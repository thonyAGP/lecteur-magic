# Trouver la table mappee pour obj=594 comp=2 dans VIL

[xml]$comps = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Comps.xml" -Encoding UTF8

# Trouver le composant 2
$comp2 = $comps.SelectSingleNode("//Component[@id='2']")
Write-Host "Composant 2: $($comp2.name)" -ForegroundColor Cyan
Write-Host "  ECF: $($comp2.CABINET_FILE)"
Write-Host ""

# Trouver l'objet avec id=594 dans ComponentDataObjects
$objects = $comp2.SelectNodes("./ComponentDataObjects/Object")
Write-Host "Nombre d'objets dans composant 2: $($objects.Count)"

$obj594 = $comp2.SelectSingleNode("./ComponentDataObjects/Object[id/@val='594']")
if ($obj594) {
    $itemIsn = $obj594.SelectSingleNode("ItemIsn/@val").Value
    $publicName = $obj594.SelectSingleNode("PublicName/@val").Value
    Write-Host ""
    Write-Host "Objet 594 trouve:" -ForegroundColor Green
    Write-Host "  ItemIsn dans REF: $itemIsn"
    Write-Host "  PublicName: $publicName"

    # Maintenant chercher cette table dans REF
    Write-Host ""
    Write-Host "=== RECHERCHE DANS REF ===" -ForegroundColor Yellow
    [xml]$refDS = Get-Content "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml" -Encoding UTF8

    # Chercher par ItemIsn
    $refTable = $refDS.SelectSingleNode("//DataObject[@ItemIsn='$itemIsn']")
    if (-not $refTable) {
        # Chercher par id
        $refTable = $refDS.SelectSingleNode("//DataObject[@id='$itemIsn']")
    }

    if ($refTable) {
        Write-Host "Table REF trouvee:" -ForegroundColor Green
        Write-Host "  name: $($refTable.name)"
        Write-Host "  PhysicalName: $($refTable.PhysicalName)"

        $cols = $refTable.SelectNodes("./Columns/Column")
        Write-Host "  COLONNES: $($cols.Count)" -ForegroundColor Green

        if ($cols.Count -gt 0) {
            Write-Host ""
            Write-Host "Liste des colonnes:"
            $idx = 0
            foreach ($col in $cols) {
                Write-Host ("  [{0}] id={1} : {2}" -f $idx, $col.id, $col.name)
                $idx++
                if ($idx -ge 30) {
                    Write-Host "  ... et $($cols.Count - 30) autres"
                    break
                }
            }
        }
    } else {
        Write-Host "Table ItemIsn=$itemIsn non trouvee dans REF"
    }
} else {
    Write-Host "Objet 594 non trouve dans composant 2"

    # Debug - montrer quelques objets
    Write-Host ""
    Write-Host "Quelques objets proches:"
    $objects | Where-Object {
        $idNode = $_.SelectSingleNode("id/@val")
        if ($idNode) {
            $idVal = [int]$idNode.Value
            return $idVal -ge 590 -and $idVal -le 600
        }
        return $false
    } | ForEach-Object {
        $idNode = $_.SelectSingleNode("id/@val")
        $isnNode = $_.SelectSingleNode("ItemIsn/@val")
        $nameNode = $_.SelectSingleNode("PublicName/@val")
        Write-Host "  id=$($idNode.Value) ItemIsn=$($isnNode.Value) : $($nameNode.Value)"
    }
}
