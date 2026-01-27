<#
.SYNOPSIS
    Parse un fichier XML Magic et génère un rapport formaté des variables et de la logique.

.DESCRIPTION
    Script déterministe qui produit TOUJOURS le même résultat pour le même XML.
    Extrait:
    - Variables du DataView avec leurs lettres (A-Z, AA-ZZ, AAA-ZZZ)
    - Lignes de Logic avec les vrais numéros IDE
    - Expressions avec formules en variables ET traduction lisible

.PARAMETER Project
    Nom du projet (ADH, PBG, PBP, PVE, REF, VIL)

.PARAMETER PrgId
    ID du programme (numéro du fichier Prg_XXX.xml)

.PARAMETER TaskIsn
    ISN_2 de la tâche à analyser

.PARAMETER ParentOffset
    Offset cumulatif des variables parentes (Main + ancêtres)

.EXAMPLE
    .\magic-logic-parser.ps1 -Project VIL -PrgId 558 -TaskIsn 19 -ParentOffset 52
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
    [int]$ParentOffset = 0,

    [Parameter(Mandatory=$false)]
    [string]$OutputFile
)

# Configuration des chemins
$BasePath = "D:\Data\Migration\XPA\PMS\$Project\Source"
$PrgFile = Join-Path $BasePath "Prg_$PrgId.xml"

if (-not (Test-Path $PrgFile)) {
    Write-Error "Fichier non trouve: $PrgFile"
    exit 1
}

# Fonction pour convertir un index en lettre(s) de variable
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

# Fonction pour parser le type de champ
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

# Fonction pour parser une expression
function Get-ExpressionFormula {
    param(
        [System.Xml.XmlElement]$ExpressionsNode,
        [int]$ExpId,
        [hashtable]$VariableMap
    )

    $exp = $ExpressionsNode.SelectSingleNode("Expression[@id='$ExpId']")
    if (-not $exp) { return @{ Raw = "?"; Translated = "?" } }

    $formulaNode = $exp.SelectSingleNode("Formula")
    $formula = if ($formulaNode) { $formulaNode.InnerText } else { $null }
    if (-not $formula) {
        # Expression simple (juste une valeur)
        $valueNode = $exp.SelectSingleNode("Value")
        $val = if ($valueNode) { $valueNode.InnerText } else { $null }
        if ($val) { return @{ Raw = $val; Translated = $val } }
        return @{ Raw = "?"; Translated = "?" }
    }

    # Traduire les références {niveau,colonne} en variables
    $translated = $formula
    $pattern = '\{(\d+),(\d+)\}'

    $matches = [regex]::Matches($formula, $pattern)
    foreach ($match in $matches) {
        $level = [int]$match.Groups[1].Value
        $colId = [int]$match.Groups[2].Value

        $key = "$level,$colId"
        if ($VariableMap.ContainsKey($key)) {
            $varInfo = $VariableMap[$key]
            $translated = $translated -replace [regex]::Escape($match.Value), $varInfo.Name
        }
    }

    # Retourner les deux formes
    # Remplacer les lettres par les noms dans la version "translated"
    $withLetters = $formula
    foreach ($match in $matches) {
        $level = [int]$match.Groups[1].Value
        $colId = [int]$match.Groups[2].Value
        $key = "$level,$colId"
        if ($VariableMap.ContainsKey($key)) {
            $varInfo = $VariableMap[$key]
            $withLetters = $withLetters -replace [regex]::Escape($match.Value), $varInfo.Letter
        }
    }

    return @{
        Raw = $withLetters
        Translated = $translated
    }
}

# Charger le XML
Write-Host "Chargement de $PrgFile..." -ForegroundColor Cyan
[xml]$xml = Get-Content $PrgFile -Encoding UTF8

# Trouver la tâche spécifique
$task = $xml.SelectSingleNode("//Task[Header[@ISN_2='$TaskIsn']]")
if (-not $task) {
    Write-Error "Tache ISN_2=$TaskIsn non trouvee"
    exit 1
}

$taskName = $task.Header.Description
Write-Host "Tache trouvee: $taskName (ISN_2=$TaskIsn)" -ForegroundColor Green

# ============================================
# 1. PARSER LES COLONNES (VARIABLES)
# ============================================
Write-Host "`n=== VARIABLES DU DATAVIEW ===" -ForegroundColor Yellow

$columns = $task.SelectNodes(".//Resource/Columns/Column")
$variables = @()
$variableMap = @{}  # Pour lookup par niveau,colId
$position = 0

foreach ($col in $columns) {
    $colId = [int]$col.id
    $colName = $col.name
    $colType = Get-FieldType -Column $col

    # Calculer la lettre avec l'offset parent
    $globalIndex = $ParentOffset + $position
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
    $variableMap["0,$colId"] = $varInfo  # Niveau 0 = tâche courante

    $position++
}

