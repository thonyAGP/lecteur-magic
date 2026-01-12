param([string]$Project = "ADH")

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_1.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Count-AllColumns($node, [string]$indent = "") {
    $name = $node.Header.Description
    $cols = @($node.Resource.Columns.Column)
    $maxId = 0

    foreach ($col in $cols) {
        $id = [int]$col.id
        if ($id -gt $maxId) { $maxId = $id }
    }

    Write-Host "$indent$name : $($cols.Count) columns (max id=$maxId)"

    if ($node.Task) {
        foreach ($st in @($node.Task)) {
            Count-AllColumns $st "$indent  "
        }
    }

    return $cols.Count
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Resource.Columns par tache ===" -ForegroundColor Cyan
$total = Count-AllColumns $mainTask

Write-Host ""
Write-Host "Note: En Magic, les colonnes sont definies au niveau programme, pas tache"
