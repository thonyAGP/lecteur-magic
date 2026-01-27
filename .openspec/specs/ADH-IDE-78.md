# ADH IDE 78 - Print Ventes Club Med Pass

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_78.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 78 |
| **Fichier XML** | Prg_78.xml |
| **Description** | Print Ventes Club Med Pass |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_78.xml. L'ID XML (78) peut differer de la position IDE (78).

---

## 2. TABLES (4 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #15 | `bartransacent` | transac_entete_bar | R | 7x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 7x |
| #69 | `cafil047_dat` | initialisation___ini | R | 1x |
| #271 | `cctotal` | cc_total | R | 7x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 Societe | ALPHA | - |
| P2 | P0 compte | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 masque montant | ALPHA | - |
| P5 | P0 action | ALPHA | - |
| P6 | v.nom village | ALPHA | - |
| P7 | v.masque-mtt | ALPHA | - |
| P8 | v.code-devise | ALPHA | - |
| P9 | v.PrinterName | ALPHA | - |
| P10 | v.ChangeRowTo999 | LOGICAL | - |
| P11 | v.RowInitial | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-99}` | v.nom village | ALPHA | - |
| `{0,-98}` | v.masque-mtt | ALPHA | - |
| `{0,-97}` | v.code-devise | ALPHA | - |
| `{0,-96}` | v.PrinterName | ALPHA | - |
| `{0,-95}` | v.ChangeRowTo999 | LOGICAL | - |
| `{0,-94}` | v.RowInitial | ALPHA | - |

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

> Total: 140 variables mappees

---

## 5. EXPRESSIONS (244 total, 190 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `SetCrsr (1)` | `SetCrsr (1)` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=6` | `GetParam ('CURRENTPRINTERNUM')=6` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 8 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `{0,2}` | `P0 filiation` |
| 2 | `'N'&Right ('### ### ###'&Left ('.',{0,4})&Fill ('#',{0,4}...` | `'N'&Right ('### ### ###'&Left ('.',P0 action)&Fill ('#',P...` |
| 3 | `{0,3}` | `P0 masque montant` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 2 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `{2,7}` | `{2,7}` |
| 3 | `0` | `0` |
| 4 | `{0,1}+{0,10}` | `P0 compte+v.RowInitial` |
| 5 | `{0,2}+{0,11}` | `P0 filiation+{0,11}` |
| 6 | `{0,3}+{0,12}` | `P0 masque montant+{0,12}` |
| 7 | `{0,4}` | `P0 action` |
| 8 | `{0,5}` | `v.nom village` |
| 9 | `{0,6}` | `v.masque-mtt` |
| 10 | `Trim ({0,19})&' '&Trim ({0,18})` | `Trim ({0,19})&' '&Trim ({0,18})` |
| 11 | `{2,1}` | `{2,1}` |
| 12 | `{2,2}` | `{2,2}` |
| 13 | `CndRange ({2,5}='E',{2,3})` | `CndRange ({2,5}='E',{2,3})` |
| 14 | `Trim ({0,7})&' / '&Trim ({0,8})` | `Trim (v.code-devise)&' / '&Trim (v.PrinterName)` |
| 15 | `IF (Left ({0,9},3)='EZM',Str (ASCIIVal (MID ({0,9},4,1))*...` | `IF (Left (v.ChangeRowTo999,3)='EZM',Str (ASCIIVal (MID (v...` |
| 16 | `GetParam ('VI_CLUB')` | `GetParam ('VI_CLUB')` |
| 17 | `GetParam ('VI_NAME')` | `GetParam ('VI_NAME')` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 (0 W / 4 R) |
| Parametres | 5 |
| Variables locales | 11 |
| Expressions | 244 |
| Expressions 100% decodees | 190 (78%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
