param([string]$Project = "ADH", [int]$PrgId = 159, [int]$TaskIsn = 1)

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

Write-Host "=== TOUS les LogicUnits pour $Project IDE $PrgId TaskIsn=$TaskIsn ===" -ForegroundColor Cyan

foreach ($lu in $task.TaskLogic.LogicUnit) {
    $level = $lu.Level.val
    $type = $lu.Type.val
    
    Write-Host "`n--- LogicUnit Level=$level Type=$type ---" -ForegroundColor Yellow
    
    $lineNum = 0
    foreach ($line in $lu.LogicLines.LogicLine) {
        $lineNum++
        if ($line.BLOCK) {
            $condExp = $line.BLOCK.Condition.Exp
            Write-Host "  L$lineNum : BLOCK IF (Exp=$condExp)" -ForegroundColor Magenta
        }
        elseif ($line.END_BLK) {
            Write-Host "  L$lineNum : END_BLK" -ForegroundColor Magenta
        }
        elseif ($line.Update) {
            $fieldId = $line.Update.FieldID.val
            $withValue = $line.Update.WithValue.val
            Write-Host "  L$lineNum : Update FieldID=$fieldId WithValue=$withValue" -ForegroundColor Green
        }
        elseif ($line.Remark) {
            Write-Host "  L$lineNum : Remark"
        }
        else {
            Write-Host "  L$lineNum : (autre)"
        }
    }
}
