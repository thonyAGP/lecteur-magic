# Chercher table 594 dans REF DataSources.xml

[xml]$refDS = Get-Content "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml" -Encoding UTF8
$tables = $refDS.SelectNodes("//DataObject[@id]")
Write-Host "Tables dans REF: $($tables.Count)"

# Chercher table id=594
$table594 = $refDS.SelectSingleNode("//DataObject[@id='594']")
if ($table594) {
    Write-Host ""
    Write-Host "Table 594 trouvee:" -ForegroundColor Green
    Write-Host "  name=$($table594.name)"
    Write-Host "  PhysicalName=$($table594.PhysicalName)"

    $cols = $table594.SelectNodes("./Columns/Column")
    Write-Host "  Colonnes: $($cols.Count)" -ForegroundColor Green

    Write-Host ""
    Write-Host "Liste des colonnes:"
    $idx = 0
    foreach ($col in $cols) {
        Write-Host ("  [{0}] id={1} : {2}" -f $idx, $col.id, $col.name)
        $idx++
    }
} else {
    Write-Host "Table 594 non trouvee dans REF"

    # Montrer quelques tables pour debug
    Write-Host ""
    Write-Host "Recherche dans les IDs proches de 594:"
    $tables | Where-Object { [int]$_.id -ge 590 -and [int]$_.id -le 600 } | ForEach-Object {
        Write-Host "  id=$($_.id) : $($_.name)"
    }

    Write-Host ""
    Write-Host "Tables contenant 'comptage' ou 'coffre':"
    $tables | Where-Object { $_.name -match "comptage|coffre|devise" } | ForEach-Object {
        Write-Host "  id=$($_.id) : $($_.name)"
    }
}
