param([string]$Project = "ADH")

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_1.xml"

if (-not (Test-Path $xmlPath)) {
    Write-Error "Main program not found: $xmlPath"
    exit 1
}

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Analyse $Project Prg_1.xml ===" -ForegroundColor Cyan
Write-Host ""

# Resource.Columns
$columns = @($mainTask.Resource.Columns.Column)
Write-Host "Resource.Columns: $($columns.Count) colonnes" -ForegroundColor Yellow

# Count Selects in DataView
$selectCount = 0
foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Select) {
                $selectCount++
            }
        }
    }
}
Write-Host "DataView Selects (R/M): $selectCount" -ForegroundColor Green

# Count ALL Selects (including handlers)
$allSelectCount = 0
foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    foreach ($line in $lu.LogicLines.LogicLine) {
        if ($line.Select) {
            $allSelectCount++
        }
    }
}
Write-Host "Total Selects (all LU): $allSelectCount" -ForegroundColor Green

# Check for subtasks
if ($mainTask.Task) {
    $subtasks = @($mainTask.Task)
    Write-Host ""
    Write-Host "Subtasks: $($subtasks.Count)" -ForegroundColor Yellow
    foreach ($st in $subtasks) {
        $stName = $st.Header.Description
        $stSelects = 0
        foreach ($lu in $st.TaskLogic.LogicUnit) {
            foreach ($line in $lu.LogicLines.LogicLine) {
                if ($line.Select) {
                    $stSelects++
                }
            }
        }
        Write-Host "  - $stName : $stSelects Selects"
    }
}

# Max FieldID
$maxFieldId = 0
foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    foreach ($line in $lu.LogicLines.LogicLine) {
        if ($line.Select.FieldID) {
            $fid = [int]$line.Select.FieldID
            if ($fid -gt $maxFieldId) { $maxFieldId = $fid }
        }
    }
}
Write-Host ""
Write-Host "Max FieldID in Main: $maxFieldId" -ForegroundColor Cyan
