# Analyse COMPLETE de l'offset pour VIL Prg_558 tâche Reception (ISN_2=19)
# Objectif: calculer exactement d'où viennent les ~130 colonnes avant Reception

[xml]$xml = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Prg_558.xml" -Encoding UTF8
[xml]$comps = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Comps.xml" -Encoding UTF8
[xml]$refDS = Get-Content "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml" -Encoding UTF8

function Get-TableColumnCount {
    param(
        [int]$CompId,
        [int]$ObjId
    )

    if ($CompId -le 0) {
        # Table locale (pas de composant externe)
        return 0
    }

    # Trouver le composant
    $comp = $comps.SelectSingleNode("//Component[@id='$CompId']")
    if (-not $comp) { return 0 }

    # Trouver l'objet dans ComponentDataObjects
    $obj = $comp.SelectSingleNode("./ComponentDataObjects/Object[id/@val='$ObjId']")
    if (-not $obj) { return 0 }

    $itemIsn = $obj.SelectSingleNode("ItemIsn/@val").Value

    # Trouver la table dans REF
    $table = $refDS.SelectSingleNode("//DataObject[@id='$itemIsn']")
    if (-not $table) {
        $table = $refDS.SelectSingleNode("//DataObject[@ItemIsn='$itemIsn']")
    }

    if ($table) {
        $cols = $table.SelectNodes("./Columns/Column")
        return $cols.Count
    }

    return 0
}

function Analyze-TaskDataView {
    param(
        [System.Xml.XmlElement]$Task,
        [string]$Prefix = ""
    )

    $header = $Task.SelectSingleNode("Header")
    $isn = $header.ISN_2
    $desc = $header.Description

    Write-Host ""
    Write-Host "${Prefix}=== TACHE ISN_2=$isn : $desc ===" -ForegroundColor Yellow

    $resource = $Task.SelectSingleNode("./Resource")
    $totalCols = 0

    # 1. Vérifier le DB (Main Source)
    $db = $resource.SelectSingleNode("./DB")
    if ($db) {
        $dataObj = $db.SelectSingleNode("./DataObject")
        if ($dataObj) {
            $comp = $dataObj.comp
            $obj = $dataObj.obj

            $tableCols = Get-TableColumnCount -CompId $comp -ObjId $obj
            Write-Host "${Prefix}  Main Source: comp=$comp obj=$obj -> $tableCols colonnes"
            $totalCols += $tableCols
        }
    }

    # 2. Vérifier les Links
    $links = $resource.SelectNodes("./Links/Link")
    if ($links -and $links.Count -gt 0) {
        Write-Host "${Prefix}  Links: $($links.Count)"
        foreach ($link in $links) {
            $linkDb = $link.SelectSingleNode("./DB/DataObject")
            if ($linkDb) {
                $comp = $linkDb.comp
                $obj = $linkDb.obj
                $linkCols = Get-TableColumnCount -CompId $comp -ObjId $obj
                Write-Host "${Prefix}    Link comp=$comp obj=$obj -> $linkCols colonnes"
                $totalCols += $linkCols
            }
        }
    }

    # 3. Colonnes virtuelles locales
    $localCols = $resource.SelectNodes("./Columns/Column")
    Write-Host "${Prefix}  Colonnes locales (virtuelles): $($localCols.Count)"
    $totalCols += $localCols.Count

    Write-Host "${Prefix}  TOTAL colonnes tache: $totalCols" -ForegroundColor Green

    return $totalCols
}

Write-Host "=== ANALYSE COMPLETE OFFSET VIL PRG_558 ===" -ForegroundColor Cyan

# Analyser chaque tâche dans le chemin vers Reception
# Chemin: Main (ISN=1) -> Edition (ISN=18) -> Reception (ISN=19)

$mainTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='1']]")
$editionTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='18']]")
$receptionTask = $xml.SelectSingleNode("//Task[Header[@ISN_2='19']]")

$offsetMain = Analyze-TaskDataView -Task $mainTask -Prefix ""
$offsetEdition = Analyze-TaskDataView -Task $editionTask -Prefix "  "
$offsetReception = Analyze-TaskDataView -Task $receptionTask -Prefix "    "

Write-Host ""
Write-Host "=== CALCUL FINAL ===" -ForegroundColor Cyan
$totalOffset = $offsetMain + $offsetEdition
Write-Host "Offset avant Reception = Main ($offsetMain) + Edition ($offsetEdition) = $totalOffset"

# Quelle lettre pour index $totalOffset ?
$idx = $totalOffset
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

Write-Host "Premiere variable de Reception: index $totalOffset = $letter"
Write-Host ""
Write-Host "=== VERIFICATION AVEC SCREENSHOT ===" -ForegroundColor Yellow
Write-Host "Screenshot utilisateur montrait Reception commencant a DO"
Write-Host "DO = D(3) O(14) = 26 + 3*26 + 14 = 118"
Write-Host "Ecart: $($totalOffset - 118)"
