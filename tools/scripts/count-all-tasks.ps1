param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Show-TaskCounts {
    param($node, [string]$indent = "")
    
    $isn = $node.Header.ISN_2
    $name = $node.Header.Description
    
    $columns = @($node.Resource.Columns.Column).Count
    $selects = 0
    foreach ($lu in $node.TaskLogic.LogicUnit) {
        $selects += @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
    }
    
    Write-Host "$indent ISN=$isn $name : Cols=$columns, Sel=$selects"
    
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Show-TaskCounts $subtask "$indent  "
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== PVE Prg_$PrgId - Colonnes vs Selects ===" -ForegroundColor Cyan
Show-TaskCounts $mainTask
