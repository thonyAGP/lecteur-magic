# ADH IDE 111 - Garantie sur compte

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_111.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 111 |
| **Fichier XML** | Prg_111.xml |
| **Description** | Garantie sur compte |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 17 |
| **Module** | ADH |
| **Dossier IDE** | Garantie |

> **Note**: Ce programme est Prg_111.xml. L'ID XML (111) peut differer de la position IDE (111).

---

## 2. TABLES (22 tables - 11 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #31 | `cafil009_dat` | gm-complet_______gmc | **W** | 4x |
| #39 | `cafil017_dat` | depot_garantie___dga | **W** | 6x |
| #40 | `cafil018_dat` | comptable________cte | **W** | 2x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 7x |
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 2x |
| #88 | `cafil066_dat` | historik_station | **W** | 2x |
| #285 | `email` | email | **W** | 2x |
| #312 | `ezcard` | ez_card | **W** | 1x |
| #370 | `pv_accountdate_dat` | pv_accounting_date | **W** | 2x |
| #911 | `log_booker` | log_booker | **W** | 2x |
| #945 | `Table_945` | Unknown | **W** | 2x |
| #23 | `cafil001_dat` | reseau_cloture___rec | R | 2x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 4x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #66 | `cafil044_dat` | imputations______imp | R | 2x |
| #69 | `cafil047_dat` | initialisation___ini | R | 2x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 2x |
| #89 | `cafil067_dat` | moyen_paiement___mop | R | 1x |
| #91 | `cafil069_dat` | garantie_________gar | R | 4x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |
| #140 | `cafil118_dat` | moyen_paiement___mop | R | 1x |
| #910 | `classification_memory` | classification_memory | R | 1x |

---

## 3. PARAMETRES D'ENTREE (17)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P.i. societe | ALPHA | - |
| P2 | P.i.num compte | NUMERIC | - |
| P3 | P.i.filiation | NUMERIC | - |
| P4 | P.i.devise locale | ALPHA | - |
| P5 | P.i.nb decimale | NUMERIC | - |
| P6 | P.i.masque montant | ALPHA | - |
| P7 | P.i.village à CAM | ALPHA | - |
| P8 | P.i.flag depot | ALPHA | - |
| P9 | P.o.code retour | ALPHA | - |
| P10 | P.i.nom village | ALPHA | - |
| P11 | P.i.solde compte | NUMERIC | - |
| P12 | P.i.etat compte | ALPHA | - |
| P13 | P.i.date solde | DATE | - |
| P14 | P.i.change uni/bi ? | ALPHA | - |
| P15 | P.i.choix garantie | ALPHA | - |
| P16 | W0 reseau | ALPHA | - |
| P17 | W0 fin tache | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-85}` | W0 reseau | ALPHA | - |
| `{0,-84}` | W0 fin tache | ALPHA | - |
| `{0,-82}` | v.Création Garantie | LOGICAL | - |
| `{0,-78}` | v.TPE ICMP ? | LOGICAL | - |
| `{0,-75}` | v.Session caisse ouverte? | LOGICAL | - |

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

> Total: 162 variables mappees

---

## 5. EXPRESSIONS (544 total, 310 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}=''` | `P.i.num compte=''` |
| 2 | `'C'` | `'C'` |
| 3 | `{0,18}<>'R' AND {0,14}<>'B'` | `W0 fin tache<>'R' AND P.i.choix garantie<>'B'` |
| 4 | `{0,18}<>'R' AND {0,14}='B'` | `W0 fin tache<>'R' AND P.i.choix garantie='B'` |
| 5 | `'F'` | `'F'` |
| 6 | `{0,19}='F'` | `v.Création Garantie='F'` |
| 7 | `''` | `''` |
| 8 | `{0,20} AND {32768,64}` | `v.TPE ICMP ? AND VG.Prise de Garantie V2.00` |
| 13 | `{32768,94} AND IF({32768,23},{32768,116},'TRUE'LOG) AND {...` | `VG.Gestion Garantie API CM AND IF(VG.PROJ.INTERF.TPE ACTI...` |
| 11 | `CallProg('{323,-1}'PROG)` | `CallProg('{323,-1}'PROG)` |
| 12 | `NOT({0,22}) AND NOT({32768,3})` | `NOT({0,22}) AND NOT(VG.DROIT ACCES IT ?)` |
| 14 | `{0,1}` | `P.i.num compte` |
| 15 | `{0,2}` | `P.i.filiation` |
| 16 | `{0,3}` | `P.i.devise locale` |
| 1 | `{0,3}<>'S'` | `P.i.devise locale<>'S'` |
| 2 | `{1,1}` | `{1,1}` |
| 3 | `{1,2}` | `{1,2}` |
| 4 | `{0,3}` | `P.i.devise locale` |
| 5 | `{1,18}='R'` | `{1,18}='R'` |
| 6 | `{1,18}<>'R'` | `{1,18}<>'R'` |
| 7 | `'R'` | `'R'` |
| 1 | `MlsTrans ('Nombre de carte(s) à recuperer')&' : '&Trim (S...` | `MlsTrans ('Nombre de carte(s) à recuperer')&' : '&Trim (S...` |
| 2 | `17` | `17` |
| 3 | `Trim ({0,47})` | `Trim ({0,47})` |
| 4 | `{32768,43}` | `VG.VG_TPE_V2.00` |
| 5 | `Trim({0,27})='$CARD'` | `Trim({0,27})='$CARD'` |
| 6 | `{1,2}` | `{1,2}` |
| 7 | `{1,3}` | `{1,3}` |
| 8 | `{0,18} AND NOT {32768,80}` | `W0 fin tache AND NOT VG.VG Réception en mobilité V1.00` |
| 9 | `Trim({0,38})` | `Trim({0,38})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 22 (11 W / 11 R) |
| Parametres | 17 |
| Variables locales | 22 |
| Expressions | 544 |
| Expressions 100% decodees | 310 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
