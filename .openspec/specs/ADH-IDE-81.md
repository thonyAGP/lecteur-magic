# ADH IDE 81 -    Card scan create

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_81.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 81 |
| **Fichier XML** | Prg_81.xml |
| **Description** |    Card scan create |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 1 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_81.xml. L'ID XML (81) peut differer de la position IDE (81).

---

## 2. TABLES (2 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #312 | `ezcard` | ez_card | R | 1x |

---

## 3. PARAMETRES D'ENTREE (1)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | p.card id | ALPHA | - |
| P2 | v.card id | ALPHA | - |
| P3 | r.card | LOGICAL | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-113}` | v.card id | ALPHA | - |

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

> Total: 124 variables mappees

---

## 5. EXPRESSIONS (11 total, 3 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,2}` | `r.card` |
| 2 | `''` | `''` |
| 3 | `IF ({0,8}='V',MlsTrans ('Cette carte appartient à')&' :'&...` | `IF ({0,8}='V',MlsTrans ('Cette carte appartient à')&' :'&...` |
| 4 | `NOT ({0,3})` | `NOT ({0,3})` |
| 5 | `{0,5}` | `{0,5}` |
| 6 | `{0,6}` | `{0,6}` |
| 7 | `{0,7}` | `{0,7}` |
| 8 | `{0,3} OR Len (Trim ({0,2}))<10` | `{0,3} OR Len (Trim (r.card))<10` |
| 9 | `NOT ({0,3})` | `NOT ({0,3})` |
| 10 | `{0,2}` | `r.card` |
| 11 | `{0,3}` | `{0,3}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (0 W / 2 R) |
| Parametres | 1 |
| Variables locales | 3 |
| Expressions | 11 |
| Expressions 100% decodees | 3 (27%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
