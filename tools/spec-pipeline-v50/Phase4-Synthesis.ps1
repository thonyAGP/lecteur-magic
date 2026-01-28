#Requires -Version 5.1
<#
.SYNOPSIS
    Phase 4: SYNTHESIS - Produire la spec finale

.DESCRIPTION
    Production de la specification V5.0 complete:
    4.1 Assembler spec avec template 3 onglets
    4.2 Cartographie applicative (callers, callees 3 niveaux)
    4.3 Notes migration (score complexite, patterns C#)
    4.4 Validation finale (format IDE, Mermaid)

.OUTPUTS
    ADH-IDE-XXX.md specification complete V5.0
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [Parameter(Mandatory = $true)]
    [int]$IdePosition,

    [Parameter(Mandatory = $true)]
    [string]$DiscoveryFile,

    [Parameter(Mandatory = $true)]
    [string]$MappingFile,

    [Parameter(Mandatory = $true)]
    [string]$DecodeFile,

    [Parameter(Mandatory = $true)]
    [string]$OutputFile,

    [hashtable]$Config
)

$ErrorActionPreference = "Stop"

# ============================================================================
# CONFIGURATION
# ============================================================================

$ProjectsPath = if ($Config) { $Config.ProjectsPath } else { "D:\Data\Migration\XPA\PMS" }

# Charger tous les fichiers intermediaires
$Discovery = Get-Content $DiscoveryFile -Raw | ConvertFrom-Json
$Mapping = Get-Content $MappingFile -Raw | ConvertFrom-Json
$Decoded = Get-Content $DecodeFile -Raw | ConvertFrom-Json

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host "  [$Step] $Message" -ForegroundColor Gray
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "  [!!] $Message" -ForegroundColor Yellow
}

