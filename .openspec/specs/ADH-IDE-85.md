# ADH IDE 85 - Determine Age Debut Sejour

> **Analyse**: Phases 1-4 2026-02-07 06:53 -> 06:53 (16s) | Assemblage 14:04
> **Pipeline**: V7.2 Enrichi
> **Structure**: 4 onglets (Resume | Ecrans | Donnees | Connexions)

<!-- TAB:Resume -->

## 1. FICHE D'IDENTITE

| Attribut | Valeur |
|----------|--------|
| Projet | ADH |
| IDE Position | 85 |
| Nom Programme | Determine Age Debut Sejour |
| Fichier source | `Prg_85.xml` |
| Dossier IDE | General |
| Taches | 1 (0 ecrans visibles) |
| Tables modifiees | 0 |
| Programmes appeles | 0 |
| Complexite | **BASSE** (score 0/100) |
| <span style="color:red">Statut</span> | <span style="color:red">**ORPHELIN_POTENTIEL**</span> |

## 2. DESCRIPTION FONCTIONNELLE

**ADH IDE 85 - Determine Age Debut Sejour** est un programme utilitaire pur qui calcule l'âge exact d'une personne à la date de début de son séjour. À partir de deux dates en entrée (date de naissance et date de début de séjour), il détermine l'âge en années, en tenant compte précisément de la position du mois et du jour (si l'anniversaire a eu lieu ou non avant la date de référence). Le programme gère aussi les cas limites : si la date de séjour est manquante, il utilise la date du jour ; si l'âge dépasse 100 ans, il signale une donnée anormale via une valeur d'erreur.

La logique est basée sur trois règles métier : d'abord valider et normaliser la date de début de séjour (avec défaut au jour courant), puis soustraire 1 année si l'anniversaire n'a pas encore eu lieu dans l'année en cours, et enfin calculer un décalage mensuel pour les calculs en sous-année. Le programme encode le résultat sous forme de caractère ASCII (technique classique Magic) : l'âge devient `ASCIIChr(âge + 100)` ou `ASCIIChr(200)` si invalide, permettant une transmission compacte sur un seul octet.

Malgré l'absence d'appelants détectés, ce programme n'est pas réellement orphelin : il fait partie du composant ADH.ecf partagé et est probablement appelé par d'autres programmes ADH via un mécanisme indirect ou un appel par indice. Il ne manipule aucune table, ne modifie aucune donnée en base, et reste un calcul pur et déterministe, idéal pour servir de brique utilitaire dans le domaine métier des séjours et de la gestion des âges.

## 3. BLOCS FONCTIONNELS

## 5. REGLES METIER

3 regles identifiees:

### Autres (3 regles)

#### <a id="rm-RM-001"></a>[RM-001] Si P0-Date debut Sejour [B]='00/00/0000'DATE alors Date () sinon P0-Date debut Sejour [B])

| Element | Detail |
|---------|--------|
| **Condition** | `P0-Date debut Sejour [B]='00/00/0000'DATE` |
| **Si vrai** | Date () |
| **Si faux** | P0-Date debut Sejour [B]) |
| **Variables** | B (P0-Date debut Sejour) |
| **Expression source** | Expression 1 : `IF (P0-Date debut Sejour [B]='00/00/0000'DATE,Date (),P0-Dat` |
| **Exemple** | Si P0-Date debut Sejour [B]='00/00/0000'DATE â†’ Date (). Sinon â†’ P0-Date debut Sejour [B]) |

#### <a id="rm-RM-002"></a>[RM-002] Si P0-Age [C]>100 alors ASCIIChr (200) sinon ASCIIChr (P0-Age [C]+100))

| Element | Detail |
|---------|--------|
| **Condition** | `P0-Age [C]>100` |
| **Si vrai** | ASCIIChr (200) |
| **Si faux** | ASCIIChr (P0-Age [C]+100)) |
| **Variables** | C (P0-Age) |
| **Expression source** | Expression 8 : `IF (P0-Age [C]>100,ASCIIChr (200),ASCIIChr (P0-Age [C]+100))` |
| **Exemple** | Si P0-Age [C]>100 â†’ ASCIIChr (200). Sinon â†’ ASCIIChr (P0-Age [C]+100)) |

#### <a id="rm-RM-003"></a>[RM-003] Si Month (W0 Date debut sejour [F])<=Month (P0-Date de Naissance [A]) alors Month (W0 Date debut sejour [F])+12-Month (P0-Date de Naissance [A]) sinon Month (W0 Date debut sejour [F])-Month (P0-Date de Naissance [A]))

