# ADH IDE 206 - Visualisation pooling

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_205.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 206 |
| **Fichier XML** | Prg_205.xml |
| **Description** | Visualisation pooling |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Telephone |

> **Note**: Ce programme est Prg_205.xml. L'ID XML (205) peut differer de la position IDE (206).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #476 | `%club_user%_caisse_cpte_chgt_act` | comptes_pour_changer_activite | R | 2x |

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

## 5. EXPRESSIONS (14 total, 8 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 2 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 2 | `Date ()` | `Date ()` |
| 3 | `{32768,2}` | `VG.Retour Chariot` |
| 4 | `IF ({0,2}='COM',MlsTrans ('TELEPHONE'),MlsTrans ('MONETIQ...` | `IF ({0,2}='COM',MlsTrans ('TELEPHONE'),MlsTrans ('MONETIQ...` |
| 5 | `IF ({0,4},MlsTrans ('Problème sur le pooling'),'Ok')` | `IF ({0,4},MlsTrans ('Problème sur le pooling'),'Ok')` |
| 6 | `IF ({0,4},11,1)` | `IF ({0,4},11,1)` |
| 1 | `GetHostName ()` | `GetHostName ()` |
| 2 | `Date ()` | `Date ()` |
| 3 | `{32768,2}` | `VG.Retour Chariot` |
| 4 | `IF ({0,2}='COM',MlsTrans ('TELEPHONE'),MlsTrans ('MONETIQ...` | `IF ({0,2}='COM',MlsTrans ('TELEPHONE'),MlsTrans ('MONETIQ...` |
| 5 | `IF ({0,4},MlsTrans ('Problème sur le pooling'),'Ok')` | `IF ({0,4},MlsTrans ('Problème sur le pooling'),'Ok')` |
| 6 | `IF ({0,4},11,1)` | `IF ({0,4},11,1)` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 14 |
| Expressions 100% decodees | 8 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
