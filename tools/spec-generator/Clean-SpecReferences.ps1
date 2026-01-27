<#
.SYNOPSIS
    Nettoie les references internes Magic des specs V2.1

.DESCRIPTION
    Supprime les colonnes Ref contenant {0,-N} et {32768,N}

.PARAMETER InputPath
    Chemin du fichier spec a nettoyer
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$InputPath
)

$lines = Get-Content $InputPath -Encoding UTF8
$output = @()
$inVariablesSection = $false
$inVGSection = $false
$skipNextSeparator = $false

foreach ($line in $lines) {
    # Detecter les sections
    if ($line -match '### 4\.1 Variables de travail') {
        $inVariablesSection = $true
        $inVGSection = $false
    }
    elseif ($line -match '### 4\.2 Variables globales') {
        $inVariablesSection = $false
        $inVGSection = $true
    }
    elseif ($line -match '^## [56]\.') {
        $inVariablesSection = $false
        $inVGSection = $false
    }

    # Transformer les lignes dans les sections variables
    if ($inVariablesSection) {
        if ($line -match '^\| Ref \| Nom \| Type \| Role \|') {
            $output += '| Nom | Type | Role |'
            $skipNextSeparator = $true
            continue
        }
        elseif ($skipNextSeparator -and $line -match '^\|[-|]+\|$') {
            $output += '|-----|------|------|'
            $skipNextSeparator = $false
            continue
        }
        elseif ($line -match '^\| `\{0,-?\d+\}` \| (.+)$') {
            # Supprimer la colonne Ref: | `{0,-78}` | W0 en-tête ? | ALPHA | - |
            $output += "| $($Matches[1])"
            continue
        }
    }

    if ($inVGSection) {
        if ($line -match '^\| Ref \| Decode \| Role \|') {
            $output += '| Variable | Role |'
            $skipNextSeparator = $true
            continue
        }
        elseif ($skipNextSeparator -and $line -match '^\|[-|]+\|$') {
            $output += '|----------|------|'
            $skipNextSeparator = $false
            continue
        }
        elseif ($line -match '^\| `\{32768,\d+\}` \| (.+?) \| (.+?) \|') {
            # | `{32768,0}` | VG.LOGIN | - | -> | VG.LOGIN | - |
            $output += "| $($Matches[1]) | $($Matches[2]) |"
            continue
        }
    }

    # Ligne normale
    $output += $line
}

$output | Out-File -FilePath $InputPath -Encoding UTF8

Write-Host "Spec nettoyee: $InputPath" -ForegroundColor Green
