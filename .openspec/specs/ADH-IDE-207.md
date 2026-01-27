# ADH IDE 207 - Suppression demande verif pool

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_206.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 207 |
| **Fichier XML** | Prg_206.xml |
| **Description** | Suppression demande verif pool |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Telephone |

> **Note**: Ce programme est Prg_206.xml. L'ID XML (206) peut differer de la position IDE (207).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #476 | `%club_user%_caisse_cpte_chgt_act` | comptes_pour_changer_activite | **W** | 2x |

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

## 5. EXPRESSIONS (4 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 2 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 1 | `GetHostName ()` | `GetHostName ()` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 4 |
| Expressions 100% decodees | 4 (100%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
