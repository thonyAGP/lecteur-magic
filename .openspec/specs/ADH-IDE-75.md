# ADH IDE 75 - Creation Pied Facture

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_75.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 75 |
| **Fichier XML** | Prg_75.xml |
| **Description** | Creation Pied Facture |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Extrait de Compte |

> **Note**: Ce programme est Prg_75.xml. L'ID XML (75) peut differer de la position IDE (75).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #867 | `log_maj_tpe` | log_maj_tpe | **W** | 1x |

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

## 5. EXPRESSIONS (12 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Val(Fill('9',10),'10')` | `Val(Fill('9',10),'10')` |
| 2 | `{0,4}` | `P.Montant Ttc` |
| 3 | `999` | `999` |
| 4 | `{0,12}+({0,5}/(1+{0,4}/100))` | `{0,12}+({0,5}/(1+P.Montant Ttc/100))` |
| 5 | `{0,21}+({0,5}/(1+{0,4}/100))` | `{0,21}+({0,5}/(1+P.Montant Ttc/100))` |
| 6 | `{0,13}+Round(({0,5}/(1+{0,4}/100)*{0,4}/100),12,2)` | `{0,13}+Round(({0,5}/(1+P.Montant Ttc/100)*P.Montant Ttc/1...` |
| 7 | `{0,22}+Round(({0,5}/(1+{0,4}/100)*{0,4}/100),12,2)` | `{0,22}+Round(({0,5}/(1+P.Montant Ttc/100)*P.Montant Ttc/1...` |
| 8 | `{0,14}+{0,5}` | `{0,14}+{0,5}` |
| 9 | `{0,23}+{0,5}` | `{0,23}+{0,5}` |
| 10 | `{0,1}` | `P.Compte Gm` |
| 11 | `{0,2}` | `P.Filiation` |
| 12 | `{0,3}` | `P.Taux Tva` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 5 |
| Variables locales | 5 |
| Expressions | 12 |
| Expressions 100% decodees | 6 (50%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
