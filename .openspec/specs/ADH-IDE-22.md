# ADH IDE 22 - Calcul equivalent

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_22.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 22 |
| **Fichier XML** | Prg_22.xml |
| **Description** | Calcul equivalent |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 11 |
| **Module** | ADH |
| **Dossier IDE** | Change |

> **Note**: Ce programme est Prg_22.xml. L'ID XML (22) peut differer de la position IDE (22).

---

## 2. TABLES (2 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |

---

## 3. PARAMETRES D'ENTREE (11)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | > Societe | ALPHA | - |
| P2 | > devise locale | ALPHA | - |
| P3 | > nombre de decimal | NUMERIC | - |
| P4 | > Devise | ALPHA | - |
| P5 | < cdrt devise in | LOGICAL | - |
| P6 | > mode de paiement | ALPHA | - |
| P7 | > quantite | NUMERIC | - |
| P8 | < Equivalent | NUMERIC | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|

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

> Total: 140 variables mappees

---

## 5. EXPRESSIONS (16 total, 12 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `> Uni/BI` |
| 2 | `{0,5}` | `< cdrt devise in` |
| 3 | `{0,7}` | `> quantite` |
| 4 | `''` | `''` |
| 5 | `{0,10}` | `> Type de devise` |
| 6 | `'O'` | `'O'` |
| 7 | `Fix ({0,8}*{0,17},11,{0,4})` | `Fix (< Equivalent*{0,17},11,> Devise)` |
| 8 | `Fix ({0,8}*{0,24},11,{0,4})` | `Fix (< Equivalent*{0,24},11,> Devise)` |
| 9 | `Fix ({0,8}/{0,24},11,{0,4})` | `Fix (< Equivalent/{0,24},11,> Devise)` |
| 10 | `'FALSE'LOG` | `'FALSE'LOG` |
| 11 | `{0,11}` | `{0,11}` |
| 12 | `{0,10}='A' AND {0,2}<>'B'` | `> Type de devise='A' AND > devise locale<>'B'` |
| 13 | `{0,10}='A' AND {0,2}='B'` | `> Type de devise='A' AND > devise locale='B'` |
| 14 | `{0,2}<>'B'` | `> devise locale<>'B'` |
| 15 | `{0,2}='B'` | `> devise locale='B'` |
| 16 | `{0,10}<>'A'` | `> Type de devise<>'A'` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (0 W / 2 R) |
| Parametres | 11 |
| Variables locales | 11 |
| Expressions | 16 |
| Expressions 100% decodees | 12 (75%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
