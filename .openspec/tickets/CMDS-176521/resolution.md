# Resolution CMDS-176521

> **Jira** : <a href="https://clubmed.atlassian.net/browse/CMDS-176521" target="_blank">CMDS-176521</a>

## Statut: BUG IDENTIFIÉ - FIX REQUIS

---

## Symptôme

**Bug d'affichage du prix remisé dans le POS (module PVE)**

- Prix attendu avec -10% : **5,400 JPY**
- Prix affiché : **41,857** (valeur incorrecte)
- Prix facturé à la validation : **CORRECT**

---

## Programme concerné

### PVE IDE 181 - Main Sale-664

**Fichier source** : `D:\Data\Migration\XPA\PMS\PVE\Source\Prg_181.xml`

---

## CAUSE RACINE

### Expression 33 (ligne 34526)

```magic
Round({1,13}*(1-ExpCalc('15'EXP)/100),10,{32768,43})
```

### Le Bug

**`{1,13}` référence une variable qui N'EXISTE PAS dans le parent !**

**Task 19 (Forfait_Package=> account)** - Variables disponibles :

| Index | Variable | Description |
|-------|----------|-------------|
| 16 | P. Customer | ID client |
| 17 | P. Package Id OUT | ID package sortie |
| 18 | P. Action type | Type action |
| ... | ... | ... |
| **31** | **P.Prix** | **PRIX DU PRODUIT** |
| 32 | P.Montant PrePaid | Montant prépayé |
| ... | ... | ... |

**Il n'y a PAS de variable index 13 dans Task 19 !**

Le prix est stocké à l'**index 31** (`P.Prix`), pas à l'index 13.

---

## Correction

### AVANT (bug)
```magic
Round({1,13}*(1-ExpCalc('15'EXP)/100),10,{32768,43})
```

### APRÈS (fix)
```magic
Round({1,31}*(1-ExpCalc('15'EXP)/100),10,{32768,43})
```

### Localisation exacte

| Élément | Valeur |
|---------|--------|
| **Programme** | PVE IDE 181 - Main Sale-664 |
| **Fichier** | Prg_181.xml |
| **Ligne XML** | 34526 |
| **Task** | Task 22 (SALE package_Creat_projet_FBO) |
| **Expression** | Expression 33 |

---

## Hiérarchie des tâches

```
Task 1 - Main Sale-664 (Root)
  └── Task 19 - Forfait_Package=> account
        └── Task 22 - SALE package_Creat_projet_FBO
              └── Expression 33 (calcul prix remisé)
```

**Depuis Task 22 :**
- `{0,...}` = Task 22 (seulement Variable 2)
- `{1,...}` = Task 19 (Variables 16-65, **PAS de 13**)
- `{1,13}` → **Variable inexistante** → valeur aléatoire/résiduelle

---

## Pourquoi 41,857 ?

Quand Magic référence une variable inexistante, il peut :
1. Retourner 0 (comportement normal)
2. Utiliser une valeur résiduelle en mémoire
3. Remonter à un niveau parent supérieur

La valeur **41,857** correspond probablement au **solde du compte** (`V.SoldeCompte` - index 59 dans Task 1) qui "fuite" via le contexte mémoire.

---

## Validation requise

- [ ] Modifier Expression 33 : remplacer `{1,13}` par `{1,31}`
- [ ] Tester avec différents % de remise (5%, 10%, 50%, 100%)
- [ ] Vérifier que le prix facturé reste correct
- [ ] Tester sur environnement de dev avant production

---

## Programmes similaires à vérifier

| Programme | Description | Même bug potentiel ? |
|-----------|-------------|---------------------|
| PVE IDE 284 | Main Sale Sale Bar Code | **OUI** - même structure |
| PVE IDE 360 | Main Sale-664 (copie) | **OUI** - à vérifier |

---

## Références Magic IDE

### Programme

| IDE | Projet | Nom Public | Description |
|-----|--------|------------|-------------|
| **PVE IDE 181** | PVE | Main Sale-664 | Vente principale 664 |

### Tâches concernées

| Task | ISN_2 | Description | Rôle |
|------|-------|-------------|------|
| Task 1 | 1 | Main Sale-664 | Root |
| Task 19 | 19 | Forfait_Package=> account | Parent du calcul |
| Task 22 | 22 | SALE package_Creat_projet_FBO | Contient Expression 33 |

### Variables Task 19 (pertinentes)

| Index | Variable | Usage |
|-------|----------|-------|
| 31 | P.Prix | **Prix produit (CORRECT)** |
| 32 | P.Montant PrePaid | Montant prépayé |
| 35 | v Lien Remise Great Members | Lien remise |

---

*Dernière mise à jour: 2026-01-09*
*Bug identifié - Fix: remplacer {1,13} par {1,31} dans Expression 33*
