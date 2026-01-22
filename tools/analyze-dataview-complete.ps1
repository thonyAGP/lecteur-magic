# Analyse complete du DataView de Reception (ISN_2=19)
# Objectif: comprendre d'où viennent les 131+ colonnes

[xml]$xml = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Prg_558.xml" -Encoding UTF8

$recTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='19']]")
$resource = $recTask.SelectSingleNode("./Resource")

Write-Host "=== STRUCTURE COMPLETE DU RESOURCE ===" -ForegroundColor Cyan
Write-Host ""

# Lister TOUS les éléments enfants
Write-Host "Elements enfants du Resource:" -ForegroundColor Yellow
foreach ($child in $resource.ChildNodes) {
    if ($child.NodeType -eq "Element") {
        Write-Host "  <$($child.LocalName)> : $($child.ChildNodes.Count) enfants"
    }
}

# Examiner DataSources
Write-Host ""
Write-Host "=== DataSources ===" -ForegroundColor Yellow
$dataSources = $resource.SelectSingleNode("./DataSources")
if ($dataSources) {
    foreach ($ds in $dataSources.ChildNodes) {
        if ($ds.NodeType -eq "Element") {
            Write-Host "  <$($ds.LocalName)> id=$($ds.id) obj=$($ds.obj)"
            # Examiner les sous-elements
            foreach ($sub in $ds.ChildNodes) {
                if ($sub.NodeType -eq "Element") {
                    Write-Host "    <$($sub.LocalName)>"
                }
            }
        }
    }
} else {
    Write-Host "  (pas de DataSources)"
}

# Examiner Columns en détail (avec le DataSourceRef s'il existe)
Write-Host ""
Write-Host "=== Columns (detail) ===" -ForegroundColor Yellow
$columns = $resource.SelectNodes("./Columns/Column")
Write-Host "Nombre de colonnes: $($columns.Count)"

foreach ($col in $columns) {
    $dsRef = $col.SelectSingleNode("./DataSourceRef")
    $dsId = if ($dsRef) { $dsRef.val } else { "N/A" }

    $storage = $col.SelectSingleNode("./Storage")
    $storageType = if ($storage) { $storage.val } else { "" }

    Write-Host ("  Col id={0} ds={1} storage={2} : {3}" -f $col.id, $dsId, $storageType, $col.name)
}

# Regarder si les ancêtres ont des DataSources avec des tables
Write-Host ""
Write-Host "=== DATASOURCES DES ANCETRES ===" -ForegroundColor Yellow

# Main task
$mainTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='1']]")
$mainDS = $mainTask.SelectNodes("./Resource/DataSources/DataSource")
Write-Host "Main (ISN=1) DataSources: $($mainDS.Count)"
foreach ($ds in $mainDS) {
    Write-Host "  DS id=$($ds.id) obj=$($ds.obj)"
    $cols = $mainTask.SelectNodes("./Resource/Columns/Column[DataSourceRef/@val='$($ds.id)']")
    Write-Host "    Colonnes de cette source: $($cols.Count)"
}

# Edition task
$editionTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='18']]")
$edDS = $editionTask.SelectNodes("./Resource/DataSources/DataSource")
Write-Host "`nEdition (ISN=18) DataSources: $($edDS.Count)"
foreach ($ds in $edDS) {
    Write-Host "  DS id=$($ds.id) obj=$($ds.obj)"
}

# Regarder le XML brut de Resource pour Reception
Write-Host ""
Write-Host "=== XML BRUT RESOURCE (partiel) ===" -ForegroundColor Yellow
$xmlText = $resource.OuterXml
if ($xmlText.Length -gt 2000) {
    Write-Host $xmlText.Substring(0, 2000)
    Write-Host "`n... (tronque)"
} else {
    Write-Host $xmlText
}
