# ADH IDE 172 - Print Depot Obj/Dev/Sce

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_171.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 172 |
| **Fichier XML** | Prg_171.xml |
| **Description** | Print Depot Obj/Dev/Sce |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 11 |
| **Module** | ADH |
| **Dossier IDE** | Operations GM |

> **Note**: Ce programme est Prg_171.xml. L'ID XML (171) peut differer de la position IDE (172).

---

## 2. TABLES (6 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 9x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 8x |
| #41 | `cafil019_dat` | depot_objets_____doa | R | 26x |
| #42 | `cafil020_dat` | depot_devises____dda | R | 7x |
| #43 | `cafil021_dat` | solde_devises____sda | R | 6x |
| #456 | `taistart` | tai_demarrage | R | 7x |

---

## 3. PARAMETRES D'ENTREE (11)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 code adherent | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 date session | DATE | - |
| P5 | P0 heure session | TIME | - |
| P6 | P0 nom village | ALPHA | - |
| P7 | P0 user | ALPHA | - |
| P8 | P0 existe objet | ALPHA | - |
| P9 | P0 existe devise | ALPHA | - |
| P10 | P0 existe scelle | ALPHA | - |
| P11 | P0 Code scelle | ALPHA | - |
| P12 | W0 nbre d'edition | NUMERIC | - |
| P13 | W0 fin tâche | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-92}` | W0 nbre d'edition | NUMERIC | - |
| `{0,-90}` | W0 fin tâche | ALPHA | - |

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

> Total: 144 variables mappees

---

## 5. EXPRESSIONS (530 total, 274 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (1)` | `SetCrsr (1)` |
| 2 | `SetCrsr (2)` | `SetCrsr (2)` |
| 3 | `1` | `1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 8 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 9 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 2 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `{2,8}='O' AND {0,4}` | `{2,8}='O' AND P0 heure session` |
| 3 | `{2,8}='O' AND {0,5}` | `{2,8}='O' AND P0 nom village` |
| 4 | `{2,10}='O'` | `{2,10}='O'` |
| 5 | `{2,9}='O'` | `{2,9}='O'` |
| 6 | `GetParam ('VI_CLUB')` | `GetParam ('VI_CLUB')` |
| 7 | `GetParam ('VI_NAME')` | `GetParam ('VI_NAME')` |
| 8 | `GetParam ('VI_ADR1')` | `GetParam ('VI_ADR1')` |
| 9 | `GetParam ('VI_ADR2')` | `GetParam ('VI_ADR2')` |
| 10 | `GetParam ('VI_ZIPC')` | `GetParam ('VI_ZIPC')` |
| 11 | `GetParam ('VI_PHON')` | `GetParam ('VI_PHON')` |
| 12 | `GetParam ('VI_FAXN')` | `GetParam ('VI_FAXN')` |
| 13 | `GetParam ('VI_MAIL')` | `GetParam ('VI_MAIL')` |
| 14 | `GetParam ('VI_SIRE')` | `GetParam ('VI_SIRE')` |
| 15 | `GetParam ('VI_VATN')` | `GetParam ('VI_VATN')` |
| 16 | `Date ()` | `Date ()` |
| 17 | `Time ()` | `Time ()` |
| 18 | `{32768,2}` | `VG.Retour Chariot` |
| 19 | `GetParam ('GM_ADHN')` | `GetParam ('GM_ADHN')` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 6 (0 W / 6 R) |
| Parametres | 11 |
| Variables locales | 13 |
| Expressions | 530 |
| Expressions 100% decodees | 274 (52%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
