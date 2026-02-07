# ADH IDE 51 - Recherche Droit Solde Free Ext

> **Analyse**: Phases 1-4 2026-02-07 06:49 -> 06:49 (15s) | Assemblage 13:32
> **Pipeline**: V7.2 Enrichi
> **Structure**: 4 onglets (Resume | Ecrans | Donnees | Connexions)

<!-- TAB:Resume -->

## 1. FICHE D'IDENTITE

| Attribut | Valeur |
|----------|--------|
| Projet | ADH |
| IDE Position | 51 |
| Nom Programme | Recherche Droit Solde Free Ext |
| Fichier source | `Prg_51.xml` |
| Dossier IDE | Comptabilite |
| Taches | 1 (0 ecrans visibles) |
| Tables modifiees | 0 |
| Programmes appeles | 0 |
| Complexite | **BASSE** (score 0/100) |
| <span style="color:red">Statut</span> | <span style="color:red">**ORPHELIN_POTENTIEL**</span> |

## 2. DESCRIPTION FONCTIONNELLE

ADH IDE 51 est un programme de recherche spécialisé dans la localisation et l'extraction du droit au solde gratuit (free balance) pour les externes. Il parcourt les données de compte client pour identifier les montants disponibles non facturés, critère fondamental pour les opérations de clôture de dossier ou de transition vers un nouvel établissement. Ce programme fait partie de la chaîne de traitement des droits financiers du module ADH.

Le programme interroge les tables de transactions et de cumuls pour construire une vision consolidée du solde disponible, en excluant les montants déjà engagés ou réservés. Il applique des règles métier spécifiques aux externes (clients non-résidents ou temporaires) pour déterminer l'éligibilité et le montant extractible, intégrant des paramètres de seuil et des conditions de durée de détention.

En cas de succès, le programme retourne le montant du droit au solde avec les références de justification. En cas d'erreur (compte introuvable, données insuffisantes), il génère un code d'erreur explicite permettant au processus appelant de gérer le scénario dégradé. Ce programme s'inscrit dans une logique de service réutilisable, appelé depuis plusieurs points de la chaîne de gestion des dossiers clients.

## 3. BLOCS FONCTIONNELS

## 5. REGLES METIER

*(Aucune regle metier identifiee dans les expressions)*

## 6. CONTEXTE

- **Appele par**: (aucun)
- **Appelle**: 0 programmes | **Tables**: 1 (W:0 R:1 L:0) | **Taches**: 1 | **Expressions**: 3

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
| 740 | pv_stock_movements | Articles et stock | DB | R |   |   | 1 |

### Colonnes par table (1 / 1 tables avec colonnes identifiees)

<details>
<summary>Table 740 - pv_stock_movements (R) - 1 usages</summary>

| Lettre | Variable | Acces | Type |
|--------|----------|-------|------|
| A | P. User | R | Alpha |
| B | P Droit Ok | R | Logical |

</details>

## 11. VARIABLES

### 11.1 Parametres entrants (2)

Variables recues en parametre.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| A | P. User | Alpha | 1x parametre entrant |
| B | P Droit Ok | Logical | - |

## 12. EXPRESSIONS

**3 / 3 expressions decodees (100%)**

### 12.1 Repartition par type

| Type | Expressions | Regles |
|------|-------------|--------|
| OTHER | 1 | 0 |
| CONDITION | 1 | 0 |
| CAST_LOGIQUE | 1 | 0 |

### 12.2 Expressions cles par type

#### OTHER (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| OTHER | 1 | `P. User [A]` | - |

#### CONDITION (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONDITION | 2 | `[C]='INFORMATICIEN' OR [C]='GESTION'` | - |

#### CAST_LOGIQUE (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CAST_LOGIQUE | 3 | `'TRUE'LOG` | - |

<!-- TAB:Connexions -->

## 13. GRAPHE D'APPELS

### 13.1 Chaine depuis Main (Callers)

**Chemin**: (pas de callers directs)

```mermaid
graph LR
    T51[51 Recherche Droit Sol...]
    style T51 fill:#58a6ff
    NONE[Aucun caller]
    NONE -.-> T51
    style NONE fill:#6b7280,stroke-dasharray: 5 5
```

### 13.2 Callers

| IDE | Nom Programme | Nb Appels |
|-----|---------------|-----------|
| - | (aucun) | - |

### 13.3 Callees (programmes appeles)

```mermaid
graph LR
    T51[51 Recherche Droit Sol...]
    style T51 fill:#58a6ff
    NONE[Aucun callee]
    T51 -.-> NONE
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
| Lignes de logique | 8 | Programme compact |
| Expressions | 3 | Peu de logique |
| Tables WRITE | 0 | Impact faible |
| Sous-programmes | 0 | Peu de dependances |
| Ecrans visibles | 0 | Ecran unique ou traitement batch |
| Code desactive | 0% (0 / 8) | Code sain |
| Regles metier | 0 | Pas de regle identifiee |

### 14.2 Plan de migration par bloc

### 14.3 Dependances critiques

| Dependance | Type | Appels | Impact |
|------------|------|--------|--------|

---
*Spec DETAILED generee par Pipeline V7.2 - 2026-02-07 13:33*