# Afficher les variables
Write-Host "`n| Lettre | Col ID | Nom | Type |"
Write-Host "|--------|--------|-----|------|"
foreach ($v in $variables) {
    Write-Host ("| **{0}** | {1} | {2} | {3} |" -f $v.Letter, $v.ColId, $v.Name, $v.Type)
}

# ============================================
# 2. PARSER LES EXPRESSIONS
# ============================================
Write-Host "`n=== EXPRESSIONS ===" -ForegroundColor Yellow

$expressions = $task.SelectSingleNode(".//Expressions")
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
    Write-Host "`n| # | Formule (variables) | Formule (traduction) |"
    Write-Host "|---|---------------------|----------------------|"
    foreach ($e in $expList | Sort-Object { [int]$_.Id }) {
        if ($e.Raw -ne "?" -and $e.Raw.Length -lt 80) {
            Write-Host ("| {0} | ``{1}`` | ``{2}`` |" -f $e.Id, $e.Raw, $e.Translated)
        }
    }
}

# ============================================
# 3. PARSER LA LOGIQUE (LIGNES)
# ============================================
Write-Host "`n=== LOGIC ===" -ForegroundColor Yellow

$taskLogic = $task.SelectSingleNode(".//TaskLogic")
$logicUnits = $taskLogic.SelectNodes("LogicUnit")

$lineNumber = 1  # Compteur global de lignes IDE
$logicLines = @()

# Mapping des types de handler
$handlerTypes = @{
    "P" = "Task Prefix"
    "S" = "Task Suffix"  # ou Record Suffix selon Level
}

$levelTypes = @{
    "T" = "Task"
    "R" = "Record"
    "C" = "Control"
    "G" = "Group"
}

foreach ($unit in $logicUnits) {
    $unitId = $unit.id
    $unitLevel = $unit.Level.val
    $unitType = $unit.Type.val

    $handlerName = ""
    if ($levelTypes.ContainsKey($unitLevel)) {
        $handlerName = $levelTypes[$unitLevel]
    }
    if ($handlerTypes.ContainsKey($unitType)) {
        if ($unitType -eq "P") {
            $handlerName += " Prefix"
        } else {
            $handlerName += " Suffix"
        }
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

                # Trouver la variable par FieldID
                $varInfo = $variables | Where-Object { $_.ColId -eq [int]$fieldId } | Select-Object -First 1
                if ($varInfo) {
                    $lineInfo.Variable = $varInfo.Letter
                    $lineInfo.VarName = $varInfo.Name
                }

                $lineInfo.Type = "Variable"
                $lineInfo.ExpNum = $withValue

                # Chercher l'expression
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
                $blockType = $childNode.Type
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
Write-Host "`n| Ligne | Operation | Type | Variable | Nom Variable | Exp# | Formule (vars) | Formule (traduite) |"
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

# ============================================
# 4. GÉNÉRER LE RAPPORT MARKDOWN
# ============================================
if ($OutputFile) {
    $md = @"
# Rapport Logic - $Project IDE $PrgId - Tâche $taskName (ISN_2=$TaskIsn)

> Généré le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
> Script: magic-logic-parser.ps1
> Offset parent: $ParentOffset

---

## Variables du DataView

| Lettre | Col ID | Nom | Type |
|--------|--------|-----|------|
"@

    foreach ($v in $variables) {
        $md += "`n| **{0}** | {1} | {2} | {3} |" -f $v.Letter, $v.ColId, $v.Name, $v.Type
    }

    $md += @"

---

## Logic

| Ligne | Operation | Type | Variable | Nom Variable | Exp# | Formule (vars) | Formule (traduite) |
|-------|-----------|------|----------|--------------|------|----------------|-------------------|
"@

    foreach ($l in $logicLines) {
        if ($l.Type -eq "Header") {
            $md += "`n| **{0}** | **{1}** | | | | | | |" -f $l.LineNum, $l.Operation
        }
        elseif ($l.Operation -ne "Remark" -or $l.Details.Trim() -ne "") {
            $varDisplay = if ($l.Variable) { "**$($l.Variable)**" } else { "" }
            $md += "`n| {0} | {1} | {2} | {3} | {4} | {5} | ``{6}`` | ``{7}`` |" -f `
                $l.LineNum, $l.Operation, $l.Type, $varDisplay, $l.VarName, $l.ExpNum, $l.ExpRaw, $l.ExpTranslated
        }
    }

    $md | Out-File $OutputFile -Encoding UTF8
    Write-Host "`nRapport genere: $OutputFile" -ForegroundColor Green
}

Write-Host "`n=== FIN ===" -ForegroundColor Cyan
