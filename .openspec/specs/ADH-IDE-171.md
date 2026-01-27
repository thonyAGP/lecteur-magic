# ADH IDE 171 - Print versement retrait

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_170.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 171 |
| **Fichier XML** | Prg_170.xml |
| **Description** | Print versement retrait |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 14 |
| **Module** | ADH |
| **Dossier IDE** | Operations GM |

> **Note**: Ce programme est Prg_170.xml. L'ID XML (170) peut differer de la position IDE (171).

---

## 2. TABLES (4 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 7x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #40 | `cafil018_dat` | comptable________cte | R | 7x |

---

## 3. PARAMETRES D'ENTREE (14)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P.i.societe | ALPHA | - |
| P2 | P.i.code adherent | NUMERIC | - |
| P3 | P.i.date | DATE | - |
| P4 | P.i.heure | TIME | - |
| P5 | P.i.devise locale | ALPHA | - |
| P6 | P.i.masque montant | ALPHA | - |
| P7 | P.i.nom village | ALPHA | - |
| P8 | P.i.telephone | ALPHA | - |
| P9 | P.i.fax | ALPHA | - |
| P10 | P.i.Cloture en cours | LOGICAL | - |
| P11 | v.entête ? | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-94}` | v.entête ? | ALPHA | - |
| `{0,-91}` | v.Nom | UNICODE | - |
| `{0,-90}` | v.Prenom | UNICODE | - |
| `{0,-89}` | v.Chambre | UNICODE | - |
| `{0,-88}` | v.Date Debut | DATE | - |
| `{0,-87}` | v.Date Fin | DATE | - |
| `{0,-84}` | v.copies | NUMERIC | - |
| `{0,-83}` | v.Montant Product | NUMERIC | - |
| `{0,-78}` | v.Libellé transaction | UNICODE | - |
| `{0,-77}` | v.Libellé autorisation | UNICODE | - |
| `{0,-76}` | v.Edition ligne carte? | LOGICAL | - |

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

> Total: 168 variables mappees

---

## 5. EXPRESSIONS (292 total, 211 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `SetCrsr (1)` | `SetCrsr (1)` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 8 | `'TRUE'LOG` | `'TRUE'LOG` |
| 9 | `GetParam ('NUMBERCOPIES')` | `GetParam ('NUMBERCOPIES')` |
| 10 | `'File Number : '&Trim({0,21})` | `'File Number : '&Trim(v.Montant Product)` |
| 11 | `'Autorisation Number : '&Trim({0,22})` | `'Autorisation Number : '&Trim(v.Libellé transaction)` |
| 12 | `Trim({0,21})<>'' AND {32768,106}` | `Trim(v.Montant Product)<>'' AND VG.Id Log Utilisation ADH` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{1,12}` | `{1,12}` |
| 4 | `{0,7}` | `P.i.telephone` |
| 5 | `{0,15}` | `v.Nom` |
| 6 | `'H'` | `'H'` |
| 7 | `Date()` | `Date()` |
| 8 | `{0,22}` | `v.Libellé transaction` |
| 9 | `{0,9}` | `P.i.Cloture en cours` |
| 10 | `{0,10}` | `P.i.N° Ticket` |
| 1 | `Counter (0)>={1,19}` | `Counter (0)>={1,19}` |
| 2 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 3 | `IsFirstRecordCycle(0)` | `IsFirstRecordCycle(0)` |
| 4 | `ABS({1,20})` | `ABS({1,20})` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `IF ({2,10},DbName('{173,4}'DSOURCE),DbName('{40,4}'DSOURCE))` | `IF ({2,10},DbName('{173,4}'DSOURCE),DbName('{40,4}'DSOURCE))` |
| 3 | `{2,1}` | `{2,1}` |
| 4 | `{2,2}` | `{2,2}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 (0 W / 4 R) |
| Parametres | 14 |
| Variables locales | 25 |
| Expressions | 292 |
| Expressions 100% decodees | 211 (72%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
