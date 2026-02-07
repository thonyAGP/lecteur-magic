#Requires -Version 5.1
<#
.SYNOPSIS
    Add TAB markers to V2.1 renders for viewer tabs support

.DESCRIPTION
    Transforms V2.1 renders by adding <!-- TAB:xxx --> markers to enable
    the viewer's tab interface (Fonctionnel, Technique, Cartographie)
#>

$ErrorActionPreference = "Stop"
$projectRoot = "D:\Projects\Lecteur_Magic"
$rendersPath = "$projectRoot\.openspec\renders"
$indexPath = "$projectRoot\.openspec\index.json"

Write-Host "=== Add TAB Markers to V2.1 Renders ===" -ForegroundColor Cyan

# Load index for callees info
$index = Get-Content $indexPath -Raw | ConvertFrom-Json
$specsMap = @{}
foreach ($spec in $index.specs) {
    if ($spec.ide) {
        $specsMap[$spec.ide] = $spec
    }
}

$files = Get-ChildItem "$rendersPath\ADH-IDE-*.md" | Sort-Object {
    [int]([regex]::Match($_.BaseName, 'IDE-(\d+)').Groups[1].Value)
}

$updated = 0
$skipped = 0

foreach ($file in $files) {
    $ide = [int]([regex]::Match($file.BaseName, 'IDE-(\d+)').Groups[1].Value)
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Skip if already has TAB markers
    if ($content -match '<!-- TAB:') {
        $skipped++
        continue
    }

    # Extract header (everything before first ## section)
    $headerEnd = $content.IndexOf("`n## ")
    if ($headerEnd -eq -1) {
        Write-Host "  Skip $($file.Name): no sections found" -ForegroundColor Yellow
        $skipped++
        continue
    }

    $header = $content.Substring(0, $headerEnd).Trim()
    $body = $content.Substring($headerEnd).Trim()

    # Find section positions
    $funcStart = $body.IndexOf("## 1. IDENTIFICATION")
    if ($funcStart -eq -1) { $funcStart = $body.IndexOf("## PARTIE I") }

    $techStart = $body.IndexOf("## 2. TABLES")
    if ($techStart -eq -1) { $techStart = $body.IndexOf("## TABLES") }

    # Build new content with TAB markers
    $newContent = $header + "`n`n---`n`n"

    # TAB:Fonctionnel - from start to tables
    if ($funcStart -ge 0 -and $techStart -gt 0) {
        $funcSection = $body.Substring($funcStart, $techStart - $funcStart).Trim()
        $newContent += "<!-- TAB:Fonctionnel -->`n`n"
        $newContent += $funcSection + "`n`n---`n`n"
    } elseif ($funcStart -ge 0) {
        $funcSection = $body.Substring($funcStart).Trim()
        $newContent += "<!-- TAB:Fonctionnel -->`n`n"
        $newContent += $funcSection + "`n`n---`n`n"
    }

    # TAB:Technique - from tables to end
    if ($techStart -gt 0) {
        $techSection = $body.Substring($techStart).Trim()
        $newContent += "<!-- TAB:Technique -->`n`n"
        $newContent += $techSection + "`n`n---`n`n"
    }

    # TAB:Cartographie - callees info from index
    $specInfo = $specsMap[$ide]
    $newContent += "<!-- TAB:Cartographie -->`n`n"
    $newContent += "## CARTOGRAPHIE`n`n"

    # Add callees if available
    if ($specInfo -and $specInfo.callees -and $specInfo.callees.Count -gt 0) {
        $newContent += "### Programmes appeles (callees)`n`n"
        $newContent += "| IDE | Programme |`n"
        $newContent += "|-----|-----------|`n"
        foreach ($callee in $specInfo.callees) {
            $newContent += "| $callee | - |`n"
        }
        $newContent += "`n"
    } else {
        $newContent += "*Aucun callee identifie - programme terminal ou appels dynamiques*`n`n"
    }

    # Add complexity info
    if ($specInfo) {
        $newContent += "### Metriques`n`n"
        $newContent += "| Metrique | Valeur |`n"
        $newContent += "|----------|--------|`n"
        $newContent += "| Tables | $($specInfo.tables) |`n"
        $newContent += "| Expressions | $($specInfo.expressions) |`n"
        $newContent += "| Complexite | $($specInfo.complexity) |`n"
        $newContent += "`n"
    }

    $newContent += "---`n`n*Spec V2.1 avec marqueurs TAB - Genere automatiquement*`n"

    # Write updated file
    $newContent | Out-File $file.FullName -Encoding UTF8 -NoNewline
    $updated++

    if ($updated % 50 -eq 0) {
        Write-Host "  Processed $updated files..." -ForegroundColor Gray
    }
}

Write-Host "`n=== DONE ===" -ForegroundColor Cyan
Write-Host "  Updated: $updated files"
Write-Host "  Skipped: $skipped files (already had TAB markers)"
