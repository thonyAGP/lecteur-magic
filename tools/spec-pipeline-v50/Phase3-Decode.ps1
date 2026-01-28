#Requires -Version 5.1
<#
.SYNOPSIS
    Phase 3: DECODE - Comprendre la logique

.DESCRIPTION
    Comprehension rigoureuse de la logique programme:
    3.1 Expressions critiques (decodage {N,Y} -> lettres)
    3.2 Flux logique (handlers, branchements)
    3.3 Regles metier (conditions IF/CASE)
    3.4 Algorigramme Mermaid

.OUTPUTS
    decoded.json avec toute la logique decodee
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [Parameter(Mandatory = $true)]
    [int]$IdePosition,

    [Parameter(Mandatory = $true)]
    [string]$DiscoveryFile,

    [Parameter(Mandatory = $true)]
    [string]$MappingFile,

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
# Utiliser chemin complet pour sqlite3 (installe dans C:\Tools\sqlite)
$Sqlite3 = "C:\Tools\sqlite\sqlite3.exe"
if (!(Test-Path $Sqlite3)) {
    $Sqlite3 = "sqlite3"  # Fallback si dans PATH
}

# Charger les fichiers precedents
$Discovery = Get-Content $DiscoveryFile -Raw | ConvertFrom-Json
$Mapping = Get-Content $MappingFile -Raw | ConvertFrom-Json

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

# Fonction pour convertir FieldN en lettre IDE (A, B, ..., Z, AA, AB, ...)
function Convert-FieldToLetter {
    param([int]$FieldNumber)

    if ($FieldNumber -le 0) { return "?" }

    $Result = ""
    $N = [int]$FieldNumber

    while ($N -gt 0) {
        $N--
        $CharCode = [int](65 + ($N % 26))
        $Result = [char]$CharCode + $Result
        $N = [int][math]::Floor($N / 26)
    }

    return $Result
}

# Fonction pour calculer l'offset d'une tache
function Get-TaskOffset {
    param(
        [xml]$Xml,
        [int]$TaskISN2
    )

    $TotalOffset = 0

    # Trouver toutes les taches precedentes
    $AllTasks = $Xml.ProgramContent.TaskTable.Task | Sort-Object { [int]$_.ISN_2 }

    foreach ($Task in $AllTasks) {
        $CurrentISN2 = [int]$Task.ISN_2
        if ($CurrentISN2 -ge $TaskISN2) { break }

        # Trouver le DataView pour cette tache
        $DV = $Xml.ProgramContent.DataViewTable.DataViewContent | Where-Object { $_.TaskRef -eq $CurrentISN2.ToString() }
        if ($DV -and $DV.DataViewElements) {
            $TotalOffset += $DV.DataViewElements.ChildNodes.Count
        }
    }

    return $TotalOffset
}

# Fonction pour decoder une expression {N,Y}
function Decode-Expression {
    param(
        [string]$Expression,
        [int]$TaskOffset,
        [hashtable]$GlobalVars
    )

    if ([string]::IsNullOrWhiteSpace($Expression)) {
        return $Expression
    }

    $Result = $Expression

    # Pattern pour {N,Y} ou {N}
    $Pattern = '\{(\d+)(?:,(\d+))?\}'

    $Result = [regex]::Replace($Result, $Pattern, {
        param($Match)

        $Type = [int]$Match.Groups[1].Value
        $Index = if ($Match.Groups[2].Success) { [int]$Match.Groups[2].Value } else { 0 }

        switch ($Type) {
            0 {
                # Variable locale - appliquer offset
                $RealIndex = $Index - $TaskOffset
                if ($RealIndex -gt 0) {
                    $Letter = Convert-FieldToLetter $RealIndex
                    return "Var_$Letter"
                }
                else {
                    return "Var_?($Index)"
                }
            }
            1 {
                # Variable globale VG
                return "VG$Index"
            }
            2 {
                # Constante
                return "Const_$Index"
            }
            3 {
                # Fonction Magic
                return "Func_$Index"
            }
            4 {
                # Parametre
                $Letter = Convert-FieldToLetter $Index
                return "Param_$Letter"
            }
            default {
                return "{$Type,$Index}"
            }
        }
    })

    return $Result
}

# ============================================================================
# 3.1 EXPRESSIONS CRITIQUES
# ============================================================================

Write-Step "3.1" "Extraction et decodage des expressions..."

$Expressions = @{
    All         = @()
    Critical    = @()
    Conditions  = @()
    Assignments = @()
    ByTask      = @{}
}

