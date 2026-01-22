<#
.SYNOPSIS
    Parse un fichier XML Magic et genere un rapport formate - Version 3 DETERMINISTE

.DESCRIPTION
    VERSION FINALE avec calcul d'offset CORRECT:
    Offset = colonnes_ancetres_complets + colonnes_table_tache_cible

    La numerotation des variables Magic suit cette logique:
    1. Colonnes de tous les ancetres (table + locales pour chaque)
    2. Colonnes de la table Main Source de la tache courante
    3. Puis colonnes locales (virtuelles) de la tache courante

.PARAMETER Project
    Nom du projet (ADH, PBG, PBP, PVE, REF, VIL)

.PARAMETER PrgId
    ID du programme (numero du fichier Prg_XXX.xml)

.PARAMETER TaskIsn
    ISN_2 de la tache a analyser

.EXAMPLE
    .\magic-logic-parser-v3.ps1 -Project VIL -PrgId 558 -TaskIsn 19
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("ADH", "PBG", "PBP", "PVE", "REF", "VIL")]
    [string]$Project,

    [Parameter(Mandatory=$true)]
    [int]$PrgId,

    [Parameter(Mandatory=$true)]
    [int]$TaskIsn,

    [Parameter(Mandatory=$false)]
    [string]$OutputFile
)

$BasePath = "D:\Data\Migration\XPA\PMS\$Project\Source"
$PrgFile = Join-Path $BasePath "Prg_$PrgId.xml"
$CompsFile = Join-Path $BasePath "Comps.xml"

if (-not (Test-Path $PrgFile)) {
    Write-Error "Fichier non trouve: $PrgFile"
    exit 1
}

# ============================================
# CHARGEMENT DES DONNEES
# ============================================

Write-Host "Chargement des fichiers XML..." -ForegroundColor Cyan
[xml]$xml = Get-Content $PrgFile -Encoding UTF8
[xml]$comps = Get-Content $CompsFile -Encoding UTF8
[xml]$refDS = Get-Content "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml" -Encoding UTF8

# ============================================
# FONCTIONS UTILITAIRES
# ============================================

function Convert-IndexToLetter {
    param([int]$Index)

    if ($Index -lt 26) {
        return [char](65 + $Index)  # A-Z
    }
    elseif ($Index -lt 702) {  # 26 + 26*26 = 702
        $first = [int][Math]::Floor(($Index - 26) / 26)
        $second = ($Index - 26) % 26
        return [char](65 + $first) + [char](65 + $second)  # AA-ZZ
    }
    else {
        $Index -= 702
        $first = [int][Math]::Floor($Index / 676)
        $remainder = $Index % 676
        $second = [int][Math]::Floor($remainder / 26)
        $third = $remainder % 26
        return [char](65 + $first) + [char](65 + $second) + [char](65 + $third)  # AAA-ZZZ
    }
}

function Get-FieldType {
    param([System.Xml.XmlElement]$Column)

    $model = $Column.SelectSingleNode(".//Model/@attr_obj")
    if ($model) {
        switch ($model.Value) {
            "FIELD_NUMERIC" { return "Numeric" }
            "FIELD_ALPHA" { return "Alpha" }
            "FIELD_UNICODE" { return "Unicode" }
            "FIELD_DATE" { return "Date" }
            "FIELD_TIME" { return "Time" }
            "FIELD_LOGICAL" { return "Logical" }
            "FIELD_BLOB" { return "Blob" }
            default { return $model.Value -replace "FIELD_", "" }
        }
    }
    return "Unknown"
}

function Get-TableColumnCount {
    param(
        [int]$CompId,
        [int]$ObjId
    )

    if ($CompId -le 0) {
        return 0
    }

    # Trouver l'objet dans le composant
    $comp = $comps.SelectSingleNode("//Component[@id='$CompId']")
    if (-not $comp) { return 0 }

    $obj = $comp.SelectSingleNode("./ComponentDataObjects/Object[id/@val='$ObjId']")
    if (-not $obj) { return 0 }

    $itemIsn = $obj.SelectSingleNode("ItemIsn/@val").Value

    # Trouver la table dans REF
    $table = $refDS.SelectSingleNode("//DataObject[@id='$itemIsn']")
    if (-not $table) {
        $table = $refDS.SelectSingleNode("//DataObject[@ItemIsn='$itemIsn']")
    }

    if ($table) {
        $cols = $table.SelectNodes("./Columns/Column")
        return $cols.Count
    }

    return 0
}

