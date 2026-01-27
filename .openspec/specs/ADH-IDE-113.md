# ADH IDE 113 - Test Activation ECO

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_113.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 113 |
| **Fichier XML** | Prg_113.xml |
| **Description** | Test Activation ECO |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Garantie |

> **Note**: Ce programme est Prg_113.xml. L'ID XML (113) peut differer de la position IDE (113).

---

## 2. TABLES (0 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.Compte | NUMERIC | - |
| P2 | p.Traitement | ALPHA | - |
| P3 | p.mail envoyé | LOGICAL | - |
| P4 | ftm_date_creation | ALPHA | - |

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

> Total: 126 variables mappees

---

## 5. EXPRESSIONS (4 total, 3 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Trim({0,2})&'_'&Trim(Str({0,1},'8P0'))` | `Trim(p.mail envoyé)&'_'&Trim(Str(p.Traitement,'8P0'))` |
| 2 | `'FALSE'LOG` | `'FALSE'LOG` |
| 3 | `'TRUE'LOG` | `'TRUE'LOG` |
| 4 | `Counter(0)>0 AND Range(DVal({0,4},'YYYYMMDD'),Date()-1,Da...` | `Counter(0)>0 AND Range(DVal({0,4},'YYYYMMDD'),Date()-1,Da...` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 0 (0 W / 0 R) |
| Parametres | 3 |
| Variables locales | 4 |
| Expressions | 4 |
| Expressions 100% decodees | 3 (75%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
