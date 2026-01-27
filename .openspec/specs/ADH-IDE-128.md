# ADH IDE 128 - Controle ouverture caisse WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_128.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 128 |
| **Fichier XML** | Prg_128.xml |
| **Description** | Controle ouverture caisse WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 21 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_128.xml. L'ID XML (128) peut differer de la position IDE (128).

---

## 2. TABLES (3 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #232 | `caisse_devise` | gestion_devise_session | **W** | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |
| #141 | `cafil119_dat` | devises__________dev | R | 1x |

---

## 3. PARAMETRES D'ENTREE (21)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param UNI/BI | ALPHA | - |
| P4 | Param chrono session | NUMERIC | - |
| P5 | Param solde initial | NUMERIC | - |
| P6 | Param solde initial monnaie | NUMERIC | - |
| P7 | Param solde initial produits | NUMERIC | - |
| P8 | Param solde initial cartes | NUMERIC | - |
| P9 | Param solde initial cheques | NUMERIC | - |
| P10 | Param solde initial od | NUMERIC | - |
| P11 | Param solde initial nbre devise | NUMERIC | - |
| P12 | Param appro coffre | NUMERIC | - |
| P13 | Param appro articles | NUMERIC | - |
| P14 | Param appro Nbre devises | NUMERIC | - |
| P15 | Param caisse calculee | NUMERIC | - |
| P16 | Param caisse calculee monnaie | NUMERIC | - |
| P17 | Param caisse calculee produits | NUMERIC | - |
| P18 | Param caisse calculee cartes | NUMERIC | - |
| P19 | Param caisse calculee cheque | NUMERIC | - |
| P20 | Param caisse calculee od | NUMERIC | - |
| P21 | Param caisse calculee nb devise | NUMERIC | - |

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

> Total: 160 variables mappees

---

## 5. EXPRESSIONS (29 total, 24 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,5}+{0,12}+{0,13}` | `Param solde initial monnaie+Param appro articles+Param ap...` |
| 2 | `{0,6}+{0,12}` | `Param solde initial produits+Param appro articles` |
| 3 | `{0,7}+{0,13}` | `Param solde initial cartes+Param appro Nbre devises` |
| 4 | `{0,8}` | `Param solde initial cheques` |
| 5 | `{0,9}` | `Param solde initial od` |
| 6 | `{0,10}` | `Param solde initial nbre devise` |
| 7 | `{0,11}+{0,14}` | `Param appro coffre+Param caisse calculee` |
| 8 | `{0,3}<>'B'` | `Param chrono session<>'B'` |
| 9 | `{0,3}='B'` | `Param chrono session='B'` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `'O'` | `'O'` |
| 3 | `0` | `0` |
| 4 | `{0,2}` | `Param UNI/BI` |
| 5 | `{32768,1}` | `VG.USER` |
| 6 | `{0,2}` | `Param UNI/BI` |
| 7 | `{0,4}` | `Param solde initial` |
| 8 | `'O'` | `'O'` |
| 9 | `'I'` | `'I'` |
| 10 | `'A'` | `'A'` |
| 11 | `{0,2}<>{1,2} AND ({0,8}='O' OR {0,9}='O')` | `Param UNI/BI<>{1,2} AND (Param solde initial cheques='O' ...` |
| 12 | `{32768,1}` | `VG.USER` |
| 13 | `{0,2}` | `Param UNI/BI` |
| 14 | `{0,4}` | `Param solde initial` |
| 15 | `'O'` | `'O'` |
| 16 | `'K'` | `'K'` |
| 17 | `{0,18}+{0,24}` | `Param caisse calculee cheque+{0,24}` |
| 18 | `Str ({0,11},'6P0')&{0,4}` | `Str (Param appro coffre,'6P0')&Param solde initial` |
| 19 | `{1,21}+1` | `{1,21}+1` |
| 20 | `{0,30}<>0` | `{0,30}<>0` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 ( W / 2 R) |
| Parametres | 21 |
| Variables locales | 21 |
| Expressions | 29 |
| Expressions 100% decodees | 24 (83%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
