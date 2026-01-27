# ADH IDE 147 - Devises des tickets WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_147.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 147 |
| **Fichier XML** | Prg_147.xml |
| **Description** | Devises des tickets WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_147.xml. L'ID XML (147) peut differer de la position IDE (147).

---

## 2. TABLES (5 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #513 | `%club_user%_pv_filiations` | pv_invoiceprintfiliationtmp | **W** | 6x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 2x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 2x |
| #232 | `caisse_devise` | gestion_devise_session | R | 3x |
| #250 | `caisse_session_devise` | histo_sessions_caisse_devise | R | 2x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param N° session | NUMERIC | - |
| P4 | Param Quand | ALPHA | - |
| P5 | Param UNI/BI | ALPHA | - |
| P6 | Quantite devise | NUMERIC | - |

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

> Total: 130 variables mappees

---

## 5. EXPRESSIONS (73 total, 46 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,4}='O'` | `Param UNI/BI='O'` |
| 2 | `{0,4}='F'` | `Param UNI/BI='F'` |
| 3 | `DbDel ('{513,4}'DSOURCE,'')` | `DbDel ('{513,4}'DSOURCE,'')` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `{2,4}` | `{2,4}` |
| 3 | `InStr ('ICDL',{0,5})<>0` | `InStr ('ICDL',Quantite devise)<>0` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'O'` | `'O'` |
| 3 | `{1,5}` | `{1,5}` |
| 4 | `{1,2}` | `{1,2}` |
| 5 | `{1,3}` | `{1,3}` |
| 6 | `{1,6}` | `{1,6}` |
| 7 | `1` | `1` |
| 8 | `2` | `2` |
| 9 | `3` | `3` |
| 10 | `4` | `4` |
| 11 | `{0,3}='I'` | `Param Quand='I'` |
| 12 | `{0,3}='C'` | `Param Quand='C'` |
| 13 | `{0,3}='D'` | `Param Quand='D'` |
| 14 | `{0,3}='L'` | `Param Quand='L'` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `{2,4}` | `{2,4}` |
| 3 | `InStr ('LVCKD',{0,5})<>0` | `InStr ('LVCKD',Quantite devise)<>0` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'F'` | `'F'` |
| 3 | `{1,5}` | `{1,5}` |
| 4 | `{1,2}` | `{1,2}` |
| 5 | `{1,3}` | `{1,3}` |
| 6 | `{1,6}` | `{1,6}` |
| 7 | `1` | `1` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 5 ( W / 4 R) |
| Parametres | 5 |
| Variables locales | 6 |
| Expressions | 73 |
| Expressions 100% decodees | 46 (63%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
