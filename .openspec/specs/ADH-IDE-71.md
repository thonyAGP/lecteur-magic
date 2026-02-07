# ADH IDE 71 - Print extrait compte /Date

> **Analyse**: Phases 1-4 2026-02-07 03:43 -> 03:43 (28s) | Assemblage 13:43
> **Pipeline**: V7.2 Enrichi
> **Structure**: 4 onglets (Resume | Ecrans | Donnees | Connexions)

<!-- TAB:Resume -->

## 1. FICHE D'IDENTITE

| Attribut | Valeur |
|----------|--------|
| Projet | ADH |
| IDE Position | 71 |
| Nom Programme | Print extrait compte /Date |
| Fichier source | `Prg_71.xml` |
| Dossier IDE | Comptabilite |
| Taches | 24 (0 ecrans visibles) |
| Tables modifiees | 1 |
| Programmes appeles | 5 |
| Complexite | **BASSE** (score 25/100) |

## 2. DESCRIPTION FONCTIONNELLE

**ADH IDE 71 - Print extrait compte /Date** est un programme de génération et d'impression d'extraits de compte. Il reçoit les appels de plusieurs programmes spécialisés dans la consultation de soldes (IDE 69 pour l'extrait standard, IDE 53 pour le checkout décalé, IDE 64 et 287 pour les soldes). Son rôle est de préparer les données comptables de l'adhérent, récupérer les paramètres d'impression (devise locale via IDE 21, imprimante via IDE 179) et orchestrer l'édition complète du document.

Le processus suit une séquence logique : récupération du nom de l'adhérent, configuration de l'imprimante cible (tâche "Printer 1"), génération du corps du document "extrait compte", ajout du pied de page en appelant IDE 75, et finalisation avec un récapitulatif des frais supplémentaires. Le programme met à jour la table `log_maj_tpe` pour tracer les opérations d'impression effectuées, garantissant un audit des éditions critiques.

La gestion de l'imprimante est centralisée : utilisation des services IDE 181 (Set Listing Number) et 182 (Raz Current Printer) pour initialiser et réinitialiser l'état de sortie. Cela assure que chaque édition est isolée et que l'imprimante revient à un état connu après impression, évitant les chevauchements de documents ou les configurations résiduelles.

## 3. BLOCS FONCTIONNELS

### 3.1 Traitement (5 taches)

Traitements internes.

---

#### <a id="t1"></a>T1 - Veuillez patienter... [ECRAN]

**Role** : Traitement : Veuillez patienter....
**Ecran** : 432 x 60 DLU (MDI) | [Voir mockup](#ecran-t1)

<details>
<summary>4 sous-taches directes</summary>

| Tache | Nom | Bloc |
|-------|-----|------|
| [T2](#t2) | recup nom adherent | Traitement |
| [T16](#t16) | Veuillez patienter... **[ECRAN]** | Traitement |
| [T18](#t18) | Veuillez patienter... **[ECRAN]** | Traitement |
| [T22](#t22) | Veuillez patienter... **[ECRAN]** | Traitement |

</details>
**Delegue a** : [Recupere devise local (IDE 21)](ADH-IDE-21.md), [Set Listing Number (IDE 181)](ADH-IDE-181.md)

---

#### <a id="t2"></a>T2 - recup nom adherent

**Role** : Consultation/chargement : recup nom adherent.
**Variables liees** : S (W0 nom adherent), T (W0 prenom adherent), U (W0 n° adherent)
**Delegue a** : [Recupere devise local (IDE 21)](ADH-IDE-21.md), [Set Listing Number (IDE 181)](ADH-IDE-181.md)

---

#### <a id="t16"></a>T16 - Veuillez patienter... [ECRAN]

**Role** : Traitement : Veuillez patienter....
**Ecran** : 422 x 56 DLU (MDI) | [Voir mockup](#ecran-t16)
**Delegue a** : [Recupere devise local (IDE 21)](ADH-IDE-21.md), [Set Listing Number (IDE 181)](ADH-IDE-181.md)

---

#### <a id="t18"></a>T18 - Veuillez patienter... [ECRAN]

**Role** : Traitement : Veuillez patienter....
**Ecran** : 422 x 56 DLU (MDI) | [Voir mockup](#ecran-t18)
**Delegue a** : [Recupere devise local (IDE 21)](ADH-IDE-21.md), [Set Listing Number (IDE 181)](ADH-IDE-181.md)

---

#### <a id="t22"></a>T22 - Veuillez patienter... [ECRAN]

**Role** : Traitement : Veuillez patienter....
**Ecran** : 422 x 56 DLU (MDI) | [Voir mockup](#ecran-t22)
**Delegue a** : [Recupere devise local (IDE 21)](ADH-IDE-21.md), [Set Listing Number (IDE 181)](ADH-IDE-181.md)


### 3.2 Impression (19 taches)

Generation des documents et tickets.

---

#### <a id="t3"></a>T3 - Printer 1

**Role** : Generation du document : Printer 1.

---

#### <a id="t4"></a>T4 - edition extrait compte

**Role** : Generation du document : edition extrait compte.
**Variables liees** : B (P0 n° compte), H (P0 edition Tva V2), O (P. Edition Auto), X (W0 masque extrait), BD (v. Libelle edition)

---

#### <a id="t5"></a>T5 - Edition du pied

**Role** : Generation du document : Edition du pied.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t6"></a>T6 - Edition recap Free Etra

**Role** : Generation du document : Edition recap Free Etra.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t7"></a>T7 - edition extrait compte

**Role** : Generation du document : edition extrait compte.
**Variables liees** : B (P0 n° compte), H (P0 edition Tva V2), O (P. Edition Auto), X (W0 masque extrait), BD (v. Libelle edition)

---

#### <a id="t8"></a>T8 - Edition du pied

**Role** : Generation du document : Edition du pied.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t9"></a>T9 - Edition recap Free Etra

**Role** : Generation du document : Edition recap Free Etra.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t10"></a>T10 - Printer 4

**Role** : Generation du document : Printer 4.

---

#### <a id="t11"></a>T11 - edition extrait compte

**Role** : Generation du document : edition extrait compte.
**Variables liees** : B (P0 n° compte), H (P0 edition Tva V2), O (P. Edition Auto), X (W0 masque extrait), BD (v. Libelle edition)

---

#### <a id="t12"></a>T12 - edition extrait compte

**Role** : Generation du document : edition extrait compte.
**Variables liees** : B (P0 n° compte), H (P0 edition Tva V2), O (P. Edition Auto), X (W0 masque extrait), BD (v. Libelle edition)

---

#### <a id="t13"></a>T13 - Edition du pied

**Role** : Generation du document : Edition du pied.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t14"></a>T14 - Edition recap Free Etra

**Role** : Generation du document : Edition recap Free Etra.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t15"></a>T15 - Printer 6

**Role** : Generation du document : Printer 6.

---

#### <a id="t17"></a>T17 - Printer 8

**Role** : Generation du document : Printer 8.

---

#### <a id="t19"></a>T19 - Edition du pied

**Role** : Generation du document : Edition du pied.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t20"></a>T20 - Edition recap Free Etra

**Role** : Generation du document : Edition recap Free Etra.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t21"></a>T21 - Printer 9

**Role** : Generation du document : Printer 9.

---

#### <a id="t23"></a>T23 - Edition du pied

**Role** : Generation du document : Edition du pied.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)

---

#### <a id="t24"></a>T24 - Edition recap Free Etra

**Role** : Generation du document : Edition recap Free Etra.
**Variables liees** : H (P0 edition Tva V2), O (P. Edition Auto), BD (v. Libelle edition)


## 5. REGLES METIER

*(Programme d'impression - logique technique sans conditions metier)*

## 6. CONTEXTE

- **Appele par**: [Extrait de compte (IDE 69)](ADH-IDE-69.md), [Extrait Easy Check Out à J+1 (IDE 53)](ADH-IDE-53.md), [Solde Easy Check Out (IDE 64)](ADH-IDE-64.md), [Solde Easy Check Out (IDE 287)](ADH-IDE-287.md)
- **Appelle**: 5 programmes | **Tables**: 8 (W:1 R:3 L:7) | **Taches**: 24 | **Expressions**: 16

<!-- TAB:Ecrans -->

## 8. ECRANS

*(Programme sans ecran visible)*

## 9. NAVIGATION

### 9.3 Structure hierarchique (24 taches)

| Position | Tache | Type | Dimensions | Bloc |
|----------|-------|------|------------|------|
| **71.1** | [**Veuillez patienter...** (T1)](#t1) [mockup](#ecran-t1) | MDI | 432x60 | Traitement |
| 71.1.1 | [recup nom adherent (T2)](#t2) | MDI | - | |
| 71.1.2 | [Veuillez patienter... (T16)](#t16) [mockup](#ecran-t16) | MDI | 422x56 | |
| 71.1.3 | [Veuillez patienter... (T18)](#t18) [mockup](#ecran-t18) | MDI | 422x56 | |
| 71.1.4 | [Veuillez patienter... (T22)](#t22) [mockup](#ecran-t22) | MDI | 422x56 | |
| **71.2** | [**Printer 1** (T3)](#t3) | MDI | - | Impression |
| 71.2.1 | [edition extrait compte (T4)](#t4) | MDI | - | |
| 71.2.2 | [Edition du pied (T5)](#t5) | - | - | |
| 71.2.3 | [Edition recap Free Etra (T6)](#t6) | - | - | |
| 71.2.4 | [edition extrait compte (T7)](#t7) | MDI | - | |
| 71.2.5 | [Edition du pied (T8)](#t8) | - | - | |
| 71.2.6 | [Edition recap Free Etra (T9)](#t9) | - | - | |
| 71.2.7 | [Printer 4 (T10)](#t10) | MDI | - | |
| 71.2.8 | [edition extrait compte (T11)](#t11) | MDI | - | |
| 71.2.9 | [edition extrait compte (T12)](#t12) | MDI | - | |
| 71.2.10 | [Edition du pied (T13)](#t13) | - | - | |
| 71.2.11 | [Edition recap Free Etra (T14)](#t14) | - | - | |
| 71.2.12 | [Printer 6 (T15)](#t15) | MDI | - | |
| 71.2.13 | [Printer 8 (T17)](#t17) | MDI | - | |
| 71.2.14 | [Edition du pied (T19)](#t19) | - | - | |
| 71.2.15 | [Edition recap Free Etra (T20)](#t20) | - | - | |
| 71.2.16 | [Printer 9 (T21)](#t21) | MDI | - | |
| 71.2.17 | [Edition du pied (T23)](#t23) | - | - | |
| 71.2.18 | [Edition recap Free Etra (T24)](#t24) | - | - | |

### 9.4 Algorigramme

```mermaid
flowchart TD
    START([START])
    B1[Traitement (5t)]
    START --> B1
    B2[Impression (19t)]
    B1 --> B2
    WRITE[MAJ 1 tables]
    B2 --> WRITE
    ENDOK([END])
    WRITE --> ENDOK
    style START fill:#3fb950,color:#000
    style ENDOK fill:#3fb950,color:#000
    style WRITE fill:#ffeb3b,color:#000
```

> *Algorigramme simplifie base sur les blocs fonctionnels. Utiliser `/algorigramme` pour une synthese metier detaillee.*

<!-- TAB:Donnees -->

## 10. TABLES

### Tables utilisees (8)

| ID | Nom | Description | Type | R | W | L | Usages |
|----|-----|-------------|------|---|---|---|--------|
| 867 | log_maj_tpe |  | DB |   | **W** |   | 5 |
| 40 | comptable________cte |  | DB | R |   | L | 12 |
| 31 | gm-complet_______gmc |  | DB | R |   | L | 10 |
| 30 | gm-recherche_____gmr | Index de recherche | DB | R |   | L | 8 |
| 928 | type_lit |  | DB |   |   | L | 2 |
| 413 | pv_tva |  | DB |   |   | L | 1 |
| 400 | pv_cust_rentals |  | DB |   |   | L | 1 |
| 34 | hebergement______heb | Hebergement (chambres) | DB |   |   | L | 1 |

### Colonnes par table (1 / 4 tables avec colonnes identifiees)

<details>
<summary>Table 867 - log_maj_tpe (**W**) - 5 usages</summary>

*Table utilisee uniquement en Link ou aucune colonne Real identifiee dans le DataView.*

</details>

<details>
<summary>Table 40 - comptable________cte (R/L) - 12 usages</summary>

| Lettre | Variable | Acces | Type |
|--------|----------|-------|------|
| A | W1 solde compte | R | Numeric |
| B | v.retour offre | R | Logical |
| C | W1 normal | R | Alpha |
| D | W1 condense | R | Alpha |
| E | W1 detecteur papier | R | Alpha |
| F | W1 inhibe panel | R | Alpha |
| G | W1 massicot | R | Alpha |
| H | W1 selection feuille | R | Alpha |
| I | W1 selection rouleau | R | Alpha |
| J | W1 solde compte | R | Numeric |
| K | v.retour special offer | R | Logical |

</details>

<details>
<summary>Table 31 - gm-complet_______gmc (R/L) - 10 usages</summary>

*Table utilisee uniquement en Link ou aucune colonne Real identifiee dans le DataView.*

</details>

<details>
<summary>Table 30 - gm-recherche_____gmr (R/L) - 8 usages</summary>

*Table utilisee uniquement en Link ou aucune colonne Real identifiee dans le DataView.*

</details>

## 11. VARIABLES

### 11.1 Parametres entrants (11)

Variables recues du programme appelant ([Extrait de compte (IDE 69)](ADH-IDE-69.md)).

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| A | P0 societe | Alpha | - |
| B | P0 n° compte | Numeric | - |
| C | P0 filiation | Numeric | - |
| D | P0 masque montant | Alpha | 1x parametre entrant |
| E | P0 nom village | Alpha | - |
| F | P0 fictif | Logical | - |
| G | P0 date comptable | Date | - |
| H | P0 edition Tva V2 | Logical | - |
| O | P. Edition Auto | Logical | - |
| P | P.i.Nom Fichier I/O | Unicode | - |
| Q | P. Sans annulations | Logical | - |

### 11.2 Variables de session (2)

Variables persistantes pendant toute la session.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| BD | v. Libelle edition | Alpha | - |
| BE | v. Libelle Categ | Alpha | - |

### 11.3 Variables de travail (13)

Variables internes au programme.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| R | W0 titre | Alpha | - |
| S | W0 nom adherent | Alpha | - |
| T | W0 prenom adherent | Alpha | - |
| U | W0 n° adherent | Numeric | - |
| V | W0 lettre contrôle | Alpha | - |
| W | W0 filiation | Numeric | - |
| X | W0 masque extrait | Alpha | - |
| Y | W0 langue parlee | Alpha | - |
| Z | W0 chambre | Alpha | - |
| BA | W0 Date debut Sejour | Date | - |
| BB | W0 Fin debut Sejour | Date | - |
| BC | W0 code inscription | Unicode | - |
| BF | W0 devise locale | Alpha | - |

### 11.4 Autres (6)

Variables diverses.

| Lettre | Nom | Type | Usage dans |
|--------|-----|------|-----------|
| I | P_FormatPDF | Logical | 1x refs |
| J | P_Chemin | Alpha | - |
| K | P_NomFichierPDF | Alpha | - |
| L | P_Print or Mail | Alpha | - |
| M | P_Print GIFT PASS | Logical | - |
| N | P_Appel Direct | Logical | 1x refs |

<details>
<summary>Toutes les 32 variables (liste complete)</summary>

| Cat | Lettre | Nom Variable | Type |
|-----|--------|--------------|------|
| P0 | **A** | P0 societe | Alpha |
| P0 | **B** | P0 n° compte | Numeric |
| P0 | **C** | P0 filiation | Numeric |
| P0 | **D** | P0 masque montant | Alpha |
| P0 | **E** | P0 nom village | Alpha |
| P0 | **F** | P0 fictif | Logical |
| P0 | **G** | P0 date comptable | Date |
| P0 | **H** | P0 edition Tva V2 | Logical |
| P0 | **O** | P. Edition Auto | Logical |
| P0 | **P** | P.i.Nom Fichier I/O | Unicode |
| P0 | **Q** | P. Sans annulations | Logical |
| W0 | **R** | W0 titre | Alpha |
| W0 | **S** | W0 nom adherent | Alpha |
| W0 | **T** | W0 prenom adherent | Alpha |
| W0 | **U** | W0 n° adherent | Numeric |
| W0 | **V** | W0 lettre contrôle | Alpha |
| W0 | **W** | W0 filiation | Numeric |
| W0 | **X** | W0 masque extrait | Alpha |
| W0 | **Y** | W0 langue parlee | Alpha |
| W0 | **Z** | W0 chambre | Alpha |
| W0 | **BA** | W0 Date debut Sejour | Date |
| W0 | **BB** | W0 Fin debut Sejour | Date |
| W0 | **BC** | W0 code inscription | Unicode |
| W0 | **BF** | W0 devise locale | Alpha |
| V. | **BD** | v. Libelle edition | Alpha |
| V. | **BE** | v. Libelle Categ | Alpha |
| Autre | **I** | P_FormatPDF | Logical |
| Autre | **J** | P_Chemin | Alpha |
| Autre | **K** | P_NomFichierPDF | Alpha |
| Autre | **L** | P_Print or Mail | Alpha |
| Autre | **M** | P_Print GIFT PASS | Logical |
| Autre | **N** | P_Appel Direct | Logical |

</details>

## 12. EXPRESSIONS

**16 / 16 expressions decodees (100%)**

### 12.1 Repartition par type

| Type | Expressions | Regles |
|------|-------------|--------|
| CALCULATION | 1 | 0 |
| CONSTANTE | 2 | 0 |
| OTHER | 5 | 0 |
| CONDITION | 5 | 0 |
| NEGATION | 1 | 0 |
| CAST_LOGIQUE | 2 | 0 |

### 12.2 Expressions cles par type

#### CALCULATION (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CALCULATION | 10 | `Left (P0 masque montant [D],Len (RTrim (P0 masque montant [D]))-1)` | - |

#### CONSTANTE (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONSTANTE | 15 | `'Par Date / By Date'` | - |
| CONSTANTE | 14 | `'Extrait de compte / Account statement'` | - |

#### OTHER (5 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| OTHER | 4 | `SetCrsr (2)` | - |
| OTHER | 11 | `DbDel ('{867,4}'DSOURCE,'')` | - |
| OTHER | 3 | `SetCrsr (1)` | - |
| OTHER | 1 | `GetParam ('LISTINGNUMPRINTERCHOICE')` | - |
| OTHER | 2 | `IsComponent () AND NOT(P_Appel Direct [N])` | - |

#### CONDITION (5 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CONDITION | 8 | `GetParam ('CURRENTPRINTERNUM')=8` | - |
| CONDITION | 9 | `GetParam ('CURRENTPRINTERNUM')=9` | - |
| CONDITION | 7 | `GetParam ('CURRENTPRINTERNUM')=6` | - |
| CONDITION | 5 | `GetParam ('CURRENTPRINTERNUM')=1` | - |
| CONDITION | 6 | `GetParam ('CURRENTPRINTERNUM')=4` | - |

#### NEGATION (1 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| NEGATION | 12 | `NOT P_FormatPDF [I]` | - |

#### CAST_LOGIQUE (2 expressions)

| Type | IDE | Expression | Regle |
|------|-----|------------|-------|
| CAST_LOGIQUE | 16 | `'TRUE'LOG` | - |
| CAST_LOGIQUE | 13 | `INIPut('EmbedFonts=N','FALSE'LOG)` | - |

<!-- TAB:Connexions -->

## 13. GRAPHE D'APPELS

### 13.1 Chaine depuis Main (Callers)

Main -> ... -> [Extrait de compte (IDE 69)](ADH-IDE-69.md) -> **Print extrait compte /Date (IDE 71)**

Main -> ... -> [Extrait Easy Check Out à J+1 (IDE 53)](ADH-IDE-53.md) -> **Print extrait compte /Date (IDE 71)**

Main -> ... -> [Solde Easy Check Out (IDE 64)](ADH-IDE-64.md) -> **Print extrait compte /Date (IDE 71)**

Main -> ... -> [Solde Easy Check Out (IDE 287)](ADH-IDE-287.md) -> **Print extrait compte /Date (IDE 71)**

```mermaid
graph LR
    T71[71 Print extrait compt...]
    style T71 fill:#58a6ff
    CC1[1 Main Program]
    style CC1 fill:#8b5cf6
    CC66[66 Lancement Solde ECO]
    style CC66 fill:#f59e0b
    CC283[283 Easy Check-Out ===...]
    style CC283 fill:#f59e0b
    CC163[163 Menu caisse GM - s...]
    style CC163 fill:#f59e0b
    CC55[55 Easy Check-Out === ...]
    style CC55 fill:#f59e0b
    CC64[64 Solde Easy Check Out]
    style CC64 fill:#3fb950
    CC53[53 Extrait Easy Check ...]
    style CC53 fill:#3fb950
    CC287[287 Solde Easy Check Out]
    style CC287 fill:#3fb950
    CC69[69 Extrait de compte]
    style CC69 fill:#3fb950
    CC55 --> CC53
    CC66 --> CC53
    CC283 --> CC53
    CC163 --> CC53
    CC55 --> CC64
    CC66 --> CC64
    CC283 --> CC64
    CC163 --> CC64
    CC55 --> CC69
    CC66 --> CC69
    CC283 --> CC69
    CC163 --> CC69
    CC55 --> CC287
    CC66 --> CC287
    CC283 --> CC287
    CC163 --> CC287
    CC1 --> CC55
    CC1 --> CC66
    CC1 --> CC283
    CC1 --> CC163
    CC53 --> T71
    CC64 --> T71
    CC69 --> T71
    CC287 --> T71
```

### 13.2 Callers

| IDE | Nom Programme | Nb Appels |
|-----|---------------|-----------|
| [69](ADH-IDE-69.md) | Extrait de compte | 2 |
| [53](ADH-IDE-53.md) | Extrait Easy Check Out à J+1 | 1 |
| [64](ADH-IDE-64.md) | Solde Easy Check Out | 1 |
| [287](ADH-IDE-287.md) | Solde Easy Check Out | 1 |

### 13.3 Callees (programmes appeles)

```mermaid
graph LR
    T71[71 Print extrait compt...]
    style T71 fill:#58a6ff
    C75[75 Creation Pied Facture]
    T71 --> C75
    style C75 fill:#3fb950
    C21[21 Recupere devise local]
    T71 --> C21
    style C21 fill:#3fb950
    C179[179 Get Printer]
    T71 --> C179
    style C179 fill:#3fb950
    C181[181 Set Listing Number]
    T71 --> C181
    style C181 fill:#3fb950
    C182[182 Raz Current Printer]
    T71 --> C182
    style C182 fill:#3fb950
```

### 13.4 Detail Callees avec contexte

| IDE | Nom Programme | Appels | Contexte |
|-----|---------------|--------|----------|
| [75](ADH-IDE-75.md) | Creation Pied Facture | 5 | Sous-programme |
| [21](ADH-IDE-21.md) | Recupere devise local | 1 | Recuperation donnees |
| [179](ADH-IDE-179.md) | Get Printer | 1 | Impression ticket/document |
| [181](ADH-IDE-181.md) | Set Listing Number | 1 | Configuration impression |
| [182](ADH-IDE-182.md) | Raz Current Printer | 1 | Impression ticket/document |

## 14. RECOMMANDATIONS MIGRATION

### 14.1 Profil du programme

| Metrique | Valeur | Impact migration |
|----------|--------|-----------------|
| Lignes de logique | 780 | Programme volumineux |
| Expressions | 16 | Peu de logique |
| Tables WRITE | 1 | Impact faible |
| Sous-programmes | 5 | Peu de dependances |
| Ecrans visibles | 0 | Ecran unique ou traitement batch |
| Code desactive | 0.1% (1 / 780) | Code sain |
| Regles metier | 0 | Pas de regle identifiee |

### 14.2 Plan de migration par bloc

#### Traitement (5 taches: 4 ecrans, 1 traitement)

- **Strategie** : Orchestrateur avec 4 ecrans (Razor/React) et 1 traitements backend (services).
- Les ecrans deviennent des composants UI, les traitements invisibles deviennent des services injectables.
- 5 sous-programme(s) a migrer ou a reutiliser depuis les services existants.
- Decomposer les taches en services unitaires testables.

#### Impression (19 taches: 0 ecran, 19 traitements)

- **Strategie** : Templates HTML -> PDF via wkhtmltopdf ou Puppeteer.
- `PrintService` injectable avec choix imprimante

### 14.3 Dependances critiques

| Dependance | Type | Appels | Impact |
|------------|------|--------|--------|
| log_maj_tpe | Table WRITE (Database) | 5x | Schema + repository |
| [Creation Pied Facture (IDE 75)](ADH-IDE-75.md) | Sous-programme | 5x | **CRITIQUE** - Sous-programme |
| [Set Listing Number (IDE 181)](ADH-IDE-181.md) | Sous-programme | 1x | Normale - Configuration impression |
| [Raz Current Printer (IDE 182)](ADH-IDE-182.md) | Sous-programme | 1x | Normale - Impression ticket/document |
| [Recupere devise local (IDE 21)](ADH-IDE-21.md) | Sous-programme | 1x | Normale - Recuperation donnees |
| [Get Printer (IDE 179)](ADH-IDE-179.md) | Sous-programme | 1x | Normale - Impression ticket/document |

---
*Spec DETAILED generee par Pipeline V7.2 - 2026-02-07 13:44*
