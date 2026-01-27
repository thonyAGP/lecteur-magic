# ADH IDE 140 - Init apport article session WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_140.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 140 |
| **Fichier XML** | Prg_140.xml |
| **Description** | Init apport article session WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_140.xml. L'ID XML (140) peut differer de la position IDE (140).

---

## 2. TABLES (3 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #196 | `caisse_article` | gestion_article_session | **W** | 2x |
| #77 | `cafil055_dat` | articles_________art | R | 1x |
| #197 | `caisse_artstock` | articles_en_stock | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

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

> Total: 118 variables mappees

---

## 5. EXPRESSIONS (14 total, 9 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{32768,1}` | `VG.USER` |
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `{0,1}` | `{0,1}` |
| 4 | `{0,7}+1` | `{0,7}+1` |
| 5 | `'O'` | `'O'` |
| 6 | `'A'` | `'A'` |
| 7 | `'D'` | `'D'` |
| 8 | `'P'` | `'P'` |
| 9 | `'F'` | `'F'` |
| 10 | `'ART'` | `'ART'` |
| 11 | `{0,4}` | `{0,4}` |
| 12 | `{0,5}` | `{0,5}` |
| 13 | `{0,3}` | `{0,3}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 ( W / 2 R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 14 |
| Expressions 100% decodees | 9 (64%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
