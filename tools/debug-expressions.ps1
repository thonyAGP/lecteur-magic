# Debug expressions pour VIL Prg_558 tache Reception (ISN_2=19)

[xml]$xml = Get-Content "D:\Data\Migration\XPA\PMS\VIL\Source\Prg_558.xml" -Encoding UTF8

$task = $xml.SelectSingleNode("//Task[Header[@ISN_2='19']]")

Write-Host "=== EXPRESSIONS DANS TACHE 19 ===" -ForegroundColor Cyan

# Expressions directes dans la tache
$directExp = $task.SelectSingleNode("./Expressions")
if ($directExp) {
    $expNodes = $directExp.SelectNodes("Expression")
    Write-Host "Expressions dans ./Expressions: $($expNodes.Count)"
    $expNodes | Select-Object -First 5 | ForEach-Object {
        Write-Host "  id=$($_.id)"
        $formula = $_.SelectSingleNode("Formula")
        if ($formula) {
            Write-Host "    Formula: $($formula.InnerText)"
        }
        $value = $_.SelectSingleNode("Value")
        if ($value) {
            Write-Host "    Value: $($value.InnerText)"
        }
    }
} else {
    Write-Host "Pas de ./Expressions directes"
}

# Expressions dans Resource
$resExp = $task.SelectSingleNode("./Resource/Expressions")
if ($resExp) {
    $expNodes = $resExp.SelectNodes("Expression")
    Write-Host ""
    Write-Host "Expressions dans ./Resource/Expressions: $($expNodes.Count)"
    $expNodes | Select-Object -First 5 | ForEach-Object {
        Write-Host "  id=$($_.id)"
        $formula = $_.SelectSingleNode("Formula")
        if ($formula) {
            Write-Host "    Formula: $($formula.InnerText)"
        }
    }
} else {
    Write-Host "Pas de ./Resource/Expressions"
}

# Chercher toutes les Expressions dans la tache
$allExp = $task.SelectNodes(".//Expressions")
Write-Host ""
Write-Host "Tous les noeuds Expressions: $($allExp.Count)"
foreach ($expContainer in $allExp) {
    $parent = $expContainer.ParentNode.LocalName
    $expNodes = $expContainer.SelectNodes("Expression")
    Write-Host "  Parent: $parent -> $($expNodes.Count) expressions"
}

# Regarder une expression specifique (par exemple 11 qui est utilisee pour Update EU)
Write-Host ""
Write-Host "=== RECHERCHE EXPRESSION 11 ===" -ForegroundColor Yellow
$exp11 = $task.SelectSingleNode(".//Expression[@id='11']")
if ($exp11) {
    Write-Host "Expression 11 trouvee:"
    Write-Host "  Parent: $($exp11.ParentNode.ParentNode.LocalName)"
    Write-Host "  XML: $($exp11.OuterXml.Substring(0, [Math]::Min(200, $exp11.OuterXml.Length)))"
} else {
    Write-Host "Expression 11 non trouvee dans tache 19"

    # Chercher dans tout le programme
    $exp11Global = $xml.SelectSingleNode("//Expression[@id='11']")
    if ($exp11Global) {
        Write-Host "Expression 11 trouvee globalement"
        $taskParent = $exp11Global.ParentNode.ParentNode
        if ($taskParent.LocalName -eq "Task") {
            $header = $taskParent.SelectSingleNode("Header")
            Write-Host "  Dans tache ISN=$($header.ISN_2)"
        }
    }
}
