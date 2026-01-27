# ADH IDE 122 - Ouverture caisse

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_122.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 122 |
| **Fichier XML** | Prg_122.xml |
| **Description** | Ouverture caisse |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 15 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_122.xml. L'ID XML (122) peut differer de la position IDE (122).

---

## 2. TABLES (3 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #67 | `cafil045_dat` | tables___________tab | R | 1x |
| #232 | `caisse_devise` | gestion_devise_session | R | 2x |
| #693 | `devisein_par` | devise_in | R | 1x |

---

## 3. PARAMETRES D'ENTREE (15)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param Nbre decimales | NUMERIC | - |
| P4 | Param masque montant | ALPHA | - |
| P5 | Param code village | ALPHA | - |
| P6 | Param nom village | ALPHA | - |
| P7 | Param masque cumul | ALPHA | - |
| P8 | Param Uni/Bi | ALPHA | - |
| P9 | Param village TAI | ALPHA | - |
| P10 | Param date comptable | DATE | - |
| P11 | Param ouverture validee | LOGICAL | - |
| P12 | Param chrono session | NUMERIC | - |
| P13 | Param coffre 2 est ouvert | LOGICAL | - |
| P14 | Fin | LOGICAL | - |
| P15 | Action | NUMERIC | - |
| P16 | Flag avancement | NUMERIC | - |
| P17 | Montant solde initial | NUMERIC | - |
| P18 | Montant solde initial monnaie | NUMERIC | - |
| P19 | Montant solde initial produits | NUMERIC | - |
| P20 | Montant solde initial cartes | NUMERIC | - |
| P21 | Montant solde initial cheques | NUMERIC | - |
| P22 | Montant solde initial od | NUMERIC | - |

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

> Total: 232 variables mappees

---

## 5. EXPRESSIONS (160 total, 76 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,17}=0` | `Flag avancement=0` |
| 2 | `{0,16}` | `Action` |
| 3 | `0` | `0` |
| 4 | `'FALSE'LOG` | `'FALSE'LOG` |
| 5 | `{0,56}` | `Edition ticket` |
| 6 | `{0,57}` | `{0,57}` |
| 7 | `'O'` | `'O'` |
| 8 | `{0,26}<>0 OR {0,27}<>0 OR {0,28}<>0` | `Montant apport produits<>0 OR Nbre devise apport<>0 OR Mo...` |
| 1 | `'1'` | `'1'` |
| 2 | `'2'` | `'2'` |
| 3 | `'3'` | `'3'` |
| 4 | `'4'` | `'4'` |
| 5 | `'5'` | `'5'` |
| 6 | `'6'` | `'6'` |
| 7 | `'7'` | `'7'` |
| 8 | `'8'` | `'8'` |
| 9 | `Date ()` | `Date ()` |
| 10 | `{32768,2}` | `VG.Retour Chariot` |
| 11 | `Trim ({0,10})` | `Trim (Param ouverture validee)` |
| 12 | `{1,4}` | `{1,4}` |
| 13 | `143` | `143` |
| 14 | `{1,18}>0` | `{1,18}>0` |
| 15 | `{1,18}>0 AND {1,24}<>0` | `{1,18}>0 AND {1,24}<>0` |
| 16 | `{1,18}>1` | `{1,18}>1` |
| 17 | `{1,18}>2` | `{1,18}>2` |
| 18 | `{1,18}>2 AND ({1,26}<>0 OR {1,27}<>0 OR {1,28}<>0)` | `{1,18}>2 AND ({1,26}<>0 OR {1,27}<>0 OR {1,28}<>0)` |
| 19 | `{1,18}>3` | `{1,18}>3` |
| 20 | `{1,18}>3 AND {1,34}<>0` | `{1,18}>3 AND {1,34}<>0` |
| 21 | `{1,18}>4` | `{1,18}>4` |
| 22 | `{1,18}>4 AND {1,41}<>0` | `{1,18}>4 AND {1,41}<>0` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (0 W / 3 R) |
| Parametres | 15 |
| Variables locales | 57 |
| Expressions | 160 |
| Expressions 100% decodees | 76 (48%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
