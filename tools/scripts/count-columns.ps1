param([string]$Project = "PVE", [int]$PrgId = 186, [int]$TaskIsn = 1)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Find-TaskByIsn {
    param($node, [int]$targetIsn)
    if ($node.Header.ISN_2 -eq $targetIsn) { return $node }
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            $found = Find-TaskByIsn $subtask $targetIsn
            if ($found) { return $found }
        }
    }
    return $null
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$task = Find-TaskByIsn $mainTask $TaskIsn

$taskName = $task.Header.Description

# Count columns in Resource.Columns
$columns = @($task.Resource.Columns.Column)
$colCount = $columns.Count

# Count Selects
$selectCount = 0
foreach ($lu in $task.TaskLogic.LogicUnit) {
    $selectCount += @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
}

Write-Host "=== Task ISN=$TaskIsn : $taskName ===" -ForegroundColor Cyan
Write-Host "Colonnes (Resource.Columns): $colCount" -ForegroundColor Green
Write-Host "Selects (LogicUnit): $selectCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "La vraie valeur pour l'offset = $colCount (pas $selectCount)" -ForegroundColor Magenta
