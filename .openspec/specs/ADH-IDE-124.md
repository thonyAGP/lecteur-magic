# ADH IDE 124 - Apport articles

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_124.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 124 |
| **Fichier XML** | Prg_124.xml |
| **Description** | Apport articles |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_124.xml. L'ID XML (124) peut differer de la position IDE (124).

---

## 2. TABLES (5 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #196 | `caisse_article` | gestion_article_session | **W** | 2x |
| #217 | `caisse_coffre_compcais_histo2` | comptage_coffre_histo | R | 1x |
| #222 | `caisse_compcais_histo2` | comptage_caisse_histo | R | 1x |
| #246 | `caisse_session` | histo_sessions_caisse | R | 1x |
| #248 | `caisse_session_coffre2` | sessions_coffre2 | R | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param masque montant | ALPHA | - |
| P2 | Param montant articles | NUMERIC | - |
| P3 | Param devise locale | ALPHA | - |
| P4 | Param quand | ALPHA | - |
| P5 | Param coffre 2 est ouvert | LOGICAL | - |
| P6 | Fin | LOGICAL | - |

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

> Total: 132 variables mappees

---

## 5. EXPRESSIONS (48 total, 23 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,7}` | `{0,7}` |
| 2 | `NOT ({0,5}) AND NOT {0,6}` | `NOT (p.i.Host courant coffre 2 ?) AND NOT Fin` |
| 3 | `'TRUE'LOG` | `'TRUE'LOG` |
| 4 | `NOT(ExpCalc('2'EXP))` | `NOT(ExpCalc('2'EXP))` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `{1,4}` | `{1,4}` |
| 3 | `'A'` | `'A'` |
| 4 | `0` | `0` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `{1,3}` | `{1,3}` |
| 3 | `{1,4}` | `{1,4}` |
| 4 | `'A'` | `'A'` |
| 5 | `146` | `146` |
| 6 | `Trim ({0,12})` | `Trim ({0,12})` |
| 7 | `'TRUE'LOG` | `'TRUE'LOG` |
| 8 | `{32768,1}` | `VG.USER` |
| 9 | `Date ()` | `Date ()` |
| 10 | `{0,9}` | `{0,9}` |
| 11 | `{0,7}*{0,8}` | `{0,7}*{0,8}` |
| 12 | `{1,1}` | `{1,1}` |
| 13 | `0` | `0` |
| 14 | `'TRUE'LOG` | `'TRUE'LOG` |
| 15 | `{0,11}` | `{0,11}` |
| 16 | `'ART'` | `'ART'` |
| 17 | `{0,10}` | `{0,10}` |
| 18 | `MlsTrans('Stock insuffisant > faire une entrée de produit...` | `MlsTrans('Stock insuffisant > faire une entrée de produit...` |
| 44 | `MlsTrans('Le coffre 2 n''est pas ouvert')` | `MlsTrans('Le coffre 2 n''est pas ouvert')` |
| 29 | `MlsTrans('Stock insuffisant dans Coffre 2')` | `MlsTrans('Stock insuffisant dans Coffre 2')` |
| 47 | `{0,8}>0` | `{0,8}>0` |
| 39 | `{0,20}<{0,8}` | `{0,20}<{0,8}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 5 ( W / 4 R) |
| Parametres | 6 |
| Variables locales | 7 |
| Expressions | 48 |
| Expressions 100% decodees | 23 (48%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
