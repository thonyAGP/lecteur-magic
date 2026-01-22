# Vérifier le contexte du programme VIL 558
# Peut-être que ce programme est appelé par un autre et hérite de colonnes

[xml]$headers = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\ProgramHeaders.xml" -Encoding UTF8

# Trouver le programme 558
$prg558 = $headers.SelectSingleNode("//ProgramHeader[@id='558']")

if ($prg558) {
    Write-Host "=== PROGRAMME 558 ===" -ForegroundColor Cyan
    Write-Host "  Description: $($prg558.Description)"
    Write-Host "  TaskType: $($prg558.TaskType)"
    Write-Host "  PublicName: $($prg558.PublicName)"

    # Vérifier les paramètres
    $params = $prg558.Parameters
    Write-Host "  Parameters: $params"
}

# Regarder aussi la Main Task du programme pour ses vraies colonnes
Write-Host ""
Write-Host "=== ANALYSE DETAILLEE MAIN TASK ===" -ForegroundColor Yellow

[xml]$xml = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Prg_558.xml" -Encoding UTF8

$mainTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='1']]")
$resource = $mainTask.SelectSingleNode("./Resource")

# DB détaillé
$db = $resource.SelectSingleNode("./DB")
Write-Host "DB element:"
$db.ChildNodes | ForEach-Object {
    if ($_.NodeType -eq "Element") {
        $attrs = ""
        foreach ($attr in $_.Attributes) {
            $attrs += " $($attr.Name)=$($attr.Value)"
        }
        Write-Host "  <$($_.LocalName)>$attrs"
    }
}

# Links
$links = $resource.SelectNodes("./Links/Link")
Write-Host ""
Write-Host "Links dans Main: $($links.Count)"
foreach ($link in $links) {
    $linkDb = $link.SelectSingleNode("./DB/DataObject")
    if ($linkDb) {
        Write-Host "  Link: comp=$($linkDb.comp) obj=$($linkDb.obj)"
    }
}

# Analyse de la table obj=50 comp=2
Write-Host ""
Write-Host "=== TABLE OBJ=50 COMP=2 ===" -ForegroundColor Yellow

[xml]$comps = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Comps.xml" -Encoding UTF8
[xml]$refDS = Get-Content "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml" -Encoding UTF8

$comp2 = $comps.SelectSingleNode("//Component[@id='2']")
$obj50 = $comp2.SelectSingleNode("./ComponentDataObjects/Object[id/@val='50']")
if ($obj50) {
    $itemIsn = $obj50.SelectSingleNode("ItemIsn/@val").Value
    $publicName = $obj50.SelectSingleNode("PublicName/@val").Value
    Write-Host "Objet 50 -> ItemIsn=$itemIsn PublicName=$publicName"

    # Trouver dans REF
    $table = $refDS.SelectSingleNode("//DataObject[@id='$itemIsn']")
    if ($table) {
        Write-Host "Table REF: $($table.name)"
        $cols = $table.SelectNodes("./Columns/Column")
        Write-Host "Colonnes: $($cols.Count)"
        $cols | ForEach-Object { Write-Host "  $($_.name)" }
    }
}

# Essayer de comprendre la vraie numérotation Magic
Write-Host ""
Write-Host "=== COMPARAISON AVEC SCREENSHOT ===" -ForegroundColor Cyan
Write-Host "Le screenshot montrait pour Reception:"
Write-Host "  Premiere variable visible: DO (index ~118)"
Write-Host ""
Write-Host "Ma formule pour AA-ZZ: index = 26 + first*26 + second"
Write-Host "DO: D=3, O=14 -> 26 + 3*26 + 14 = 26 + 78 + 14 = 118"
Write-Host ""
Write-Host "DONC Reception commence a l'index 118"
Write-Host ""
Write-Host "Mes calculs donnent:"
Write-Host "  Main: 6 (table obj=50) + 12 (locales) = 18"
Write-Host "  Edition: 56 (table obj=594) + 1 (locale) = 57"
Write-Host "  Total avant Reception: 18 + 57 = 75"
Write-Host "  Ecart: 118 - 75 = 43 colonnes manquantes"
Write-Host ""
Write-Host "HYPOTHESE: Les tables Main Source de Reception ne comptent pas"
Write-Host "           car elles sont les memes que Edition."
Write-Host "           Ou bien les colonnes table ne sont pas numerotees comme variables."
