param([string]$Project = "ADH", [int]$PrgId = 159)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$task = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== XML des Updates dans Record Prefix ===" -ForegroundColor Cyan

foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "P") {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Update) {
                Write-Host $line.OuterXml
            }
        }
    }
}
