param()

$basePath = 'D:\Data\Migration\XPA\PMS\PBG'
$sourcePath = Join-Path $basePath 'Source'
$progsPath = Join-Path $sourcePath 'Progs.xml'
$headersPath = Join-Path $sourcePath 'ProgramHeaders.xml'

# Build IDE map
[xml]$progsDoc = Get-Content $progsPath -Encoding UTF8
$ideMap = @{}
$progs = $progsDoc.SelectNodes('//Program')
for ($i = 0; $i -lt $progs.Count; $i++) {
    $xmlId = $progs[$i].GetAttribute('id')
    if ($xmlId) { $ideMap[$xmlId] = ($i + 1) }
}

# Parse all PBG program headers
[xml]$headersDoc = Get-Content $headersPath -Encoding UTF8
$headers = $headersDoc.SelectNodes('//ProgramsRepositoryHeaders/Program/Header')

Write-Output "=== ALL PBG Programs ==="
Write-Output "IDE|ID|Description|PublicName|Tasks"
Write-Output "---|--|-----------|----------|-----"

foreach ($h in $headers) {
    $desc = $h.GetAttribute('Description')
    $xmlId = $h.GetAttribute('id')
    $publicEl = $h.SelectSingleNode('Public')
    $publicName = ''
    if ($publicEl) { $publicName = $publicEl.GetAttribute('val') }
    $lastIsn = $h.GetAttribute('LastIsn')
    $isEmpty = $h.GetAttribute('ISEMPTY_TSK')
    $idePos = $ideMap[$xmlId]
    if (-not $idePos) { $idePos = '?' }
    $taskCount = $lastIsn
    if ($isEmpty -eq '1') { $taskCount = 0 }

    Write-Output ('{0}|{1}|{2}|{3}|{4}' -f $idePos, $xmlId, $desc.Trim(), $publicName, $taskCount)
}