# Fonction pour nettoyer les labels Mermaid
function Clean-MermaidLabel {
    param([string]$Label)

    if ([string]::IsNullOrWhiteSpace($Label)) { return "Unknown" }

    # Supprimer caracteres speciaux
    $Clean = $Label -replace '[<>"\''`?!@#$%^&*()+=\[\]{}|\\:;,./~]', ''
    $Clean = $Clean -replace '\s+', ' '
    $Clean = $Clean.Trim()

    # Limiter longueur
    if ($Clean.Length -gt 20) {
        $Clean = $Clean.Substring(0, 17) + "..."
    }

    if ([string]::IsNullOrWhiteSpace($Clean)) { return "Prog" }

    return $Clean
}

# ============================================================================
# 4.1 ASSEMBLAGE SPEC V5.0
# ============================================================================

Write-Step "4.1" "Assemblage de la spec V5.0..."

$SpecLines = @()
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"

# Header
$ProgramName = $Discovery.Identification.Name
$PublicName = $Discovery.Identification.PublicName

$SpecLines += "# $Project IDE $IdePosition - $ProgramName"
$SpecLines += ""
$SpecLines += "> **Version spec**: 5.0"
$SpecLines += "> **Analyse**: $Timestamp"
$SpecLines += "> **Source**: ``$($Discovery.Identification.XmlPath)``"
$SpecLines += "> **Methode**: V5.0 Pipeline 4-Phase (Discovery-Mapping-Decode-Synthesis)"
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""

# ============================================================================
# ONGLET 1: FONCTIONNEL
# ============================================================================

$SpecLines += "<!-- TAB:Fonctionnel -->"
$SpecLines += ""
$SpecLines += "## SPECIFICATION FONCTIONNELLE"
$SpecLines += ""

# 1.1 Objectif metier
$SpecLines += "### 1.1 Objectif metier"
$SpecLines += ""
$SpecLines += "| Element | Description |"
$SpecLines += "|---------|-------------|"
$SpecLines += "| **Qui** | Operateur (utilisateur connecte) |"
$SpecLines += "| **Quoi** | $ProgramName |"
$SpecLines += "| **Pourquoi** | Fonction metier du module $Project |"
$SpecLines += "| **Declencheur** | Appel depuis programme parent ou menu |"
$SpecLines += "| **Resultat** | Traitement effectue selon logique programme |"
$SpecLines += ""

# 1.2 Regles metier
$SpecLines += "### 1.2 Regles metier"
$SpecLines += ""
$SpecLines += "| Code | Regle | Condition |"
$SpecLines += "|------|-------|-----------"

$RuleCount = 0
if ($Decoded.BusinessRules -and $Decoded.BusinessRules.All) {
    foreach ($Rule in $Decoded.BusinessRules.All | Select-Object -First 10) {
        $RuleCount++
        $ConditionClean = $Rule.Condition -replace '\|', '/' -replace '\n', ' '
        if ($ConditionClean.Length -gt 50) {
            $ConditionClean = $ConditionClean.Substring(0, 47) + "..."
        }
        $SpecLines += "| $($Rule.Code) | $($Rule.Type) | $ConditionClean |"
    }
}

if ($RuleCount -eq 0) {
    $SpecLines += "| RM-001 | Traitement principal | Conditions initiales validees |"
}
$SpecLines += ""

# 1.3 Flux utilisateur
$ParamIn = if ($Mapping.Parameters) { $Mapping.Parameters.Count } else { 0 }
$TaskCount = if ($Discovery.TaskStructure) { $Discovery.TaskStructure.TotalTasks } else { 0 }
$LogicLines = if ($Discovery.TaskStructure) { $Discovery.TaskStructure.TotalLogicLines } else { 0 }
$CalleeCount = if ($Discovery.CallGraph) { $Discovery.CallGraph.Callees.Count } else { 0 }

$SpecLines += "### 1.3 Flux utilisateur"
$SpecLines += ""
$SpecLines += "1. Reception des parametres d'entree ($ParamIn params)"
$SpecLines += "2. Initialisation et verification conditions"
$SpecLines += "3. Traitement principal ($TaskCount taches)"
$SpecLines += "4. Appels sous-programmes ($CalleeCount callees)"
$SpecLines += "5. Retour resultats"
$SpecLines += ""

# 1.4 Cas d'erreur
$SpecLines += "### 1.4 Cas d'erreur"
$SpecLines += ""
$SpecLines += "| Erreur | Comportement |"
$SpecLines += "|--------|--------------"
$SpecLines += "| Conditions non remplies | Abandon avec message |"
$SpecLines += "| Erreur sous-programme | Propagation erreur |"
$SpecLines += "| Donnees invalides | Validation et rejet |"
$SpecLines += ""

# 1.5 Dependances ECF
$EcfInfo = if ($Discovery.Orphan -and $Discovery.Orphan.EcfMembership) { $Discovery.Orphan.EcfMembership } else { "" }
if ([string]::IsNullOrWhiteSpace($EcfInfo)) {
    $EcfInfo = "Aucune dependance ECF identifiee"
}
$SpecLines += "### 1.5 Dependances ECF"
$SpecLines += ""
$SpecLines += "Programme partage via **$EcfInfo**"
if ($PublicName) {
    $SpecLines += " - Composant: $PublicName"
}
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""

# ============================================================================
# ONGLET 2: TECHNIQUE
# ============================================================================

$SpecLines += "<!-- TAB:Technique -->"
$SpecLines += ""
$SpecLines += "## SPECIFICATION TECHNIQUE"
$SpecLines += ""

# 2.1 Identification
$SpecLines += "### 2.1 Identification"
$SpecLines += ""
$SpecLines += "| Attribut | Valeur |"
$SpecLines += "|----------|--------|"
$SpecLines += "| **IDE Position** | $IdePosition |"
$SpecLines += "| **Fichier XML** | ``$($Discovery.Identification.XmlFile)`` |"
$SpecLines += "| **Description** | $ProgramName |"
$SpecLines += "| **Module** | $Project |"
if ($PublicName) {
    $SpecLines += "| **Public Name** | $PublicName |"
}
$SpecLines += "| **Nombre taches** | $TaskCount |"
$SpecLines += "| **Lignes logique** | $($Discovery.TaskStructure.TotalLogicLines) |"
$SpecLines += "| **Expressions** | $($Decoded.Stats.TotalExpressions) |"
$SpecLines += ""

# 2.2 Tables
$TableCount = if ($Mapping.Tables) { $Mapping.Tables.All.Count } else { 0 }
$WriteCount = if ($Mapping.Tables) { $Mapping.Tables.ByAccess.W } else { 0 }

$SpecLines += "### 2.2 Tables - $TableCount tables dont $WriteCount en ecriture"
$SpecLines += ""
$SpecLines += "| IDE# | Nom Physique | Nom Logique | Access | Usage |"
$SpecLines += "|------|--------------|-------------|--------|-------|"

if ($Mapping.Tables -and $Mapping.Tables.All) {
    foreach ($Table in $Mapping.Tables.All | Select-Object -First 20) {
        $AccessMode = switch ($Table.AccessMode) {
            "R" { "**READ**" }
            "W" { "**WRITE**" }
            "L" { "**LINK**" }
            default { $Table.AccessMode }
        }
        $SpecLines += "| #$($Table.TableId) | ``$($Table.PhysicalName)`` | $($Table.LogicalName) | $AccessMode | $($Table.UsageCount)x |"
    }
}

if ($TableCount -eq 0) {
    $SpecLines += "| - | Aucune table | - | - | - |"
}
$SpecLines += ""
$SpecLines += "> *Liste limitee aux 20 tables principales*"
$SpecLines += ""

# 2.3 Parametres
$ParamCount = if ($Mapping.Parameters) { $Mapping.Parameters.Count } else { 0 }

$SpecLines += "### 2.3 Parametres d'entree - $ParamCount parametres"
$SpecLines += ""
$SpecLines += "| Var | Nom | Type | Direction | Picture |"
$SpecLines += "|-----|-----|------|-----------|---------"

if ($Mapping.Parameters -and $Mapping.Parameters.All) {
    foreach ($Param in $Mapping.Parameters.All) {
        $SpecLines += "| $($Param.Letter) | $($Param.Name) | $($Param.Type) | $($Param.Direction) | $($Param.Picture) |"
    }
}

if ($ParamCount -eq 0) {
    $SpecLines += "| - | Aucun parametre | - | - | - |"
}
$SpecLines += ""

# 2.4 Algorigramme
$SpecLines += "### 2.4 Algorigramme"
$SpecLines += ""
$SpecLines += "``````mermaid"

if ($Decoded.Flowchart -and $Decoded.Flowchart.Mermaid) {
    $SpecLines += $Decoded.Flowchart.Mermaid
}
else {
    # Flowchart par defaut
    $SpecLines += "flowchart TD"
    $SpecLines += "    START([START - $ParamCount params])"
    $SpecLines += "    INIT[`"Initialisation`"]"
    $SpecLines += "    PROCESS[`"Traitement principal<br/>$TaskCount taches`"]"
    $SpecLines += "    CALLS[`"Appels sous-programmes<br/>$CalleeCount callees`"]"
    $SpecLines += "    ENDOK([END])"
    $SpecLines += ""
    $SpecLines += "    START --> INIT --> PROCESS --> CALLS --> ENDOK"
    $SpecLines += ""
    $SpecLines += "    style START fill:#3fb950"
    $SpecLines += "    style ENDOK fill:#f85149"
    $SpecLines += "    style PROCESS fill:#58a6ff"
}

