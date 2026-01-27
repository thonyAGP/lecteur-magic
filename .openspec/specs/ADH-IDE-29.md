# ADH IDE 29 - Write histo Fus_Sep

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_29.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 29 |
| **Fichier XML** | Prg_29.xml |
| **Description** | Write histo Fus_Sep |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Changement Compte |

> **Note**: Ce programme est Prg_29.xml. L'ID XML (29) peut differer de la position IDE (29).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #340 | `histo_fus_sep` | histo_fusionseparation | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | i type update | ALPHA | - |
| P2 | i chrono | NUMERIC | - |
| P3 | i date F/E | DATE | - |
| P4 | i heure F/E | TIME | - |
| P5 | i Valide | LOGICAL | - |

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

> Total: 128 variables mappees

---

## 5. EXPRESSIONS (13 total, 12 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,2}` | `i date F/E` |
| 2 | `{0,1}='DATEHEURE'` | `i chrono='DATEHEURE'` |
| 3 | `{0,1}='UPDFIRST'` | `i chrono='UPDFIRST'` |
| 4 | `{0,1}='UPDTABLE'` | `i chrono='UPDTABLE'` |
| 5 | `{0,1}='UPDEND'` | `i chrono='UPDEND'` |
| 6 | `{0,1}='FIN'` | `i chrono='FIN'` |
| 7 | `{0,1}='REPRISE'` | `i chrono='REPRISE'` |
| 8 | `{0,3}` | `i heure F/E` |
| 9 | `{0,4}` | `i Valide` |
| 10 | `{0,5}` | `{0,5}` |
| 11 | `Date ()` | `Date ()` |
| 12 | `Time ()` | `Time ()` |
| 13 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 5 |
| Variables locales | 5 |
| Expressions | 13 |
| Expressions 100% decodees | 12 (92%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