function Get-TaskTotalColumns {
    param([System.Xml.XmlElement]$Task)

    $resource = $Task.SelectSingleNode("./Resource")
    $total = 0

    # Colonnes de la table Main Source
    $db = $resource.SelectSingleNode("./DB/DataObject")
    if ($db) {
        $total += Get-TableColumnCount -CompId $db.comp -ObjId $db.obj
    }

    # Colonnes des Links
    $links = $resource.SelectNodes("./Links/Link/DB/DataObject")
    foreach ($linkDb in $links) {
        $total += Get-TableColumnCount -CompId $linkDb.comp -ObjId $linkDb.obj
    }

    # Colonnes locales (virtuelles)
    $localCols = $resource.SelectNodes("./Columns/Column")
    $total += $localCols.Count

    return $total
}

function Get-TaskMainSourceColumns {
    param([System.Xml.XmlElement]$Task)

    $resource = $Task.SelectSingleNode("./Resource")
    $total = 0

    # Colonnes de la table Main Source seulement
    $db = $resource.SelectSingleNode("./DB/DataObject")
    if ($db) {
        $total += Get-TableColumnCount -CompId $db.comp -ObjId $db.obj
    }

    # Colonnes des Links
    $links = $resource.SelectNodes("./Links/Link/DB/DataObject")
    foreach ($linkDb in $links) {
        $total += Get-TableColumnCount -CompId $linkDb.comp -ObjId $linkDb.obj
    }

    return $total
}

# ============================================
# CONSTRUCTION DE LA HIERARCHIE
# ============================================

Write-Host "Construction de la hierarchie des taches..." -ForegroundColor Yellow

# Trouver le chemin vers la tache cible en remontant les parents
$targetTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='$TaskIsn']]")
if (-not $targetTask) {
    Write-Error "Tache ISN_2=$TaskIsn non trouvee"
    exit 1
}

$taskName = $targetTask.Header.Description
Write-Host "Tache trouvee: $taskName (ISN_2=$TaskIsn)" -ForegroundColor Green

# Construire le chemin en remontant
$path = [System.Collections.ArrayList]::new()
$current = $targetTask

while ($current.LocalName -eq "Task") {
    [void]$path.Insert(0, $current)
    $current = $current.ParentNode
}

Write-Host "Chemin hierarchique:" -ForegroundColor Cyan
foreach ($t in $path) {
    $h = $t.SelectSingleNode("Header")
    Write-Host "  ISN=$($h.ISN_2) : $($h.Description)"
}

# ============================================
# CALCUL DE L'OFFSET
# ============================================

Write-Host ""
Write-Host "Calcul de l'offset..." -ForegroundColor Yellow

$offset = 0
$details = @()

# Colonnes de TOUS les ancetres (table + locales pour chacun)
for ($i = 0; $i -lt $path.Count - 1; $i++) {
    $ancestor = $path[$i]
    $h = $ancestor.SelectSingleNode("Header")
    $ancestorCols = Get-TaskTotalColumns -Task $ancestor
    $offset += $ancestorCols
    $details += "  Ancetre ISN=$($h.ISN_2): +$ancestorCols = $offset"
}

# Colonnes de la table Main Source de la tache cible (PAS les locales)
$targetSourceCols = Get-TaskMainSourceColumns -Task $targetTask
$offset += $targetSourceCols
$details += "  Table MainSource tache cible: +$targetSourceCols = $offset"

# Afficher les details
$details | ForEach-Object { Write-Host $_ }

Write-Host ""
Write-Host "OFFSET FINAL: $offset" -ForegroundColor Green
$firstLetter = Convert-IndexToLetter -Index $offset
Write-Host "Premiere variable locale: $firstLetter (index $offset)"

# ============================================
# PARSER LES COLONNES (VARIABLES)
# ============================================

Write-Host ""
Write-Host "=== VARIABLES DU DATAVIEW ===" -ForegroundColor Yellow

$columns = $targetTask.SelectNodes("./Resource/Columns/Column")
$variables = @()
$variableMap = @{}  # Pour lookup par niveau,colId
$position = 0

foreach ($col in $columns) {
    $colId = [int]$col.id
    $colName = $col.name
    $colType = Get-FieldType -Column $col

    $globalIndex = $offset + $position
    $letter = Convert-IndexToLetter -Index $globalIndex

    $varInfo = @{
        Position = $position
        GlobalIndex = $globalIndex
        Letter = $letter
        ColId = $colId
        Name = $colName
        Type = $colType
    }

    $variables += $varInfo
    $variableMap["0,$colId"] = $varInfo  # Niveau 0 = tache courante

    $position++
}