$SpecLines += "``````"
$SpecLines += ""

# 2.5 Expressions cles
$SpecLines += "### 2.5 Expressions cles (selection)"
$SpecLines += ""
$SpecLines += "| # | Expression | Commentaire |"
$SpecLines += "|---|------------|-------------|"

if ($Decoded.Expressions -and $Decoded.Expressions.Critical) {
    $ExprIdx = 0
    foreach ($Expr in $Decoded.Expressions.Critical | Select-Object -First 10) {
        $ExprIdx++
        $DecodedClean = $Expr.Decoded -replace '\|', '/' -replace '\n', ' '
        if ($DecodedClean.Length -gt 60) {
            $DecodedClean = $DecodedClean.Substring(0, 57) + "..."
        }
        $SpecLines += "| $($Expr.ISN) | ``$DecodedClean`` | $($Expr.Type) |"
    }
}

if ($Decoded.Stats.TotalExpressions -eq 0) {
    $SpecLines += "| - | Aucune expression | - |"
}

$SpecLines += ""
$SpecLines += "> *$($Decoded.Stats.TotalExpressions) expressions au total. Liste limitee aux 10 premieres.*"
$SpecLines += ""

# 2.6 Statistiques
$SpecLines += "### 2.6 Statistiques"
$SpecLines += ""
$SpecLines += "| Metrique | Valeur |"
$SpecLines += "|----------|--------|"
$SpecLines += "| **Taches** | $TaskCount |"
$SpecLines += "| **Lignes logique** | $($Discovery.TaskStructure.TotalLogicLines) |"
$SpecLines += "| **Expressions** | $($Decoded.Stats.TotalExpressions) |"
$SpecLines += "| **Parametres** | $ParamCount |"
$SpecLines += "| **Tables accedees** | $TableCount |"
$SpecLines += "| **Tables en ecriture** | $WriteCount |"
$SpecLines += "| **Callees niveau 1** | $CalleeCount |"
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""

