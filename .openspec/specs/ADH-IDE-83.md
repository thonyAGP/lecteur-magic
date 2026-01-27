# ADH IDE 83 - Deactivate all cards

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_83.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 83 |
| **Fichier XML** | Prg_83.xml |
| **Description** | Deactivate all cards |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_83.xml. L'ID XML (83) peut differer de la position IDE (83).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #312 | `ezcard` | ez_card | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.societe | ALPHA | - |
| P2 | p.code-8chiffres | NUMERIC | - |
| P3 | p.nb carte valides | NUMERIC | - |

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

## 5. EXPRESSIONS (8 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `p.code-8chiffres` |
| 2 | `{0,2}` | `p.nb carte valides` |
| 3 | `'O'` | `'O'` |
| 4 | `'V'` | `'V'` |
| 5 | `Date ()` | `Date ()` |
| 6 | `Time ()` | `Time ()` |
| 7 | `{32768,1}` | `VG.USER` |
| 8 | `{0,3}+1` | `{0,3}+1` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 3 |
| Variables locales | 3 |
| Expressions | 8 |
| Expressions 100% decodees | 7 (88%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