# Afficher les variables
Write-Host ""
Write-Host "| Lettre | Col ID | Nom | Type |"
Write-Host "|--------|--------|-----|------|"
foreach ($v in $variables) {
    Write-Host ("| **{0}** | {1} | {2} | {3} |" -f $v.Letter, $v.ColId, $v.Name, $v.Type)
}

# ============================================
# PARSER LES EXPRESSIONS
# ============================================

Write-Host ""
Write-Host "=== EXPRESSIONS ===" -ForegroundColor Yellow

function Get-ExpressionFormula {
    param(
        [System.Xml.XmlElement]$ExpressionsNode,
        [int]$ExpId,
        [hashtable]$VariableMap
    )

    $exp = $ExpressionsNode.SelectSingleNode("Expression[@id='$ExpId']")
    if (-not $exp) { return @{ Raw = "?"; Translated = "?" } }

    # Magic utilise ExpSyntax pour la formule, pas Formula
    $syntaxNode = $exp.SelectSingleNode("ExpSyntax/@val")
    $formula = if ($syntaxNode) { $syntaxNode.Value } else { $null }

    if (-not $formula) {
        # Fallback sur Formula si ExpSyntax n'existe pas
        $formulaNode = $exp.SelectSingleNode("Formula")
        $formula = if ($formulaNode) { $formulaNode.InnerText } else { $null }
    }

    if (-not $formula) {
        $valueNode = $exp.SelectSingleNode("Value")
        $val = if ($valueNode) { $valueNode.InnerText } else { $null }
        if ($val) { return @{ Raw = $val; Translated = $val } }
        return @{ Raw = "?"; Translated = "?" }
    }

    # Traduire les references {niveau,colonne} en variables
    $translated = $formula
    $withLetters = $formula
    $pattern = '\{(\d+),(\d+)\}'

    $allMatches = [regex]::Matches($formula, $pattern)
    foreach ($match in $allMatches) {
        $level = [int]$match.Groups[1].Value
        $colId = [int]$match.Groups[2].Value

        $key = "$level,$colId"
        if ($VariableMap.ContainsKey($key)) {
            $varInfo = $VariableMap[$key]
            $translated = $translated -replace [regex]::Escape($match.Value), $varInfo.Name
            $withLetters = $withLetters -replace [regex]::Escape($match.Value), $varInfo.Letter
        }
    }

    return @{
        Raw = $withLetters
        Translated = $translated
    }
}

$expressions = $targetTask.SelectSingleNode(".//Expressions")
$expList = @()

if ($expressions) {
    $expNodes = $expressions.SelectNodes("Expression")
    foreach ($exp in $expNodes) {
        $expId = $exp.id
        $formula = Get-ExpressionFormula -ExpressionsNode $expressions -ExpId $expId -VariableMap $variableMap

        $expInfo = @{
            Id = $expId
            Raw = $formula.Raw
            Translated = $formula.Translated
        }
        $expList += $expInfo
    }
}

# Afficher les expressions
if ($expList.Count -gt 0) {
    Write-Host ""
    Write-Host "| # | Formule (variables) | Formule (traduction) |"
    Write-Host "|---|---------------------|----------------------|"
    foreach ($e in $expList | Sort-Object { [int]$_.Id }) {
        if ($e.Raw -ne "?" -and $e.Raw.Length -lt 80) {
            Write-Host ("| {0} | ``{1}`` | ``{2}`` |" -f $e.Id, $e.Raw, $e.Translated)
        }
    }
}

# ============================================
# PARSER LA LOGIQUE (LIGNES)
# ============================================

Write-Host ""
Write-Host "=== LOGIC ===" -ForegroundColor Yellow

$taskLogic = $targetTask.SelectSingleNode(".//TaskLogic")
$logicUnits = $taskLogic.SelectNodes("LogicUnit")

$lineNumber = 1
$logicLines = @()

$levelTypes = @{
    "T" = "Task"
    "R" = "Record"
    "C" = "Control"
    "G" = "Group"
}

