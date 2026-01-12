param([string]$Project = "ADH", [int]$PrgId = 159, [int]$ExprId = 26)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8
$expr = $xml.Application.ProgramsRepository.Programs.Task.DataView.Source.Expressions.Expression | Where-Object { $_.id -eq "$ExprId" }

Write-Host "Expression $ExprId :" -ForegroundColor Cyan
Write-Host $expr.val
