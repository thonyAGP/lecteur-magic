param([string]$Project = "ADH", [int]$PrgId = 159)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

# Chercher dans Task.DataView.Source.Expressions
$exprs = $xml.Application.ProgramsRepository.Programs.Task.DataView.Source.Expressions.Expression
Write-Host "=== Expressions dans DataView.Source ===" -ForegroundColor Cyan
foreach ($e in $exprs) {
    Write-Host "  ID=$($e.id): $($e.val)"
}

# Chercher aussi dans Task.Expressions si existe
$exprs2 = $xml.Application.ProgramsRepository.Programs.Task.Expressions.Expression
if ($exprs2) {
    Write-Host "`n=== Expressions dans Task.Expressions ===" -ForegroundColor Cyan
    foreach ($e in $exprs2) {
        Write-Host "  ID=$($e.id): $($e.val)"
    }
}
