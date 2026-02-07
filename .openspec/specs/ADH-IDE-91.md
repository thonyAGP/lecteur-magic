# ADH IDE 91 - Verif boutique

> **Analyse**: Phases 1-4 2026-02-07 06:55 -> 06:55 (16s) | Assemblage 14:16
> **Pipeline**: V7.2 Enrichi
> **Structure**: 4 onglets (Resume | Ecrans | Donnees | Connexions)

<!-- TAB:Resume -->

## 1. FICHE D'IDENTITE

| Attribut | Valeur |
|----------|--------|
| Projet | ADH |
| IDE Position | 91 |
| Nom Programme | Verif boutique |
| Fichier source | `Prg_91.xml` |
| Dossier IDE | General |
| Taches | 1 (0 ecrans visibles) |
| Tables modifiees | 0 |
| Programmes appeles | 0 |
| Complexite | **BASSE** (score 0/100) |
| <span style="color:red">Statut</span> | <span style="color:red">**ORPHELIN_POTENTIEL**</span> |

## 2. DESCRIPTION FONCTIONNELLE

Le programme **ADH IDE 91 - Verif_boutique** est un utilitaire de vérification chargé de valider l'intégrité des données relatives aux articles de boutique (merchandise) lors du processus de facturation et caisse. Il intervient dans la chaîne de checkout, appelé par ADH 54 (Factures_Check_Out), et reçoit en entrée l'identifiant de la transaction (Societe, Compte, Row ID de vente). Le programme effectue une validation par plage sur l'ID de ligne pour s'assurer qu'il est valide et non-zéro, puis interroge la table maj_appli_tpe (configuration TPE) pour vérifier l'existence et la validité de la ligne boutique associée.

Structuralement, il s'agit d'un programme très simple composé d'une unique tâche avec 17 lignes de logique et 9 expressions, sans branchement conditionnel. Le programme retourne deux drapeaux logiques (variables E et D) indiquant respectivement si la ligne boutique existe et si des lignes sont manquantes. Cette approche minimaliste reflète son rôle de vérification ponctuelle : il n'effectue que des lectures et aucune modification de données.

Sur le plan métier, ADH 91 constitue un point de contrôle critique de la qualité des données dans le flux comptable et de ventes. Elle garantit que les articles de boutique sont correctement associés aux transactions avant la génération de factures, et s'inscrit dans une chaîne complexe incluant aussi ADH 89 (Factures - Table Comptabilité), ADH 90 (Edition Facture TVA) et ADH 92 (Flag ligne boutique). Son utilisation cross-projets suggère son importance dans la cohérence des données entre plusieurs modules du système.

## 3. BLOCS FONCTIONNELS

## 5. REGLES METIER

*(Aucune regle metier identifiee dans les expressions)*

## 6. CONTEXTE

- **Appele par**: (aucun)
- **Appelle**: 0 programmes | **Tables**: 1 (W:0 R:1 L:0) | **Taches**: 1 | **Expressions**: 9

<!-- TAB:Ecrans -->

## 8. ECRANS

*(Programme sans ecran visible)*

## 9. NAVIGATION

### 9.3 Structure hierarchique (0 tache)

| Position | Tache | Type | Dimensions | Bloc |
|----------|-------|------|------------|------|

### 9.4 Algorigramme

```mermaid
flowchart TD
    START([START])
    INIT[Init controles]
    SAISIE[Traitement principal]
    ENDOK([END OK])

    START --> INIT --> SAISIE
    SAISIE --> ENDOK

    style START fill:#3fb950,color:#000
    style ENDOK fill:#3fb950,color:#000
```

> **Legende**: Vert = START/END OK | Rouge = END KO | Bleu = Decisions
> *Algorigramme auto-genere. Utiliser `/algorigramme` pour une synthese metier detaillee.*

<!-- TAB:Donnees -->

## 10. TABLES

### Tables utilisees (1)

| ID | Nom | Description | Type | R | W | L | Usages |
|----|-----|-------------|------|---|---|---|--------|
| 866 | maj_appli_tpe |  | DB | R |   |   | 1 |

