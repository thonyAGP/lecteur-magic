# ADH IDE 196 - Choix Articles Gift Pass

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_195.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 196 |
| **Fichier XML** | Prg_195.xml |
| **Description** | Choix Articles Gift Pass |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Solde |

> **Note**: Ce programme est Prg_195.xml. L'ID XML (195) peut differer de la position IDE (196).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #979 | `Table_979` | Unknown | **W** | 2x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-113}` | v.GiftPassTotal | NUMERIC | - |
| `{0,-117}` | v.Solde Gift Pass | NUMERIC | - |

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

## 5. EXPRESSIONS (10 total, 2 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P.Valider` |
| 2 | `{0,6}` | `{0,6}` |
| 3 | `{0,7} > {0,8}` | `{0,7} > {0,8}` |
| 4 | `'TRUE'LOG` | `'TRUE'LOG` |
| 5 | `{0,6}>{0,5}` | `{0,6}>Btn.Cancel` |
| 6 | `'Montant : ' & Str({0,5},'12.3') & ' Gift Pass : ' & Str(...` | `'Montant : ' & Str(Btn.Cancel,'12.3') & ' Gift Pass : ' &...` |
| 7 | `{0,6} > {0,8}` | `{0,6} > {0,8}` |
| 8 | `{0,7}>{0,1}` | `{0,7}>P.Valider` |
| 1 | `{0,6}+{0,5}` | `{0,6}+Btn.Cancel` |
| 2 | `{0,6}` | `{0,6}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 6 |
| Expressions | 10 |
| Expressions 100% decodees | 2 (20%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
