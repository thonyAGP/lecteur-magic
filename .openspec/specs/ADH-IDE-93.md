# ADH IDE 93 - Creation Pied Facture

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_93.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 93 |
| **Fichier XML** | Prg_93.xml |
| **Description** | Creation Pied Facture |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Factures |

> **Note**: Ce programme est Prg_93.xml. L'ID XML (93) peut differer de la position IDE (93).

---

## 2. TABLES (2 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #867 | `log_maj_tpe` | log_maj_tpe | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | R | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

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

> Total: 128 variables mappees

---

## 5. EXPRESSIONS (16 total, 8 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `p.Compte` |
| 2 | `{0,4}` | `P.Flaguee` |
| 3 | `{0,24}` | `{0,24}` |
| 4 | `999` | `999` |
| 5 | `{0,2}` | `p.Filiation` |
| 6 | `{0,3}` | `p.NumFac` |
| 7 | `0` | `0` |
| 8 | `{0,38}+{0,25}` | `{0,38}+{0,25}` |
| 9 | `{0,47}+{0,25}` | `{0,47}+{0,25}` |
| 10 | `{0,39}+Round(({0,26}/(1+{0,24}/100)*{0,24}/100),12,2)` | `{0,39}+Round(({0,26}/(1+{0,24}/100)*{0,24}/100),12,2)` |
| 11 | `{0,48}+Round(({0,26}/(1+{0,24}/100)*{0,24}/100),12,2)` | `{0,48}+Round(({0,26}/(1+{0,24}/100)*{0,24}/100),12,2)` |
| 12 | `{0,40}+{0,26}` | `{0,40}+{0,26}` |
| 13 | `{0,49}+{0,26}` | `{0,49}+{0,26}` |
| 14 | `IF({32768,77},'TRUE'LOG,{0,30}<>'R')` | `IF(VG.Interfaces OB,'TRUE'LOG,{0,30}<>'R')` |
| 15 | `CndRange({32768,53},'O')` | `CndRange(VG.Facture V3.00,'O')` |
| 16 | `IsFirstRecordCycle(0)` | `IsFirstRecordCycle(0)` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 ( W /  R) |
| Parametres | 5 |
| Variables locales | 5 |
| Expressions | 16 |
| Expressions 100% decodees | 8 (50%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
