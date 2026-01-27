<#
.SYNOPSIS
    Parse un fichier XML Magic et génère un rapport formaté - Version 2

.DESCRIPTION
    Version améliorée qui:
    - Calcule automatiquement l'offset des variables (compte tous les ancêtres)
    - Mappe correctement les FieldID vers les variables
    - Parse les expressions avec traduction

.PARAMETER Project
    Nom du projet (ADH, PBG, PBP, PVE, REF, VIL)

.PARAMETER PrgId
    ID du programme (numéro du fichier Prg_XXX.xml)

.PARAMETER TaskIsn
    ISN_2 de la tâche à analyser

.EXAMPLE
    .\magic-logic-parser-v2.ps1 -Project VIL -PrgId 558 -TaskIsn 19
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

if (-not (Test-Path $PrgFile)) {
    Write-Error "Fichier non trouve: $PrgFile"
    exit 1
}

# Fonction pour convertir un index en lettre(s)
function Convert-IndexToLetter {
    param([int]$Index)

    if ($Index -lt 26) {
        return [char](65 + $Index)
    }
    elseif ($Index -lt 702) {
        $first = [int][Math]::Floor(($Index - 26) / 26)
        $second = ($Index - 26) % 26
        return [char](65 + $first) + [char](65 + $second)
    }
    else {
        $Index -= 702
        $first = [int][Math]::Floor($Index / 676)
        $remainder = $Index % 676
        $second = [int][Math]::Floor($remainder / 26)
        $third = $remainder % 26
        return [char](65 + $first) + [char](65 + $second) + [char](65 + $third)
    }
}

# Fonction pour obtenir le type de champ
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
            default { return $model.Value }
        }
    }
    return "Unknown"
}

Write-Host "Chargement de $PrgFile..." -ForegroundColor Cyan
[xml]$xml = Get-Content $PrgFile -Encoding UTF8

# ============================================
# ÉTAPE 1: CONSTRUIRE LA HIÉRARCHIE DES TÂCHES
# ============================================

Write-Host "Construction de la hierarchie des taches..." -ForegroundColor Yellow

# Fonction récursive pour trouver le chemin vers une tâche
function Find-TaskPath {
    param(
        [System.Xml.XmlElement]$TaskNode,
        [int]$TargetIsn,
        [System.Collections.ArrayList]$Path
    )

    $isn = $TaskNode.Header.ISN_2
    if ($isn -eq $TargetIsn) {
        [void]$Path.Add($TaskNode)
        return $true
    }

    $children = $TaskNode.SelectNodes("./Task")
    foreach ($child in $children) {
        [void]$Path.Add($TaskNode)
        $found = Find-TaskPath -TaskNode $child -TargetIsn $TargetIsn -Path $Path
        if ($found) { return $true }
        $Path.RemoveAt($Path.Count - 1)
    }

    return $false
}

# Trouver le Main (première Task)
$mainTask = $xml.SelectSingleNode("//ProgramsRepository/Programs/Task")
$taskPath = New-Object System.Collections.ArrayList
$found = Find-TaskPath -TaskNode $mainTask -TargetIsn $TaskIsn -Path $taskPath

if (-not $found) {
    Write-Error "Tache ISN_2=$TaskIsn non trouvee dans la hierarchie"
    exit 1
}

$targetTask = $taskPath[$taskPath.Count - 1]
$taskName = $targetTask.Header.Description
Write-Host "Tache trouvee: $taskName (ISN_2=$TaskIsn)" -ForegroundColor Green
Write-Host "Chemin: Main" -NoNewline
for ($i = 1; $i -lt $taskPath.Count; $i++) {
    Write-Host " > $($taskPath[$i].Header.Description)" -NoNewline
}
Write-Host ""

# ============================================
# ÉTAPE 2: COLLECTER TOUTES LES COLONNES DU CHEMIN
# ============================================

Write-Host "`nCollecte des colonnes de toute la hierarchie..." -ForegroundColor Yellow

