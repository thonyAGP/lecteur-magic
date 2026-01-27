# Upgrade specs from V2.0/V2.1 to V3.5 format
# Phase 2 PDCA - Batch upgrade with TAB markers and Mermaid

param(
    [string]$SpecsPath = "D:\Projects\Lecteur_Magic\.openspec\specs",
    [int]$StartIDE = 1,
    [int]$EndIDE = 350,
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "=== Upgrade Specs to V3.5 ===" -ForegroundColor Cyan
Write-Host "Path: $SpecsPath" -ForegroundColor Cyan
Write-Host "Range: IDE $StartIDE to $EndIDE" -ForegroundColor Cyan

$upgraded = 0
$skipped = 0
$errors = 0

function Get-SpecVersion {
    param([string]$Content)

    if ($Content -match "Version spec.*?:\s*(\d+\.\d+)") {
        return [decimal]$Matches[1]
    }
    return 1.0
}

function Has-TabMarkers {
    param([string]$Content)
    return $Content -match "<!-- TAB:"
}

function Upgrade-SpecToV35 {
    param(
        [string]$FilePath,
        [switch]$DryRun
    )

    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $fileName = Split-Path $FilePath -Leaf

    $version = Get-SpecVersion $content
    $hasTabs = Has-TabMarkers $content

    # Skip if already V3.5+ with TAB markers
    if ($version -ge 3.5 -and $hasTabs) {
        return @{ Status = "SKIP"; Reason = "Already V3.5+" }
    }

    # Extract key info from existing spec
    $ideMatch = [regex]::Match($content, "# ADH IDE (\d+)")
    if (-not $ideMatch.Success) {
        return @{ Status = "SKIP"; Reason = "Not ADH spec" }
    }
    $ide = $ideMatch.Groups[1].Value

    $descMatch = [regex]::Match($content, "# ADH IDE \d+ - (.+)")
    $description = if ($descMatch.Success) { $descMatch.Groups[1].Value } else { "Unknown" }

    # Extract tables section
    $tablesSection = ""
    if ($content -match "## \d+\. TABLES[^\n]*\n\n([^#]+)") {
        $tablesSection = $Matches[1].Trim()
    }

    # Extract parameters section
    $paramsSection = ""
    if ($content -match "## \d+\. PARAMETRES[^\n]*\n\n([^#]+)") {
        $paramsSection = $Matches[1].Trim()
    }

    # Extract variables section
    $varsSection = ""
    if ($content -match "## \d+\. VARIABLES[^\n]*\n\n([\s\S]+?)(?=\n---|\n## )") {
        $varsSection = $Matches[1].Trim()
    }

    # Extract expressions section (first 15 lines max for upgrade)
    $exprSection = ""
    if ($content -match "## \d+\. EXPRESSIONS[^\n]*\n\n([^#]+)") {
        $raw = $Matches[1].Trim()
        $lines = $raw -split "`n" | Select-Object -First 20
        $exprSection = $lines -join "`n"
    }

    # Extract stats
    $statsSection = ""
    if ($content -match "## \d+\. STATISTIQUES[^\n]*\n\n([^#]+)") {
        $statsSection = $Matches[1].Trim()
    }

    # Build upgraded spec
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    $upgraded = @"
# ADH IDE $ide - $description

> **Version spec**: 3.5
> **Analyse**: $date
> **Source**: ``Prg_XXX.xml``

---

<!-- TAB:Fonctionnel -->

## SPECIFICATION FONCTIONNELLE

### 1.1 Objectif metier

| Element | Description |
|---------|-------------|
| **Qui** | Operateur |
| **Quoi** | $description |
| **Pourquoi** | A documenter |
| **Declencheur** | A identifier |

### 1.2 Regles metier

| Code | Regle | Condition |
|------|-------|-----------|
| RM-001 | A documenter | - |

### 1.3 Flux utilisateur

1. Demarrage programme
2. Traitement principal
3. Fin programme

### 1.4 Cas d'erreur

| Erreur | Comportement |
|--------|--------------|
| - | A documenter |

---

<!-- TAB:Technique -->

## SPECIFICATION TECHNIQUE

### 2.1 Identification

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE $ide |
| **Description** | $description |
| **Module** | ADH |

### 2.2 Tables

$tablesSection

### 2.3 Parametres d'entree

$paramsSection

### 2.4 Algorigramme

``````mermaid
flowchart TD
    START([START])
    PROCESS[Traitement]
    ENDOK([END])
    START --> PROCESS --> ENDOK
    style START fill:#3fb950
    style ENDOK fill:#f85149
``````

### 2.5 Expressions cles

$exprSection

### 2.6 Variables importantes

$varsSection

### 2.7 Statistiques

$statsSection

---

<!-- TAB:Cartographie -->

## CARTOGRAPHIE APPLICATIVE

### 3.1 Chaine d'appels depuis Main

``````mermaid
graph LR
    M[1 Main]
    T[$ide Programme]
    M --> T
    style M fill:#8b5cf6,color:#fff
    style T fill:#58a6ff,color:#000
``````

### 3.2 Callers directs

| IDE | Programme | Nb appels |
|-----|-----------|-----------|
| - | A analyser | - |

### 3.3 Callees

``````mermaid
graph LR
    T[$ide Programme]
    NONE[Aucun callee]
    T -.-> NONE
    style T fill:#58a6ff,color:#000
    style NONE fill:#6b7280,stroke-dasharray: 5 5
``````

### 3.4 Verification orphelin

| Critere | Resultat |
|---------|----------|
| Callers actifs | A verifier |
| **Conclusion** | A analyser |

---

## HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| $date | **Upgrade V3.5** - TAB markers, Mermaid | Claude |

---

*Specification V3.5 - Format avec TAB markers et Mermaid*
"@

    if (-not $DryRun) {
        $upgraded | Out-File $FilePath -Encoding UTF8
    }

    return @{ Status = "OK"; FromVersion = $version }
}

# Process all specs in range
for ($i = $StartIDE; $i -le $EndIDE; $i++) {
    $specFile = Join-Path $SpecsPath "ADH-IDE-$i.md"

    if (-not (Test-Path $specFile)) {
        continue
    }

    $result = Upgrade-SpecToV35 -FilePath $specFile -DryRun:$DryRun

    switch ($result.Status) {
        "OK" {
            $upgraded++
            Write-Host "  [OK] ADH-IDE-$i (v$($result.FromVersion) -> v3.5)" -ForegroundColor Green
        }
        "SKIP" {
            $skipped++
            if ($Force) {
                Write-Host "  [SKIP] ADH-IDE-$i ($($result.Reason))" -ForegroundColor Yellow
            }
        }
        "ERROR" {
            $errors++
            Write-Host "  [ERROR] ADH-IDE-$i ($($result.Reason))" -ForegroundColor Red
        }
    }
}

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Upgraded: $upgraded" -ForegroundColor Green
Write-Host "Skipped:  $skipped" -ForegroundColor Yellow
Write-Host "Errors:   $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Green" })

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] No files were modified" -ForegroundColor Magenta
}
