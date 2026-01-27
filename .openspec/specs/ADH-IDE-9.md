# ADH IDE 9 - System avail (top left corner

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_9.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 9 |
| **Fichier XML** | Prg_9.xml |
| **Description** | System avail (top left corner |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 1 |
| **Module** | ADH |
| **Dossier IDE** | Brazil DataCatching |

> **Note**: Ce programme est Prg_9.xml. L'ID XML (9) peut differer de la position IDE (9).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #780 | `log_affec_auto_detail` | log_affec_auto_detail | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (1)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.no exit | LOGICAL | - |

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

> Total: 120 variables mappees

---

## 5. EXPRESSIONS (3 total, 2 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `NOT ({0,3})` | `NOT ({0,3})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 1 |
| Variables locales | 1 |
| Expressions | 3 |
| Expressions 100% decodees | 2 (67%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
