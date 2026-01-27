# ADH IDE 74 - Print extrait DateImp /O

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_74.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 74 |
| **Fichier XML** | Prg_74.xml |
| **Description** | Print extrait DateImp /O |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 9 |
| **Module** | ADH |
| **Dossier IDE** | Extrait de Compte |

> **Note**: Ce programme est Prg_74.xml. L'ID XML (74) peut differer de la position IDE (74).

---

## 2. TABLES (6 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #867 | `log_maj_tpe` | log_maj_tpe | **W** | 6x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 8x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 7x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #40 | `cafil018_dat` | comptable________cte | R | 13x |
| #928 | `type_lit` | type_lit | R | 2x |

---

## 3. PARAMETRES D'ENTREE (9)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 code adherent | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 masque montant | ALPHA | - |
| P5 | P0 nom village | ALPHA | - |
| P6 | P0 fictif | LOGICAL | - |
| P7 | P0 date comptable | DATE | - |
| P8 | W0 nom | ALPHA | - |
| P9 | W0 prenom | ALPHA | - |
| P10 | W0 titre | ALPHA | - |
| P11 | W0 n° adherent | NUMERIC | - |
| P12 | W0 lettre contrôle | ALPHA | - |
| P13 | W0 filiation | NUMERIC | - |
| P14 | W0 langue parlee | ALPHA | - |
| P15 | W0 chambre | ALPHA | - |
| P16 | W0 masque extrait | ALPHA | - |
| P17 | W0 devise local | ALPHA | - |
| P18 | W0 date min | DATE | - |
| P19 | W0 date max | DATE | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-90}` | W0 nom | ALPHA | - |
| `{0,-89}` | W0 prenom | ALPHA | - |
| `{0,-88}` | W0 titre | ALPHA | - |
| `{0,-87}` | W0 n° adherent | NUMERIC | - |
| `{0,-86}` | W0 lettre contrôle | ALPHA | - |
| `{0,-85}` | W0 filiation | NUMERIC | - |
| `{0,-84}` | W0 langue parlee | ALPHA | - |
| `{0,-83}` | W0 chambre | ALPHA | - |
| `{0,-81}` | W0 masque extrait | ALPHA | - |
| `{0,-80}` | W0 devise local | ALPHA | - |
| `{0,-79}` | W0 date min | DATE | - |
| `{0,-78}` | W0 date max | DATE | - |

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

> Total: 160 variables mappees

---

## 5. EXPRESSIONS (386 total, 257 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (1)` | `SetCrsr (1)` |
| 2 | `SetCrsr (2)` | `SetCrsr (2)` |
| 3 | `Left ({0,4},Len (RTrim ({0,4}))-1)` | `Left (P0 nom village,Len (RTrim (P0 nom village))-1)` |
| 4 | `{0,20}<>'00/00/0000'DATE` | `W0 date max<>'00/00/0000'DATE` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=6` | `GetParam ('CURRENTPRINTERNUM')=6` |
| 8 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 9 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 10 | `DbDel ('{867,4}'DSOURCE,'')` | `DbDel ('{867,4}'DSOURCE,'')` |
| 11 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 2 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 3 | `DbDel ('{867,4}'DSOURCE,'')` | `DbDel ('{867,4}'DSOURCE,'')` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `{2,1}` | `{2,1}` |
| 3 | `{2,2}` | `{2,2}` |
| 4 | `{2,20}` | `{2,20}` |
| 5 | `{2,21}` | `{2,21}` |
| 6 | `{2,18}` | `{2,18}` |
| 7 | `{0,1}+{0,15}` | `P0 code adherent+W0 langue parlee` |
| 8 | `{0,1}` | `P0 code adherent` |
| 9 | `{0,3}+{0,15}` | `P0 masque montant+W0 langue parlee` |
| 10 | `0` | `0` |
| 11 | `{0,5}` | `P0 fictif` |
| 12 | `{0,7}` | `P0 edition Tva V2` |
| 13 | `IF ({0,2}>0,MlsTrans ('Solde crediteur'),IF ({0,2}<0,MlsT...` | `IF (P0 filiation>0,MlsTrans ('Solde crediteur'),IF (P0 fi...` |
| 14 | `Date ()` | `Date ()` |
| 15 | `Time ()` | `Time ()` |
| 16 | `RTrim ({0,12})&' '&RTrim ({0,13})` | `RTrim (W0 n° adherent)&' '&RTrim (W0 lettre contrôle)` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 6 ( W / 5 R) |
| Parametres | 9 |
| Variables locales | 21 |
| Expressions | 386 |
| Expressions 100% decodees | 257 (67%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
