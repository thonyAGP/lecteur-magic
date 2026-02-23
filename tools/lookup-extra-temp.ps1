param()

$basePath = 'D:\Data\Migration\XPA\PMS'

# Look up specific programs by project and ID
$lookups = @(
    @{ Project = 'EXB'; Ids = @(24) },
    @{ Project = 'SEN'; SubPath = 'SEN'; Ids = @(2, 18, 19, 21, 24, 28) },
    @{ Project = 'VIL'; Ids = @(448, 538, 554, 97, 368, 385, 386, 313, 314, 553) },
    @{ Project = 'CAB'; Ids = @(27, 20) },
    @{ Project = 'ADH'; Ids = @(111, 112, 107, 108, 109, 164, 165, 187, 264, 283) },
    @{ Project = 'REF'; Ids = @(618, 620, 865, 650) }
)

foreach ($lookup in $lookups) {
    $proj = $lookup.Project
    if ($lookup.SubPath) {
        $sourcePath = Join-Path (Join-Path (Join-Path $basePath $proj) $lookup.SubPath) 'Source'
    } else {
        $sourcePath = Join-Path (Join-Path $basePath $proj) 'Source'
    }
    $progsPath = Join-Path $sourcePath 'Progs.xml'
    $headersPath = Join-Path $sourcePath 'ProgramHeaders.xml'

    if (-not (Test-Path $progsPath) -or -not (Test-Path $headersPath)) {
        Write-Output "=== $proj (NOT FOUND) ==="
        continue
    }

    [xml]$progsDoc = Get-Content $progsPath -Encoding UTF8
    $ideMap = @{}
    $progs = $progsDoc.SelectNodes('//Program')
    for ($i = 0; $i -lt $progs.Count; $i++) {
        $xmlId = $progs[$i].GetAttribute('id')
        if ($xmlId) { $ideMap[$xmlId] = ($i + 1) }
    }

    [xml]$headersDoc = Get-Content $headersPath -Encoding UTF8
    $headers = $headersDoc.SelectNodes('//ProgramsRepositoryHeaders/Program/Header')

    foreach ($h in $headers) {
        $xmlId = $h.GetAttribute('id')
        if ([int]$xmlId -in $lookup.Ids) {
            $desc = $h.GetAttribute('Description')
            $publicEl = $h.SelectSingleNode('Public')
            $publicName = ''
            if ($publicEl) { $publicName = $publicEl.GetAttribute('val') }
            $lastIsn = $h.GetAttribute('LastIsn')
            $isEmpty = $h.GetAttribute('ISEMPTY_TSK')
            $idePos = $ideMap[$xmlId]
            if (-not $idePos) { $idePos = '?' }
            $taskCount = $lastIsn
            if ($isEmpty -eq '1') { $taskCount = 0 }
            Write-Output "$proj|$idePos|$xmlId|$($desc.Trim())|$publicName|$taskCount"
        }
    }
}
