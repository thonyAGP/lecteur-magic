# ADH IDE 130 - Ecart fermeture caisse

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_130.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 130 |
| **Fichier XML** | Prg_130.xml |
| **Description** | Ecart fermeture caisse |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 30 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_130.xml. L'ID XML (130) peut differer de la position IDE (130).

---

## 2. TABLES (7 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 2x |
| #90 | `cafil068_dat` | devises__________dev | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 2x |
| #141 | `cafil119_dat` | devises__________dev | R | 2x |
| #232 | `caisse_devise` | gestion_devise_session | R | 4x |
| #492 | `caisse_tabrecap` | edition_tableau_recap | R | 1x |
| #706 | `paramcom_par` | parametre_port_serie | R | 1x |

---

## 3. PARAMETRES D'ENTREE (30)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param chrono session | NUMERIC | - |
| P3 | Param devise locale | ALPHA | - |
| P4 | Param masque montant | ALPHA | - |
| P5 | Param quand | ALPHA | - |
| P6 | Param caisse comptee | NUMERIC | - |
| P7 | Param caisse comptee monnaie | NUMERIC | - |
| P8 | Param caisse comptee produits | NUMERIC | - |
| P9 | Param caisse comptee cartes | NUMERIC | - |
| P10 | Param caisse comptee cheques | NUMERIC | - |
| P11 | Param caisse comptee od | NUMERIC | - |
| P12 | Param caisse comptee nb devise | NUMERIC | - |
| P13 | Param caisse calculee | NUMERIC | - |
| P14 | Param caisse calculee monnaie | NUMERIC | - |
| P15 | Param caisse calculee produits | NUMERIC | - |
| P16 | Param caisse calculee cartes | NUMERIC | - |
| P17 | Param caisse calculee cheques | NUMERIC | - |
| P18 | Param caisse calculee od | NUMERIC | - |
| P19 | Param caisse calculee nb devise | NUMERIC | - |
| P20 | Param montant ecart | NUMERIC | - |
| P21 | Param montant ecart monnaie | NUMERIC | - |
| P22 | Param montant ecart produits | NUMERIC | - |

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

> Total: 180 variables mappees

---

## 5. EXPRESSIONS (97 total, 64 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'FALSE'LOG` | `'FALSE'LOG` |
| 2 | `{0,31}` | `{0,31}` |
| 1 | `149` | `149` |
| 2 | `Trim ({0,2})` | `Trim (Param devise locale)` |
| 3 | `{32768,1}` | `VG.USER` |
| 4 | `Date ()` | `Date ()` |
| 5 | `{1,4}` | `{1,4}` |
| 6 | `{1,7}-{1,14}` | `{1,7}-{1,14}` |
| 7 | `{1,8}-{1,15}` | `{1,8}-{1,15}` |
| 8 | `{1,9}-{1,16}` | `{1,9}-{1,16}` |
| 9 | `{1,10}-{1,17}` | `{1,10}-{1,17}` |
| 10 | `{1,11}-{1,18}` | `{1,11}-{1,18}` |
| 11 | `{1,6}-{1,13}` | `{1,6}-{1,13}` |
| 12 | `{0,3}<>''` | `Param masque montant<>''` |
| 13 | `{0,1}<>''` | `Param chrono session<>''` |
| 14 | `{0,3}<>'' OR {1,15}<>{1,8} OR {1,16}<>{1,9} OR {1,17}<>{1...` | `Param masque montant<>'' OR {1,15}<>{1,8} OR {1,16}<>{1,9...` |
| 15 | `NOT ({0,3}<>'' OR {1,15}<>{1,8} OR {1,16}<>{1,9} OR {1,17...` | `NOT (Param masque montant<>'' OR {1,15}<>{1,8} OR {1,16}<...` |
| 16 | `{0,1}='' AND NOT ({0,3}<>'' OR {1,15}<>{1,8} OR {1,16}<>{...` | `Param chrono session='' AND NOT (Param masque montant<>''...` |
| 17 | `'TRUE'LOG` | `'TRUE'LOG` |
| 18 | `{0,1}=''` | `Param chrono session=''` |
| 19 | `0` | `0` |
| 20 | `''` | `''` |
| 21 | `{1,13}-{1,6}` | `{1,13}-{1,6}` |
| 22 | `{1,14}-{1,7}` | `{1,14}-{1,7}` |
| 23 | `{1,15}-{1,8}` | `{1,15}-{1,8}` |
| 24 | `{1,16}-{1,9}` | `{1,16}-{1,9}` |
| 25 | `{1,17}-{1,10}` | `{1,17}-{1,10}` |
| 26 | `{1,18}-{1,11}` | `{1,18}-{1,11}` |
| 27 | `{0,1}` | `Param chrono session` |
| 28 | `{0,3}` | `Param masque montant` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 7 (0 W / 7 R) |
| Parametres | 30 |
| Variables locales | 31 |
| Expressions | 97 |
| Expressions 100% decodees | 64 (66%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
