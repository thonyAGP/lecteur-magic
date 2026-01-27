<#
.SYNOPSIS
    Regenere et nettoie tous les renders V2.1
#>

$rendersPath = "D:\Projects\Lecteur_Magic\.openspec\renders"
$mergeScript = "D:\Projects\Lecteur_Magic\tools\spec-generator\Merge-SpecWithAnnotations.ps1"
$cleanScript = "D:\Projects\Lecteur_Magic\tools\spec-generator\Clean-SpecReferences.ps1"

Get-ChildItem "$rendersPath\ADH-IDE-*.md" | ForEach-Object {
    $fileName = $_.BaseName
    $ide = [regex]::Match($fileName, 'IDE-(\d+)').Groups[1].Value

    Write-Host "`n=== Processing ADH IDE $ide ===" -ForegroundColor Cyan

    # Regenerer depuis les sources
    & $mergeScript -Project ADH -IDE $ide

    # Nettoyer les references
    & $cleanScript -InputPath $_.FullName
}

Write-Host "`n=== Tous les renders regeneres et nettoyes ===" -ForegroundColor Green
