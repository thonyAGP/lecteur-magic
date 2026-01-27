# ADH IDE 68 -  Saisie date

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_68.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 68 |
| **Fichier XML** | Prg_68.xml |
| **Description** |  Saisie date |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Extrait de Compte |

> **Note**: Ce programme est Prg_68.xml. L'ID XML (68) peut differer de la position IDE (68).

---

## 2. TABLES (0 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | > date comptable | DATE | - |
| P2 | < date min | DATE | - |
| P3 | < date max | DATE | - |
| P4 | v.date Min | DATE | - |
| P5 | v.date Max | DATE | - |
| P6 | v. ok | LOGICAL | - |
| P7 | Bouton Ok | ALPHA | - |
| P8 | v.titre | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-106}` | v.date Min | DATE | - |
| `{0,-105}` | v.date Max | DATE | - |
| `{0,-104}` | v. ok | LOGICAL | - |
| `{0,-102}` | v.titre | ALPHA | - |

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

## 5. EXPRESSIONS (10 total, 9 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `< date min` |
| 2 | `Trim ({0,8})` | `Trim ({0,8})` |
| 3 | `123` | `123` |
| 4 | `Date ()` | `Date ()` |
| 5 | `{32768,2}` | `VG.Retour Chariot` |
| 6 | `{0,4}` | `v.date Max` |
| 7 | `{0,5}` | `v. ok` |
| 8 | `'00/00/0000'DATE` | `'00/00/0000'DATE` |
| 9 | `NOT ({0,6})` | `NOT (Bouton Ok)` |
| 10 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 0 (0 W / 0 R) |
| Parametres | 3 |
| Variables locales | 8 |
| Expressions | 10 |
| Expressions 100% decodees | 9 (90%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
