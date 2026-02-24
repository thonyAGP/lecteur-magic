# Load Club Med AWS Bedrock credentials for Claude Code
# Usage: . .\use-clubmed-credentials.ps1

$envFile = Join-Path $PSScriptRoot ".env.clubmed.local"

if (-not (Test-Path $envFile)) {
    Write-Error "Credentials file not found: $envFile"
    exit 1
}

Write-Host "Loading Club Med AWS Bedrock credentials..." -ForegroundColor Cyan

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()

    # Skip comments and empty lines
    if ($line -match '^#' -or $line -eq '') {
        return
    }

    # Parse KEY=VALUE
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $Matches[1].Trim()
        $value = $Matches[2].Trim()

        # Set environment variable
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
        Write-Host "  ✓ $key set" -ForegroundColor Green
    }
}

Write-Host "`nClub Med credentials loaded successfully!" -ForegroundColor Green
Write-Host "You can now use Claude Code with AWS Bedrock (Club Med account)" -ForegroundColor Yellow
Write-Host "`nTo start Claude Code:" -ForegroundColor Cyan
Write-Host "  claude --dangerously-skip-permissions" -ForegroundColor White
