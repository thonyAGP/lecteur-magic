# ADH IDE 181 - Set Listing Number

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_180.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 181 |
| **Fichier XML** | Prg_180.xml |
| **Description** | Set Listing Number |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 1 |
| **Module** | ADH |
| **Dossier IDE** | Printer Management |

> **Note**: Ce programme est Prg_180.xml. L'ID XML (180) peut differer de la position IDE (181).

---

## 2. TABLES (0 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|

---

## 3. PARAMETRES D'ENTREE (1)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param Listing number | NUMERIC | - |

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

## 5. EXPRESSIONS (5 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetParam ('CURRENTLISTINGNUM',{0,1})` | `SetParam ('CURRENTLISTINGNUM',{0,1})` |
| 2 | `SetParam ('CURRENTPRINTERNUM',0)` | `SetParam ('CURRENTPRINTERNUM',0)` |
| 3 | `SetParam ('CURRENTPRINTERNAME','VOID')` | `SetParam ('CURRENTPRINTERNAME','VOID')` |
| 4 | `SetParam ('NUMBERCOPIES',0)` | `SetParam ('NUMBERCOPIES',0)` |
| 5 | `GetParam ('SPECIFICPRINT')='VOID'` | `GetParam ('SPECIFICPRINT')='VOID'` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 0 (0 W / 0 R) |
| Parametres | 1 |
| Variables locales | 1 |
| Expressions | 5 |
| Expressions 100% decodees | 4 (80%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
