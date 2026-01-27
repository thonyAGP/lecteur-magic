# ADH IDE 100 - flag ligne boutique V3

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_100.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 100 |
| **Fichier XML** | Prg_100.xml |
| **Description** | flag ligne boutique V3 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Factures V3 |

> **Note**: Ce programme est Prg_100.xml. L'ID XML (100) peut differer de la position IDE (100).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 2x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|

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

> Total: 122 variables mappees

---

## 5. EXPRESSIONS (8 total, 5 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'TRUE'LOG` | `'TRUE'LOG` |
| 2 | `'R'` | `'R'` |
| 3 | `{0,1}` | `p.Compte` |
| 4 | `{0,2}` | `{0,2}` |
| 1 | `{1,5}` | `{1,5}` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `{0,4}<>'R'` | `{0,4}<>'R'` |
| 4 | `1` | `1` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 2 |
| Expressions | 8 |
| Expressions 100% decodees | 5 (62%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
