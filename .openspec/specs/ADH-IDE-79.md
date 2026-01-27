# ADH IDE 79 - Balance Credit de conso

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_79.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 79 |
| **Fichier XML** | Prg_79.xml |
| **Description** | Balance Credit de conso |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_79.xml. L'ID XML (79) peut differer de la position IDE (79).

---

## 2. TABLES (6 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #268 | `ccpartyp` | cc_total_par_type | **W** | 16x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 15x |
| #69 | `cafil047_dat` | initialisation___ini | R | 1x |
| #271 | `cctotal` | cc_total | R | 15x |
| #272 | `cctypdet` | cc_type_detail | R | 8x |
| #273 | `cctype` | cc_type | R | 16x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.societe | ALPHA | - |
| P2 | p.code-8chiffres | NUMERIC | - |
| P3 | p.filiation | NUMERIC | - |
| P4 | p.masque montant | ALPHA | - |
| P5 | v.nom village | ALPHA | - |
| P6 | v.masque-mtt | ALPHA | - |
| P7 | v.code-devise | ALPHA | - |
| P8 | v.detail | LOGICAL | - |
| P9 | bt.detail | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-97}` | v.solde_credit_conso | NUMERIC | - |
| `{0,-102}` | v.nom village | ALPHA | - |
| `{0,-101}` | v.masque-mtt | ALPHA | - |
| `{0,-100}` | v.code-devise | ALPHA | - |
| `{0,-99}` | v.detail | LOGICAL | - |

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

> Total: 138 variables mappees

---

## 5. EXPRESSIONS (479 total, 385 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `LastClicked ()='PRINT'` | `LastClicked ()='PRINT'` |
| 2 | `LastClicked ()='PRINTDETAIL'` | `LastClicked ()='PRINTDETAIL'` |
| 3 | `MlsTrans ('Balance des credits de consommation bar')` | `MlsTrans ('Balance des credits de consommation bar')` |
| 4 | `{0,8}` | `v.detail` |
| 5 | `{0,5}` | `v.nom village` |
| 6 | `{0,6}` | `v.masque-mtt` |
| 7 | `{0,7}` | `v.code-devise` |
| 8 | `{32768,1}` | `VG.USER` |
| 9 | `Date ()` | `Date ()` |
| 10 | `Trim ({0,16})&' '&Trim ({0,15})` | `Trim ({0,16})&' '&Trim ({0,15})` |
| 11 | `{0,1}` | `p.code-8chiffres` |
| 12 | `{0,2}` | `p.filiation` |
| 13 | `{0,3}` | `p.masque montant` |
| 14 | `IF ({0,24},'Quit Detail','Detail')` | `IF ({0,24},'Quit Detail','Detail')` |
| 15 | `NOT ({0,24})` | `NOT ({0,24})` |
| 16 | `'FALSE'LOG` | `'FALSE'LOG` |
| 17 | `'N'&Left (Right ({0,4},13),12)` | `'N'&Left (Right (v.solde_credit_conso,13),12)` |
| 18 | `2` | `2` |
| 19 | `38` | `38` |
| 20 | `39` | `39` |
| 21 | `0` | `0` |
| 22 | `0` | `0` |
| 23 | `0` | `0` |
| 1 | `{0,2}` | `p.filiation` |
| 2 | `'N'&Right ('## ### ### ###'&Left ('.',{0,4})&Fill ('#',{0...` | `'N'&Right ('## ### ### ###'&Left ('.',v.solde_credit_cons...` |
| 3 | `{0,3}` | `p.masque montant` |
| 1 | `NOT ({1,24}) OR {1,24} AND Level (1)='RP'` | `NOT ({1,24}) OR {1,24} AND Level (1)='RP'` |
| 2 | `{1,1}` | `{1,1}` |
| 3 | `{1,2}` | `{1,2}` |
| 4 | `{1,3}` | `{1,3}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 6 ( W / 5 R) |
| Parametres | 4 |
| Variables locales | 10 |
| Expressions | 479 |
| Expressions 100% decodees | 385 (80%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
