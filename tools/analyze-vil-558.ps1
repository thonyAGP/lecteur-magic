# Analyse complete du DataView VIL Prg_558

[xml]$xml = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Prg_558.xml" -Encoding UTF8

Write-Host "=== ANALYSE VIL PRG_558 ===" -ForegroundColor Cyan
Write-Host ""

# Trouver la tâche Main (ISN_2=1)
$mainTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='1']]")
$mainResource = $mainTask.SelectSingleNode("./Resource")

Write-Host "=== MAIN TASK (ISN_2=1) Print recap sessions ===" -ForegroundColor Yellow

# DataSources dans Main
$dataSources = $mainResource.SelectNodes("./DataSources/DataSource")
Write-Host "DataSources count: $($dataSources.Count)"
foreach ($ds in $dataSources) {
    Write-Host "  DS id=$($ds.id) obj=$($ds.obj)"
}

# Colonnes dans Main
$mainCols = $mainResource.SelectNodes("./Columns/Column")
Write-Host ""
Write-Host "Colonnes Main: $($mainCols.Count)"
$idx = 0
foreach ($col in $mainCols) {
    $model = $col.SelectSingleNode(".//Model/@attr_obj")
    $type = if ($model) { $model.Value -replace "FIELD_", "" } else { "?" }
    Write-Host ("  [{0}] id={1} : {2} ({3})" -f $idx, $col.id, $col.name, $type)
    $idx++
}

# Analyser la tâche Edition (ISN_2=18)
Write-Host ""
Write-Host "=== TASK Edition (ISN_2=18) ===" -ForegroundColor Yellow
$editionTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='18']]")
$edResource = $editionTask.SelectSingleNode("./Resource")
$edCols = $edResource.SelectNodes("./Columns/Column")
Write-Host "Colonnes Edition: $($edCols.Count)"
$idx = 0
foreach ($col in $edCols) {
    Write-Host ("  [{0}] id={1} : {2}" -f $idx, $col.id, $col.name)
    $idx++
}

# Analyser la tâche Reception (ISN_2=19)
Write-Host ""
Write-Host "=== TASK Reception (ISN_2=19) ===" -ForegroundColor Yellow
$recTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='19']]")
$recResource = $recTask.SelectSingleNode("./Resource")

# DataSources
$recDS = $recResource.SelectNodes("./DataSources/DataSource")
Write-Host "DataSources: $($recDS.Count)"
foreach ($ds in $recDS) {
    Write-Host "  DS id=$($ds.id) obj=$($ds.obj)"
}

$recCols = $recResource.SelectNodes("./Columns/Column")
Write-Host ""
Write-Host "Colonnes Reception: $($recCols.Count)"
$idx = 0
foreach ($col in $recCols) {
    Write-Host ("  [{0}] id={1} : {2}" -f $idx, $col.id, $col.name)
    $idx++
}

# Verifier la hierarchie reelle - Edition est parent de Reception ?
Write-Host ""
Write-Host "=== HIERARCHIE ===" -ForegroundColor Yellow
$edParent = $editionTask.ParentNode
Write-Host "Parent de Edition: $($edParent.LocalName)"
if ($edParent.LocalName -eq "Task") {
    $edParentHeader = $edParent.SelectSingleNode("Header")
    Write-Host "  ISN_2 parent: $($edParentHeader.ISN_2)"
}

$recParent = $recTask.ParentNode
Write-Host "Parent de Reception: $($recParent.LocalName)"
if ($recParent.LocalName -eq "Task") {
    $recParentHeader = $recParent.SelectSingleNode("Header")
    Write-Host "  ISN_2 parent: $($recParentHeader.ISN_2)"
}

# CALCUL DE L'OFFSET REEL
Write-Host ""
Write-Host "=== CALCUL OFFSET ===" -ForegroundColor Yellow
$totalCols = 0

# Compter Main
$totalCols += $mainCols.Count
Write-Host "Main: +$($mainCols.Count) = $totalCols"

# Vérifier si Edition est dans le chemin vers Reception
# On remonte depuis Reception
$current = $recTask.ParentNode
while ($current.LocalName -eq "Task") {
    $currHeader = $current.SelectSingleNode("Header")
    $currCols = $current.SelectNodes("./Resource/Columns/Column")
    $totalCols += $currCols.Count
    Write-Host "Ancetre ISN=$($currHeader.ISN_2): +$($currCols.Count) = $totalCols"
    $current = $current.ParentNode
}

Write-Host ""
Write-Host "OFFSET FINAL (colonnes ancetres): $totalCols" -ForegroundColor Green

# Ce que cela donne comme lettre
$idx = $totalCols
if ($idx -lt 26) {
    $letter = [char](65 + $idx)
} elseif ($idx -lt 702) {
    $first = [int][Math]::Floor(($idx - 26) / 26)
    $second = ($idx - 26) % 26
    $letter = [char](65 + $first) + [char](65 + $second)
} else {
    $idx2 = $idx - 702
    $first = [int][Math]::Floor($idx2 / 676)
    $remainder = $idx2 % 676
    $second = [int][Math]::Floor($remainder / 26)
    $third = $remainder % 26
    $letter = [char](65 + $first) + [char](65 + $second) + [char](65 + $third)
}

Write-Host "Premiere variable de Reception serait: $letter"

# Comparaison avec l'attendu
Write-Host ""
Write-Host "=== COMPARAISON ===" -ForegroundColor Yellow
Write-Host "Attendu (qui marche): offset 131 -> ED"
Write-Host "Calcule: offset $totalCols -> $letter"
Write-Host "Ecart: $($totalCols - 131) colonnes"
