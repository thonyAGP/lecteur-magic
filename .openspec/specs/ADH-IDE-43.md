# ADH IDE 43 - Recuperation du titre

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_43.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 43 |
| **Fichier XML** | Prg_43.xml |
| **Description** | Recuperation du titre |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Divers |

> **Note**: Ce programme est Prg_43.xml. L'ID XML (43) peut differer de la position IDE (43).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #719 | `arc_bartransacdet` | arc_transac_detail_bar | R | 1x |

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | > code ecran | NUMERIC | - |
| P2 | < nom ecran | ALPHA | - |
| P3 | > type prog (CA si vide) | ALPHA | - |

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

## 5. EXPRESSIONS (4 total, 2 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `GetParam ('CODELANGUE')` | `GetParam ('CODELANGUE')` |
| 2 | `{0,1}` | `< nom ecran` |
| 3 | `IF ({0,3}='','CA',{0,3})` | `IF ({0,3}='','CA',{0,3})` |
| 4 | `Trim ({0,7})&' - '&Trim ({0,8})` | `Trim ({0,7})&' - '&Trim ({0,8})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 3 |
| Variables locales | 3 |
| Expressions | 4 |
| Expressions 100% decodees | 2 (50%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
