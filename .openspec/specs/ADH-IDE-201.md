# ADH IDE 201 -   Mise en synchro date/time

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_200.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 201 |
| **Fichier XML** | Prg_200.xml |
| **Description** |   Mise en synchro date/time |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Synchro Serveur |

> **Note**: Ce programme est Prg_200.xml. L'ID XML (200) peut differer de la position IDE (201).

---

## 2. TABLES (0 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | v. serveur | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-116}` | v. serveur | ALPHA | - |

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

## 5. EXPRESSIONS (7 total, 2 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'cmd /c NET TIME \\'&Trim ({0,1})&' /YES /SET'` | `'cmd /c NET TIME \\'&Trim ({0,1})&' /YES /SET'` |
| 1 | `Trim ({1,1})&MID ({0,1},Counter (0),1)` | `Trim ({1,1})&MID ({0,1},Counter (0),1)` |
| 2 | `StrToken (INIGet ('[MAGIC_SERVERS]NTSERVER'),2,',')` | `StrToken (INIGet ('[MAGIC_SERVERS]NTSERVER'),2,',')` |
| 3 | `MID ({0,1},Counter (0),1)='/' OR Len (Trim ({0,1}))<=Coun...` | `MID ({0,1},Counter (0),1)='/' OR Len (Trim ({0,1}))<=Coun...` |
| 4 | `MID ({0,1},Counter (0),1)<>'/'` | `MID ({0,1},Counter (0),1)<>'/'` |
| 5 | `{0,2}` | `{0,2}` |
| 6 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 0 (0 W / 0 R) |
| Parametres | 0 |
| Variables locales | 1 |
| Expressions | 7 |
| Expressions 100% decodees | 2 (29%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
