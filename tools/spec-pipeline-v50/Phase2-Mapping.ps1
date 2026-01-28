#Requires -Version 5.1
<#
.SYNOPSIS
    Phase 2: MAPPING - Documenter les donnees

.DESCRIPTION
    Documentation rigoureuse des structures de donnees:
    2.1 Tables (R/W/L, noms physiques, frequence)
    2.2 Parametres (IN/OUT, types, pictures)
    2.3 Variables (locales avec lettres, globales VG*)
    2.4 Forms et Controls (UI)

.OUTPUTS
    mapping.json avec toutes les donnees de mapping
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [Parameter(Mandatory = $true)]
    [int]$IdePosition,

    [Parameter(Mandatory = $true)]
    [string]$DiscoveryFile,

    [Parameter(Mandatory = $true)]
    [string]$OutputFile,

    [hashtable]$Config
)

$ErrorActionPreference = "Stop"

# ============================================================================
# CONFIGURATION
# ============================================================================

$ProjectsPath = if ($Config) { $Config.ProjectsPath } else { "D:\Data\Migration\XPA\PMS" }
$KbPath = Join-Path $env:USERPROFILE ".magic-kb\knowledge.db"
$Sqlite3 = "sqlite3"

# Charger discovery.json
$Discovery = Get-Content $DiscoveryFile -Raw | ConvertFrom-Json

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host "  [$Step] $Message" -ForegroundColor Gray
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "  [!!] $Message" -ForegroundColor Yellow
}

# Fonction pour convertir FieldN en lettre IDE
function Convert-FieldToLetter {
    param([int]$FieldNumber)

    if ($FieldNumber -le 0) { return "?" }

    $Result = ""
    $N = $FieldNumber

    while ($N -gt 0) {
        $N--
        $Result = [char](65 + ($N % 26)) + $Result
        $N = [math]::Floor($N / 26)
    }

    return $Result
}

# ============================================================================
# 2.1 TABLES UTILISEES
# ============================================================================

Write-Step "2.1" "Extraction des tables..."

$Tables = @{
    All      = @()
    Read     = @()
    Write    = @()
    Link     = @()
    ByAccess = @{
        R = 0
        W = 0
        L = 0
    }
}

# Query KB pour les tables
$TablesQuery = @"
SELECT DISTINCT
    t.table_id,
    t.physical_name,
    t.logical_name,
    tu.access_mode,
    COUNT(*) as usage_count
FROM table_usage tu
JOIN tables t ON tu.table_id = t.id
JOIN programs p ON tu.program_id = p.id
WHERE p.project = '$Project' AND p.ide_position = $IdePosition
GROUP BY t.table_id, t.physical_name, t.logical_name, tu.access_mode
ORDER BY t.table_id
"@

try {
    $TablesResult = & $Sqlite3 $KbPath $TablesQuery 2>$null
    if ($TablesResult) {
        foreach ($Line in ($TablesResult -split "`n" | Where-Object { $_ })) {
            $Parts = $Line -split '\|'
            if ($Parts.Count -ge 5) {
                $TableId = [int]$Parts[0]
                $PhysicalName = $Parts[1]
                $LogicalName = $Parts[2]
                $AccessMode = $Parts[3]
                $UsageCount = [int]$Parts[4]

                $TableEntry = @{
                    TableId      = $TableId
                    PhysicalName = $PhysicalName
                    LogicalName  = $LogicalName
                    AccessMode   = $AccessMode
                    UsageCount   = $UsageCount
                }

                $Tables.All += $TableEntry

                switch ($AccessMode) {
                    "R" {
                        $Tables.Read += $TableEntry
                        $Tables.ByAccess.R++
                    }
                    "W" {
                        $Tables.Write += $TableEntry
                        $Tables.ByAccess.W++
                    }
                    "L" {
                        $Tables.Link += $TableEntry
                        $Tables.ByAccess.L++
                    }
                    default {
                        # Access mixte (R/W, L/W, etc.)
                        if ($AccessMode -match "W") {
                            $Tables.Write += $TableEntry
                            $Tables.ByAccess.W++
                        }
                        elseif ($AccessMode -match "R") {
                            $Tables.Read += $TableEntry
                            $Tables.ByAccess.R++
                        }
                        else {
                            $Tables.Link += $TableEntry
                            $Tables.ByAccess.L++
                        }
                    }
                }
            }
        }
    }
    Write-Success "$($Tables.All.Count) tables: $($Tables.ByAccess.R) R, $($Tables.ByAccess.W) W, $($Tables.ByAccess.L) L"
}
catch {
    Write-Warning2 "Erreur extraction tables: $_"
}

