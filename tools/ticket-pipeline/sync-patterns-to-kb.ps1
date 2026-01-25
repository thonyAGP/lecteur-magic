# sync-patterns-to-kb.ps1
# Synchronize .openspec/patterns/*.md files to resolution_patterns table in KB
# Usage: .\sync-patterns-to-kb.ps1 [-PatternsPath <path>] [-DryRun]

param(
    [string]$PatternsPath = ".openspec/patterns",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$KbPath = Join-Path $env:USERPROFILE ".magic-kb\knowledge.db"

# Resolve patterns path relative to project root if not absolute
if (-not [System.IO.Path]::IsPathRooted($PatternsPath)) {
    $PatternsPath = Join-Path $ProjectRoot $PatternsPath
}

Write-Host "=== Pattern Sync to Knowledge Base ===" -ForegroundColor Cyan
Write-Host "Patterns: $PatternsPath" -ForegroundColor Gray
Write-Host "KB: $KbPath" -ForegroundColor Gray
Write-Host ""

# Verify paths exist
if (-not (Test-Path $PatternsPath)) {
    Write-Error "Patterns path not found: $PatternsPath"
    exit 1
}

if (-not (Test-Path $KbPath)) {
    Write-Error "Knowledge Base not found: $KbPath"
    exit 1
}

# ============================================================================
# PARSING FUNCTIONS
# ============================================================================

function Parse-PatternFile {
    param([string]$FilePath)

    $Content = Get-Content $FilePath -Raw -Encoding UTF8
    $FileName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)

    # Initialize pattern object
    $Pattern = @{
        PatternName = $FileName
        SourceTicket = $null
        RootCauseType = $null
        SymptomKeywords = @()
        SolutionTemplate = ""
    }

    # Extract header metadata
    # > **Source**: CMDS-174321
    if ($Content -match '>\s*\*\*Source\*\*:\s*([A-Z]+-\d+)') {
        $Pattern.SourceTicket = $Matches[1]
    }

    # > **Type**: Bug logique
    if ($Content -match '>\s*\*\*Type\*\*:\s*(.+)') {
        $Pattern.RootCauseType = $Matches[1].Trim()
    }

    # Extract symptoms (bullet list after ## Symptomes typiques)
    if ($Content -match '##\s*Symptomes?\s*typiques?\s*\r?\n([\s\S]*?)(?=\r?\n---|\r?\n##)') {
        $SymptomsSection = $Matches[1]
        $Symptoms = [regex]::Matches($SymptomsSection, '-\s*["\']?([^"\'\r\n]+)["\']?')
        foreach ($Match in $Symptoms) {
            $Symptom = $Match.Groups[1].Value.Trim(' "''')
            if ($Symptom -and $Symptom.Length -gt 2) {
                $Pattern.SymptomKeywords += $Symptom
            }
        }
    }

    # Extract keywords (bullet list after ### Mots-cles)
    if ($Content -match '###\s*Mots-cles[^\r\n]*\r?\n([\s\S]*?)(?=\r?\n###|\r?\n##|\r?\n---)') {
        $KeywordsSection = $Matches[1]
        $Keywords = [regex]::Matches($KeywordsSection, '-\s*["\']?([^"\'\r\n]+)["\']?')
        foreach ($Match in $Keywords) {
            $Keyword = $Match.Groups[1].Value.Trim(' "''')
            if ($Keyword -and $Keyword.Length -gt 2 -and $Keyword -notin $Pattern.SymptomKeywords) {
                $Pattern.SymptomKeywords += $Keyword
            }
        }
    }

    # Extract solution template (section after ## Solution type)
    if ($Content -match '##\s*Solution\s*type\s*\r?\n([\s\S]*?)(?=\r?\n##\s*[A-Z]|\r?\n---\s*\r?\n\*Pattern)') {
        $Pattern.SolutionTemplate = $Matches[1].Trim()
    }

    return $Pattern
}

function Escape-SqlString {
    param([string]$Value)
    if ($null -eq $Value) { return "NULL" }
    $Escaped = $Value -replace "'", "''"
    return "'$Escaped'"
}

# ============================================================================
# MAIN
# ============================================================================

