# ADH IDE 203 - Lecture autocom

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_202.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 203 |
| **Fichier XML** | Prg_202.xml |
| **Description** | Lecture autocom |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | Telephone |

> **Note**: Ce programme est Prg_202.xml. L'ID XML (202) peut differer de la position IDE (203).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #80 | `cafil058_dat` | codes_autocom____aut | R | 1x |

---

## 3. PARAMETRES D'ENTREE (7)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | PI societe | ALPHA | - |
| P2 | PI compte | NUMERIC | - |
| P3 | PI filiation | NUMERIC | - |
| P4 | PO code | NUMERIC | - |
| P5 | PO ligne | NUMERIC | - |
| P6 | PO poste | NUMERIC | - |
| P7 | PO Existe à P | LOGICAL | - |

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

## 5. EXPRESSIONS (7 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `PI compte` |
| 2 | `{0,2}` | `PI filiation` |
| 3 | `{0,3}` | `PO code` |
| 4 | `'P'` | `'P'` |
| 5 | `{0,11}` | `{0,11}` |
| 6 | `{0,12}` | `{0,12}` |
| 7 | `{0,13}` | `{0,13}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 7 |
| Variables locales | 7 |
| Expressions | 7 |
| Expressions 100% decodees | 4 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