foreach ($unit in $logicUnits) {
    $unitLevel = $unit.Level.val
    $unitType = $unit.Type.val

    $handlerName = ""
    if ($levelTypes.ContainsKey($unitLevel)) {
        $handlerName = $levelTypes[$unitLevel]
    }
    if ($unitType -eq "P") {
        $handlerName += " Prefix"
    } elseif ($unitType -eq "S") {
        $handlerName += " Suffix"
    }

    # Ligne header du LogicUnit
    $logicLines += @{
        LineNum = $lineNumber
        Operation = $handlerName.Trim()
        Type = "Header"
        Variable = ""
        VarName = ""
        ExpNum = ""
        ExpRaw = ""
        ExpTranslated = ""
        Details = ""
    }
    $lineNumber++

    # Parser chaque LogicLine
    $lines = $unit.SelectNodes("LogicLines/LogicLine")
    foreach ($line in $lines) {
        $childNode = $line.FirstChild
        if (-not $childNode) { continue }

        $operation = $childNode.LocalName
        $lineInfo = @{
            LineNum = $lineNumber
            Operation = $operation
            Type = ""
            Variable = ""
            VarName = ""
            ExpNum = ""
            ExpRaw = ""
            ExpTranslated = ""
            Details = ""
        }

        switch ($operation) {
            "Update" {
                $fieldId = $childNode.FieldID.val
                $withValue = $childNode.WithValue.val

                $varInfo = $variables | Where-Object { $_.ColId -eq [int]$fieldId } | Select-Object -First 1
                if ($varInfo) {
                    $lineInfo.Variable = $varInfo.Letter
                    $lineInfo.VarName = $varInfo.Name
                }

                $lineInfo.Type = "Variable"
                $lineInfo.ExpNum = $withValue

                if ($withValue -and $expList) {
                    $exp = $expList | Where-Object { $_.Id -eq $withValue } | Select-Object -First 1
                    if ($exp) {
                        $lineInfo.ExpRaw = $exp.Raw
                        $lineInfo.ExpTranslated = $exp.Translated
                    }
                }
            }
            "CallTask" {
                $taskId = $childNode.TaskID.obj
                $condition = $childNode.SelectSingleNode("Condition")
                $cndExp = ""
                if ($condition -and $condition.Exp) {
                    $cndExp = $condition.Exp
                }

                $lineInfo.Type = "SubTask"
                $lineInfo.Details = "TaskID=$taskId"
                if ($cndExp) {
                    $lineInfo.ExpNum = $cndExp
                    $exp = $expList | Where-Object { $_.Id -eq $cndExp } | Select-Object -First 1
                    if ($exp) {
                        $lineInfo.ExpRaw = $exp.Raw
                        $lineInfo.ExpTranslated = $exp.Translated
                    }
                }
            }
            "BLOCK" {
                $condition = $childNode.SelectSingleNode("Condition")
                $cndExp = ""
                if ($condition -and $condition.Exp) {
                    $cndExp = $condition.Exp
                }

                $lineInfo.Type = "If"
                if ($cndExp) {
                    $lineInfo.ExpNum = $cndExp
                    $exp = $expList | Where-Object { $_.Id -eq $cndExp } | Select-Object -First 1
                    if ($exp) {
                        $lineInfo.ExpRaw = $exp.Raw
                        $lineInfo.ExpTranslated = $exp.Translated
                    }
                }
            }
            "END_BLK" {
                $lineInfo.Type = "End"
                $lineInfo.Details = "}"
            }
            "Remark" {
                $text = $childNode.Text.val
                $lineInfo.Type = "Remark"
                $lineInfo.Details = $text
            }
            "Form" {
                $formId = $childNode.IODIdx.val
                $lineInfo.Type = "Output"
                $lineInfo.Details = "Form $formId"
            }
            default {
                $lineInfo.Type = $operation
            }
        }

        $logicLines += $lineInfo
        $lineNumber++
    }
}

# Afficher les lignes Logic
Write-Host ""
Write-Host "| Ligne | Operation | Type | Variable | Nom Variable | Exp# | Formule (vars) | Formule (traduite) |"
Write-Host "|-------|-----------|------|----------|--------------|------|----------------|-------------------|"
foreach ($l in $logicLines) {
    if ($l.Type -eq "Header") {
        Write-Host ("| **{0}** | **{1}** | | | | | | |" -f $l.LineNum, $l.Operation)
    }
    elseif ($l.Operation -ne "Remark" -or $l.Details.Trim() -ne "") {
        $varDisplay = if ($l.Variable) { "**$($l.Variable)**" } else { "" }
        $expRaw = if ($l.ExpRaw.Length -gt 40) { $l.ExpRaw.Substring(0,37) + "..." } else { $l.ExpRaw }
        $expTrans = if ($l.ExpTranslated.Length -gt 40) { $l.ExpTranslated.Substring(0,37) + "..." } else { $l.ExpTranslated }

        Write-Host ("| {0} | {1} | {2} | {3} | {4} | {5} | ``{6}`` | ``{7}`` |" -f `
            $l.LineNum, $l.Operation, $l.Type, $varDisplay, $l.VarName, $l.ExpNum, $expRaw, $expTrans)
    }
}

Write-Host ""
Write-Host "=== FIN ===" -ForegroundColor Cyan
