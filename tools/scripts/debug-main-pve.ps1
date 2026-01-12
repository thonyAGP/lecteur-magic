$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\PVE\Source\Prg_1.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Main PVE Structure ===" -ForegroundColor Cyan
Write-Host "Task principale: $($mainTask.Header.Description)"

# Count selects in main task
$mainSelects = 0
foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    $mainSelects += @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
}
Write-Host "Selects dans tache principale: $mainSelects"

# Check for subtasks
if ($mainTask.Task) {
    Write-Host "`nSous-taches du Main:" -ForegroundColor Yellow
    $totalSubSelects = 0
    foreach ($subtask in @($mainTask.Task)) {
        $isn = $subtask.Header.ISN_2
        $name = $subtask.Header.Description
        $subSelects = 0
        foreach ($lu in $subtask.TaskLogic.LogicUnit) {
            $subSelects += @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
        }
        Write-Host "  ISN=$isn $name : $subSelects Selects"
        $totalSubSelects += $subSelects
    }
    Write-Host "`nTotal sous-taches: $totalSubSelects"
    Write-Host "TOTAL Main + sous-taches: $($mainSelects + $totalSubSelects)" -ForegroundColor Green
}
