param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Show-TaskOrder {
    param($node, [int]$depth = 0, [int]$order = 1)

    $isn = $node.Header.ISN_2
    $name = $node.Header.Description
    $taskNum = $node.Header.TaskNumber.val  # Task number in IDE?

    $indent = "  " * $depth

    Write-Host "${indent}Order=$order ISN_2=$isn TaskNumber=$taskNum Name='$name'" -ForegroundColor Yellow

    if ($node.Task) {
        $subtasks = @($node.Task)
        Write-Host "${indent}  ${subtasks.Count} subtasks:" -ForegroundColor Gray
        $childOrder = 1
        foreach ($subtask in $subtasks) {
            Show-TaskOrder $subtask ($depth + 1) $childOrder
            $childOrder++
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Ordre des Task dans le XML ===" -ForegroundColor Cyan
Write-Host ""
Show-TaskOrder $mainTask
