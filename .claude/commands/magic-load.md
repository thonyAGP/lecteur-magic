---
description: Charge un projet Magic Unipaas pour analyse
arguments:
  - name: path
    description: Chemin vers le dossier Source du projet Magic
    required: true
---

# Chargement du projet Magic

Tu vas charger et indexer un projet Magic Unipaas situe dans : `$ARGUMENTS`

## Etapes

1. **Verifier la structure du projet**
   - Lire `Progs.xml` pour l'arborescence des programmes
   - Lire `ProgramHeaders.xml` pour les metadonnees
   - Lire `DataSources.xml` pour les tables
   - Verifier la presence de `Comps.xml` pour les composants partages

2. **Extraire les informations cles**
   - Nombre total de programmes
   - Structure des dossiers (Folders)
   - Composants externes references
   - Tables definies localement vs partagees

3. **Afficher un resume**
   Format attendu :
   ```
   Projet Magic charge : [NOM]
   Chemin : [PATH]

   Programmes : X programmes dans Y dossiers
   Tables : Z tables (locales: A, partagees: B)
   Composants : liste des .ecf references

   Commandes disponibles :
   - /magic-tree : Afficher l'arborescence
   - /magic-analyze <id> : Analyser un programme
   - /magic-tables : Lister les tables
   - /magic-migrate <id> --target=ts|cs|py : Migrer un programme
   ```

## References a consulter

Pour comprendre la structure des fichiers XML, consulter :
- `skills/magic-unipaas/references/xml-format-spec.md`
- `skills/magic-unipaas/references/arborescence.md`

## Important

- Memoriser le chemin du projet pour les commandes suivantes
- Ne pas lire les fichiers Prg_XXX.xml a ce stade (trop nombreux)
- Identifier le type de projet (REF = tables, PBP = editions, PBG = batch, PVE = caisse)
