# ADH IDE 143 - Devises calcul ecart WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_143.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 143 |
| **Fichier XML** | Prg_143.xml |
| **Description** | Devises calcul ecart WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_143.xml. L'ID XML (143) peut differer de la position IDE (143).

---

## 2. TABLES (3 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |
| #232 | `caisse_devise` | gestion_devise_session | R | 2x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param quand | ALPHA | - |
| P4 | Param difference | LOGICAL | - |
| P5 | Param UNI/BI | ALPHA | - |

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

> Total: 128 variables mappees

---

## 5. EXPRESSIONS (27 total, 16 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,5}<>'B'` | `{0,5}<>'B'` |
| 2 | `{0,5}='B'` | `{0,5}='B'` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `{32768,1}` | `VG.USER` |
| 3 | `{0,6}` | `{0,6}` |
| 4 | `{0,8}` | `{0,8}` |
| 5 | `{0,3}` | `Param difference` |
| 6 | `'C'` | `'C'` |
| 7 | `'K'` | `'K'` |
| 8 | `'TRUE'LOG` | `'TRUE'LOG` |
| 9 | `{0,14}<>{0,20}` | `{0,14}<>{0,20}` |
| 10 | `{0,6}<>{0,2}` | `{0,6}<>Param quand` |
| 11 | `'FALSE'LOG` | `'FALSE'LOG` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `'O'` | `'O'` |
| 3 | `0` | `0` |
| 4 | `{32768,1}` | `VG.USER` |
| 5 | `{0,6}` | `{0,6}` |
| 6 | `{0,8}` | `{0,8}` |
| 7 | `{0,3}` | `Param difference` |
| 8 | `'C'` | `'C'` |
| 9 | `'K'` | `'K'` |
| 10 | `'TRUE'LOG` | `'TRUE'LOG` |
| 11 | `{0,16}<>{0,22}` | `{0,16}<>{0,22}` |
| 12 | `{0,6}<>{0,2}` | `{0,6}<>Param quand` |
| 13 | `'FALSE'LOG` | `'FALSE'LOG` |
| 14 | `{0,6}&{0,8}` | `{0,6}&{0,8}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (0 W / 3 R) |
| Parametres | 5 |
| Variables locales | 5 |
| Expressions | 27 |
| Expressions 100% decodees | 16 (59%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
