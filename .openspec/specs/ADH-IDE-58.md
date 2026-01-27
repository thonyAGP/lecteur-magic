# ADH IDE 58 - Incremente N° de Facture

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_58.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 58 |
| **Fichier XML** | Prg_58.xml |
| **Description** | Incremente N° de Facture |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_58.xml. L'ID XML (58) peut differer de la position IDE (58).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (2)

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

> Total: 122 variables mappees

---

## 5. EXPRESSIONS (6 total, 2 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,6}+1` | `{0,6}+1` |
| 2 | `'C'` | `'C'` |
| 3 | `IF({0,2}='','F'&DStr(Date(),'YYMM'),{0,2})` | `IF({0,2}='','F'&DStr(Date(),'YYMM'),{0,2})` |
| 4 | `Val( IF ({0,2}='', DStr(Date(),'YYMM'),Trim({0,2})) &
St...` | `Val( IF ({0,2}='', DStr(Date(),'YYMM'),Trim({0,2})) &
St...` |
| 5 | `1` | `1` |
| 6 | `{0,6}=9999 AND {0,2}<>''` | `{0,6}=9999 AND {0,2}<>''` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 2 |
| Expressions | 6 |
| Expressions 100% decodees | 2 (33%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
