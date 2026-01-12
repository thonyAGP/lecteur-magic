param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Count-DataViewLines($taskNode) {
    $count = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            $count = @($lu.LogicLines.LogicLine).Count
            break
        }
    }
    return $count
}

function Show-TaskLines {
    param($node, [string]$indent = "")
    
    $isn = $node.Header.ISN_2
    $name = $node.Header.Description
    $lines = Count-DataViewLines $node
    
    Write-Host "$indent ISN=$isn $name : $lines lignes DV"
    
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Show-TaskLines $subtask "$indent  "
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Lignes Data View (pas Selects) ===" -ForegroundColor Cyan
Show-TaskLines $mainTask
