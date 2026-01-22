# Compter les colonnes d'une table Magic
# comp=2 = composant REF (basé sur Comps.xml de VIL)

param(
    [int]$TableObj = 594,
    [int]$CompId = 2
)

Write-Host "=== RECHERCHE TABLE obj=$TableObj comp=$CompId ===" -ForegroundColor Cyan

# D'abord, trouver quel est le composant 2 dans VIL
$vilComps = "D:\Data\Migration\XPA\PMS\VIL\Source\Comps.xml"
[xml]$comps = Get-Content $vilComps -Encoding UTF8

Write-Host "`nComposants dans VIL:" -ForegroundColor Yellow
$compList = $comps.SelectNodes("//Component")
foreach ($c in $compList) {
    Write-Host "  id=$($c.id) ItemIsn=$($c.ItemIsn) ECF=$($c.ECFFileName)"
}

# Trouver le composant 2
$targetComp = $comps.SelectSingleNode("//Component[@id='$CompId']")
if ($targetComp) {
    $ecfName = $targetComp.ECFFileName
    Write-Host "`nComposant $CompId = $ecfName"

    # Le composant 2 est généralement REF
    # Les tables de REF sont dans DataSources.xml de REF
    $refPath = "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml"

    if (Test-Path $refPath) {
        Write-Host "`nChargement de $refPath..." -ForegroundColor Cyan
        [xml]$refDS = Get-Content $refPath -Encoding UTF8

        # Chercher la table par son obj (ItemIsn dans DataSources)
        # Dans DataSources.xml, les tables sont référencées par leur position dans DataSourcesRepositoryOutLine
        # ou par leur id dans DataSource elements

        $tables = $refDS.SelectNodes("//DataSource")
        Write-Host "Nombre de DataSources dans REF: $($tables.Count)"

        # Chercher par ItemIsn
        $targetTable = $refDS.SelectSingleNode("//DataSource[@ItemIsn='$TableObj']")
        if (-not $targetTable) {
            # Chercher par id
            $targetTable = $refDS.SelectSingleNode("//DataSource[@id='$TableObj']")
        }

        if ($targetTable) {
            Write-Host "`nTable trouvee:" -ForegroundColor Green
            Write-Host "  id=$($targetTable.id)"
            Write-Host "  ItemIsn=$($targetTable.ItemIsn)"
            Write-Host "  Description=$($targetTable.Description)"

            # Compter les colonnes
            $cols = $targetTable.SelectNodes("./Columns/Column")
            Write-Host "  Nombre de colonnes: $($cols.Count)" -ForegroundColor Green

            Write-Host "`n  Colonnes:"
            $idx = 0
            foreach ($col in $cols) {
                $model = $col.SelectSingleNode(".//Model/@attr_obj")
                $type = if ($model) { $model.Value -replace "FIELD_", "" } else { "?" }
                Write-Host ("    [{0}] id={1} : {2} ({3})" -f $idx, $col.id, $col.name, $type)
                $idx++
                if ($idx -ge 20) {
                    Write-Host "    ... et $($cols.Count - 20) autres colonnes"
                    break
                }
            }
        } else {
            Write-Host "Table obj=$TableObj non trouvee dans REF DataSources.xml"

            # Essayer de chercher dans tous les DataSource
            Write-Host "`nRecherche par description contenant 'comptage' ou 'coffre'..."
            $allTables = $refDS.SelectNodes("//DataSource")
            foreach ($t in $allTables) {
                $desc = $t.Description
                if ($desc -match "comptage|coffre|session" -and $t.ItemIsn) {
                    Write-Host "  ItemIsn=$($t.ItemIsn) : $desc"
                }
            }
        }
    }
} else {
    Write-Host "Composant $CompId non trouve dans Comps.xml"
}

# Aussi regarder dans VIL directement au cas où
Write-Host "`n=== RECHERCHE DANS VIL DataSources.xml ===" -ForegroundColor Yellow
$vilDSPath = "D:\Data\Migration\XPA\PMS\VIL\Source\DataSources.xml"
if (Test-Path $vilDSPath) {
    [xml]$vilDS = Get-Content $vilDSPath -Encoding UTF8
    $vilTables = $vilDS.SelectNodes("//DataSource")
    Write-Host "Tables dans VIL: $($vilTables.Count)"

    # Chercher obj=594
    foreach ($t in $vilTables) {
        if ($t.id -eq $TableObj -or $t.ItemIsn -eq $TableObj) {
            Write-Host "`nTable trouvee dans VIL:" -ForegroundColor Green
            Write-Host "  id=$($t.id) ItemIsn=$($t.ItemIsn) : $($t.Description)"
            $cols = $t.SelectNodes("./Columns/Column")
            Write-Host "  Colonnes: $($cols.Count)"
        }
    }
}