# Si KB n'a pas les tables, extraire du XML
if ($Tables.All.Count -eq 0 -and $Discovery.Identification.XmlPath) {
    Write-Step "2.1b" "Fallback: extraction tables depuis XML..."

    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    # Structure XML: Application.ProgramsRepository.Programs.Task.Resource.DB
    $AllTasks = @($Xml.Application.ProgramsRepository.Programs.Task)

    foreach ($Task in $AllTasks) {
        if (!$Task -or !$Task.Resource -or !$Task.Resource.DB) { continue }

        $DB = $Task.Resource.DB
        $TableObj = $DB.DataObject
        $TableId = 0

        if ($TableObj) {
            $TableId = if ($TableObj.obj) { [int]$TableObj.obj } else { 0 }
        }

        $Access = if ($DB.Access) { $DB.Access.val } else { "R" }

        $AccessMode = switch ($Access) {
            "R" { "R" }  # Read
            "W" { "W" }  # Write
            "L" { "L" }  # Link
            default { "R" }
        }

        # Nom physique par defaut
        $PhysicalName = "Table_$TableId"
        $LogicalName = ""

        # Eviter les doublons
        $Existing = $Tables.All | Where-Object { $_.TableId -eq $TableId -and $_.AccessMode -eq $AccessMode }
        if (!$Existing -and $TableId -gt 0) {
            $TableEntry = @{
                TableId      = $TableId
                PhysicalName = $PhysicalName
                LogicalName  = $LogicalName
                AccessMode   = $AccessMode
                UsageCount   = 1
            }
            $Tables.All += $TableEntry

            switch ($AccessMode) {
                "R" { $Tables.Read += $TableEntry; $Tables.ByAccess.R++ }
                "W" { $Tables.Write += $TableEntry; $Tables.ByAccess.W++ }
                "L" { $Tables.Link += $TableEntry; $Tables.ByAccess.L++ }
            }
        }
    }

    Write-Success "Fallback: $($Tables.All.Count) tables extraites du XML"
}

# ============================================================================
# 2.2 PARAMETRES
# ============================================================================

Write-Step "2.2" "Extraction des parametres..."

$Parameters = @{
    All       = @()
    Input     = @()
    Output    = @()
    InOut     = @()
    Count     = 0
}

