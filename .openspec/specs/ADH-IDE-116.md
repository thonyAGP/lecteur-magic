# ADH IDE 116 - Calcul concurrence sessions

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_116.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 116 |
| **Fichier XML** | Prg_116.xml |
| **Description** | Calcul concurrence sessions |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_116.xml. L'ID XML (116) peut differer de la position IDE (116).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #227 | `caisse_concurrences` | concurrence_sessions | **W** | 5x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | PI code calcul | ALPHA | - |
| P2 | PO coffre en cours comptage | ALPHA | - |
| P3 | coffre en cours comptage | LOGICAL | - |

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

> Total: 124 variables mappees

---

## 5. EXPRESSIONS (27 total, 25 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}='C'` | `PO coffre en cours comptage='C'` |
| 2 | `{0,1}='D'` | `PO coffre en cours comptage='D'` |
| 3 | `'C'` | `'C'` |
| 4 | `'O'` | `'O'` |
| 5 | `'O'` | `'O'` |
| 6 | `{0,3}` | `{0,3}` |
| 7 | `NOT ({0,3})` | `NOT ({0,3})` |
| 8 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 9 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'R'` | `'R'` |
| 3 | `'O'` | `'O'` |
| 4 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'R'` | `'R'` |
| 3 | `'O'` | `'O'` |
| 4 | `0` | `0` |
| 5 | `GetHostName ()` | `GetHostName ()` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'R'` | `'R'` |
| 3 | `'N'` | `'N'` |
| 4 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'R'` | `'R'` |
| 3 | `'N'` | `'N'` |
| 4 | `0` | `0` |
| 5 | `GetHostName ()` | `GetHostName ()` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 3 |
| Expressions | 27 |
| Expressions 100% decodees | 25 (93%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