$allColumns = @()  # Liste de toutes les colonnes avec leur origine
$globalIndex = 0

foreach ($task in $taskPath) {
    $taskIsn = $task.Header.ISN_2
    $taskDesc = $task.Header.Description

    $columns = $task.SelectNodes("./Resource/Columns/Column")
    foreach ($col in $columns) {
        $letter = Convert-IndexToLetter -Index $globalIndex

        $colInfo = @{
            GlobalIndex = $globalIndex
            Letter = $letter
            ColId = [int]$col.id
            Name = $col.name
            Type = Get-FieldType -Column $col
            TaskIsn = $taskIsn
            TaskName = $taskDesc
        }

        $allColumns += $colInfo
        $globalIndex++
    }
}

Write-Host "Total colonnes collectees: $($allColumns.Count)" -ForegroundColor Green

# Créer un mapping FieldID -> Variable pour la tâche cible
# Note: Dans Magic, FieldID fait référence à la position dans la liste des colonnes du DataView
$fieldIdMap = @{}
$localIndex = 0

# Les colonnes de la tâche cible
$targetColumns = $targetTask.SelectNodes("./Resource/Columns/Column")

# L'offset est le nombre de colonnes AVANT cette tâche
$targetOffset = 0
for ($i = 0; $i -lt $taskPath.Count - 1; $i++) {
    $ancestorColumns = $taskPath[$i].SelectNodes("./Resource/Columns/Column")
    $targetOffset += $ancestorColumns.Count
}

Write-Host "Offset pour tache cible: $targetOffset" -ForegroundColor Cyan

# Construire le mapping FieldID -> ColInfo
foreach ($col in $targetColumns) {
    $colId = [int]$col.id
    $globalIdx = $targetOffset + $localIndex
    $letter = Convert-IndexToLetter -Index $globalIdx

    $fieldIdMap[$colId] = @{
        Letter = $letter
        Name = $col.name
        Type = Get-FieldType -Column $col
        GlobalIndex = $globalIdx
        LocalIndex = $localIndex
    }

    $localIndex++
}

# ============================================
# ÉTAPE 3: AFFICHER LES VARIABLES LOCALES
# ============================================

Write-Host "`n=== VARIABLES LOCALES (Tache $taskName) ===" -ForegroundColor Yellow
Write-Host "| Lettre | Col ID | Nom | Type |"
Write-Host "|--------|--------|-----|------|"

foreach ($colId in ($fieldIdMap.Keys | Sort-Object)) {
    $v = $fieldIdMap[$colId]
    Write-Host ("| **{0}** | {1} | {2} | {3} |" -f $v.Letter, $colId, $v.Name, $v.Type)
}

# ============================================
# ÉTAPE 4: PARSER LES EXPRESSIONS
# ============================================

Write-Host "`n=== EXPRESSIONS ===" -ForegroundColor Yellow

$expressions = $targetTask.SelectSingleNode("./Expressions")
$expMap = @{}

