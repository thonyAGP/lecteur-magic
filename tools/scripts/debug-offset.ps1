param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Count-TaskSelects($taskNode) {
    $count = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        $count += @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
    }
    return $count
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Debug Offset pour $Project Prg_$PrgId ===" -ForegroundColor Cyan
Write-Host ""

# Task principale (Select Product)
$selectCount1 = Count-TaskSelects $mainTask
Write-Host "Task 1 (Select Product) ISN=$($mainTask.Header.ISN_2) : $selectCount1 Selects"

# Sub Category (première sous-tâche)
if ($mainTask.Task) {
    foreach ($subtask in @($mainTask.Task)) {
        $isn = $subtask.Header.ISN_2
        $name = $subtask.Header.Description
        $selectCount = Count-TaskSelects $subtask
        Write-Host "  SubTask ISN=$isn ($name) : $selectCount Selects"
        
        # Product (sous-sous-tâche)
        if ($subtask.Task) {
            foreach ($subsubtask in @($subtask.Task)) {
                $isn2 = $subsubtask.Header.ISN_2
                $name2 = $subsubtask.Header.Description
                $selectCount2 = Count-TaskSelects $subsubtask
                Write-Host "    SubSubTask ISN=$isn2 ($name2) : $selectCount2 Selects"
            }
        }
    }
}

Write-Host ""
Write-Host "Calcul attendu pour Product:"
Write-Host "  Main(143) + SelectProduct($selectCount1) + SubCategory(?) = ?"