# ============================================================================
# ONGLET 3: CARTOGRAPHIE
# ============================================================================

$SpecLines += "<!-- TAB:Cartographie -->"
$SpecLines += ""
$SpecLines += "## CARTOGRAPHIE APPLICATIVE"
$SpecLines += ""

# 3.1 Chaine d'appels depuis Main
$SpecLines += "### 3.1 Chaine d'appels depuis Main"
$SpecLines += ""
$SpecLines += "``````mermaid"
$SpecLines += "graph LR"

# Construire la chaine des callers
$CallerChain = @()
if ($Discovery.CallGraph -and $Discovery.CallGraph.CallChainFromMain) {
    $CallerChain = $Discovery.CallGraph.CallChainFromMain
}

if ($CallerChain.Count -gt 0) {
    $PrevNode = $null
    foreach ($Caller in $CallerChain) {
        $NodeId = "C$($Caller.IdePosition)"
        $Label = Clean-MermaidLabel "$($Caller.IdePosition) $($Caller.Name)"
        $SpecLines += "    $NodeId[$Label]"

        if ($PrevNode) {
            $SpecLines += "    $PrevNode --> $NodeId"
        }
        $PrevNode = $NodeId
    }

    # Ajouter le programme cible
    $TargetLabel = Clean-MermaidLabel "$IdePosition $ProgramName"
    $SpecLines += "    T[$TargetLabel]"
    if ($PrevNode) {
        $SpecLines += "    $PrevNode --> T"
    }
    $SpecLines += "    style T fill:#58a6ff,color:#000"
}
else {
    # Pas de chaine - programme orphelin ou Main
    $TargetLabel = Clean-MermaidLabel "$IdePosition $ProgramName"
    $SpecLines += "    T[$TargetLabel]"
    $SpecLines += "    ORPHAN([ORPHELIN ou Main])"
    $SpecLines += "    T -.-> ORPHAN"
    $SpecLines += "    style T fill:#58a6ff,color:#000"
}

$SpecLines += "``````"
$SpecLines += ""

# 3.2 Callers directs
$SpecLines += "### 3.2 Callers directs"
$SpecLines += ""
$SpecLines += "| IDE | Programme | Nb appels |"
$SpecLines += "|-----|-----------|-----------|"

if ($Discovery.CallGraph -and $Discovery.CallGraph.Callers) {
    foreach ($Caller in $Discovery.CallGraph.Callers | Select-Object -First 10) {
        $SpecLines += "| $($Caller.IdePosition) | $($Caller.Name) | $($Caller.CallCount) |"
    }
}

if (!$Discovery.CallGraph -or $Discovery.CallGraph.Callers.Count -eq 0) {
    $SpecLines += "| - | ECF partage - appels cross-projet | - |"
}
$SpecLines += ""

# 3.3 Callees (3 niveaux)
$SpecLines += "### 3.3 Callees (3 niveaux)"
$SpecLines += ""
$SpecLines += "``````mermaid"
$SpecLines += "graph LR"

$TargetLabel = Clean-MermaidLabel "$IdePosition $ProgramName"
$SpecLines += "    T[$TargetLabel]"

if ($Discovery.CallGraph -and $Discovery.CallGraph.Callees -and $Discovery.CallGraph.Callees.Count -gt 0) {
    $Level1 = $Discovery.CallGraph.Callees | Where-Object { $_.Level -eq 1 }
    $Level2 = $Discovery.CallGraph.Callees | Where-Object { $_.Level -eq 2 }
    $Level3 = $Discovery.CallGraph.Callees | Where-Object { $_.Level -eq 3 }

    foreach ($Callee in $Level1 | Select-Object -First 5) {
        $NodeId = "L1_$($Callee.IdePosition)"
        $Label = Clean-MermaidLabel "$($Callee.IdePosition) $($Callee.Name)"
        $SpecLines += "    $NodeId[$Label]"
        $SpecLines += "    T --> $NodeId"
    }

    foreach ($Callee in $Level2 | Select-Object -First 5) {
        $NodeId = "L2_$($Callee.IdePosition)"
        $ParentId = "L1_$($Callee.ParentIde)"
        $Label = Clean-MermaidLabel "$($Callee.IdePosition) $($Callee.Name)"
        $SpecLines += "    $NodeId[$Label]"
        $SpecLines += "    $ParentId --> $NodeId"
    }

    foreach ($Callee in $Level3 | Select-Object -First 3) {
        $NodeId = "L3_$($Callee.IdePosition)"
        $ParentId = "L2_$($Callee.ParentIde)"
        $Label = Clean-MermaidLabel "$($Callee.IdePosition) $($Callee.Name)"
        $SpecLines += "    $NodeId[$Label]"
        $SpecLines += "    $ParentId --> $NodeId"
    }

    # Styles par niveau
    foreach ($Callee in $Level1 | Select-Object -First 5) {
        $SpecLines += "    style L1_$($Callee.IdePosition) fill:#3fb950"
    }
    foreach ($Callee in $Level2 | Select-Object -First 5) {
        $SpecLines += "    style L2_$($Callee.IdePosition) fill:#22c55e"
    }
    foreach ($Callee in $Level3 | Select-Object -First 3) {
        $SpecLines += "    style L3_$($Callee.IdePosition) fill:#10b981"
    }
}
else {
    $SpecLines += "    TERM([TERMINAL])"
    $SpecLines += "    T -.-> TERM"
    $SpecLines += "    style TERM fill:#6b7280,stroke-dasharray: 5 5"
}