| Element | Detail |
|---------|--------|
| **Condition** | `Month (W0 Date debut sejour [F])<=Month (P0-Date de Naissance [A])` |
| **Si vrai** | Month (W0 Date debut sejour [F])+12-Month (P0-Date de Naissance [A]) |
| **Si faux** | Month (W0 Date debut sejour [F])-Month (P0-Date de Naissance [A])) |
| **Variables** | F (W0 Date debut sejour), A (P0-Date de Naissance) |
| **Expression source** | Expression 10 : `IF (Month (W0 Date debut sejour [F])<=Month (P0-Date de Nais` |
| **Exemple** | Si Month (W0 Date debut sejour [F])<=Month (P0-Date de Naissance [A]) â†’ Month (W0 Date debut sejour [F])+12-Month (P0-Date de Naissance [A]) |

## 6. CONTEXTE

- **Appele par**: (aucun)
- **Appelle**: 0 programmes | **Tables**: 0 (W:0 R:0 L:0) | **Taches**: 1 | **Expressions**: 19

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

### Tables utilisees (0)

| ID | Nom | Description | Type | R | W | L | Usages |
|----|-----|-------------|------|---|---|---|--------|

### Colonnes par table (0 / 0 tables avec colonnes identifiees)

## 11. VARIABLES

### 11.1 Variables de travail (2)

Variables internes au programme.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| F | W0 Date debut sejour | Date | 5x calcul interne |
| G | W0 Nb de Mois | Numeric | 4x calcul interne |

### 11.2 Autres (5)

Variables diverses.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| A | P0-Date de Naissance | Date | 7x refs |
| B | P0-Date debut Sejour | Date | 1x refs |
| C | P0-Age | Numeric | 4x refs |
| D | P0-Age Codifie | Alpha | - |
| E | P0-Nb mois | Numeric | - |

## 12. EXPRESSIONS

**19 / 19 expressions decodees (100%)**

### 12.1 Repartition par type

| Type | Expressions | Regles |
|------|-------------|--------|
| CALCULATION | 4 | 0 |
| CONDITION | 11 | 3 |
| CONSTANTE | 2 | 0 |
| OTHER | 2 | 0 |

### 12.2 Expressions cles par type

#### CALCULATION (4 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CALCULATION | 12 | `W0 Nb de Mois [G]-1` | - |
| CALCULATION | 15 | `ASCIIChr (80+W0 Nb de Mois [G])` | - |
| CALCULATION | 3 | `Year (W0 Date debut sejour [F])-Year (P0-Date de Naissance [A])` | - |
| CALCULATION | 5 | `P0-Age [C]-1` | - |

#### CONDITION (11 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONDITION | 10 | `IF (Month (W0 Date debut sejour [F])<=Month (P0-Date de Naissance [A]),Month (W0 Date debut sejour [F])+12-Month (P0-Date de Naissance [A]),Month (W0 Date debut sejour [F])-Month (P0-Date de Naissance [A]))` | [RM-003](#rm-RM-003) |
| CONDITION | 8 | `IF (P0-Age [C]>100,ASCIIChr (200),ASCIIChr (P0-Age [C]+100))` | [RM-002](#rm-RM-002) |
| CONDITION | 1 | `IF (P0-Date debut Sejour [B]='00/00/0000'DATE,Date (),P0-Date debut Sejour [B])` | [RM-001](#rm-RM-001) |
| CONDITION | 11 | `Day (W0 Date debut sejour [F])<Day (P0-Date de Naissance [A])` | - |
| CONDITION | 9 | `P0-Age [C]=0` | - |
| ... | | *+6 autres* | |

#### CONSTANTE (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONSTANTE | 17 | `0` | - |
| CONSTANTE | 14 | `1` | - |

#### OTHER (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| OTHER | 19 | `W0 Nb de Mois [G]` | - |
| OTHER | 18 | `ASCIIChr (80)` | - |

<!-- TAB:Connexions -->

## 13. GRAPHE D'APPELS

### 13.1 Chaine depuis Main (Callers)

**Chemin**: (pas de callers directs)

```mermaid
graph LR
    T85[85 Determine Age Debut...]
    style T85 fill:#58a6ff
    NONE[Aucun caller]
    NONE -.-> T85
    style NONE fill:#6b7280,stroke-dasharray: 5 5
```

### 13.2 Callers

| IDE | Nom Programme | Nb Appels |
|-----|---------------|-----------|
| - | (aucun) | - |

### 13.3 Callees (programmes appeles)

```mermaid
graph LR
    T85[85 Determine Age Debut...]
    style T85 fill:#58a6ff
    NONE[Aucun callee]
    T85 -.-> NONE
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
| Lignes de logique | 30 | Programme compact |
| Expressions | 19 | Peu de logique |
| Tables WRITE | 0 | Impact faible |
| Sous-programmes | 0 | Peu de dependances |
| Ecrans visibles | 0 | Ecran unique ou traitement batch |
| Code desactive | 0% (0 / 30) | Code sain |
| Regles metier | 3 | Quelques regles a preserver |

### 14.2 Plan de migration par bloc

### 14.3 Dependances critiques

| Dependance | Type | Appels | Impact |
|------------|------|--------|--------|

---
*Spec DETAILED generee par Pipeline V7.2 - 2026-02-07 14:06*
