# ADH IDE 176 - Print transferts

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_175.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 176 |
| **Fichier XML** | Prg_175.xml |
| **Description** | Print transferts |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Operations GM |

> **Note**: Ce programme est Prg_175.xml. L'ID XML (175) peut differer de la position IDE (176).

---

## 2. TABLES (4 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 3x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 3x |
| #473 | `%club_user%_caisse_compcais` | comptage_caisse | R | 2x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.i.Societe | ALPHA | - |
| P2 | p.i..Code adherent | NUMERIC | - |
| P3 | p.i.Ffiliation | NUMERIC | - |
| P4 | p.i.Nom village | ALPHA | - |
| P5 | W0 Nom | ALPHA | - |
| P6 | W0 Prenom | ALPHA | - |
| P7 | W0 N° adherent | NUMERIC | - |
| P8 | W0 Lettre contrôle | ALPHA | - |
| P9 | W0 Filiation | NUMERIC | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-99}` | W0 Nom | ALPHA | - |
| `{0,-98}` | W0 Prenom | ALPHA | - |
| `{0,-97}` | W0 N° adherent | NUMERIC | - |
| `{0,-96}` | W0 Lettre contrôle | ALPHA | - |
| `{0,-95}` | W0 Filiation | NUMERIC | - |
| `{0,-93}` | W0 Chambre | ALPHA | - |
| `{0,-91}` | W0 Date de debut | DATE | - |
| `{0,-90}` | W0 Date de fin | DATE | - |

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

> Total: 142 variables mappees

---

## 5. EXPRESSIONS (77 total, 48 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `SetCrsr (1)` | `SetCrsr (1)` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 5 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{1,3}` | `{1,3}` |
| 4 | `{0,7}` | `W0 Lettre contrôle` |
| 5 | `{0,13}` | `{0,13}` |
| 6 | `{0,4}` | `W0 Nom` |
| 7 | `{0,5}` | `W0 Prenom` |
| 8 | `{0,6}` | `W0 N° adherent` |
| 9 | `'H'` | `'H'` |
| 10 | `Date()` | `Date()` |
| 11 | `{0,20}` | `{0,20}` |
| 12 | `{0,18}` | `{0,18}` |
| 13 | `{0,19}` | `{0,19}` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 2 | `INIPut('[MAGIC_SPECIALS]SpecialTable2dPrint=Y', 'FALSE'LOG)` | `INIPut('[MAGIC_SPECIALS]SpecialTable2dPrint=Y', 'FALSE'LOG)` |
| 1 | `'CLUB MED'&' '&GetParam ('VI_CLUB')` | `'CLUB MED'&' '&GetParam ('VI_CLUB')` |
| 2 | `GetParam ('VI_NAME')` | `GetParam ('VI_NAME')` |
| 3 | `GetParam ('VI_ADR1')` | `GetParam ('VI_ADR1')` |
| 4 | `GetParam ('VI_ADR2')` | `GetParam ('VI_ADR2')` |
| 5 | `GetParam ('VI_ZIPC')` | `GetParam ('VI_ZIPC')` |
| 6 | `'Tel/Phone: '&GetParam ('VI_PHON')` | `'Tel/Phone: '&GetParam ('VI_PHON')` |
| 7 | `'Email: '&GetParam ('VI_MAIL')` | `'Email: '&GetParam ('VI_MAIL')` |
| 8 | `IF(Lower(Left(GetParam ('VI_SIRE'),5))='siret',GetParam (...` | `IF(Lower(Left(GetParam ('VI_SIRE'),5))='siret',GetParam (...` |
| 9 | `GetParam ('VI_VATN')` | `GetParam ('VI_VATN')` |
| 10 | `{2,1}` | `{2,1}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 (0 W / 4 R) |
| Parametres | 4 |
| Variables locales | 12 |
| Expressions | 77 |
| Expressions 100% decodees | 48 (62%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
