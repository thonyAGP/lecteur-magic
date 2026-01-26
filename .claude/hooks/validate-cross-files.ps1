# validate-cross-files.ps1
# Hook de validation croisee pour les fichiers d'analyse de tickets
# Verifie la coherence entre analysis.md, implementation.md et sources XML
# Version 1.0

param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

$ErrorActionPreference = "Stop"

# Ne valider que les fichiers dans tickets/
if ($FilePath -notmatch '\.openspec[\\/]tickets[\\/][A-Z]+-\d+[\\/]') {
    exit 0
}

# Extraire le dossier du ticket
$ticketDir = Split-Path $FilePath -Parent
$ticketKey = Split-Path $ticketDir -Leaf

# Chemins des fichiers
$analysisPath = Join-Path $ticketDir "analysis.md"
$implementationPath = Join-Path $ticketDir "implementation.md"
$notesPath = Join-Path $ticketDir "notes.md"

# Sources Magic
$sourcePaths = @(
    "D:\Data\Migration\XPA\PMS\ADH\Source",
    "D:\Data\Migration\XPA\PMS\PBP\Source",
    "D:\Data\Migration\XPA\PMS\PVE\Source",
    "D:\Data\Migration\XPA\PMS\PBG\Source",
    "D:\Data\Migration\XPA\PMS\VIL\Source",
    "D:\Data\Migration\XPA\PMS\REF\Source"
)

Write-Host "=== Validation Croisee Fichiers Ticket ===" -ForegroundColor Cyan
Write-Host "Ticket: $ticketKey" -ForegroundColor Gray

$errors = @()
$warnings = @()

# ============================================================================
# LECTURE FICHIERS
# ============================================================================

$analysisContent = $null
$implementationContent = $null

if (Test-Path $analysisPath) {
    $analysisContent = Get-Content $analysisPath -Raw -ErrorAction SilentlyContinue
}

if (Test-Path $implementationPath) {
    $implementationContent = Get-Content $implementationPath -Raw -ErrorAction SilentlyContinue
}

# ============================================================================
# EXTRACTION PROGRAMMES MENTIONNES
# ============================================================================

function Get-MentionedPrograms {
    param([string]$Content)

    $programs = @()

    # Pattern: {PROJET} IDE {N}
    $matches = [regex]::Matches($Content, '(ADH|PVE|PBP|PBG|VIL|REF)\s+IDE\s+(\d+)')
    foreach ($m in $matches) {
        $programs += @{
            Project = $m.Groups[1].Value
            IDE = [int]$m.Groups[2].Value
            FullMatch = $m.Value
        }
    }

    # Pattern: Prg_{X}.xml
    $prgMatches = [regex]::Matches($Content, 'Prg_(\d+)\.xml')
    foreach ($m in $prgMatches) {
        $prgNum = [int]$m.Groups[1].Value
        # Ajouter seulement si pas deja present
        if (-not ($programs | Where-Object { $_.IDE -eq $prgNum })) {
            $programs += @{
                Project = "UNKNOWN"
                IDE = $prgNum
                FullMatch = $m.Value
            }
        }
    }

    return $programs
}

# ============================================================================
# VALIDATION 1: COHERENCE PROGRAMMES ENTRE FICHIERS
# ============================================================================

if ($analysisContent -and $implementationContent) {
    Write-Host "`n--- Validation coherence programmes ---" -ForegroundColor Cyan

    $analysisProgs = Get-MentionedPrograms -Content $analysisContent
    $implProgs = Get-MentionedPrograms -Content $implementationContent

    if ($analysisProgs.Count -gt 0 -and $implProgs.Count -gt 0) {
        # Verifier que le programme principal de l'implementation est dans l'analyse
        $mainAnalysisProg = $analysisProgs | Select-Object -First 1
        $mainImplProg = $implProgs | Select-Object -First 1

        if ($mainAnalysisProg.IDE -ne $mainImplProg.IDE) {
            $errors += "[Cross-Validation] Programme principal different entre analysis.md ($($mainAnalysisProg.FullMatch)) et implementation.md ($($mainImplProg.FullMatch))"
        } else {
            Write-Host "[OK] Programme principal coherent: $($mainAnalysisProg.FullMatch)" -ForegroundColor Green
        }
    }
}

# ============================================================================
# VALIDATION 2: EXISTENCE FICHIERS XML SOURCES
# ============================================================================

if ($analysisContent) {
    Write-Host "`n--- Validation existence fichiers XML ---" -ForegroundColor Cyan

    $prgFiles = [regex]::Matches($analysisContent, 'Prg_(\d+)\.xml')
    $checkedFiles = @{}

    foreach ($match in $prgFiles) {
        $prgNum = $match.Groups[1].Value
        $fileName = "Prg_$prgNum.xml"

        # Eviter doublons
        if ($checkedFiles.ContainsKey($fileName)) { continue }
        $checkedFiles[$fileName] = $true

        $found = $false
        foreach ($sourcePath in $sourcePaths) {
            $fullPath = Join-Path $sourcePath $fileName
            if (Test-Path $fullPath) {
                $found = $true
                $project = Split-Path (Split-Path $sourcePath -Parent) -Leaf
                Write-Host "[OK] $fileName trouve dans $project" -ForegroundColor Green
                break
            }
        }

        if (-not $found) {
            $errors += "[Cross-Validation] Fichier $fileName introuvable dans les sources Magic"
        }
    }
}

