# ADH IDE 91 - Verif boutique

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_91.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 91 |
| **Fichier XML** | Prg_91.xml |
| **Description** | Verif boutique |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Factures |

> **Note**: Ce programme est Prg_91.xml. L'ID XML (91) peut differer de la position IDE (91).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #866 | `maj_appli_tpe` | maj_appli_tpe | R | 1x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-117}` | v.Existe ligne boutique ? | LOGICAL | - |

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

## 5. EXPRESSIONS (9 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P.Compte` |
| 2 | `{0,2}` | `P.Row id vente` |
| 3 | `CndRange({0,3}<>0,{0,3})` | `CndRange(P.Ligne manquante ?<>0,P.Ligne manquante ?)` |
| 4 | `'R'` | `'R'` |
| 5 | `{0,9}` | `{0,9}` |
| 6 | `1` | `1` |
| 7 | `'TRUE'LOG` | `'TRUE'LOG` |
| 8 | `NOT {0,10}` | `NOT {0,10}` |
| 9 | `'FALSE'LOG` | `'FALSE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 4 |
| Variables locales | 5 |
| Expressions | 9 |
| Expressions 100% decodees | 7 (78%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