if ($Discovery.Identification.XmlPath -and (Test-Path $Discovery.Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    # Structure XML: Application.ProgramsRepository.Programs.Task.Resource.Columns
    $Task = $Xml.Application.ProgramsRepository.Programs.Task | Select-Object -First 1

    if ($Task -and $Task.Header.ReturnValue) {
        $ParamCountVal = if ($Task.Header.ReturnValue.ParametersCount) {
            [int]$Task.Header.ReturnValue.ParametersCount.val
        } else { 0 }

        # Extraire les colonnes qui sont des parametres
        if ($Task.Resource -and $Task.Resource.Columns -and $Task.Resource.Columns.Column) {
            $Columns = @($Task.Resource.Columns.Column)

            # Les N premieres colonnes sont les parametres (selon TSK_PARAMS ou ParametersCount)
            $ParamIndex = 0
            foreach ($Column in $Columns | Select-Object -First $ParamCountVal) {
                $ParamIndex++

                $ParamName = if ($Column.name) { $Column.name } else { "Param_$ParamIndex" }
                $ParamType = "Alpha"  # Par defaut

                # Determiner le type depuis PropertyList.Model
                if ($Column.PropertyList -and $Column.PropertyList.Model) {
                    $ModelAttr = $Column.PropertyList.Model.attr_obj
                    $ParamType = switch ($ModelAttr) {
                        "FIELD_NUMERIC" { "Numeric" }
                        "FIELD_UNICODE" { "Alpha" }
                        "FIELD_DATE" { "Date" }
                        "FIELD_TIME" { "Time" }
                        "FIELD_LOGICAL" { "Logical" }
                        default { "Alpha" }
                    }
                }

                # Picture
                $Picture = ""
                if ($Column.PropertyList -and $Column.PropertyList.Picture) {
                    $Picture = $Column.PropertyList.Picture.valUnicode
                }

                $Letter = Convert-FieldToLetter $ParamIndex

                # Direction par defaut IN (les params Magic n'ont pas explicitement IN/OUT dans ce format)
                $Direction = "IN"
                if ($Task.Header.ReturnValue.ParametersAttributes -and $Task.Header.ReturnValue.ParametersAttributes.Attr) {
                    $Attrs = @($Task.Header.ReturnValue.ParametersAttributes.Attr)
                    if ($ParamIndex -le $Attrs.Count) {
                        $MgAttr = $Attrs[$ParamIndex - 1].MgAttr
                        $Direction = switch ($MgAttr) {
                            "U" { "INOUT" }  # Update
                            "N" { "IN" }     # None/Input
                            "O" { "OUT" }
                            default { "IN" }
                        }
                    }
                }

                $ParamEntry = @{
                    FieldIndex = $ParamIndex
                    Letter     = $Letter
                    Name       = $ParamName
                    Type       = $ParamType
                    Direction  = $Direction
                    Picture    = $Picture
                }

                $Parameters.All += $ParamEntry
                $Parameters.Count++

                switch ($Direction) {
                    "IN" { $Parameters.Input += $ParamEntry }
                    "OUT" { $Parameters.Output += $ParamEntry }
                    "INOUT" { $Parameters.InOut += $ParamEntry }
                }
            }
        }
    }

    Write-Success "$($Parameters.Count) parametres: $($Parameters.Input.Count) IN, $($Parameters.Output.Count) OUT, $($Parameters.InOut.Count) INOUT"
}

# ============================================================================
# 2.3 VARIABLES LOCALES
# ============================================================================

Write-Step "2.3" "Extraction des variables..."

$Variables = @{
    Local    = @()
    Global   = @()
    Working  = @()
    Table    = @()
}

if ($Discovery.Identification.XmlPath -and (Test-Path $Discovery.Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    # Structure XML: Application.ProgramsRepository.Programs.Task.Resource.Columns
    $AllTasks = @($Xml.Application.ProgramsRepository.Programs.Task)

    foreach ($Task in $AllTasks) {
        if (!$Task -or !$Task.Resource -or !$Task.Resource.Columns) { continue }

        $TaskISN2 = if ($Task.Header.ISN_2) { [int]$Task.Header.ISN_2 } else { 1 }

        # Nombre de parametres
        $ParamCount = 0
        if ($Task.Header.ReturnValue -and $Task.Header.ReturnValue.ParametersCount) {
            $ParamCount = [int]$Task.Header.ReturnValue.ParametersCount.val
        }

        $Columns = @($Task.Resource.Columns.Column)
        $FieldIndex = 0

        foreach ($Column in $Columns) {
            $FieldIndex++
            $Letter = Convert-FieldToLetter $FieldIndex

            $VarName = if ($Column.name) { $Column.name } else { "Var_$FieldIndex" }

            # Determiner le type
            $VarType = "Alpha"
            if ($Column.PropertyList -and $Column.PropertyList.Model) {
                $ModelAttr = $Column.PropertyList.Model.attr_obj
                $VarType = switch ($ModelAttr) {
                    "FIELD_NUMERIC" { "Numeric" }
                    "FIELD_UNICODE" { "Alpha" }
                    "FIELD_DATE" { "Date" }
                    "FIELD_TIME" { "Time" }
                    "FIELD_LOGICAL" { "Logical" }
                    default { "Alpha" }
                }
            }

            # Categoriser: Parametre, Colonne table, ou Variable locale
            if ($FieldIndex -le $ParamCount) {
                # Deja traite dans 2.2 (parametres)
                continue
            }

            # Si c'est une colonne de table (commence par prefixe table)
            if ($VarName -match '^[A-Za-z]+\.' -or $VarName -match '^P\.' -or $VarName -match '^t\d+\.') {
                $Variables.Table += @{
                    TaskRef    = $TaskISN2
                    FieldIndex = $FieldIndex
                    Letter     = $Letter
                    Name       = $VarName
                    Type       = $VarType
                    Category   = "Table"
                }
            }
            else {
                # Variable locale
                $Variables.Local += @{
                    TaskRef    = $TaskISN2
                    FieldIndex = $FieldIndex
                    Letter     = $Letter
                    Name       = $VarName
                    Type       = $VarType
                    Category   = "Local"
                }
            }
        }
    }

    # Deduplication des globales (meme VG peut apparaitre dans plusieurs tasks)
    $UniqueGlobals = @{}
    foreach ($G in $Variables.Global) {
        $Key = $G.GlobalName
        if (!$UniqueGlobals.ContainsKey($Key)) {
            $UniqueGlobals[$Key] = $G
        }
    }
    $Variables.GlobalUnique = $UniqueGlobals.Values | Sort-Object { [int]($_.GlobalName -replace 'VG', '') }

    Write-Success "$($Variables.Local.Count) locales, $($Variables.GlobalUnique.Count) globales uniques, $($Variables.Table.Count) colonnes table"
}

# ============================================================================
# 2.4 FORMS ET CONTROLS
# ============================================================================

Write-Step "2.4" "Extraction des Forms et Controls..."

$Forms = @{
    All      = @()
    Controls = @()
}

if ($Discovery.Identification.XmlPath -and (Test-Path $Discovery.Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    # Extraire les Forms depuis TaskTable
    $AllTasks = $Xml.ProgramContent.TaskTable.Task

    foreach ($Task in $AllTasks) {
        $TaskISN2 = [int]$Task.ISN_2
        $TaskName = if ($Task.Name) { $Task.Name.InnerText } else { "Task_$TaskISN2" }

        # Chercher les forms dans Form/FormDisplay
        if ($Task.Form) {
            foreach ($Form in $Task.Form) {
                $FormName = if ($Form.FormName) { $Form.FormName.InnerText } else { "" }
                $WindowType = if ($Form.WindowType) { $Form.WindowType } else { "" }
                $Width = if ($Form.Width) { [int]$Form.Width } else { 0 }
                $Height = if ($Form.Height) { [int]$Form.Height } else { 0 }

                $FormEntry = @{
                    TaskISN2   = $TaskISN2
                    TaskName   = $TaskName
                    FormName   = $FormName
                    WindowType = switch ($WindowType) {
                        "0" { "None" }
                        "1" { "Modal" }
                        "2" { "SDI" }
                        "3" { "MDI" }
                        "5" { "Floating" }
                        "6" { "Tool" }
                        default { $WindowType }
                    }
                    Width      = $Width
                    Height     = $Height
                    Controls   = @()
                }

                # Extraire les controls
                if ($Form.Controls) {
                    foreach ($Control in $Form.Controls.Control) {
                        $CtrlType = if ($Control.Type) { $Control.Type } else { "" }
                        $CtrlName = if ($Control.Name) { $Control.Name.InnerText } else { "" }
                        $CtrlField = if ($Control.FieldRef) { [int]$Control.FieldRef } else { 0 }

                        $FormEntry.Controls += @{
                            Type     = $CtrlType
                            Name     = $CtrlName
                            FieldRef = $CtrlField
                            Letter   = if ($CtrlField -gt 0) { Convert-FieldToLetter $CtrlField } else { "" }
                        }
                    }
                }

                $Forms.All += $FormEntry
            }
        }
    }

    Write-Success "$($Forms.All.Count) forms trouvees"
}

# ============================================================================
# ASSEMBLAGE MAPPING.JSON
# ============================================================================

$Mapping = @{
    GeneratedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    Pipeline    = "V5.0"
    Phase       = "2-MAPPING"

    Tables      = $Tables
    Parameters  = $Parameters
    Variables   = $Variables
    Forms       = $Forms

    Stats       = @{
        TotalTables   = $Tables.All.Count
        TablesRead    = $Tables.ByAccess.R
        TablesWrite   = $Tables.ByAccess.W
        TablesLink    = $Tables.ByAccess.L
        Parameters    = $Parameters.Count
        ParamsIn      = $Parameters.Input.Count
        ParamsOut     = $Parameters.Output.Count
        LocalVars     = $Variables.Local.Count
        GlobalVars    = $Variables.GlobalUnique.Count
        TableVars     = $Variables.Table.Count
        Forms         = $Forms.All.Count
    }
}

# Sauvegarder
$Mapping | ConvertTo-Json -Depth 10 | Set-Content $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "  Mapping sauvegarde: $OutputFile" -ForegroundColor Cyan
