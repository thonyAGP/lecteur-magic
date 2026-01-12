param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$main = $xml.Application.ProgramsRepository.Programs.Task
$cols = @($main.Resource.Columns.Column)

Write-Host "=== Structure XML des premieres colonnes (Main) ===" -ForegroundColor Cyan
Write-Host "Total colonnes: $($cols.Count)"
Write-Host ""

for ($i = 0; $i -lt [Math]::Min(5, $cols.Count); $i++) {
    Write-Host "--- Colonne $($i+1) ---" -ForegroundColor Yellow
    Write-Host $cols[$i].OuterXml
    Write-Host ""
}
