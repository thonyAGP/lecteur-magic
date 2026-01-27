# ADH IDE 42 - Controle Login Informaticien

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_42.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 42 |
| **Fichier XML** | Prg_42.xml |
| **Description** | Controle Login Informaticien |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Divers |

> **Note**: Ce programme est Prg_42.xml. L'ID XML (42) peut differer de la position IDE (42).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #740 | `pv_stockmvt_dat` | pv_stock_movements | R | 1x |

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P in societe | ALPHA | - |
| P2 | P out Accès OK | LOGICAL | - |
| P3 | P in sans message | LOGICAL | - |

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

## 5. EXPRESSIONS (7 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'FALSE'LOG` | `'FALSE'LOG` |
| 2 | `{0,1}` | `P out Accès OK` |
| 3 | `{32768,1}` | `VG.USER` |
| 4 | `'TRUE'LOG` | `'TRUE'LOG` |
| 5 | `{0,6}='INFORMATICIEN'` | `{0,6}='INFORMATICIEN'` |
| 6 | `{0,6}<>'INFORMATICIEN'` | `{0,6}<>'INFORMATICIEN'` |
| 7 | `NOT ({0,3})` | `NOT ({0,3})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 3 |
| Variables locales | 3 |
| Expressions | 7 |
| Expressions 100% decodees | 4 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
