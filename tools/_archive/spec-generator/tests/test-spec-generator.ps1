# Test suite for spec-generator scripts
# Phase 2 PDCA - Tests unitaires spec-generator

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $PSScriptRoot

# Test framework
$testResults = @{
    Passed = 0
    Failed = 0
    Skipped = 0
    Tests = @()
}

function Assert-True {
    param([bool]$Condition, [string]$TestName, [string]$Message = "")
    if ($Condition) {
        $script:testResults.Passed++
        $script:testResults.Tests += @{ Name = $TestName; Status = "PASS"; Message = "" }
        Write-Host "  [PASS] $TestName" -ForegroundColor Green
    } else {
        $script:testResults.Failed++
        $script:testResults.Tests += @{ Name = $TestName; Status = "FAIL"; Message = $Message }
        Write-Host "  [FAIL] $TestName - $Message" -ForegroundColor Red
    }
}

function Assert-FileExists {
    param([string]$Path, [string]$TestName)
    Assert-True (Test-Path $Path) $TestName "File not found: $Path"
}

function Assert-Contains {
    param([string]$Content, [string]$Pattern, [string]$TestName)
    Assert-True ($Content -match $Pattern) $TestName "Pattern not found: $Pattern"
}

function Assert-NoSyntaxErrors {
    param([string]$ScriptPath, [string]$TestName)
    $errors = $null
    $tokens = $null
    [System.Management.Automation.Language.Parser]::ParseFile($ScriptPath, [ref]$tokens, [ref]$errors) | Out-Null
    Assert-True ($errors.Count -eq 0) $TestName "Syntax errors: $($errors | ForEach-Object { $_.Message })"
}

# =============================================================================
# TEST SUITE 1: Script Syntax Validation
# =============================================================================
Write-Host "`n=== Test Suite 1: Syntax Validation ===" -ForegroundColor Cyan

$scripts = @(
    "Generate-ProgramSpecV2.ps1",
    "Batch-GenerateSpecs.ps1",
    "Generate-TestsFromSpec.ps1",
    "Generate-AllAdhSpecs.ps1",
    "Generate-SpecsIndex.ps1"
)

foreach ($script in $scripts) {
    $path = Join-Path $scriptRoot $script
    if (Test-Path $path) {
        Assert-NoSyntaxErrors $path "Syntax valid: $script"
    } else {
        $testResults.Skipped++
        Write-Host "  [SKIP] $script - File not found" -ForegroundColor Yellow
    }
}

# =============================================================================
# TEST SUITE 2: Required Functions
# =============================================================================
Write-Host "`n=== Test Suite 2: Required Functions ===" -ForegroundColor Cyan

$mainScript = Join-Path $scriptRoot "Generate-ProgramSpecV2.ps1"
if (Test-Path $mainScript) {
    $content = Get-Content $mainScript -Raw

    # Check for required sections
    Assert-Contains $content "param\s*\(" "Has param block"
    Assert-Contains $content "\[Parameter\(Mandatory" "Has mandatory parameters"
    Assert-Contains $content "Test-Path" "Has file existence check"
    Assert-Contains $content "Get-Content.*-Encoding UTF8" "Has UTF8 encoding"
    Assert-Contains $content "\[xml\]" "Has XML parsing"
    Assert-Contains $content "Out-File|Set-Content" "Has output writing"
}

# =============================================================================
# TEST SUITE 3: Output Format Validation
# =============================================================================
Write-Host "`n=== Test Suite 3: Output Format ===" -ForegroundColor Cyan

$specsPath = "D:\Projects\Lecteur_Magic\.openspec\specs"
$sampleSpec = Get-ChildItem "$specsPath\ADH-IDE-*.md" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($sampleSpec) {
    $specContent = Get-Content $sampleSpec.FullName -Raw

    Assert-Contains $specContent "# ADH IDE \d+" "Has correct title format"
    Assert-Contains $specContent "Version spec" "Has version info"
    Assert-Contains $specContent "IDENTIFICATION|Identification" "Has identification section"
    Assert-Contains $specContent "TABLES|Tables" "Has tables section"
    Assert-Contains $specContent "\| .+ \| .+ \|" "Has table format"
    Assert-Contains $specContent "Prg_\d+\.xml" "Has XML file reference"
} else {
    $testResults.Skipped++
    Write-Host "  [SKIP] No sample spec found" -ForegroundColor Yellow
}