# Get all pattern files (exclude README)
$PatternFiles = Get-ChildItem -Path $PatternsPath -Filter "*.md" |
    Where-Object { $_.Name -ne "README.md" }

Write-Host "Found $($PatternFiles.Count) pattern file(s)" -ForegroundColor Yellow
Write-Host ""

$Patterns = @()
$SqlStatements = @()

foreach ($File in $PatternFiles) {
    Write-Host "Parsing: $($File.Name)" -ForegroundColor Gray

    $Pattern = Parse-PatternFile -FilePath $File.FullName
    $Patterns += $Pattern

    # Build SQL INSERT
    $KeywordsJson = ($Pattern.SymptomKeywords | ConvertTo-Json -Compress)
    if ($Pattern.SymptomKeywords.Count -eq 0) {
        $KeywordsJson = "[]"
    }
    if ($Pattern.SymptomKeywords.Count -eq 1) {
        $KeywordsJson = "[`"$($Pattern.SymptomKeywords[0])`"]"
    }

    $Sql = @"
INSERT INTO resolution_patterns (pattern_name, symptom_keywords, root_cause_type, solution_template, source_ticket, usage_count)
VALUES (
    $(Escape-SqlString $Pattern.PatternName),
    $(Escape-SqlString $KeywordsJson),
    $(Escape-SqlString $Pattern.RootCauseType),
    $(Escape-SqlString $Pattern.SolutionTemplate),
    $(Escape-SqlString $Pattern.SourceTicket),
    0
)
ON CONFLICT(pattern_name) DO UPDATE SET
    symptom_keywords = excluded.symptom_keywords,
    root_cause_type = excluded.root_cause_type,
    solution_template = excluded.solution_template,
    source_ticket = excluded.source_ticket;
"@
    $SqlStatements += $Sql

    # Display parsed info
    Write-Host "  Name: $($Pattern.PatternName)" -ForegroundColor White
    Write-Host "  Source: $($Pattern.SourceTicket)" -ForegroundColor White
    Write-Host "  Type: $($Pattern.RootCauseType)" -ForegroundColor White
    Write-Host "  Keywords: $($Pattern.SymptomKeywords.Count)" -ForegroundColor White
    Write-Host ""
}

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Patterns parsed: $($Patterns.Count)" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] SQL that would be executed:" -ForegroundColor Magenta
    Write-Host ""
    foreach ($Sql in $SqlStatements) {
        Write-Host $Sql -ForegroundColor DarkGray
        Write-Host ""
    }
    exit 0
}

# Execute SQL
Write-Host ""
Write-Host "Syncing to Knowledge Base..." -ForegroundColor Yellow

$TempFile = [System.IO.Path]::GetTempFileName()
$AllSql = $SqlStatements -join "`n"
$AllSql | Set-Content $TempFile -Encoding UTF8

try {
    $Result = & sqlite3 $KbPath ".read '$TempFile'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "SQLite error: $Result"
    }
    Write-Host "[OK] Synced $($Patterns.Count) patterns to KB" -ForegroundColor Green
} catch {
    Write-Error "Failed to sync: $_"
    exit 1
} finally {
    Remove-Item $TempFile -ErrorAction SilentlyContinue
}

# Verify
Write-Host ""
Write-Host "Verifying..." -ForegroundColor Yellow

$CountResult = & sqlite3 $KbPath "SELECT COUNT(*) FROM resolution_patterns;" 2>&1
Write-Host "Total patterns in KB: $CountResult" -ForegroundColor Green

# List patterns
$ListResult = & sqlite3 -separator " | " $KbPath "SELECT pattern_name, COALESCE(source_ticket, '-'), usage_count FROM resolution_patterns ORDER BY pattern_name;" 2>&1
Write-Host ""
Write-Host "Patterns in KB:" -ForegroundColor Yellow
Write-Host "Name | Source | Usage" -ForegroundColor Gray
Write-Host "------------------------------" -ForegroundColor Gray
foreach ($Line in $ListResult) {
    Write-Host $Line
}

Write-Host ""
Write-Host "[DONE] Pattern sync complete" -ForegroundColor Green
