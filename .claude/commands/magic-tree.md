---
description: Affiche l'arborescence des programmes du projet Magic charge
arguments:
  - name: folder
    description: Nom ou ID du dossier a afficher (optionnel, affiche tout si omis)
    required: false
---

# Arborescence des programmes Magic

Affiche l'arborescence des programmes du projet Magic actuellement charge.

Filtre optionnel : `$ARGUMENTS`

## Etapes

1. **Lire la structure des dossiers**
   Depuis `Progs.xml` > `<Folders>` :
   - Chaque `<Folder>` a un `id`, `Description`, `StartsAt`, `NumberOfEntries`
   - `StartsAt` = position dans `ProgramsRepositoryOutLine`
   - `NumberOfEntries` = nombre de programmes dans ce dossier

2. **Lire la liste des programmes**
   Depuis `Progs.xml` > `<ProgramsRepositoryOutLine>` :
   - Liste ordonnee des ID de programmes
   - Position = index dans cette liste

3. **Enrichir avec les metadonnees**
   Depuis `ProgramHeaders.xml` :
   - `id` : Numero du programme
   - `Description` : Nom du programme
   - `TaskType` : B=Batch, O=Online, I=Internal
   - `Parameters` : Nombre de parametres

4. **Afficher l'arborescence**
   Format :
   ```
   Projet: [NOM]

   [Dossier 1] (X programmes)
   ├── [ID] Description (Type) [Params]
   ├── [ID] Description (Type) [Params]
   └── [ID] Description (Type) [Params]

   [Dossier 2] (Y programmes)
   ├── [ID] Description (Type) [Params]
   └── ...
   ```

   Exemple :
   ```
   Editions (15 programmes)
   ├── [671] Export CSV Adherents (Batch) [2 params]
   ├── [672] Liste des cotisations (Online)
   └── [673] Etat des paiements (Batch) [3 params]
   ```

## References

- `skills/magic-unipaas/references/arborescence.md`
- `skills/magic-unipaas/references/xml-format-spec.md`

## Tips

- Les types de taches : B=Batch/Browse, O=Online/Output, I=Internal
- Un programme avec beaucoup de parametres est souvent un programme generique
- Les programmes numerotes proches sont souvent lies fonctionnellement
