<#
.SYNOPSIS
    Script de diagnostic pour comprendre l'offset des variables Magic
#>

param(
    [string]$Project = "VIL",
    [int]$PrgId = 558,
    [int]$TaskIsn = 19
)

$BasePath = "D:\Data\Migration\XPA\PMS\$Project\Source"
$PrgFile = Join-Path $BasePath "Prg_$PrgId.xml"

Write-Host "=== DIAGNOSTIC OFFSET VARIABLES ===" -ForegroundColor Cyan
Write-Host "Fichier: $PrgFile"
Write-Host "Tache cible: ISN_2 = $TaskIsn"
Write-Host ""

[xml]$xml = Get-Content $PrgFile -Encoding UTF8

# 1. Lister TOUTES les tâches avec leur nombre de colonnes
Write-Host "=== LISTE DES TACHES ET COLONNES ===" -ForegroundColor Yellow

$allTasks = $xml.SelectNodes("//Task")
Write-Host "Nombre total de taches: $($allTasks.Count)"
Write-Host ""

$taskData = @()
foreach ($task in $allTasks) {
    $header = $task.SelectSingleNode("Header")
    $isn = $header.ISN_2
    $desc = $header.Description

    # Compter les colonnes dans Resource/Columns
    $columns = $task.SelectNodes("./Resource/Columns/Column")
    $colCount = $columns.Count

    # Détecter si c'est une tâche Main ou enfant
    $parent = $task.ParentNode
    $parentType = if ($parent.LocalName -eq "Task") { "Child" } else { "Root" }

    $taskData += [PSCustomObject]@{
        ISN_2 = $isn
        Description = $desc
        ColumnCount = $colCount
        Type = $parentType
    }
}

# Afficher les tâches avec colonnes
$taskData | Where-Object { $_.ColumnCount -gt 0 } | Format-Table -AutoSize

# 2. Trouver le chemin vers la tâche cible
Write-Host ""
Write-Host "=== CHEMIN VERS TACHE $TaskIsn ===" -ForegroundColor Yellow

function Get-TaskPath {
    param(
        [System.Xml.XmlElement]$Task,
        [int]$TargetIsn,
        [System.Collections.ArrayList]$Path
    )

    $header = $Task.SelectSingleNode("Header")
    $isn = [int]$header.ISN_2

    if ($isn -eq $TargetIsn) {
        [void]$Path.Add($Task)
        return $true
    }

    $children = $Task.SelectNodes("./Task")
    foreach ($child in $children) {
        [void]$Path.Add($Task)
        if (Get-TaskPath -Task $child -TargetIsn $TargetIsn -Path $Path) {
            return $true
        }
        $Path.RemoveAt($Path.Count - 1)
    }

    return $false
}

# Trouver la tâche racine (Main)
$mainTask = $xml.SelectSingleNode("/Application/Programs/Program/Task")
$path = [System.Collections.ArrayList]::new()
$found = Get-TaskPath -Task $mainTask -TargetIsn $TaskIsn -Path $path

if (-not $found) {
    Write-Host "Tache $TaskIsn non trouvee!" -ForegroundColor Red
    exit 1
}

Write-Host "Chemin trouve avec $($path.Count) taches:"
$cumulOffset = 0
foreach ($t in $path) {
    $h = $t.SelectSingleNode("Header")
    $cols = $t.SelectNodes("./Resource/Columns/Column")
    Write-Host "  ISN=$($h.ISN_2) '$($h.Description)' : $($cols.Count) colonnes"

    # Montrer les premières colonnes
    $cols | Select-Object -First 3 | ForEach-Object {
        Write-Host "    - Col $($_.id): $($_.name)" -ForegroundColor Gray
    }
    if ($cols.Count -gt 3) {
        Write-Host "    - ... et $($cols.Count - 3) autres" -ForegroundColor Gray
    }

    # Ajouter à l'offset seulement pour les ancêtres (pas la tâche cible)
    if ($h.ISN_2 -ne $TaskIsn) {
        $cumulOffset += $cols.Count
    }
}

Write-Host ""
Write-Host "Offset cumule (ancetres): $cumulOffset" -ForegroundColor Green

# 3. Analyser le DataView de la tâche cible en détail
Write-Host ""
Write-Host "=== DATAVIEW TACHE CIBLE (ISN_2=$TaskIsn) ===" -ForegroundColor Yellow

$targetTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='$TaskIsn']]")
$resource = $targetTask.SelectSingleNode("./Resource")

if ($resource) {
    # Analyser les DataSources (Main Source + Links)
    $dataSources = $resource.SelectNodes("./DataSources/DataSource")
    Write-Host "DataSources: $($dataSources.Count)"
    foreach ($ds in $dataSources) {
        $dsId = $ds.id
        $dsObj = $ds.obj
        Write-Host "  DataSource $dsId : obj=$dsObj" -ForegroundColor Gray
    }

    # Analyser les colonnes
    $columns = $resource.SelectNodes("./Columns/Column")
    Write-Host ""
    Write-Host "Colonnes dans Resource/Columns: $($columns.Count)"
    Write-Host ""
    Write-Host "| Index | ColID | Nom | Type |"
    Write-Host "|-------|-------|-----|------|"
    $idx = 0
    foreach ($col in $columns) {
        $model = $col.SelectSingleNode(".//Model/@attr_obj")
        $type = if ($model) { $model.Value -replace "FIELD_", "" } else { "?" }
        Write-Host ("| {0} | {1} | {2} | {3} |" -f $idx, $col.id, $col.name, $type)
        $idx++
    }
}

# 4. Comparer avec ce qu'attend le test (offset 131)
Write-Host ""
Write-Host "=== VERIFICATION ===" -ForegroundColor Yellow
Write-Host "Offset calcule: $cumulOffset"
Write-Host "Offset attendu (test reussi): 131"
Write-Host "Difference: $($cumulOffset - 131)"
Write-Host ""

# Calculer ce que donnerait offset 131
Write-Host "Si offset = 131, premiere variable de tache $TaskIsn serait:"
$letter131 = ""
$idx = 131
if ($idx -lt 26) {
    $letter131 = [char](65 + $idx)
} else {
    $first = [int][Math]::Floor(($idx - 26) / 26)
    $second = ($idx - 26) % 26
    $letter131 = [char](65 + $first) + [char](65 + $second)
}
Write-Host "  Index 131 = Variable $letter131" -ForegroundColor Green

# Ce que donne l'offset actuel
$letterCurrent = ""
$idx = $cumulOffset
if ($idx -lt 26) {
    $letterCurrent = [char](65 + $idx)
} else {
    $first = [int][Math]::Floor(($idx - 26) / 26)
    $second = ($idx - 26) % 26
    $letterCurrent = [char](65 + $first) + [char](65 + $second)
}
Write-Host "  Index $cumulOffset = Variable $letterCurrent (offset calcule)"
