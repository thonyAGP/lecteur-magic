param([string]$Project = "PVE", [int]$PrgId = 1)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Comptage COMPLET des variables ===" -ForegroundColor Cyan

$selectCount = 0
$variableCount = 0

foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    $level = $lu.Level.val
    $type = $lu.Type.val
    
    foreach ($line in $lu.LogicLines.LogicLine) {
        if ($line.Select) {
            $selectCount++
        }
        # Chercher les déclarations de Variable dans la Logic
        if ($line.Variable) {
            $variableCount++
            $varNum = $line.Variable.Number.val
            $varName = $line.Variable.Name.val
            Write-Host "  Variable dans Logic: #$varNum $varName (LogicUnit $level/$type)"
        }
    }
}

Write-Host ""
Write-Host "Select (Data View): $selectCount" -ForegroundColor Yellow
Write-Host "Variable (Logic): $variableCount" -ForegroundColor Yellow
Write-Host "TOTAL: $($selectCount + $variableCount)" -ForegroundColor Green
