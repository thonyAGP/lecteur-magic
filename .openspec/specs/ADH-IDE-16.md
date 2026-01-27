# ADH IDE 16 - Browse - Countries iso

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_16.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 16 |
| **Fichier XML** | Prg_16.xml |
| **Description** | Browse - Countries iso |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Brazil DataCatching |

> **Note**: Ce programme est Prg_16.xml. L'ID XML (16) peut differer de la position IDE (16).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #784 | `type_repas_nenc_vill` | type_repas_nenc_vill | **W** | 3x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | PARAM LANGUAGE | ALPHA | - |
| P2 | PARAM COUNTRY CODE ISO | ALPHA | - |

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

## 5. EXPRESSIONS (11 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `GetParam ('LANGUAGE')<>'FRE'` | `GetParam ('LANGUAGE')<>'FRE'` |
| 2 | `GetParam ('LANGUAGE')='FRE'` | `GetParam ('LANGUAGE')='FRE'` |
| 3 | `GetParam ('LANGUAGE')='SPA'` | `GetParam ('LANGUAGE')='SPA'` |
| 1 | `CndRange ({1,2}<>'',{1,2})` | `CndRange ({1,2}<>'',{1,2})` |
| 2 | `{0,1}` | `PARAM COUNTRY CODE ISO` |
| 1 | `CndRange ({1,2}<>'',{1,2})` | `CndRange ({1,2}<>'',{1,2})` |
| 2 | `{0,1}` | `PARAM COUNTRY CODE ISO` |
| 1 | `74` | `74` |
| 2 | `75` | `75` |
| 3 | `CndRange ({1,2}<>'',{1,2})` | `CndRange ({1,2}<>'',{1,2})` |
| 4 | `{0,2}` | `{0,2}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 2 |
| Expressions | 11 |
| Expressions 100% decodees | 7 (64%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
