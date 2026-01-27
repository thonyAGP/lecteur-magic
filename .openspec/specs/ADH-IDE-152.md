# ADH IDE 152 - Recup Classe et Lib du MOP

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_152.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 152 |
| **Fichier XML** | Prg_152.xml |
| **Description** | Recup Classe et Lib du MOP |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_152.xml. L'ID XML (152) peut differer de la position IDE (152).

---

## 2. TABLES (3 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #89 | `cafil067_dat` | moyen_paiement___mop | R | 1x |
| #140 | `cafil118_dat` | moyen_paiement___mop | R | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param MOP | ALPHA | - |
| P3 | Param Classe MOP | ALPHA | - |
| P4 | Param UNI/BI | ALPHA | - |
| P5 | Param Libelle MOP | ALPHA | - |
| P6 | Param existence MOP | LOGICAL | - |

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

> Total: 130 variables mappees

---

## 5. EXPRESSIONS (10 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,4}<>'B'` | `Param Libelle MOP<>'B'` |
| 2 | `{0,4}='B'` | `Param Libelle MOP='B'` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{0,3}` | `Param UNI/BI` |
| 4 | `{0,4}` | `Param Libelle MOP` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{0,3}` | `Param UNI/BI` |
| 4 | `{0,4}` | `Param Libelle MOP` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (0 W / 3 R) |
| Parametres | 6 |
| Variables locales | 6 |
| Expressions | 10 |
| Expressions 100% decodees | 6 (60%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