$SpecLines += "    style T fill:#58a6ff,color:#000"
$SpecLines += "``````"
$SpecLines += ""

$SpecLines += "| Niv | IDE | Programme | Nb appels | Status |"
$SpecLines += "|-----|-----|-----------|-----------|--------|"

if ($Discovery.CallGraph -and $Discovery.CallGraph.Callees) {
    foreach ($Callee in $Discovery.CallGraph.Callees | Select-Object -First 15) {
        $Status = if ($Callee.IsActive) { "Actif" } else { "[D]" }
        $SpecLines += "| $($Callee.Level) | $($Callee.IdePosition) | $($Callee.Name) | $($Callee.CallCount) | $Status |"
    }
}

if (!$Discovery.CallGraph -or $Discovery.CallGraph.Callees.Count -eq 0) {
    $SpecLines += "| - | - | TERMINAL (aucun appel) | - | - |"
}
$SpecLines += ""

# 3.4 Composants ECF utilises
$SpecLines += "### 3.4 Composants ECF utilises"
$SpecLines += ""
$SpecLines += "| ECF | IDE | Public Name | Description |"
$SpecLines += "|-----|-----|-------------|-------------|"

if ($Discovery.Orphan -and $Discovery.Orphan.EcfMembership -and $Discovery.Orphan.EcfMembership -ne "None") {
    $SpecLines += "| $($Discovery.Orphan.EcfMembership) | $IdePosition | $PublicName | $($Discovery.Orphan.EcfComponent) |"
}
else {
    $SpecLines += "| - | - | Aucun composant ECF | - |"
}
$SpecLines += ""

# 3.5 Verification orphelin
$SpecLines += "### 3.5 Verification orphelin"
$SpecLines += ""
$SpecLines += "| Critere | Resultat |"
$SpecLines += "|---------|----------|"

$CallerCount = if ($Discovery.CallGraph -and $Discovery.CallGraph.Callers) { $Discovery.CallGraph.Callers.Count } else { 0 }
$HasPublicName = if ($PublicName) { "Defini: $PublicName" } else { "Non defini" }
$EcfName = if ($Discovery.OrphanStatus -and $Discovery.OrphanStatus.EcfName) { $Discovery.OrphanStatus.EcfName } else { $null }
$IsEcfShared = if ($EcfName) { "OUI - $EcfName" } else { "NON" }

$SpecLines += "| Callers actifs | $CallerCount programmes |"
$SpecLines += "| PublicName | $HasPublicName |"
$SpecLines += "| ECF partage | $IsEcfShared |"

# Conclusion orphelin - utilise OrphanStatus du discovery.json
$IsOrphan = $false
$OrphanReason = ""

if ($Discovery.OrphanStatus -and $Discovery.OrphanStatus.IsOrphan -eq $true) {
    $IsOrphan = $true
    $OrphanReason = "Aucun des 4 criteres satisfait"
}
elseif ($CallerCount -gt 0) {
    $OrphanReason = "Appele depuis la chaine Main"
}
elseif ($PublicName) {
    $OrphanReason = "Callable par ProgIdx('$PublicName')"
}
elseif ($EcfName) {
    $OrphanReason = "ECF shared component ($EcfName)"
}

$OrphanStatusText = if ($IsOrphan) { "ORPHELIN CONFIRME" } else { "NON ORPHELIN" }
$SpecLines += "| **Conclusion** | **$OrphanStatusText** - $OrphanReason |"
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""

