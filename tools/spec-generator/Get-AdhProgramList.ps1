# Get-AdhProgramList.ps1
# Liste tous les programmes ADH avec leur statut orphelin

param(
    [string]$AdhSourcePath = "D:\Data\Migration\XPA\PMS\ADH\Source"
)

$ErrorActionPreference = "Stop"

# 1. Charger ProgramHeaders.xml
$headersPath = Join-Path $AdhSourcePath "ProgramHeaders.xml"
[xml]$headers = Get-Content $headersPath -Encoding UTF8

# 2. Charger Progs.xml pour la structure des dossiers
$progsPath = Join-Path $AdhSourcePath "Progs.xml"
[xml]$progs = Get-Content $progsPath -Encoding UTF8

# 3. Construire la liste des programmes
$programs = @()
$idePosition = 1

foreach ($prog in $headers.Application.ProgramsRepositoryHeaders.Program) {
    $header = $prog.Header
    $publicName = $header.PublicName
    $description = $header.Description
    $isEmpty = $header.isEmpty -eq "Y"
    $taskType = $header.TaskType.val

    $programs += [PSCustomObject]@{
        IDE = $idePosition
        Description = $description
        PublicName = $publicName
        HasPublicName = [bool]$publicName
        IsEmpty = $isEmpty
        TaskType = $taskType
        XmlFile = "Prg_$($idePosition - 1).xml"
    }

    $idePosition++
}

# 4. Statistiques
$total = $programs.Count
$withPublicName = ($programs | Where-Object { $_.HasPublicName }).Count
$emptyPrograms = ($programs | Where-Object { $_.IsEmpty }).Count

Write-Host "=== ADH Programs Summary ===" -ForegroundColor Cyan
Write-Host "Total programs: $total"
Write-Host "With PublicName: $withPublicName"
Write-Host "Empty (ISEMPTY_TSK): $emptyPrograms"
Write-Host ""

# 5. Exporter en JSON pour utilisation ultérieure
$outputPath = Join-Path $PSScriptRoot "adh-programs.json"
$programs | ConvertTo-Json -Depth 3 | Out-File $outputPath -Encoding UTF8
Write-Host "Exported to: $outputPath" -ForegroundColor Green

# 6. Afficher les programmes avec PublicName (ECF candidates)
Write-Host ""
Write-Host "=== Programs with PublicName (ECF/Cross-project) ===" -ForegroundColor Yellow
$programs | Where-Object { $_.HasPublicName } | ForEach-Object {
    Write-Host "  IDE $($_.IDE): $($_.PublicName)" -ForegroundColor White
}
