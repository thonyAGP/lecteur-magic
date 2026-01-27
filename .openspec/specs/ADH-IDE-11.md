# ADH IDE 11 - Export - address

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_11.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 11 |
| **Fichier XML** | Prg_11.xml |
| **Description** | Export - address |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Brazil DataCatching |

> **Note**: Ce programme est Prg_11.xml. L'ID XML (11) peut differer de la position IDE (11).

---

## 2. TABLES (3 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #22 | `cafil_address_ec` | address_data_catching | **W** | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #36 | `cafil014_dat` | client_gm | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | V_Accept_Email | LOGICAL | - |

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

## 5. EXPRESSIONS (11 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,2}` | `{0,2}` |
| 2 | `{0,8}` | `{0,8}` |
| 3 | `{0,9}` | `{0,9}` |
| 4 | `{0,10}` | `{0,10}` |
| 5 | `'FALSE'LOG` | `'FALSE'LOG` |
| 6 | `'TRUE'LOG` | `'TRUE'LOG` |
| 7 | `ASCIIChr (33)` | `ASCIIChr (33)` |
| 8 | `'TRUE'LOG` | `'TRUE'LOG` |
| 9 | `INIGet ('[MAGIC_LOGICAL_NAMES]club_email_export')&'KIOema...` | `INIGet ('[MAGIC_LOGICAL_NAMES]club_email_export')&'KIOema...` |
| 10 | `IF ({0,51}<>'','0',IF ({0,56}=0,'1','2'))` | `IF ({0,51}<>'','0',IF ({0,56}=0,'1','2'))` |
| 11 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 ( W / 2 R) |
| Parametres | 0 |
| Variables locales | 1 |
| Expressions | 11 |
| Expressions 100% decodees | 6 (55%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