# ============================================================================
# NOTES MIGRATION
# ============================================================================

$SpecLines += "## NOTES MIGRATION"
$SpecLines += ""

# Calcul score complexite
$ComplexityScore = 0
$ComplexityScore += $TaskCount * 10
$ComplexityScore += $TableCount * 20
$ComplexityScore += $WriteCount * 50
$ComplexityScore += $CalleeCount * 30
$ComplexityScore += $Decoded.Stats.TotalExpressions

$ComplexityLevel = if ($ComplexityScore -lt 200) {
    "FAIBLE"
} elseif ($ComplexityScore -lt 500) {
    "MOYENNE"
} elseif ($ComplexityScore -lt 1000) {
    "HAUTE"
} else {
    "TRES HAUTE"
}

$SpecLines += "### Complexite"
$SpecLines += ""
$SpecLines += "| Critere | Score | Detail |"
$SpecLines += "|---------|-------|--------|"
$SpecLines += "| Taches | $TaskCount | $(if ($TaskCount -gt 20) { 'Complexe' } else { 'Standard' }) |"
$SpecLines += "| Tables | $TableCount | $(if ($WriteCount -gt 3) { "Ecriture ($WriteCount tables)" } else { 'Lecture majoritaire' }) |"
$SpecLines += "| Callees | $CalleeCount | $(if ($CalleeCount -gt 10) { 'Fort couplage' } else { 'Faible couplage' }) |"
$SpecLines += "| **Score global** | **$ComplexityScore** | **$ComplexityLevel** |"
$SpecLines += ""

# Points d'attention
$SpecLines += "### Points d'attention migration"
$SpecLines += ""
$SpecLines += "| Point | Solution moderne |"
$SpecLines += "|-------|-----------------"
$SpecLines += "| Variables globales (VG*) | Service/Repository injection |"
$SpecLines += "| Tables Magic | Entity Framework / Dapper |"
$SpecLines += "| CallTask | Service method calls |"
$SpecLines += "| Forms | React/Angular components |"
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""

# Historique
$SpecLines += "## HISTORIQUE"
$SpecLines += ""
$SpecLines += "| Date | Action | Auteur |"
$SpecLines += "|------|--------|--------|"
$SpecLines += "| $Timestamp | **V5.0 Pipeline** - Generation automatique 4 phases | Script |"
$SpecLines += ""
$SpecLines += "---"
$SpecLines += ""
$SpecLines += "*Specification V5.0 - Generated with Pipeline 4-Phase (Discovery-Mapping-Decode-Synthesis)*"
$SpecLines += ""

# ============================================================================
# 4.4 VALIDATION FINALE
# ============================================================================

Write-Step "4.4" "Validation finale..."

$ValidationErrors = @()

# Verifier format IDE (pas de Prg_XXX)
$SpecContent = $SpecLines -join "`n"
if ($SpecContent -match "Prg_\d+") {
    $ValidationErrors += "Format Prg_XXX detecte - doit utiliser IDE"
}

# Verifier expressions (pas de {0,3} brut dans le texte principal)
if ($SpecContent -match '\{[0-4],\d+\}' -and $SpecContent -notmatch '``.*\{[0-4],\d+\}.*``') {
    Write-Warning2 "Expressions {N,Y} non decodees detectees"
}

# Verifier syntaxe Mermaid basique
if ($SpecContent -match 'graph\s+(LR|TD|TB|RL|BT)') {
    # Verifier pas de caracteres speciaux dans les labels
    if ($SpecContent -match '\[[^\]]*[<>"\x27][^\]]*\]') {
        $ValidationErrors += "Caracteres speciaux dans labels Mermaid"
    }
}

if ($ValidationErrors.Count -gt 0) {
    Write-Warning2 "Validation: $($ValidationErrors.Count) problemes detectes"
    foreach ($Err in $ValidationErrors) {
        Write-Warning2 "  - $Err"
    }
}
else {
    Write-Success "Validation: format IDE OK, Mermaid OK"
}

# Sauvegarder
$SpecLines -join "`n" | Set-Content $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "  Spec sauvegardee: $OutputFile" -ForegroundColor Cyan
Write-Host "  Complexite: $ComplexityLevel (score $ComplexityScore)" -ForegroundColor $(if ($ComplexityLevel -eq "FAIBLE") { "Green" } elseif ($ComplexityLevel -eq "MOYENNE") { "Yellow" } else { "Red" })
