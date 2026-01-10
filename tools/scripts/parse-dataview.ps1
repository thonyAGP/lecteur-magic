# PARSE MAGIC DATA VIEW - VERSION DEFINITIVE
# Règles brutes, pas d'IA
#
# Structure DV Magic:
# 1. LogicLines contient l'ordre exact des lignes
# 2. Select avec Type: V=Virtual, R=Real (table column), P=Parameter
# 3. LNK définit un Link Query
# 4. NullLine représente une ligne vide
# 5. EndLnk ferme un Link Query

param(
    [string]$Project = "ADH",
    [int]$PrgId = 159,
    [int]$TaskIsn = 1
)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

if (-not (Test-Path $xmlPath)) {
    Write-Error "File not found: $xmlPath"
    exit 1
}

# Load XML
[xml]$xml = Get-Content $xmlPath -Encoding UTF8

# ============================================
# LOAD TABLE MAPPING
# ============================================
$dsPath = "$projectsPath\REF\Source\DataSources.xml"
$tableLookup = @{}
$tableNamesById = @{}

if (Test-Path $dsPath) {
    [xml]$dsXml = Get-Content $dsPath -Encoding UTF8

    $idsWithoutPublic = @()
    $tablesWithPublic = @()

    # Structure: Application/DataSourceRepository/DataObjects/DataObject
    foreach ($ds in $dsXml.Application.DataSourceRepository.DataObjects.DataObject) {
        $id = [int]$ds.id
        $publicName = $ds.Public
        $logicalName = $ds.name
        if (-not $logicalName) { $logicalName = "Table_$id" }

        $tableNamesById["$id"] = $logicalName

        if ($publicName) {
            $tablesWithPublic += [PSCustomObject]@{ Id = $id; Name = $logicalName; Public = $publicName }
        } else {
            $idsWithoutPublic += $id
        }
    }

    $idsWithoutPublic = $idsWithoutPublic | Sort-Object

    # Calculate IDE position: Position = id - (tables without Public before this id)
    foreach ($t in $tablesWithPublic) {
        $noBefore = @($idsWithoutPublic | Where-Object { $_ -lt $t.Id }).Count
        $idePos = $t.Id - $noBefore
        $tableLookup["$($t.Id)"] = @{ ide = $idePos; name = $t.Name }
    }

    Write-Host "Table mapping: $($tablesWithPublic.Count) with Public, $($idsWithoutPublic.Count) without" -ForegroundColor DarkGray
}

function Get-TableDisplay($objId) {
    if ($tableLookup.ContainsKey("$objId")) {
        $info = $tableLookup["$objId"]
        return "$($info.ide) $($info.name)"
    }
    if ($tableNamesById.ContainsKey("$objId")) {
        return "? $($tableNamesById["$objId"])"
    }
    return "obj=$objId"
}

# ============================================
# FIND TASK (recursive search for nested subtasks)
# ============================================
function Find-TaskByIsn {
    param($node, [int]$targetIsn)

    if ($node.Header.ISN_2 -eq $targetIsn) {
        return $node
    }

    # Search nested Task elements
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            $found = Find-TaskByIsn $subtask $targetIsn
            if ($found) { return $found }
        }
    }

    return $null
}

$task = $null

# Start from main program task
$mainTask = $xml.Application.ProgramsRepository.Programs.Task
if (-not $mainTask) {
    $mainTask = $xml.Application.Task | Select-Object -First 1
}

if ($mainTask) {
    $task = Find-TaskByIsn $mainTask $TaskIsn
}

if (-not $task) {
    Write-Error "Task ISN_2=$TaskIsn not found"
    exit 1
}

$taskName = $task.Header.Description
$prgIdePos = $PrgId  # TODO: calculate program IDE position too
Write-Host ""
Write-Host "=== $Project IDE $prgIdePos - $taskName ===" -ForegroundColor Cyan
Write-Host ""

# ============================================
# GET DB LIST + COLUMN NAMES
# ============================================
$dbList = @()
$dbColumns = @{}  # obj -> column definitions
$dbIndex = 1

foreach ($db in $task.Resource.DB) {
    $obj = $db.DataObject.obj
    $dbList += @{ Index = $dbIndex; Obj = $obj; Display = (Get-TableDisplay $obj) }

    # Load column names from DataSources.xml for this table
    if ($dsXml) {
        $tableNode = $dsXml.Application.DataSourceRepository.DataObjects.DataObject | Where-Object { $_.id -eq $obj }
        if ($tableNode -and $tableNode.Columns.Column) {
            $cols = @{}
            foreach ($col in $tableNode.Columns.Column) {
                $cols["$($col.id)"] = $col.name
            }
            $dbColumns["$obj"] = $cols
        }
    }
    $dbIndex++
}

# ============================================
# GET VIRTUAL COLUMNS (indexed by position, not id)
# ============================================
$virtualColumns = @{}
$virtualColumnsList = @()
$pos = 1
foreach ($col in $task.Resource.Columns.Column) {
    $colId = $col.id
    $colName = $col.name
    $virtualColumns["$pos"] = $colName      # By position (for Select Column val)
    $virtualColumns["id$colId"] = $colName  # By id (backup)
    $virtualColumnsList += $colName
    $pos++
}

# ============================================
# PARSE LOGIC LINES
# ============================================
$logicUnit = $null
foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R") {
        $logicUnit = $lu
        break
    }
}

if (-not $logicUnit) {
    Write-Error "No Record Main LogicUnit found"
    exit 1
}

