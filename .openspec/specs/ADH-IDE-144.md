# ADH IDE 144 - Devises finales F/F Nbre WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_144.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 144 |
| **Fichier XML** | Prg_144.xml |
| **Description** | Devises finales F/F Nbre WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_144.xml. L'ID XML (144) peut differer de la position IDE (144).

---

## 2. TABLES (4 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #232 | `caisse_devise` | gestion_devise_session | **W** | 2x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #67 | `cafil045_dat` | tables___________tab | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param Nbre devise finale | NUMERIC | - |
| P4 | Param UNI/BI | ALPHA | - |
| P5 | Param Faire Update F/F | LOGICAL | - |
| P6 | V nbre devise ouverture | NUMERIC | - |
| P7 | V nbre devise fermeture | NUMERIC | - |

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

## 5. EXPRESSIONS (40 total, 27 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,4}<>'B'` | `Param Faire Update F/F<>'B'` |
| 2 | `{0,4}='B'` | `Param Faire Update F/F='B'` |
| 3 | `{0,7}` | `{0,7}` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `{32768,1}` | `VG.USER` |
| 3 | `{0,5}` | `V nbre devise ouverture` |
| 4 | `{0,7}` | `{0,7}` |
| 5 | `'F'` | `'F'` |
| 6 | `'C'` | `'C'` |
| 7 | `'V'` | `'V'` |
| 8 | `{0,5}<>{0,2}` | `V nbre devise ouverture<>Param Nbre devise finale` |
| 9 | `{0,3}+1` | `Param UNI/BI+1` |
| 10 | `{0,13}-{0,19}<>0` | `{0,13}-{0,19}<>0` |
| 11 | `0` | `0` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `'O'` | `'O'` |
| 3 | `0` | `0` |
| 4 | `{0,2}&{0,4}` | `Param Nbre devise finale&Param Faire Update F/F` |
| 5 | `{32768,1}` | `VG.USER` |
| 6 | `{0,2}` | `Param Nbre devise finale` |
| 7 | `{0,4}` | `Param Faire Update F/F` |
| 8 | `'O'` | `'O'` |
| 9 | `'F'` | `'F'` |
| 10 | `'I'` | `'I'` |
| 11 | `'C'` | `'C'` |
| 12 | `'V'` | `'V'` |
| 13 | `'A'` | `'A'` |
| 14 | `'F'` | `'F'` |
| 15 | `'BDEV'` | `'BDEV'` |
| 16 | `{0,2}` | `Param Nbre devise finale` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 ( W / 3 R) |
| Parametres | 5 |
| Variables locales | 7 |
| Expressions | 40 |
| Expressions 100% decodees | 27 (68%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
