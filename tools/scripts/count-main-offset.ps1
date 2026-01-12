param([string]$Project = "PVE")

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_1.xml"

if (-not (Test-Path $xmlPath)) {
    Write-Error "Main program not found: $xmlPath"
    exit 1
}

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Count-AllSelects($taskNode) {
    $count = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Select) {
                $count++
            }
        }
    }
    return $count
}

function Traverse-And-Count {
    param($node, [ref]$total)

    $selects = Count-AllSelects $node
    $total.Value += $selects
    $name = $node.Header.Description

    Write-Host "  Task '$name' : $selects Selects"

    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Traverse-And-Count $subtask $total
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Calcul MainOffset pour $Project (Prg_1.xml) ===" -ForegroundColor Cyan
Write-Host ""

$totalSelects = [ref]0
Traverse-And-Count $mainTask $totalSelects

Write-Host ""
Write-Host "MAIN OFFSET pour $Project = $($totalSelects.Value)" -ForegroundColor Yellow
