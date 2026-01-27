# ADH IDE 35 - Write histo_Fus_Sep_Log

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_35.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 35 |
| **Fichier XML** | Prg_35.xml |
| **Description** | Write histo_Fus_Sep_Log |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | Changement Compte |

> **Note**: Ce programme est Prg_35.xml. L'ID XML (35) peut differer de la position IDE (35).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #342 | `histo_fus_sep_log` | histo__fusionseparation_log | **W** | 2x |

---

## 3. PARAMETRES D'ENTREE (7)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | i.mode Reprise | LOGICAL | - |
| P2 | i.chrono F/E | NUMERIC | - |
| P3 | i.chrono LOG | NUMERIC | - |
| P4 | i.code | ALPHA | - |
| P5 | i.texte | ALPHA | - |
| P6 | i.status | ALPHA | - |
| P7 | i.type F/E | ALPHA | - |

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

> Total: 132 variables mappees

---

## 5. EXPRESSIONS (23 total, 20 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 2 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{0,2}` | `i.chrono LOG` |
| 2 | `IF ({0,1},{0,3},0)` | `IF (i.chrono F/E,i.code,0)` |
| 3 | `{0,4}` | `i.texte` |
| 4 | `{0,5}` | `i.status` |
| 5 | `{0,6}` | `i.type F/E` |
| 6 | `Date ()` | `Date ()` |
| 7 | `Time ()` | `Time ()` |
| 8 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 9 | `{32768,1}` | `VG.USER` |
| 10 | `{0,7}` | `{0,7}` |
| 1 | `{0,2}` | `i.chrono LOG` |
| 2 | `IF ({0,1},{0,3},0)` | `IF (i.chrono F/E,i.code,0)` |
| 3 | `{0,4}` | `i.texte` |
| 4 | `{0,5}` | `i.status` |
| 5 | `{0,6}` | `i.type F/E` |
| 6 | `Date ()` | `Date ()` |
| 7 | `Time ()` | `Time ()` |
| 8 | `0` | `0` |
| 9 | `{32768,1}` | `VG.USER` |
| 10 | `{0,7}` | `{0,7}` |
| 11 | `{0,18}` | `{0,18}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 7 |
| Variables locales | 7 |
| Expressions | 23 |
| Expressions 100% decodees | 20 (87%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
