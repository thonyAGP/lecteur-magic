# Calculate variable offsets for subtasks
param([int]$PrgId = 317, [string]$Project = "ADH", [int]$BaseOffset = 143)

$xmlPath = "D:\Data\Migration\XPA\PMS\$Project\Source\Prg_$PrgId.xml"
[xml]$xml = Get-Content $xmlPath -Encoding UTF8
$main = $xml.Application.ProgramsRepository.Programs.Task

function Count-Variables($task) {
    $count = 0
    foreach ($lu in $task.TaskLogic.LogicUnit) {
        $count += ($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
    }
    return $count
}

$mainVars = Count-Variables $main
Write-Host "Main task (ISN=1): $mainVars variables"

$runningOffset = $BaseOffset + $mainVars
$subIdx = 1
foreach ($sub in @($main.Task)) {
    $subVars = Count-Variables $sub
    $isn = $sub.Header.ISN_2
    $name = $sub.Header.Description
    Write-Host "Subtask $subIdx (ISN=$isn): $subVars vars, offset=$runningOffset -> $name"
    $runningOffset += $subVars
    $subIdx++
}
