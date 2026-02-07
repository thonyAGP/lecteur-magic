# Generate-AllAdhSpecs.ps1
# Generate specifications for ALL ADH programs
# Marks orphan programs appropriately

param(
    [string]$SourcePath = "D:\Data\Migration\XPA\PMS\ADH\Source",
    [string]$OutputPath = "D:\Projects\Lecteur_Magic\.openspec\specs",
    [int[]]$SkipIDEs = @(),
    [switch]$OrphansOnly,
    [switch]$DryRun,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# ADH folder structure from Progs.xml
$folders = @(
    @{ Name = "Root"; StartIDE = 1; Count = 3 }
    @{ Name = "Brazil DataCatching"; StartIDE = 4; Count = 15 }
    @{ Name = "Change"; StartIDE = 19; Count = 7 }
    @{ Name = "Changement Compte"; StartIDE = 26; Count = 12 }
    @{ Name = "Depot"; StartIDE = 38; Count = 3 }
    @{ Name = "Divers"; StartIDE = 41; Count = 11 }
    @{ Name = "Easy Check Out"; StartIDE = 52; Count = 15 }
    @{ Name = "Extrait de Compte"; StartIDE = 67; Count = 9 }
    @{ Name = "EzCard"; StartIDE = 76; Count = 12 }
    @{ Name = "Factures"; StartIDE = 88; Count = 8 }
    @{ Name = "Factures V3"; StartIDE = 96; Count = 10 }
    @{ Name = "Garantie"; StartIDE = 106; Count = 9 }
    @{ Name = "Gestion Caisse"; StartIDE = 115; Count = 42 }
    @{ Name = "Great Members"; StartIDE = 157; Count = 1 }
    @{ Name = "Identification"; StartIDE = 158; Count = 4 }
    @{ Name = "Menus"; StartIDE = 162; Count = 5 }
    @{ Name = "Operations GM"; StartIDE = 167; Count = 11 }
    @{ Name = "Printer Management"; StartIDE = 178; Count = 10 }
    @{ Name = "Solde"; StartIDE = 188; Count = 9 }
    @{ Name = "Specif Bresil"; StartIDE = 197; Count = 3 }
    @{ Name = "Synchro Serveur"; StartIDE = 200; Count = 3 }
    @{ Name = "Telephone"; StartIDE = 203; Count = 20 }
    @{ Name = "Utilitaires"; StartIDE = 223; Count = 9 }
    @{ Name = "Ventes"; StartIDE = 232; Count = 24 }
    @{ Name = "Zooms"; StartIDE = 256; Count = 22 }
    @{ Name = "Developpement"; StartIDE = 278; Count = 6 }
    @{ Name = "Sauvegarde"; StartIDE = 284; Count = 5 }
    @{ Name = "Suppr"; StartIDE = 289; Count = 34 }
)

# ECF shared programs (ADH.ecf - Sessions_Reprises)
# These are NEVER orphans as they are callable from PBP, PVE
$ecfPrograms = @(27, 28, 53, 54, 64, 65, 69, 70, 71, 72, 73, 74, 75, 76,
                 84, 97, 111, 121, 149, 152, 178, 180, 181, 185, 192,
                 208, 210, 229, 243)

# Folders that are always orphan
$orphanFolders = @("Suppr", "Sauvegarde", "Developpement")

# Load ProgramHeaders for descriptions
$headersPath = Join-Path $SourcePath "ProgramHeaders.xml"
[xml]$headers = Get-Content $headersPath -Encoding UTF8
$programHeaders = $headers.Application.ProgramsRepositoryHeaders.Program

# Load Progs.xml for IDE -> Prg_XXX mapping
$progsPath = Join-Path $SourcePath "Progs.xml"
[xml]$progs = Get-Content $progsPath -Encoding UTF8
$programOutline = $progs.Application.ProgramsRepositoryOutLine.Programs.Program

function Get-ProgramInfo {
    param([int]$IDE)
    $index = $IDE - 1
    if ($index -lt 0 -or $index -ge $programOutline.Count) { return $null }

    # Get the internal ID from Progs.xml
    $internalId = $programOutline[$index].id

    # Find corresponding header by matching id
    $header = $programHeaders | Where-Object { $_.Header.id -eq $internalId } | Select-Object -First 1
    if (-not $header) { return $null }

    return @{
        IDE = $IDE
        InternalId = $internalId
        Description = $header.Header.Description
        TaskType = $header.Header.TaskType.val
        IsEmpty = $header.Header.isEmpty -eq "Y"
        XmlFile = "Prg_$internalId.xml"
    }
}

function Get-FolderForIDE {
    param([int]$IDE)
    foreach ($folder in $folders) {
        $endIDE = $folder.StartIDE + $folder.Count - 1
        if ($IDE -ge $folder.StartIDE -and $IDE -le $endIDE) { return $folder.Name }
    }
    return "Unknown"
}

function Test-IsOrphan {
    param([int]$IDE)
    # ECF programs are NEVER orphans
    if ($IDE -in $ecfPrograms) { return $false }
    # Main program (IDE 1) is never orphan
    if ($IDE -eq 1) { return $false }
    # Orphan folders
    $folder = Get-FolderForIDE $IDE
    if ($folder -in $orphanFolders) { return $true }
    return $false
}

function New-OrphanSpec {
    param([int]$IDE, [string]$Description, [string]$Folder, [string]$Reason)
    $date = Get-Date -Format "yyyy-MM-dd HH:mm"
    if (-not $Reason) { $Reason = "Non relie au Main et pas de PublicName" }

    return @"
# ADH IDE $IDE - $Description

> **Version spec**: Orphelin
> **Analyse**: $date
> **Source**: ``Prg_$($IDE - 1).xml``

---

## NON ANALYSE - Programme orphelin

| Critere | Valeur |
|---------|--------|
| **IDE** | $IDE |
| **Dossier** | $Folder |
| **Raison** | $Reason |
| **Callers** | Aucun depuis Main |
| **PublicName** | Aucun |
| **ECF** | Non partage |

> Ce programme n'est pas accessible depuis le flux principal de l'application.
> Il peut s'agir de code legacy, de tests, ou de programmes supprimes.

---

*Specification orpheline - Non analyse*
"@
}

# Main execution
Write-Host "=== ADH Complete Spec Generation ===" -ForegroundColor Cyan
Write-Host "Source: $SourcePath"
Write-Host "Output: $OutputPath"
Write-Host ""

# Get actual program count from Progs.xml (IDE positions)
$actualProgramCount = $programOutline.Count
Write-Host "Programs in Progs.xml (IDE positions): $actualProgramCount" -ForegroundColor Cyan
Write-Host "Programs with headers (metadata): $($programHeaders.Count)" -ForegroundColor Cyan
Write-Host ""

$stats = @{ Total = 0; Generated = 0; Skipped = 0; Orphans = 0; Errors = 0; Exists = 0 }
$generateScript = Join-Path $scriptDir "Generate-ProgramSpecV2.ps1"

foreach ($folder in $folders) {
    $folderName = $folder.Name
    Write-Host "[$folderName] IDE $($folder.StartIDE)-$($folder.StartIDE + $folder.Count - 1)" -ForegroundColor Yellow

    for ($i = 0; $i -lt $folder.Count; $i++) {
        $ide = $folder.StartIDE + $i

        # Skip if beyond actual program count
        if ($ide -gt $actualProgramCount) {
            continue
        }

        $stats.Total++

        # Skip if requested
        if ($ide -in $SkipIDEs) {
            Write-Host "  IDE $ide - SKIP (requested)" -ForegroundColor DarkGray
            $stats.Skipped++
            continue
        }

        $outputFile = Join-Path $OutputPath "ADH-IDE-$ide.md"

        # Check if spec already exists (unless -Force)
        if ((Test-Path $outputFile) -and -not $Force) {
            Write-Host "  IDE $ide - EXISTS" -ForegroundColor DarkGray
            $stats.Exists++
            continue
        }

        $progInfo = Get-ProgramInfo $ide
        if (-not $progInfo) {
            # Program exists in Progs.xml but has no header -> ghost/deleted
            Write-Host "  IDE $ide - GHOST (no metadata)" -ForegroundColor DarkYellow
            $stats.Orphans++

            if (-not $DryRun) {
                $internalId = $programOutline[$ide - 1].id
                $spec = New-OrphanSpec -IDE $ide -Description "Programme supprime (Prg_$internalId)" -Folder $folderName -Reason "Programme fantome - metadonnees supprimees"
                $spec | Out-File $outputFile -Encoding UTF8
            }
            continue
        }

        $description = $progInfo.Description
        if (-not $description) { $description = "Programme $ide" }

        $isOrphan = Test-IsOrphan $ide

        if ($isOrphan) {
            Write-Host "  IDE $ide - ORPHAN ($description)" -ForegroundColor DarkYellow
            $stats.Orphans++

            if (-not $DryRun) {
                $reason = if ($folderName -eq "Suppr") { "Dossier Suppr - code supprime" }
                         elseif ($folderName -eq "Sauvegarde") { "Dossier Sauvegarde - backup" }
                         elseif ($folderName -eq "Developpement") { "Dossier Developpement - code dev/test" }
                         else { "Non relie au Main et pas de PublicName" }
                $spec = New-OrphanSpec -IDE $ide -Description $description -Folder $folderName -Reason $reason
                $spec | Out-File $outputFile -Encoding UTF8
            }
        } else {
            if ($OrphansOnly) {
                Write-Host "  IDE $ide - SKIP (orphans only mode)" -ForegroundColor Gray
                continue
            }

            Write-Host "  IDE $ide - $description" -ForegroundColor Green -NoNewline

            if (-not $DryRun) {
                try {
                    $null = & $generateScript -Project "ADH" -IDE $ide -OutputPath $OutputPath 2>&1
                    Write-Host " [OK]" -ForegroundColor Green
                    $stats.Generated++
                } catch {
                    Write-Host " [FAIL]" -ForegroundColor Red
                    Write-Host "    Error: $_" -ForegroundColor Red
                    $stats.Errors++
                }
            } else {
                Write-Host " [DRY]" -ForegroundColor Cyan
                $stats.Generated++
            }
        }
    }
    Write-Host ""
}

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Total programs: $($stats.Total)"
Write-Host "Already exist: $($stats.Exists)" -ForegroundColor DarkGray
Write-Host "Generated: $($stats.Generated)" -ForegroundColor Green
Write-Host "Orphans: $($stats.Orphans)" -ForegroundColor DarkYellow
Write-Host "Skipped: $($stats.Skipped)" -ForegroundColor Gray
Write-Host "Errors: $($stats.Errors)" -ForegroundColor Red
