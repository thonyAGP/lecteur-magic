---
description: Recherche dans les programmes Magic
arguments:
  - name: query
    description: "Terme a rechercher (fonction, table, texte)"
    required: true
---

# Recherche dans le projet Magic

Recherche : `$ARGUMENTS`

## Types de recherche

1. **Par nom de fonction**
   Trouver tous les programmes utilisant une fonction Magic
   ```
   /magic-search GetParam
   /magic-search CallProg
   /magic-search DataViewToText
   ```

2. **Par reference de table**
   Trouver les programmes utilisant une table
   ```
   /magic-search table:38
   /magic-search DSOURCE:572
   ```

3. **Par texte dans les expressions**
   Recherche dans les ExpSyntax
   ```
   /magic-search "SUPERVISOR"
   /magic-search "hasRight"
   ```

4. **Par programme appele**
   Trouver qui appelle un programme
   ```
   /magic-search calls:493
   /magic-search prog:671
   ```

## Etapes

1. **Parser la requete**
   - Detecter le type de recherche (fonction, table, texte, appel)
   - Preparer le pattern de recherche

2. **Scanner les fichiers**
   - Pour chaque Prg_XXX.xml
   - Chercher dans les Expressions, CallTask, DB references

3. **Afficher les resultats**
   ```
   Recherche: [query]
   Resultats: X occurrences dans Y programmes

   [671] Export CSV Adherents
   ├── Expression 15: GetParam('SOCIETE')
   └── Expression 23: GetParam('LANGUE')

   [672] Liste cotisations
   └── Expression 8: GetParam('NRO_CPTE')

   [493] Traitement batch
   └── TaskLogic ligne 45: CallProg avec GetParam

   Utiliser /magic-analyze <id> pour plus de details
   ```

## Patterns frequents a rechercher

| Pattern | Description |
|---------|-------------|
| `hasRight` | Verification de droits utilisateur |
| `GetParam` | Lecture de parametres globaux |
| `SetParam` | Ecriture de parametres |
| `CallProg` | Appels dynamiques de programmes |
| `DbDel` | Suppressions de donnees |
| `DataViewToText` | Exports CSV |
| `File2Blb` | Chargement de fichiers |
| `Translate` | Noms logiques |

## References

- `skills/magic-unipaas/references/magic-functions.md`
- `skills/magic-unipaas/references/advanced-patterns.md`
