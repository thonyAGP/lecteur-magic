# ADH IDE 80 -    Card scan read

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_80.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 80 |
| **Fichier XML** | Prg_80.xml |
| **Description** |    Card scan read |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_80.xml. L'ID XML (80) peut differer de la position IDE (80).

---

## 2. TABLES (2 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #312 | `ezcard` | ez_card | R | 1x |

---

## 3. PARAMETRES D'ENTREE (7)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.code-8chiffres | NUMERIC | - |
| P2 | p.filiation | NUMERIC | - |
| P3 | p.chaine U | ALPHA | - |
| P4 | p.chaine U10 | ALPHA | - |
| P5 | p.Club Med Pass select | LOGICAL | - |
| P6 | pv.card id | ALPHA | - |
| P7 | p.status | ALPHA | - |
| P8 | r.card | LOGICAL | - |

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

> Total: 134 variables mappees

---

## 5. EXPRESSIONS (15 total, 3 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `''` | `''` |
| 2 | `{0,8}` | `{0,8}` |
| 3 | `{0,15}` | `{0,15}` |
| 4 | `{0,16}` | `{0,16}` |
| 5 | `Left ({0,17},1)` | `Left ({0,17},1)` |
| 6 | `Right (Trim ({0,17}),Len (Trim ({0,17}))-1)` | `Right (Trim ({0,17}),Len (Trim ({0,17}))-1)` |
| 7 | `'TRUE'LOG` | `'TRUE'LOG` |
| 8 | `{0,13}` | `{0,13}` |
| 9 | `{0,10}` | `{0,10}` |
| 10 | `{0,11}` | `{0,11}` |
| 11 | `{0,12}` | `{0,12}` |
| 12 | `NOT ({0,8})` | `NOT ({0,8})` |
| 13 | `{0,8}` | `{0,8}` |
| 14 | `{0,6}` | `p.status` |
| 15 | `{0,6}>'' AND NOT ({0,8})` | `p.status>'' AND NOT ({0,8})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (0 W / 2 R) |
| Parametres | 7 |
| Variables locales | 8 |
| Expressions | 15 |
| Expressions 100% decodees | 3 (20%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
