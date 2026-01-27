# Query orphan program statistics from Magic Knowledge Base
param(
    [string]$Project = ""
)

Add-Type -Path "$PSScriptRoot\..\MagicKnowledgeBase\bin\Debug\net8.0\Microsoft.Data.Sqlite.dll"

$dbPath = Join-Path $env:USERPROFILE ".magic-kb\knowledge.db"
$conn = New-Object Microsoft.Data.Sqlite.SqliteConnection("Data Source=$dbPath")
$conn.Open()

$cmd = $conn.CreateCommand()

if ($Project) {
    $cmd.CommandText = @"
SELECT
    p.ide_position,
    p.name,
    p.public_name,
    p.is_empty,
    (SELECT COUNT(*) FROM program_calls pc WHERE pc.called_program_id = p.id) as caller_count
FROM programs p
WHERE p.project = '$Project'
ORDER BY caller_count ASC, p.ide_position ASC
"@

    $reader = $cmd.ExecuteReader()

    Write-Host "## Orphan Analysis: $Project"
    Write-Host ""
    Write-Host "| IDE | Name | PublicName | Callers | Empty | Status |"
    Write-Host "|-----|------|------------|---------|-------|--------|"

    $orphans = 0
    $total = 0

    while ($reader.Read()) {
        $total++
        $ide = $reader["ide_position"]
        $name = $reader["name"]
        $publicName = if ($reader["public_name"]) { $reader["public_name"] } else { "-" }
        $isEmpty = [int]$reader["is_empty"]
        $callerCount = [int]$reader["caller_count"]

        $status = if ($callerCount -gt 0) {
            "USED"
        } elseif ($publicName -ne "-") {
            "CALLABLE"
        } elseif ($isEmpty -eq 1) {
            "EMPTY"
        } else {
            $orphans++
            "ORPHAN"
        }

        if ($status -eq "ORPHAN" -or $status -eq "EMPTY") {
            Write-Host "| $ide | $name | $publicName | $callerCount | $isEmpty | $status |"
        }
    }

    Write-Host ""
    Write-Host "**Summary**: $orphans orphans out of $total programs"

} else {
    $cmd.CommandText = @"
SELECT
    p.project,
    COUNT(*) as total,
    SUM(CASE WHEN EXISTS(SELECT 1 FROM program_calls pc WHERE pc.called_program_id = p.id) THEN 1 ELSE 0 END) as has_callers,
    SUM(CASE WHEN p.public_name IS NOT NULL AND p.public_name != '' THEN 1 ELSE 0 END) as has_public_name,
    SUM(CASE WHEN p.is_empty = 1 THEN 1 ELSE 0 END) as is_empty
FROM programs p
GROUP BY p.project
ORDER BY total DESC
"@

    $reader = $cmd.ExecuteReader()

    Write-Host "## Orphan Statistics by Project"
    Write-Host ""
    Write-Host "| Project | Total | Has Callers | Has PublicName | Empty | Orphans (est) |"
    Write-Host "|---------|-------|-------------|----------------|-------|---------------|"

    while ($reader.Read()) {
        $project = $reader["project"]
        $total = [int]$reader["total"]
        $hasCallers = [int]$reader["has_callers"]
        $hasPublicName = [int]$reader["has_public_name"]
        $isEmpty = [int]$reader["is_empty"]

        # Estimated orphans = total - has_callers - (has_public_name without callers) - empty
        # This is an approximation
        $orphans = $total - $hasCallers - $isEmpty
        if ($orphans -lt 0) { $orphans = 0 }

        Write-Host "| $project | $total | $hasCallers | $hasPublicName | $isEmpty | $orphans |"
    }
}

$conn.Close()