# =============================================================================
# TEST SUITE 4: IDE Position Mapping
# =============================================================================
Write-Host "`n=== Test Suite 4: IDE Position Mapping ===" -ForegroundColor Cyan

$progsPath = "D:\Data\Migration\XPA\PMS\ADH\Source\Progs.xml"
if (Test-Path $progsPath) {
    [xml]$progs = Get-Content $progsPath -Encoding UTF8
    $programs = $progs.Application.ProgramsRepositoryOutLine.Programs.Program

    Assert-True ($programs.Count -gt 0) "Progs.xml has programs"
    Assert-True ($programs.Count -ge 300) "ADH has expected program count (>=300)"

    # Verify IDE 237 mapping (known program)
    if ($programs.Count -ge 237) {
        $ide237 = $programs[236]  # 0-indexed
        Assert-True ($ide237.id -ne $null) "IDE 237 has valid ID"

        # Check XML file exists
        $prgFile = "D:\Data\Migration\XPA\PMS\ADH\Source\Prg_$($ide237.id).xml"
        Assert-FileExists $prgFile "IDE 237 XML file exists"
    } else {
        $testResults.Skipped++
        Write-Host "  [SKIP] Not enough programs for IDE 237 test" -ForegroundColor Yellow
    }
} else {
    $testResults.Skipped++
    Write-Host "  [SKIP] Progs.xml not found" -ForegroundColor Yellow
}

# =============================================================================
# TEST SUITE 5: Table Mapping
# =============================================================================
Write-Host "`n=== Test Suite 5: Table Mapping ===" -ForegroundColor Cyan

$dataSourcesPath = "D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml"
if (Test-Path $dataSourcesPath) {
    [xml]$ds = Get-Content $dataSourcesPath -Encoding UTF8

    # Try different XML structures
    $tables = $ds.Application.DataSourcesRepository.DataSources.DataSource
    if (-not $tables) {
        $tables = $ds.Application.DataSourcesRepository.DataSources.DataObject
    }
    if (-not $tables) {
        $tables = $ds.SelectNodes("//DataSource")
    }

    if ($tables -and $tables.Count -gt 0) {
        Assert-True $true "DataSources.xml has tables"
        Assert-True ($tables.Count -ge 100) "REF has tables (count: $($tables.Count))"
    } else {
        # Check if XML loaded correctly
        Assert-True ($ds -ne $null) "DataSources.xml loaded as XML"
        $testResults.Skipped++
        Write-Host "  [SKIP] Could not parse table structure" -ForegroundColor Yellow
    }
} else {
    $testResults.Skipped++
    Write-Host "  [SKIP] DataSources.xml not found" -ForegroundColor Yellow
}

# =============================================================================
# TEST SUITE 6: Batch Generation
# =============================================================================
Write-Host "`n=== Test Suite 6: Batch Generation ===" -ForegroundColor Cyan

$batchScript = Join-Path $scriptRoot "Batch-GenerateSpecs.ps1"
if (Test-Path $batchScript) {
    $content = Get-Content $batchScript -Raw

    Assert-Contains $content "foreach|ForEach|for\s*\(" "Has loop for batch processing"
    Assert-Contains $content "IDE|StartIDE|EndIDE" "Has IDE parameter reference"
    Assert-Contains $content "param|Param" "Has parameters block"
}

# =============================================================================
# RESULTS
# =============================================================================
Write-Host "`n=== Test Results ===" -ForegroundColor Cyan
Write-Host "Passed:  $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed:  $($testResults.Failed)" -ForegroundColor $(if ($testResults.Failed -gt 0) { "Red" } else { "Green" })
Write-Host "Skipped: $($testResults.Skipped)" -ForegroundColor Yellow
Write-Host ""

$total = $testResults.Passed + $testResults.Failed
$rate = if ($total -gt 0) { [math]::Round($testResults.Passed / $total * 100, 1) } else { 0 }
Write-Host "Success rate: $rate%" -ForegroundColor $(if ($rate -ge 80) { "Green" } elseif ($rate -ge 60) { "Yellow" } else { "Red" })

# Return exit code
if ($testResults.Failed -gt 0) {
    exit 1
}
exit 0
