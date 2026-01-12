param([string]$Project = "PVE")

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_1.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$mainTask = $xml.Application.ProgramsRepository.Programs.Task

$count = 0
foreach ($lu in $mainTask.TaskLogic.LogicUnit) {
    $selectCount = @($lu.LogicLines.LogicLine | Where-Object { $_.Select }).Count
    $level = $lu.Level.val
    $type = $lu.Type.val
    if ($selectCount -gt 0) {
        Write-Host "LogicUnit $level/$type : $selectCount Selects"
    }
    $count += $selectCount
}

Write-Host ""
Write-Host "Total Selects dans Main $Project : $count" -ForegroundColor Green

# Convert to variable letter
function Convert-IndexToVariable($idx) {
    if ($idx -lt 26) { return [string][char]([int][char]'A' + $idx) }
    elseif ($idx -lt 702) {
        $adjusted = $idx - 26
        $first = [int][math]::Floor($adjusted / 26)
        $second = [int]($adjusted % 26)
        return [string][char]([int][char]'A' + $first) + [string][char]([int][char]'A' + $second)
    }
    return "???"
}

$lastVar = Convert-IndexToVariable ($count - 1)
Write-Host "Derniere variable Main : $lastVar (index $($count-1))" -ForegroundColor Yellow
Write-Host "Premiere variable apres Main : $(Convert-IndexToVariable $count) (index $count)" -ForegroundColor Yellow
