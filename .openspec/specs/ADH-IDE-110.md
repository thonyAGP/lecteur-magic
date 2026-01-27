# ADH IDE 110 - Print creation garanti PMS-584

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_110.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 110 |
| **Fichier XML** | Prg_110.xml |
| **Description** | Print creation garanti PMS-584 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 9 |
| **Module** | ADH |
| **Dossier IDE** | Garantie |

> **Note**: Ce programme est Prg_110.xml. L'ID XML (110) peut differer de la position IDE (110).

---

## 2. TABLES (8 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #39 | `cafil017_dat` | depot_garantie___dga | R | 7x |
| #91 | `cafil069_dat` | garantie_________gar | R | 7x |
| #368 | `pmsvillage` | pms_village | R | 1x |
| #818 | `zcircafil146` | Circuit supprime | R | 1x |
| #878 | `categorie_operation_mw` | categorie_operation_mw | R | 2x |

---

## 3. PARAMETRES D'ENTREE (9)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 code adherent | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 nom village | ALPHA | - |
| P5 | P0 masque montant | ALPHA | - |
| P6 | W0 nom | ALPHA | - |
| P7 | W0 prenom | ALPHA | - |
| P8 | W0 n° adherent | NUMERIC | - |
| P9 | W0 lettre contrôle | ALPHA | - |
| P10 | W0 filiation | NUMERIC | - |
| P11 | v.comment | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-99}` | W0 nom | ALPHA | - |
| `{0,-98}` | W0 prenom | ALPHA | - |
| `{0,-97}` | W0 n° adherent | NUMERIC | - |
| `{0,-96}` | W0 lettre contrôle | ALPHA | - |
| `{0,-95}` | W0 filiation | NUMERIC | - |
| `{0,-93}` | W0 Chambre | ALPHA | - |
| `{0,-91}` | W0 date de debut | DATE | - |
| `{0,-90}` | W0 date de fin | DATE | - |
| `{0,-83}` | W0 TPE ICMP | LOGICAL | - |
| `{0,-94}` | v.comment | ALPHA | - |

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

> Total: 156 variables mappees

---

## 5. EXPRESSIONS (198 total, 137 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `GetParam ('CURRENTLISTINGNUM')` | `GetParam ('CURRENTLISTINGNUM')` |
| 3 | `Trim ({0,20})&' '&Trim ({0,21})&' '&Trim ({0,22})` | `Trim ({0,20})&' '&Trim ({0,21})&' '&Trim ({0,22})` |
| 4 | `SetCrsr (1)` | `SetCrsr (1)` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=1 OR {32768,82}='TB'` | `GetParam ('CURRENTPRINTERNUM')=1 OR VG.VG SUPPORT (Tablet...` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 8 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 9 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 10 | `'GL1'` | `'GL1'` |
| 11 | `'GL2'` | `'GL2'` |
| 12 | `'TRUE'LOG` | `'TRUE'LOG` |
| 13 | `Translate ('%TempDir%ticket_garant_'&Str({0,2},'8P0')&
'...` | `Translate ('%TempDir%ticket_garant_'&Str(P0 filiation,'8P...` |
| 14 | `{0,8}=''` | `P0 fichier signature=''` |
| 15 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 16 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 1 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 2 | `FileDelete({1,9})` | `FileDelete({1,9})` |
| 3 | `FileExist({1,9})` | `FileExist({1,9})` |
| 1 | `'CLUB MED '&Upper(GetParam ('VI_CLUB'))` | `'CLUB MED '&Upper(GetParam ('VI_CLUB'))` |
| 2 | `GetParam ('VI_NAME')` | `GetParam ('VI_NAME')` |
| 3 | `GetParam ('VI_ADR1')` | `GetParam ('VI_ADR1')` |
| 4 | `GetParam ('VI_ADR2')` | `GetParam ('VI_ADR2')` |
| 5 | `GetParam ('VI_ZIPC')` | `GetParam ('VI_ZIPC')` |
| 6 | `'Tel/Phone: '&GetParam ('VI_PHON')` | `'Tel/Phone: '&GetParam ('VI_PHON')` |
| 7 | `'Email: '&GetParam ('VI_FAXN')` | `'Email: '&GetParam ('VI_FAXN')` |
| 8 | `GetParam ('VI_MAIL')` | `GetParam ('VI_MAIL')` |
| 9 | `GetParam ('VI_SIRE')` | `GetParam ('VI_SIRE')` |
| 10 | `GetParam ('VI_VATN')` | `GetParam ('VI_VATN')` |
| 11 | `{2,1}` | `{2,1}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 8 (0 W / 8 R) |
| Parametres | 9 |
| Variables locales | 19 |
| Expressions | 198 |
| Expressions 100% decodees | 137 (69%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
