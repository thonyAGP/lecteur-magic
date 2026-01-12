param([string]$Project = "ADH", [int]$PrgId = 159)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$exprs = $xml.Application.ProgramsRepository.Programs.Task.Expressions.Expression
Write-Host "=== Expressions (id 20-30) ===" -ForegroundColor Cyan
foreach ($e in $exprs) {
    $id = $e.id
    if ([int]$id -ge 20 -and [int]$id -le 30) {
        $content = $e.InnerText
        if (-not $content) { $content = $e.'#text' }
        if (-not $content) { $content = $e.val }
        if (-not $content) { $content = $e.OuterXml }
        Write-Host "ID=$id : $content"
    }
}