if ($expressions) {
    $expNodes = $expressions.SelectNodes("Expression")
    foreach ($exp in $expNodes) {
        $expId = $exp.id

        # Chercher la formule
        $formulaNode = $exp.SelectSingleNode("Formula")
        $formula = if ($formulaNode) { $formulaNode.InnerText } else { $null }

        if (-not $formula) {
            # Expression constante
            $valueNode = $exp.SelectSingleNode("Value")
            $formula = if ($valueNode) { $valueNode.InnerText } else { "?" }
        }

        # Traduire les {niveau,colId}
        $translated = $formula
        $withLetters = $formula
        $pattern = '\{(\d+),(\d+)\}'

        $matches = [regex]::Matches($formula, $pattern)
        foreach ($m in $matches) {
            $level = [int]$m.Groups[1].Value
            $colId = [int]$m.Groups[2].Value

            # Niveau 0 = tâche courante, niveau 1 = parent, etc.
            # Niveau 32768 = variables globales VG

            if ($level -eq 0 -and $fieldIdMap.ContainsKey($colId)) {
                $varInfo = $fieldIdMap[$colId]
                $withLetters = $withLetters -replace [regex]::Escape($m.Value), $varInfo.Letter
                $translated = $translated -replace [regex]::Escape($m.Value), $varInfo.Name
            }
            elseif ($level -eq 32768) {
                # Variable globale
                $vgLetter = Convert-IndexToLetter -Index $colId
                $withLetters = $withLetters -replace [regex]::Escape($m.Value), "VG.$vgLetter"
                $translated = $translated -replace [regex]::Escape($m.Value), "VG.$vgLetter"
            }
            else {
                # Variable d'un ancêtre
                $ancestorIdx = $level
                if ($ancestorIdx -lt $taskPath.Count) {
                    $ancestorTask = $taskPath[$taskPath.Count - 1 - $ancestorIdx]
                    $ancestorCols = $ancestorTask.SelectNodes("./Resource/Columns/Column")
                    foreach ($ac in $ancestorCols) {
                        if ([int]$ac.id -eq $colId) {
                            $withLetters = $withLetters -replace [regex]::Escape($m.Value), $ac.name
                            $translated = $translated -replace [regex]::Escape($m.Value), $ac.name
                            break
                        }
                    }
                }
            }
        }

        $expMap[$expId] = @{
            Id = $expId
            Raw = $withLetters
            Translated = $translated
        }
    }
}

# Afficher les expressions non triviales
Write-Host "| # | Formule (variables) | Formule (traduction) |"
Write-Host "|---|---------------------|----------------------|"
foreach ($expId in ($expMap.Keys | Sort-Object { [int]$_ })) {
    $e = $expMap[$expId]
    if ($e.Raw.Length -lt 60) {
        Write-Host ("| {0} | ``{1}`` | ``{2}`` |" -f $e.Id, $e.Raw, $e.Translated)
    }
}

# ============================================
# ÉTAPE 5: PARSER LA LOGIC
# ============================================

Write-Host "`n=== LOGIC ===" -ForegroundColor Yellow

$taskLogic = $targetTask.SelectSingleNode("./TaskLogic")
$logicUnits = $taskLogic.SelectNodes("LogicUnit")

$lineNumber = 1
$logicLines = @()

$levelNames = @{
    "T" = "Task"
    "R" = "Record"
    "C" = "Control"
    "G" = "Group"
}

$typeNames = @{
    "P" = "Prefix"
    "S" = "Suffix"
}

