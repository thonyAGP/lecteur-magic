# ADH IDE 159 - Selection Identification

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_158.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 159 |
| **Fichier XML** | Prg_158.xml |
| **Description** | Selection Identification |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Identification |

> **Note**: Ce programme est Prg_158.xml. L'ID XML (158) peut differer de la position IDE (159).

---

## 2. TABLES (2 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #602 | `%club_user%tmp_listsce_dat` | tempo_liste_service | **W** | 4x |
| #844 | `%club_user%_stat_vendeur` | stat_vendeur | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-93}` | v.Type Liste | ALPHA | - |
| `{0,-92}` | v.Date | DATE | - |
| `{0,-91}` | v.Categorie | ALPHA | - |
| `{0,-90}` | v.Seminaire | ALPHA | - |
| `{0,-89}` | v.Lieu Sejour | ALPHA | - |
| `{0,-88}` | v.Tri | ALPHA | - |
| `{0,-87}` | v.Fidelisation | ALPHA | - |
| `{0,-77}` | v.SB Visible | LOGICAL | - |

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

> Total: 146 variables mappees

---

## 5. EXPRESSIONS (37 total, 32 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'N'` | `'N'` |
| 2 | `'1'` | `'1'` |
| 3 | `Date()` | `Date()` |
| 4 | `MlsTrans('Toutes')` | `MlsTrans('Toutes')` |
| 5 | `'T'` | `'T'` |
| 6 | `'C'` | `'C'` |
| 7 | `{0,2}` | `v.Categorie` |
| 8 | `ASCIIChr(33)` | `ASCIIChr(33)` |
| 9 | `'A'` | `'A'` |
| 10 | `'M'` | `'M'` |
| 11 | `0` | `0` |
| 12 | `'TRUE'LOG` | `'TRUE'LOG` |
| 13 | `{32768,21}` | `VG.COMBO LIEU SEJOUR` |
| 14 | `DStr({0,2},'YYYYMMDD')` | `DStr(v.Categorie,'YYYYMMDD')` |
| 15 | `'SB_LISTE_GM'` | `'SB_LISTE_GM'` |
| 16 | `{32768,20}>1` | `VG.NB LIEU SEJOUR>1` |
| 17 | `{0,1}='S'` | `v.Date='S'` |
| 18 | `'FALSE'LOG` | `'FALSE'LOG` |
| 19 | `{0,12}` | `CHG_REASON_v.Fidelisation` |
| 20 | `CtrlGoto('SB_LISTE_GM',0,0)` | `CtrlGoto('SB_LISTE_GM',0,0)` |
| 21 | `Trim({0,7})='C'` | `Trim(Nb Fid)='C'` |
| 22 | `{0,7}` | `Nb Fid` |
| 23 | `DbDel('{602,4}'DSOURCE,'')` | `DbDel('{602,4}'DSOURCE,'')` |
| 24 | `DbDel('{612,4}'DSOURCE,'')` | `DbDel('{612,4}'DSOURCE,'')` |
| 25 | `'Tri : '&{0,6}&' Date : '&DStr({0,2},'DD/MM/YYYY')` | `'Tri : '&v.Fidelisation&' Date : '&DStr(v.Categorie,'DD/M...` |
| 26 | `IF({0,3}=MlsTrans('Toutes'),'',{0,3})` | `IF(v.Seminaire=MlsTrans('Toutes'),'',v.Seminaire)` |
| 1 | `{32768,11}` | `VG.CODE LANGUE USER` |
| 2 | `{0,2}` | `v.Categorie` |
| 3 | `{0,3}` | `v.Seminaire` |
| 4 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (2 W / 0 R) |
| Parametres | 2 |
| Variables locales | 14 |
| Expressions | 37 |
| Expressions 100% decodees | 32 (86%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
