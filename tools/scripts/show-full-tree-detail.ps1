param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-VarName($index) {
    if ($index -lt 0) { return "?" }
    if ($index -lt 26) {
        return [char](65 + $index)
    }
    $idx = $index - 26
    $first = [math]::Floor($idx / 26)
    $second = $idx % 26
    return "$([char](65+[int]$first))$([char](65+[int]$second))"
}

function Count-AllSelectsInDV($taskNode) {
    $count = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            foreach ($line in $lu.LogicLines.LogicLine) {
                if ($line.Select) {
                    $count++
                }
            }
        }
    }
    return $count
}

function Show-AllTasks {
    param($node, [int]$depth = 0, [string]$childPos = "", [ref]$globalOffset)

    $isn = [int]$node.Header.ISN_2
    $name = $node.Header.Description

    $indent = "  " * $depth
    $path = if ($childPos -eq "") { "$PrgId" } else { "$PrgId.$childPos" }

    $selects = Count-AllSelectsInDV $node
    $firstVar = Get-VarName $globalOffset.Value

    Write-Host "${indent}[$path] ISN=$isn $name" -ForegroundColor Yellow -NoNewline
    Write-Host " | Selects=$selects | Offset=$($globalOffset.Value) | FirstVar=$firstVar" -ForegroundColor Green

    $globalOffset.Value += $selects

    if ($node.Task) {
        $subtasks = @($node.Task)
        Write-Host "${indent}  (${($subtasks.Count)} sous-taches)" -ForegroundColor Gray
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $newChildPos = if ($childPos -eq "") { "$($i+1)" } else { "$childPos.$($i+1)" }
            Show-AllTasks $subtasks[$i] ($depth + 1) $newChildPos $globalOffset
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Arbre complet avec toutes les sous-taches ===" -ForegroundColor Cyan
Write-Host ""

$offset = [ref]0
Show-AllTasks $mainTask 0 "" $offset

Write-Host ""
Write-Host "TOTAL variables: $($offset.Value)" -ForegroundColor Cyan
