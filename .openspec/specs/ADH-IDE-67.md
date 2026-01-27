# ADH IDE 67 - Reedition Recap Easy Check Out

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_67.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 67 |
| **Fichier XML** | Prg_67.xml |
| **Description** | Reedition Recap Easy Check Out |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Extrait de Compte |

> **Note**: Ce programme est Prg_67.xml. L'ID XML (67) peut differer de la position IDE (67).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #934 | `selection_enregistrement_div` | selection enregistrement diver | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-69}` | v.Date Récapitulatif | DATE | - |
| `{0,-68}` | v.Mode Test | LOGICAL | - |
| `{0,-67}` | v.Erreurs Seules | LOGICAL | - |
| `{0,-65}` | v.retour log easy check out | LOGICAL | - |

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

> Total: 126 variables mappees

---

## 5. EXPRESSIONS (6 total, 5 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `v.Mode Test` |
| 2 | `CndRange({0,3},'TRUE'LOG)` | `CndRange(v.retour log easy check out,'TRUE'LOG)` |
| 3 | `CndRange({0,2},'TRUE'LOG)` | `CndRange(v.Erreurs Seules,'TRUE'LOG)` |
| 4 | `Date()` | `Date()` |
| 5 | `{32768,91}` | `VG.Verification PLBS par PES` |
| 6 | `NOT({0,4})` | `NOT({0,4})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 4 |
| Expressions | 6 |
| Expressions 100% decodees | 5 (83%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
