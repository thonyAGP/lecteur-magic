# ADH IDE 205 - Verification pooling

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_204.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 205 |
| **Fichier XML** | Prg_204.xml |
| **Description** | Verification pooling |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Telephone |

> **Note**: Ce programme est Prg_204.xml. L'ID XML (204) peut differer de la position IDE (205).

---

## 2. TABLES (2 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #476 | `%club_user%_caisse_cpte_chgt_act` | comptes_pour_changer_activite | **W** | 4x |
| #63 | `cafil041_dat` | parametres___par | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

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

> Total: 118 variables mappees

---

## 5. EXPRESSIONS (32 total, 22 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'C'` | `'C'` |
| 2 | `1` | `1` |
| 3 | `2` | `2` |
| 4 | `{0,3}='O'` | `{0,3}='O'` |
| 5 | `{0,3}='O' OR {0,6}='O'` | `{0,3}='O' OR {0,6}='O'` |
| 6 | `{0,3}='N' AND {0,6}='N'` | `{0,3}='N' AND {0,6}='N'` |
| 7 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 8 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `'COM'` | `'COM'` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 1 | `'COM'` | `'COM'` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `GetHostName ()` | `GetHostName ()` |
| 1 | `{0,1}` | `{0,1}` |
| 2 | `Time ()` | `Time ()` |
| 3 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 4 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `'FALSE'LOG` | `'FALSE'LOG` |
| 4 | `{0,1}` | `{0,1}` |
| 5 | `Time ()-{1,2}>'00:00:30'TIME` | `Time ()-{1,2}>'00:00:30'TIME` |
| 6 | `Time ()-{1,2}` | `Time ()-{1,2}` |
| 7 | `MlsTrans ('Verification de connexion des Poolings')` | `MlsTrans ('Verification de connexion des Poolings')` |
| 1 | `GetHostName ()` | `GetHostName ()` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `'FALSE'LOG` | `'FALSE'LOG` |
| 4 | `{0,1}` | `{0,1}` |
| 5 | `Time ()-{1,2}>'00:00:30'TIME` | `Time ()-{1,2}>'00:00:30'TIME` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 ( W /  R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 32 |
| Expressions 100% decodees | 22 (69%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