# ============================================================================
# VALIDATION 3: COHERENCE IDE vs Prg_X
# ============================================================================

if ($analysisContent) {
    Write-Host "`n--- Validation coherence IDE vs fichiers ---" -ForegroundColor Cyan

    # Trouver les associations explicites
    $associations = [regex]::Matches($analysisContent, 'Prg_(\d+)\.xml.*?(ADH|PVE|PBP|PBG|VIL|REF)\s+IDE\s+(\d+)|(?:(ADH|PVE|PBP|PBG|VIL|REF)\s+IDE\s+(\d+)).*?Prg_(\d+)\.xml')

    foreach ($assoc in $associations) {
        $prgNum = $null
        $ideNum = $null

        if ($assoc.Groups[1].Success) {
            $prgNum = $assoc.Groups[1].Value
            $ideNum = $assoc.Groups[3].Value
        }
        if ($assoc.Groups[5].Success) {
            $ideNum = $assoc.Groups[5].Value
            $prgNum = $assoc.Groups[6].Value
        }

        if ($prgNum -and $ideNum) {
            # Verifier la coherence (Prg_X != IDE X en general, mais c'est normal)
            # On verifie juste que les numeros sont presents dans le meme contexte
            Write-Host "[INFO] Association: Prg_$prgNum.xml <-> IDE $ideNum" -ForegroundColor Gray
        }
    }
}

# ============================================================================
# VALIDATION 4: MCP EVIDENCE PRESENTE
# ============================================================================

if ($analysisContent) {
    Write-Host "`n--- Validation MCP Evidence ---" -ForegroundColor Cyan

    # Verifier presence section MCP Evidence
    if ($analysisContent -match '### MCP Evidence') {
        # Verifier contenu de la section
        $mcpTools = @('magic_find_program', 'magic_get_position', 'magic_get_tree',
                      'magic_get_line', 'magic_decode_expression', 'magic_kb_callgraph')

        $toolsFound = @()
        foreach ($tool in $mcpTools) {
            if ($analysisContent -match [regex]::Escape("`"$tool`"") -or
                $analysisContent -match [regex]::Escape("``$tool``")) {
                $toolsFound += $tool
            }
        }

        if ($toolsFound.Count -eq 0) {
            $warnings += "[MCP Evidence] Section presente mais aucun outil MCP documente"
        } else {
            Write-Host "[OK] Outils MCP documentes: $($toolsFound -join ', ')" -ForegroundColor Green
        }
    } else {
        $errors += "[MCP Evidence] Section '### MCP Evidence' absente"
    }
}

# ============================================================================
# VALIDATION 5: VARIABLE MAPPING SI {N,Y} PRESENT
# ============================================================================

if ($analysisContent) {
    Write-Host "`n--- Validation Variable Mapping ---" -ForegroundColor Cyan

    $hasNYReferences = $analysisContent -match '\{0,\d+\}' -or $analysisContent -match '\{\d+,\d+\}'

    if ($hasNYReferences) {
        if ($analysisContent -match '### Variable Mapping') {
            # Verifier que le mapping contient des correspondances
            if ($analysisContent -match '\|\s*\{[0-9,]+\}\s*\|.*\|\s*\*\*[A-Z]{1,3}\*\*') {
                Write-Host "[OK] Variable Mapping present avec correspondances" -ForegroundColor Green
            } else {
                $warnings += "[Variable Mapping] Section presente mais format invalide (attendu: | {N,Y} | ... | **VAR** |)"
            }
        } else {
            $errors += "[Variable Mapping] References {N,Y} presentes sans section '### Variable Mapping'"
        }
    } else {
        Write-Host "[INFO] Pas de references {N,Y} - Variable Mapping non requis" -ForegroundColor Gray
    }
}

# ============================================================================
# AFFICHAGE RESULTATS
# ============================================================================

Write-Host "`n=== Resume Validation Croisee ===" -ForegroundColor Cyan

if ($warnings.Count -gt 0) {
    Write-Host "[WARNINGS] $($warnings.Count) avertissement(s):" -ForegroundColor Yellow
    foreach ($w in $warnings) {
        Write-Host "  - $w" -ForegroundColor Yellow
    }
}

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "[ERRORS] $($errors.Count) erreur(s) bloquante(s):" -ForegroundColor Red
    foreach ($e in $errors) {
        Write-Host "  - $e" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Corrigez ces erreurs pour assurer la coherence de l'analyse." -ForegroundColor Red
    exit 1
}

if ($warnings.Count -eq 0 -and $errors.Count -eq 0) {
    Write-Host "[OK] Validation croisee reussie" -ForegroundColor Green
}

exit 0
