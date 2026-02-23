param(
    [string]$Project = 'REF',
    [int]$PrgId = 620
)

$basePath = 'D:\Data\Migration\XPA\PMS'
$sourcePath = Join-Path (Join-Path $basePath $Project) 'Source'
$prgPath = Join-Path $sourcePath "Prg_$PrgId.xml"
$progsPath = Join-Path $sourcePath 'Progs.xml'

# Get IDE position
[xml]$progsDoc = Get-Content $progsPath -Encoding UTF8
$progs = $progsDoc.SelectNodes('//Program')
$idePos = '?'
for ($i = 0; $i -lt $progs.Count; $i++) {
    if ($progs[$i].GetAttribute('id') -eq $PrgId.ToString()) {
        $idePos = $i + 1
        break
    }
}

Write-Output "=== $Project IDE $idePos (Prg ID $PrgId) ==="

if (-not (Test-Path $prgPath)) {
    Write-Output "File not found: $prgPath"
    exit 1
}

# Parse program XML
$content = Get-Content $prgPath -Raw -Encoding UTF8
# Remove invalid XML entities
$content = $content -replace '&#x(0[0-8BbCc]|1[0-9A-Fa-f]|0[Ee]);', ''
$content = $content -replace '&#([0-8]|1[1-2]|14|1[5-9]|2[0-9]|3[01]);', ''
[xml]$doc = $content

# Parse tasks recursively
function Get-Tasks {
    param($element, $level, $parentPos)

    $taskElements = $element.SelectNodes('Task')
    $counter = 0

    foreach ($task in $taskElements) {
        $header = $task.SelectSingleNode('Header')
        if (-not $header) { continue }

        $isn2 = $header.GetAttribute('ISN_2')
        $desc = $header.GetAttribute('Description')
        $taskTypeEl = $header.SelectSingleNode('TaskType')
        $taskType = if ($taskTypeEl) { $taskTypeEl.GetAttribute('val') } else { 'B' }
        $disabled = $header.GetAttribute('Disabled')

        if ($isn2 -eq '1') {
            $pos = $idePos.ToString()
        } else {
            $counter++
            $pos = "$parentPos.$counter"
        }

        $indent = '  ' * $level
        $typeLabel = switch ($taskType) { 'B' { 'Batch' }; 'O' { 'Online' }; default { $taskType } }
        $disabledLabel = if ($disabled -eq '1') { ' [D]' } else { '' }

        # Count logic lines
        $logicLines = $task.SelectNodes('TaskLogic/LogicUnit/LogicLines/LogicLine')
        $lineCount = if ($logicLines) { $logicLines.Count } else { 0 }

        # Get main source table
        $mainDb = $task.SelectSingleNode('Resource/DB/DataObject')
        $tableInfo = ''
        if ($mainDb) {
            $tableId = $mainDb.GetAttribute('obj')
            if ($tableId) { $tableInfo = " [Table $tableId]" }
        }

        Write-Output "${indent}${pos} - ${desc} (${typeLabel}, ISN2=${isn2}, ${lineCount} logic lines${tableInfo})${disabledLabel}"

        # Recurse into subtasks
        $subTaskContainer = $task.SelectSingleNode('SubTasks')
        if ($subTaskContainer) {
            Get-Tasks $subTaskContainer ($level + 1) $pos
        }
    }
}

$taskTree = $doc.SelectSingleNode('//TaskTree')
if ($taskTree) {
    Get-Tasks $taskTree 0 $idePos.ToString()
} else {
    Write-Output "No TaskTree found in program"
}
