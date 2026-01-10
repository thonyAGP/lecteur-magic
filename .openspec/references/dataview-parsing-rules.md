# Data View Parsing Rules - Observations Brutes

> Document de référence basé sur les screenshots IDE Magic vs parsing XML.
> Ces règles sont "brutes" et validées visuellement - ne pas modifier sans validation IDE.

## Date: 2026-01-10

### Source: ADH IDE 160 (Prg_159.xml) - Task 160.1 (ISN_2=2)

---

## Règle 1: Numérotation Variables GLOBALE

Les variables sont numérotées **globalement** sur tout le programme, pas par tâche.

| Tâche | Variables | Plage |
|-------|-----------|-------|
| Main (160) | A à GE | 1-187 environ |
| Subtask 160.1 | GI à GV | Continue après main |

**Implication**: Pour parser une sous-tâche, il faut connaître le nombre de variables de la tâche parente.

---

## Règle 2: Column IDs Non-Séquentiels

Les IDs de colonnes dans les Links sont les **vrais IDs de la table**, pas séquentiels.

Exemple observé dans screenshot Task 160.1:
```
ID Column | Var | Type    | Init
---------|-----|---------|-----
1        | GI  | Alpha   | gmr_societe
2        | GJ  | Numeric |
3        | GK  | Numeric |
4        | GL  | Alpha   |
5        | GM  | Alpha   |
8        | GN  | Date    | Date()
9        | GO  | Time    | Time()
10       | GP  | Alpha   | VG.LOGIN
```

Note: IDs 6 et 7 absents - ce sont les vrais IDs de colonnes de la table, pas un compteur.

---

## Règle 3: Mapping Composants (ItemIsn)

Quand un programme ADH référence `obj=1047`, c'est un **ItemIsn** de composant.

**Flux de résolution:**
1. ADH/Comps.xml: `<ItemIsn val="1047"/>` → `<id val="934"/>` + `<PublicName val="selection_enregistrement_div"/>`
2. REF/DataSources.xml: `id="934"` → Table "selection enregistrement diver" (Memory)

**TODO**: Implémenter ce mapping dans le script de parsing.

---

## Règle 4: Table code_fidelisation

Dans le screenshot Expression Rules de ADH 160:
- Variables GA, GB, GC → Table `code_fidelisation` (obj=800?)
- Cette table est dans la **tâche principale**, pas dans la subtask 160.1

Le parsing XML de la subtask 160.1 montrait `stat_vendeur` (obj=844) car c'est la table de **cette** sous-tâche.

**Conclusion**: Chaque tâche a sa propre Data View, mais les variables sont globales.

---

## Règle 5: Colonne Init

La colonne Init contient des expressions d'initialisation:
- `gmr_societe` → Variable globale
- `Date()` → Fonction date courante
- `Time()` → Fonction heure courante
- `VG.LOGIN` → Variable globale LOGIN

Ces valeurs sont dans l'attribut `<Init>` du XML.

---

## Screenshots de Référence

### Screenshot 1: Task 160.1 Data View
- Montre la structure exacte avec IDs colonnes non-séquentiels
- Variables GI à GP visibles
- Colonne Init avec expressions

### Screenshot 2: Expression Rules (Programme complet)
- Liste TOUTES les variables du programme (main + subtasks)
- Mapping complet Variable → Type → Table → Colonne
- Variables GA, GB, GC → code_fidelisation dans main task

---

## À Valider

- [ ] Compter exactement les variables de la tâche main pour connaître l'offset subtask
- [ ] Implémenter résolution ItemIsn → REF table id
- [ ] Parser la colonne Init
- [ ] Tester sur d'autres programmes pour valider les règles

---

## Scripts Associés

- `tools/scripts/parse-dataview.ps1` - Parser actuel (à améliorer)
- `tools/scripts/debug-param.ps1` - Debug paramètres
- `tools/scripts/debug-cols.ps1` - Debug colonnes
- `tools/scripts/check-prg.ps1` - Vérification header programme