### Colonnes par table (1 / 1 tables avec colonnes identifiees)

<details>
<summary>Table 866 - maj_appli_tpe (R) - 1 usages</summary>

| Lettre | Variable | Acces | Type |
|--------|----------|-------|------|
| A | P.Societe | R | Alpha |
| B | P.Compte | R | Numeric |
| C | P.Row id vente | R | Numeric |
| D | P.Ligne manquante ? | R | Logical |
| E | v.Existe ligne boutique ? | R | Logical |

</details>

## 11. VARIABLES

### 11.1 Parametres entrants (4)

Variables recues en parametre.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| A | P.Societe | Alpha | 1x parametre entrant |
| B | P.Compte | Numeric | 1x parametre entrant |
| C | P.Row id vente | Numeric | 1x parametre entrant |
| D | P.Ligne manquante ? | Logical | - |

### 11.2 Variables de session (1)

Variables persistantes pendant toute la session.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| E | v.Existe ligne boutique ? | Logical | - |

## 12. EXPRESSIONS

**9 / 9 expressions decodees (100%)**

### 12.1 Repartition par type

| Type | Expressions | Regles |
|------|-------------|--------|
| CONSTANTE | 2 | 0 |
| OTHER | 3 | 0 |
| CONDITION | 1 | 0 |
| CAST_LOGIQUE | 2 | 0 |
| NEGATION | 1 | 0 |

### 12.2 Expressions cles par type

#### CONSTANTE (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONSTANTE | 6 | `1` | - |
| CONSTANTE | 4 | `'R'` | - |

#### OTHER (3 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| OTHER | 5 | `[I]` | - |
| OTHER | 2 | `P.Compte [B]` | - |
| OTHER | 1 | `P.Societe [A]` | - |

#### CONDITION (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONDITION | 3 | `CndRange(P.Row id vente [C]<>0,P.Row id vente [C])` | - |

#### CAST_LOGIQUE (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CAST_LOGIQUE | 9 | `'FALSE'LOG` | - |
| CAST_LOGIQUE | 7 | `'TRUE'LOG` | - |

#### NEGATION (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| NEGATION | 8 | `NOT [J]` | - |

<!-- TAB:Connexions -->

## 13. GRAPHE D'APPELS

### 13.1 Chaine depuis Main (Callers)

**Chemin**: (pas de callers directs)

```mermaid
graph LR
    T91[91 Verif boutique]
    style T91 fill:#58a6ff
    NONE[Aucun caller]
    NONE -.-> T91
    style NONE fill:#6b7280,stroke-dasharray: 5 5
```

### 13.2 Callers

| IDE | Nom Programme | Nb Appels |
|-----|---------------|-----------|
| - | (aucun) | - |

### 13.3 Callees (programmes appeles)

```mermaid
graph LR
    T91[91 Verif boutique]
    style T91 fill:#58a6ff
    NONE[Aucun callee]
    T91 -.-> NONE
    style NONE fill:#6b7280,stroke-dasharray: 5 5
```

### 13.4 Detail Callees avec contexte

| IDE | Nom Programme | Appels | Contexte |
|-----|---------------|--------|----------|
| - | (aucun) | - | - |

## 14. RECOMMANDATIONS MIGRATION

### 14.1 Profil du programme

| Metrique | Valeur | Impact migration |
|----------|--------|-----------------|
| Lignes de logique | 17 | Programme compact |
| Expressions | 9 | Peu de logique |
| Tables WRITE | 0 | Impact faible |
| Sous-programmes | 0 | Peu de dependances |
| Ecrans visibles | 0 | Ecran unique ou traitement batch |
| Code desactive | 0% (0 / 17) | Code sain |
| Regles metier | 0 | Pas de regle identifiee |

### 14.2 Plan de migration par bloc

### 14.3 Dependances critiques

| Dependance | Type | Appels | Impact |
|------------|------|--------|--------|

---
*Spec DETAILED generee par Pipeline V7.2 - 2026-02-07 14:18*