Write-Host "Ln#  Var  Type        Details"
Write-Host "---  ---  ----------  -------"

$lineNum = 1
$inLink = $false
$currentTableObj = $null  # Track current table for column names
$mainTableIdx = 1  # Main table DB index

foreach ($logicLine in $logicUnit.LogicLines.LogicLine) {
    $output = $null
    $varLetter = ""

    # ----------------------------------------
    # DATAVIEW_SRC - Main table
    # ----------------------------------------
    if ($logicLine.DATAVIEW_SRC) {
        $dvSrc = $logicLine.DATAVIEW_SRC
        $idx = $dvSrc.IDX

        if (-not $idx -or $idx -eq "0") {
            $output = "{0,3}       Main Source 0 (No Main Source)" -f $lineNum
        } else {
            $idx = [int]$idx
            $db = $dbList | Where-Object { $_.Index -eq $idx }
            if ($db) {
                $currentTableObj = $db.Obj
                $mainTableIdx = $idx
                $output = "{0,3}       Main Source {1}" -f $lineNum, $db.Display
            } else {
                $output = "{0,3}       Main Source DB[$idx]" -f $lineNum
            }
        }
    }

    # ----------------------------------------
    # Select - Column
    # ----------------------------------------
    elseif ($logicLine.Select) {
        $sel = $logicLine.Select
        $fieldId = [int]$sel.FieldID
        $colNum = $sel.Column.val  # This is actually an XmlElement, need to get text
        if ($colNum -is [System.Xml.XmlElement]) {
            $colNum = $colNum.InnerText
        }
        # Type can be XmlElement with val attribute or plain text
        $type = $sel.Type.val
        if (-not $type) { $type = $sel.Type.InnerText }
        if (-not $type) { $type = $sel.Type }

        # Calculate variable letter
        $fieldIdx = $fieldId - 1
        if ($fieldIdx -lt 26) {
            $varLetter = [char]([int][char]'A' + $fieldIdx)
        } else {
            $first = [int][math]::Floor($fieldIdx / 26)
            $second = $fieldIdx % 26
            $varLetter = ([char]([int][char]'A' + $first - 1)).ToString() + ([char]([int][char]'A' + $second)).ToString()
        }

        # Check if it's a parameter (IsParameter can be XmlElement with val)
        $isParam = $sel.IsParameter.val
        if (-not $isParam) { $isParam = $sel.IsParameter }
        if ($isParam -eq "Y") {
            # colNum is the position in virtual columns list
            $colName = if ($virtualColumns.ContainsKey("$colNum")) { $virtualColumns["$colNum"] } else { "Param $colNum" }
            $output = "{0,3}  [{1,-2}] Parameter   {2}" -f $lineNum, $varLetter, $colName
        }
        # Get column info based on type
        elseif ($type -eq "V") {
            # Virtual column - colNum is position in list
            $colName = if ($virtualColumns.ContainsKey("$colNum")) { $virtualColumns["$colNum"] } else { "Virtual $colNum" }
            $output = "{0,3}  [{1,-2}] Virtual     {2}" -f $lineNum, $varLetter, $colName
        } else {
            # Real column from table - look up name
            $colName = ""
            if ($currentTableObj -and $dbColumns.ContainsKey("$currentTableObj")) {
                $tableCols = $dbColumns["$currentTableObj"]
                if ($tableCols.ContainsKey("$colNum")) {
                    $colName = $tableCols["$colNum"]
                }
            }
            if ($colName) {
                $output = "{0,3}  [{1,-2}] Column      {2}" -f $lineNum, $varLetter, $colName
            } else {
                $output = "{0,3}  [{1,-2}] Column      Col {2}" -f $lineNum, $varLetter, $colNum
            }
        }
    }

    # ----------------------------------------
    # LNK - Link Query/Create/Write
    # ----------------------------------------
    elseif ($logicLine.LNK) {
        $lnk = $logicLine.LNK
        $obj = $lnk.DB.obj
        $key = $lnk.Key
        $mode = $lnk.Mode

        # Mode: R=Read(Query), A=Add(Create), W=Write, L=Link(Inner)
        $linkType = switch ($mode) {
            "A" { "Link Create" }
            "W" { "Link Write" }
            "L" { "Link Inner" }
            default { "Link Query" }
        }

        $tableDisp = Get-TableDisplay $obj
        $inLink = $true
        $currentTableObj = $obj  # Switch to link table for column names

        $output = "{0,3}  [+]  {1,-11} {2}  Index: {3}" -f $lineNum, $linkType, $tableDisp, $key
    }

    # ----------------------------------------
    # END_LINK - Link Query end
    # ----------------------------------------
    elseif ($logicLine.END_LINK) {
        $output = "{0,3}       End Link" -f $lineNum
        $inLink = $false
        # Reset to main table (first DB with IDX from DATAVIEW_SRC)
        $mainDb = $dbList | Where-Object { $_.Index -eq $mainTableIdx } | Select-Object -First 1
        if ($mainDb) { $currentTableObj = $mainDb.Obj }
    }

    # ----------------------------------------
    # Remark - Empty line (comment/spacer)
    # ----------------------------------------
    elseif ($logicLine.Remark) {
        $output = "{0,3}" -f $lineNum
    }

    # Output if we have something
    if ($output) {
        Write-Host $output
        $lineNum++
    }
}

Write-Host ""
Write-Host "Total: $($lineNum - 1) lines" -ForegroundColor DarkGray
