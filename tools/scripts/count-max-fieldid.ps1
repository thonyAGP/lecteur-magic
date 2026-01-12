param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-MaxFieldID($taskNode) {
    $maxFieldId = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Select) {
                $fid = [int]$line.Select.FieldID
                if ($fid -gt $maxFieldId) { $maxFieldId = $fid }
            }
        }
    }
    return $maxFieldId
}

function Show-TaskFieldIDs {
    param($node, [string]$indent = "")
    
    $isn = $node.Header.ISN_2
    $name = $node.Header.Description
    $maxFid = Get-MaxFieldID $node
    
    Write-Host "$indent ISN=$isn $name : MaxFieldID=$maxFid"
    
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Show-TaskFieldIDs $subtask "$indent  "
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Max FieldID (= nombre de variables) ===" -ForegroundColor Cyan
Show-TaskFieldIDs $mainTask