if ($Discovery.Identification.XmlPath -and (Test-Path $Discovery.Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    # Structure XML Magic: Les expressions sont dans //Expression/ExpSyntax[@val]
    # Chaque Expression a un id, et le ExpSyntax contient l'expression decodable
    $AllExpSyntax = @($Xml.SelectNodes("//Expression/ExpSyntax[@val]"))
    Write-Step "3.1" "Analyse de $($AllExpSyntax.Count) expressions..."

    $ExprIndex = 0
    $TaskExpressionsMap = @{}

    foreach ($ExpSyntax in $AllExpSyntax) {
        if (!$ExpSyntax) { continue }

        $ExprText = $ExpSyntax.val
        if ([string]::IsNullOrWhiteSpace($ExprText)) { continue }

        # Recuperer l'ID de l'Expression parent
        $ExpressionNode = $ExpSyntax.ParentNode
        $ExprId = if ($ExpressionNode.id) { $ExpressionNode.id } else { "?" }

        # Trouver la Task parente (remonter jusqu'au noeud Task)
        $TaskNode = $ExpressionNode
        $TaskISN2 = 1
        $TaskName = "Main"
        while ($TaskNode -and $TaskNode.Name -ne "Task") {
            $TaskNode = $TaskNode.ParentNode
        }
        if ($TaskNode) {
            if ($TaskNode.Header -and $TaskNode.Header.ISN_2) {
                $TaskISN2 = [int]$TaskNode.Header.ISN_2
                $TaskName = if ($TaskNode.Header.Description) { $TaskNode.Header.Description } else { "Task_$TaskISN2" }
            }
            elseif ($TaskNode.MainProgram) {
                $TaskISN2 = 1
                $TaskName = "Main"
            }
        }

        # Calculer l'offset pour cette tache (simplifie - utiliser 0 pour Main)
        $TaskOffset = 0

        $ExprIndex++

        # Decoder l'expression
        $DecodedExpr = Decode-Expression -Expression $ExprText -TaskOffset $TaskOffset -GlobalVars @{}

        # Determiner le type
        $ExprType = "Other"
        if ($ExprText -match "IF\s*\(|If\s*\(") { $ExprType = "Condition" }
        elseif ($ExprText -match "CASE\s*\(") { $ExprType = "Condition" }
        elseif ($ExprText -match "MsgBox\s*\(") { $ExprType = "Message" }
        elseif ($ExprText -match "DbRecs\s*\(") { $ExprType = "Database" }
        elseif ($ExprText -match "=") { $ExprType = "Assignment" }

        # Detecter expressions critiques (Gift Pass, validation, calculs importants)
        $IsCritical = $false
        if ($ExprText -match "Gift|Pass|GP|solde|validation|MsgBox") { $IsCritical = $true }
        if ($ExprText -match "VG\d+|VG38|VG60") { $IsCritical = $true }
        if ($ExprText -match "IF.*AND.*AND") { $IsCritical = $true }

        $ExprEntry = @{
            ISN         = $ExprId
            Index       = $ExprIndex
            TaskISN2    = $TaskISN2
            TaskName    = $TaskName
            Raw         = $ExprText
            Decoded     = $DecodedExpr
            Type        = $ExprType
            IsCritical  = $IsCritical
            HasBrackets = ($ExprText -match '\{\d+,\d+\}')
        }

        $Expressions.All += $ExprEntry

        switch ($ExprType) {
            "Condition" { $Expressions.Conditions += $ExprEntry }
            "Assignment" { $Expressions.Assignments += $ExprEntry }
        }

        if ($IsCritical) {
            $Expressions.Critical += $ExprEntry
        }

        # Grouper par tache (cle = string pour JSON serialization)
        $TaskKey = "Task_$TaskISN2"
        if (!$TaskExpressionsMap.ContainsKey($TaskKey)) {
            $TaskExpressionsMap[$TaskKey] = @()
        }
        $TaskExpressionsMap[$TaskKey] += @{
            ExprId   = $ExprId
            Raw      = $ExprText
            Decoded  = $DecodedExpr
            Type     = $ExprType
        }
    }

    # Stocker les expressions par tache
    $Expressions.ByTask = $TaskExpressionsMap

    Write-Success "$($Expressions.All.Count) expressions, $($Expressions.Conditions.Count) conditions, $($Expressions.Critical.Count) critiques"
}

# ============================================================================
# 3.2 FLUX LOGIQUE
# ============================================================================

Write-Step "3.2" "Tracage du flux logique..."

$LogicFlow = @{
    Handlers    = @()
    Calls       = @()
    Branches    = @()
    FlowGraph   = @()
}

if ($Discovery.Identification.XmlPath -and (Test-Path $Discovery.Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Discovery.Identification.XmlPath -Encoding UTF8 -Raw)

    $AllTasks = $Xml.ProgramContent.TaskTable.Task

    foreach ($Task in $AllTasks) {
        $TaskISN2 = [int]$Task.ISN_2
        $TaskName = if ($Task.Name) { $Task.Name.InnerText } else { "Task_$TaskISN2" }
        $IsDisabled = if ($Task.Disabled) { $Task.Disabled -eq "1" } else { $false }

        if ($IsDisabled) { continue }  # Ignorer taches desactivees

        # Parcourir les handlers
        if ($Task.LogicUnit) {
            foreach ($Handler in $Task.LogicUnit) {
                $HandlerType = if ($Handler.Type) { $Handler.Type } else { "Unknown" }
                $HandlerName = switch ($HandlerType) {
                    "1" { "TaskPrefix" }
                    "2" { "TaskSuffix" }
                    "3" { "RecordPrefix" }
                    "4" { "RecordSuffix" }
                    "5" { "RecordMain" }
                    "6" { "ControlPrefix" }
                    "7" { "ControlSuffix" }
                    "8" { "ControlChange" }
                    "9" { "ControlVerify" }
                    default { "Handler_$HandlerType" }
                }

                $HandlerDisabled = if ($Handler.Disabled) { $Handler.Disabled -eq "1" } else { $false }
                if ($HandlerDisabled) { continue }

                $LineCount = 0
                $DisabledLines = 0
                $Calls = @()

                if ($Handler.LogicLine) {
                    foreach ($Line in $Handler.LogicLine) {
                        $LineNum = ++$LineCount
                        $LineDisabled = if ($Line.Disabled) { $Line.Disabled -eq "1" } else { $false }

                        if ($LineDisabled) {
                            $DisabledLines++
                            continue
                        }

                        # Detecter les appels
                        $Operation = if ($Line.Operation) { $Line.Operation } else { "" }

                        if ($Operation -match "CallTask|CallProg|CallPublic") {
                            $TargetRef = if ($Line.TargetTask) { $Line.TargetTask }
                                         elseif ($Line.TargetProgram) { $Line.TargetProgram }
                                         elseif ($Line.PublicName) { $Line.PublicName.InnerText }
                                         else { "Unknown" }

                            $Calls += @{
                                Type   = $Operation
                                Target = $TargetRef
                                Line   = $LineNum
                            }

                            $LogicFlow.Calls += @{
                                Source      = "Task_$TaskISN2"
                                SourceName  = $TaskName
                                Handler     = $HandlerName
                                Line        = $LineNum
                                CallType    = $Operation
                                Target      = $TargetRef
                            }
                        }

                        # Detecter les branchements
                        if ($Operation -match "Block|EndBlock|Else|ElseIf") {
                            $LogicFlow.Branches += @{
                                Task    = $TaskISN2
                                Handler = $HandlerName
                                Line    = $LineNum
                                Type    = $Operation
                            }
                        }
                    }
                }

                $LogicFlow.Handlers += @{
                    TaskISN2      = $TaskISN2
                    TaskName      = $TaskName
                    HandlerType   = $HandlerType
                    HandlerName   = $HandlerName
                    TotalLines    = $LineCount
                    DisabledLines = $DisabledLines
                    ActiveLines   = $LineCount - $DisabledLines
                    Calls         = $Calls
                }
            }
        }

        # Ajouter au graphe de flux
        $LogicFlow.FlowGraph += @{
            TaskISN2   = $TaskISN2
            TaskName   = $TaskName
            IsDisabled = $IsDisabled
            Handlers   = ($Task.LogicUnit | Measure-Object).Count
        }
    }

    Write-Success "$($LogicFlow.Handlers.Count) handlers, $($LogicFlow.Calls.Count) appels, $($LogicFlow.Branches.Count) branchements"
}

# ============================================================================
# 3.3 REGLES METIER
# ============================================================================

Write-Step "3.3" "Extraction des regles metier..."

$BusinessRules = @{
    All     = @()
    ByType  = @{
        Validation = @()
        Calculation = @()
        Navigation = @()
        Display = @()
    }
}

$RuleIndex = 0

# Extraire les regles depuis les conditions
foreach ($Condition in $Expressions.Conditions) {
    $RuleIndex++
    $RuleCode = "RM-{0:D3}" -f $RuleIndex

    # Analyser le type de regle
    $RuleType = "Navigation"
    $DecodedCond = $Condition.Decoded

    if ($DecodedCond -match "Len|Trim|IsNull|IsEmpty") {
        $RuleType = "Validation"
    }
    elseif ($DecodedCond -match "\+|\-|\*|\/|Sum|Avg|Count") {
        $RuleType = "Calculation"
    }
    elseif ($DecodedCond -match "MsgBox|Alert|Display") {
        $RuleType = "Display"
    }

    $Rule = @{
        Code      = $RuleCode
        Type      = $RuleType
        Condition = $DecodedCond
        RawExpr   = $Condition.Raw
        ExprISN   = $Condition.ISN
    }

    $BusinessRules.All += $Rule
    $BusinessRules.ByType[$RuleType] += $Rule
}

Write-Success "$($BusinessRules.All.Count) regles: $($BusinessRules.ByType.Validation.Count) validation, $($BusinessRules.ByType.Calculation.Count) calcul, $($BusinessRules.ByType.Navigation.Count) navigation"

# ============================================================================
# 3.4 ALGORIGRAMME MERMAID
# ============================================================================

Write-Step "3.4" "Generation de l'algorigramme..."

$Flowchart = @{
    Mermaid = ""
    Nodes   = @()
    Edges   = @()
}

# Construire le flowchart Mermaid
$MermaidLines = @()
$MermaidLines += "flowchart TD"

# Noeud START
$ParamCount = if ($Mapping.Parameters) { $Mapping.Parameters.Count } else { 0 }
$MermaidLines += "    START([START - $ParamCount params])"

# Noeuds pour chaque tache principale
$TaskIndex = 0
foreach ($Task in $Discovery.TaskStructure.Tasks) {
    $TaskIndex++
    if ($Task.IsDisabled) { continue }

    $TaskId = "T$($Task.ISN2)"
    $TaskLabel = "$($Task.ISN2) $($Task.Name -replace '[^a-zA-Z0-9 ]', '')"

    # Limiter la longueur du label
    if ($TaskLabel.Length -gt 25) {
        $TaskLabel = $TaskLabel.Substring(0, 22) + "..."
    }

    $MermaidLines += "    $TaskId[`"$TaskLabel`"]"

    $Flowchart.Nodes += @{
        Id    = $TaskId
        Label = $TaskLabel
        ISN2  = $Task.ISN2
    }
}

# Noeud END
$MermaidLines += "    ENDOK([END])"

# Edges
$PrevNode = "START"
$TaskIndex = 0
foreach ($Task in $Discovery.TaskStructure.Tasks) {
    if ($Task.IsDisabled) { continue }
    $TaskId = "T$($Task.ISN2)"

    if ($TaskIndex -eq 0) {
        $MermaidLines += "    START --> $TaskId"
    }
    else {
        $MermaidLines += "    $PrevNode --> $TaskId"
    }

    $Flowchart.Edges += @{
        From = $PrevNode
        To   = $TaskId
    }

    $PrevNode = $TaskId
    $TaskIndex++
}

# Edge vers END
if ($PrevNode -ne "START") {
    $MermaidLines += "    $PrevNode --> ENDOK"
    $Flowchart.Edges += @{
        From = $PrevNode
        To   = "ENDOK"
    }
}
else {
    $MermaidLines += "    START --> ENDOK"
}

# Styles
$MermaidLines += ""
$MermaidLines += "    style START fill:#3fb950"
$MermaidLines += "    style ENDOK fill:#f85149"

# Ajouter style pour taches avec appels
foreach ($Call in $LogicFlow.Calls | Select-Object -First 5) {
    $TaskId = "T" + ($Call.Source -replace 'Task_', '')
    $MermaidLines += "    style $TaskId fill:#58a6ff"
}

$Flowchart.Mermaid = $MermaidLines -join "`n"

Write-Success "Algorigramme genere avec $($Flowchart.Nodes.Count) noeuds"

# ============================================================================
# ASSEMBLAGE DECODED.JSON
# ============================================================================

$Decoded = @{
    GeneratedAt   = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    Pipeline      = "V5.0"
    Phase         = "3-DECODE"

    Expressions   = $Expressions
    LogicFlow     = $LogicFlow
    BusinessRules = $BusinessRules
    Flowchart     = $Flowchart

    Stats         = @{
        TotalExpressions   = $Expressions.All.Count
        Conditions         = $Expressions.Conditions.Count
        CriticalExpr       = $Expressions.Critical.Count
        Handlers           = $LogicFlow.Handlers.Count
        Calls              = $LogicFlow.Calls.Count
        Branches           = $LogicFlow.Branches.Count
        BusinessRules      = $BusinessRules.All.Count
        FlowchartNodes     = $Flowchart.Nodes.Count
    }
}

# Sauvegarder
$Decoded | ConvertTo-Json -Depth 15 | Set-Content $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "  Decoded sauvegarde: $OutputFile" -ForegroundColor Cyan