foreach ($unit in $logicUnits) {
    $unitLevel = $unit.Level.val
    $unitType = $unit.Type.val

    $handlerName = ""
    if ($levelNames.ContainsKey($unitLevel)) {
        $handlerName = $levelNames[$unitLevel]
    }
    if ($typeNames.ContainsKey($unitType)) {
        $handlerName += " " + $typeNames[$unitType]
    }

    # Header line
    $logicLines += @{
        LineNum = $lineNumber
        Operation = $handlerName.Trim()
        IsHeader = $true
        Variable = ""
        VarName = ""
        ExpNum = ""
        ExpRaw = ""
        ExpTranslated = ""
        Details = ""
    }
    $lineNumber++

    # Logic lines
    $lines = $unit.SelectNodes("LogicLines/LogicLine")
    foreach ($line in $lines) {
        $childNode = $line.FirstChild
        if (-not $childNode) { continue }

        $operation = $childNode.LocalName
        $lineInfo = @{
            LineNum = $lineNumber
            Operation = $operation
            IsHeader = $false
            Variable = ""
            VarName = ""
            ExpNum = ""
            ExpRaw = ""
            ExpTranslated = ""
            Details = ""
        }

        switch ($operation) {
            "Update" {
                $fieldId = [int]$childNode.FieldID.val
                $withValue = $childNode.WithValue.val

                if ($fieldIdMap.ContainsKey($fieldId)) {
                    $varInfo = $fieldIdMap[$fieldId]
                    $lineInfo.Variable = $varInfo.Letter
                    $lineInfo.VarName = $varInfo.Name
                }
                else {
                    $lineInfo.Variable = "?$fieldId"
                    $lineInfo.VarName = "(FieldID=$fieldId)"
                }

                $lineInfo.ExpNum = $withValue

                if ($withValue -and $expMap.ContainsKey($withValue)) {
                    $exp = $expMap[$withValue]
                    $lineInfo.ExpRaw = $exp.Raw
                    $lineInfo.ExpTranslated = $exp.Translated
                }
            }
            "CallTask" {
                $taskId = $childNode.TaskID.obj
                $lineInfo.Details = "SubTask $taskId"

                # Chercher le nom de la sous-tâche
                $subTask = $targetTask.SelectSingleNode(".//Task[Header[@ISN_2='$taskId']]")
                if ($subTask) {
                    $lineInfo.Details = $subTask.Header.Description
                }
            }
            "BLOCK" {
                $condNode = $childNode.SelectSingleNode("Condition")
                if ($condNode -and $condNode.Exp) {
                    $expId = $condNode.Exp
                    $lineInfo.ExpNum = $expId
                    if ($expMap.ContainsKey($expId)) {
                        $exp = $expMap[$expId]
                        $lineInfo.ExpRaw = $exp.Raw
                        $lineInfo.ExpTranslated = $exp.Translated
                    }
                }
                $lineInfo.Details = "IF"
            }
            "END_BLK" {
                $lineInfo.Details = "END"
            }
            "Remark" {
                $text = $childNode.Text.val
                if ($text -and $text.Trim() -ne "") {
                    $lineInfo.Details = $text.Substring(0, [Math]::Min(50, $text.Length))
                }
            }
            "Form" {
                $ioIdx = $childNode.IODIdx.val
                $lineInfo.Details = "Output $ioIdx"
            }
        }

        $logicLines += $lineInfo
        $lineNumber++
    }
}

# Afficher
Write-Host "| Ligne | Operation | Variable | Nom | Exp# | Formule | Traduite |"
Write-Host "|-------|-----------|----------|-----|------|---------|----------|"

foreach ($l in $logicLines) {
    if ($l.IsHeader) {
        Write-Host ("| **{0}** | **{1}** | | | | | |" -f $l.LineNum, $l.Operation)
    }
    elseif ($l.Operation -eq "Update") {
        $expRaw = if ($l.ExpRaw.Length -gt 30) { $l.ExpRaw.Substring(0,27) + "..." } else { $l.ExpRaw }
        $expTrans = if ($l.ExpTranslated.Length -gt 30) { $l.ExpTranslated.Substring(0,27) + "..." } else { $l.ExpTranslated }
        Write-Host ("| {0} | Update | **{1}** | {2} | {3} | ``{4}`` | ``{5}`` |" -f `
            $l.LineNum, $l.Variable, $l.VarName, $l.ExpNum, $expRaw, $expTrans)
    }
    elseif ($l.Operation -eq "CallTask") {
        Write-Host ("| {0} | Call | | {1} | | | |" -f $l.LineNum, $l.Details)
    }
    elseif ($l.Operation -eq "BLOCK") {
        $expRaw = if ($l.ExpRaw.Length -gt 30) { $l.ExpRaw.Substring(0,27) + "..." } else { $l.ExpRaw }
        Write-Host ("| {0} | Block IF | | | {1} | ``{2}`` | |" -f $l.LineNum, $l.ExpNum, $expRaw)
    }
    elseif ($l.Operation -eq "END_BLK") {
        Write-Host ("| {0} | End | | | | | |" -f $l.LineNum)
    }
    elseif ($l.Operation -eq "Form") {
        Write-Host ("| {0} | Form | | {1} | | | |" -f $l.LineNum, $l.Details)
    }
    elseif ($l.Details -and $l.Details.Trim() -ne "") {
        Write-Host ("| {0} | Remark | | {1} | | | |" -f $l.LineNum, $l.Details)
    }
}

Write-Host "`n=== FIN ===" -ForegroundColor Cyan
