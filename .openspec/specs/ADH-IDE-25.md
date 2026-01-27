# ADH IDE 25 - Change GM

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_25.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 25 |
| **Fichier XML** | Prg_25.xml |
| **Description** | Change GM |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 16 |
| **Module** | ADH |
| **Dossier IDE** | Change |

> **Note**: Ce programme est Prg_25.xml. L'ID XML (25) peut differer de la position IDE (25).

---

## 2. TABLES (14 tables - 7 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #23 | `cafil001_dat` | reseau_cloture___rec | **W** | 5x |
| #44 | `cafil022_dat` | change___________chg | **W** | 4x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 2x |
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 1x |
| #147 | `cafil125_dat` | change_vente_____chg | **W** | 4x |
| #474 | `%club_user%_caisse_compcais_devise` | comptage_caisse_devise | **W** | 3x |
| #945 | `Table_945` | Unknown | **W** | 1x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 2x |
| #35 | `cafil013_dat` | personnel_go______go | R | 1x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 2x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #124 | `cafil102_dat` | type_taux_change | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 3x |
| #141 | `cafil119_dat` | devises__________dev | R | 1x |

---

## 3. PARAMETRES D'ENTREE (16)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | > societe | ALPHA | - |
| P2 | > code GM | NUMERIC | - |
| P3 | > filiation | NUMERIC | - |
| P4 | >devise locale | ALPHA | - |
| P5 | >nb decimale | NUMERIC | - |
| P6 | >masque mtt | ALPHA | - |
| P7 | > code retour | ALPHA | - |
| P8 | > nom village | ALPHA | - |
| P9 | > solde compte | NUMERIC | - |
| P10 | > etat compte | ALPHA | - |
| P11 | > date solde | DATE | - |
| P12 | > garanti O/N | ALPHA | - |
| P13 | > telephone | ALPHA | - |
| P14 | > fax | ALPHA | - |
| P15 | V0 choix action | ALPHA | - |
| P16 | W0 date comptable | DATE | - |
| P17 | W0 n° de change | NUMERIC | - |
| P18 | W0 date operation | DATE | - |
| P19 | W0 heure operation | TIME | - |
| P20 | W0 pas d'enreg | ALPHA | - |
| P21 | W0 user | ALPHA | - |
| P22 | W0 reseau | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-76}` | V0 choix action | ALPHA | - |
| `{0,-75}` | W0 date comptable | DATE | - |
| `{0,-74}` | W0 n° de change | NUMERIC | - |
| `{0,-73}` | W0 date operation | DATE | - |
| `{0,-72}` | W0 heure operation | TIME | - |
| `{0,-71}` | W0 pas d'enreg | ALPHA | - |
| `{0,-70}` | W0 user | ALPHA | - |
| `{0,-69}` | W0 reseau | ALPHA | - |
| `{0,-58}` | V.Code retour go ? | LOGICAL | - |
| `{0,-65}` | V. titre | ALPHA | - |
| `{0,-60}` | V.Type operation | ALPHA | - |

### 4.2 Variables globales (VG)

| Ref | Decode | Role |
|-----|--------|------|
| `{32768,0}` | VG.LOGIN | - |
| `{32768,1}` | VG.USER | - |
| `{32768,2}` | VG.Retour Chariot | - |
| `{32768,3}` | VG.DROIT ACCES IT ? | - |
| `{32768,4}` | VG.DROIT ACCES CAISSE ? | - |
| `{32768,5}` | VG.BRAZIL DATACATCHING? | - |
| `{32768,6}` | VG.USE MDR | - |
| `{32768,7}` | VG.VRL ACTIF ? | - |
| `{32768,8}` | VG.ECI ACTIF ? | - |
| `{32768,9}` | VG.COMPTE CASH ACTIF ? | - |
| `{32768,10}` | VG.IND SEJ PAYE ACTIF ? | - |
| `{32768,11}` | VG.CODE LANGUE USER | - |
| `{32768,12}` | VG.EFFECTIF ACTIF ? | - |
| `{32768,13}` | VG.TAXE SEJOUR ACTIF ? | - |
| `{32768,14}` | VG.N° version | - |

> Total: 180 variables mappees

---

## 5. EXPRESSIONS (285 total, 158 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}=''` | `> code GM=''` |
| 2 | `'C'` | `'C'` |
| 3 | `Trim ({0,34})` | `Trim ({0,34})` |
| 4 | `55` | `55` |
| 5 | `'&Quitter'` | `'&Quitter'` |
| 6 | `'&Annuler'` | `'&Annuler'` |
| 7 | `'&Creer change'` | `'&Creer change'` |
| 8 | `{0,1}` | `> code GM` |
| 9 | `{0,17}<>'F'` | `W0 date comptable<>'F'` |
| 10 | `{0,17}='F'` | `W0 date comptable='F'` |
| 11 | `{0,26}` | `Btn Annuler` |
| 12 | `{32768,1}` | `VG.USER` |
| 13 | `{0,24}<>'R'` | `V.Code retour go ?<>'R'` |
| 14 | `{0,15}='B'` | `> Nouvelle caisse='B'` |
| 15 | `'A'` | `'A'` |
| 16 | `{0,15}<>'B'` | `> Nouvelle caisse<>'B'` |
| 17 | `'F'` | `'F'` |
| 18 | `{0,36}=''` | `{0,36}=''` |
| 19 | `{0,2}` | `> filiation` |
| 20 | `{0,3}` | `>devise locale` |
| 21 | `{0,36}='A'` | `{0,36}='A'` |
| 22 | `{0,36}='V'` | `{0,36}='V'` |
| 23 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 24 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{32768,2}` | `VG.Retour Chariot` |
| 2 | `Date ()` | `Date ()` |
| 3 | `Trim ({0,30})` | `Trim (V.Type operation)` |
| 4 | `89` | `89` |
| 5 | `{1,1}` | `{1,1}` |
| 6 | `{1,2}` | `{1,2}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 14 (7 W / 7 R) |
| Parametres | 16 |
| Variables locales | 31 |
| Expressions | 285 |
| Expressions 100% decodees | 158 (55%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
