# ADH IDE 195 - Print solde compte TIK V1

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_194.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 195 |
| **Fichier XML** | Prg_194.xml |
| **Description** | Print solde compte TIK V1 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 17 |
| **Module** | ADH |
| **Dossier IDE** | Solde |

> **Note**: Ce programme est Prg_194.xml. L'ID XML (194) peut differer de la position IDE (195).

---

## 2. TABLES (10 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #582 | `%club_user%tempocomptagen_dat` | tempo_comptage_nation | **W** | 8x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #40 | `cafil018_dat` | comptable________cte | R | 1x |
| #47 | `cafil025_dat` | compte_gm________cgm | R | 1x |
| #48 | `cafil026_dat` | lignes_de_solde__sld | R | 1x |
| #89 | `cafil067_dat` | moyen_paiement___mop | R | 1x |
| #140 | `cafil118_dat` | moyen_paiement___mop | R | 1x |
| #148 | `cafil126_dat` | lignes_de_solde__sld | R | 1x |

---

## 3. PARAMETRES D'ENTREE (17)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 code adherent | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 date solde | DATE | - |
| P5 | P0 heure solde | TIME | - |
| P6 | P0 solde compte | NUMERIC | - |
| P7 | P0 devise locale | ALPHA | - |
| P8 | P0 masque montant | ALPHA | - |
| P9 | P0 nom village | ALPHA | - |
| P10 | P0 telephone | ALPHA | - |
| P11 | P0 fax | ALPHA | - |
| P12 | P0 Type solde | ALPHA | - |
| P13 | P0 Annulation O/N | ALPHA | - |
| P14 | P0 BI | ALPHA | - |
| P15 | W0 entête ? | ALPHA | - |
| P16 | W0 nom | ALPHA | - |
| P17 | W0 prenom | ALPHA | - |
| P18 | W0 n° adherent | NUMERIC | - |
| P19 | W0 lettre contrôle | ALPHA | - |
| P20 | W0 filiation | NUMERIC | - |
| P21 | W0 langue parlee | ALPHA | - |
| P22 | W0 chambre | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-80}` | W0 entête ? | ALPHA | - |
| `{0,-78}` | W0 nom | ALPHA | - |
| `{0,-77}` | W0 prenom | ALPHA | - |
| `{0,-76}` | W0 n° adherent | NUMERIC | - |
| `{0,-75}` | W0 lettre contrôle | ALPHA | - |
| `{0,-74}` | W0 filiation | NUMERIC | - |
| `{0,-73}` | W0 langue parlee | ALPHA | - |
| `{0,-72}` | W0 chambre | ALPHA | - |
| `{0,-71}` | W0 date de debut | DATE | - |
| `{0,-70}` | W0 date de fin | DATE | - |
| `{0,-65}` | V.Nombre de copies | NUMERIC | - |
| `{0,-64}` | V.Montant Products | NUMERIC | - |
| `{0,-58}` | V.Ligne transaction | UNICODE | - |
| `{0,-59}` | V.Ligne acceptation | UNICODE | - |
| `{0,-57}` | V.Ligne détail carte? | LOGICAL | - |

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

> Total: 182 variables mappees

---

## 5. EXPRESSIONS (290 total, 179 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (1)` | `SetCrsr (1)` |
| 2 | `SetCrsr (2)` | `SetCrsr (2)` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 8 | `{0,13}<>'O'` | `P0 BI<>'O'` |
| 9 | `'TRUE'LOG` | `'TRUE'LOG` |
| 10 | `GetParam ('NUMBERCOPIES')` | `GetParam ('NUMBERCOPIES')` |
| 11 | `'File Number : '&Trim({0,30})` | `'File Number : '&Trim(V.Ligne acceptation)` |
| 12 | `'Autorisation Number : '&Trim({0,31})` | `'Autorisation Number : '&Trim(V.Ligne détail carte?)` |
| 13 | `Trim({0,30})<>'' AND {32768,106}` | `Trim(V.Ligne acceptation)<>'' AND VG.Id Log Utilisation ADH` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{1,3}` | `{1,3}` |
| 4 | `'H'` | `'H'` |
| 5 | `ASCIIChr (33)` | `ASCIIChr (33)` |
| 6 | `{0,8}` | `P0 nom village` |
| 7 | `{0,15}` | `Pi.id_transaction` |
| 8 | `{0,5}` | `P0 solde compte` |
| 9 | `{0,6}` | `P0 devise locale` |
| 10 | `{0,7}` | `P0 masque montant` |
| 11 | `'F'` | `'F'` |
| 12 | `{0,1}='F'` | `P0 code adherent='F'` |
| 13 | `{0,10}` | `P0 fax` |
| 14 | `{0,32}` | `{0,32}` |
| 15 | `{0,19}` | `W0 prenom` |
| 16 | `{0,24}` | `W0 chambre` |
| 17 | `{0,35}` | `{0,35}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 10 ( W / 9 R) |
| Parametres | 17 |
| Variables locales | 32 |
| Expressions | 290 |
| Expressions 100% decodees | 179 (62%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
