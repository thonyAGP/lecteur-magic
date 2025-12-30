---
description: Analyse en detail un programme Magic et explique sa logique
arguments:
  - name: program_id
    description: ID du programme a analyser
    required: true
---

# Analyse de programme Magic

Analyse le programme Magic ID : `$ARGUMENTS`

## Etapes

1. **Localiser le programme**
   - Lire `ProgramHeaders.xml` pour trouver les metadonnees
   - Ouvrir `Prg_[ID].xml` pour le code source

2. **Extraire la structure**
   Depuis le fichier Prg_XXX.xml :

   **Header**
   - Description, TaskType, Parameters
   - MainProgram (Y/N)
   - Resident (Y/N)

   **Resource > DB (DataObjects)**
   - Tables utilisees (MainSource, Links)
   - Mode d'acces (R=Read, W=Write)

   **Resource > Columns**
   - Variables definies (Real, Virtual, Parameter)
   - Types de donnees

   **Information**
   - Index utilise (Key)
   - Range et Locate (filtres)
   - Permissions (AllowModify, AllowCreate, etc.)

   **TaskLogic**
   - Task Prefix (Level=T, Type=P)
   - Task Suffix (Level=T, Type=S)
   - Record Prefix (Level=R, Type=P)
   - Record Main (Level=R, Type=M)
   - Record Suffix (Level=R, Type=S)
   - Handlers (Level=H)

3. **Decoder les expressions**
   Pour chaque expression dans `<Expressions>` :
   - Decoder les entites XML (&lt; &gt; &amp;)
   - Identifier les references {context,field}
   - Identifier les fonctions utilisees

4. **Afficher l'analyse**
   Format :
   ```
   Programme [ID] : [Description]
   Type : [Batch/Online/Internal]
   Parametres : [liste avec types]

   === Tables ===
   Main Source : [table] (Index: [key])
   Links :
   - [table] via [colonnes] (Mode: [R/W])

   === Variables ===
   [liste des variables importantes]

   === Logique ===

   Task Prefix:
   - [description des operations]

   Record Main:
   - [description des operations]

   Record Suffix:
   - [description des operations]

   === Expressions Cles ===
   [expressions importantes avec explication]

   === Programmes Appeles ===
   - [ID] [Description] (via CallTask)
   ```

## References a consulter

**Logique et Structure**
- `skills/magic-unipaas/references/logic-structure.md` - Structure Task/Record
- `skills/magic-unipaas/references/logic-operations.md` - Operations (CallTask, Update, etc.)
- `skills/magic-unipaas/references/expressions-syntax.md` - Syntaxe des expressions
- `skills/magic-unipaas/references/data-view-structure.md` - MainSource, Links, Range, Locate
- `skills/magic-unipaas/references/magic-functions.md` - Reference des fonctions
- `skills/magic-unipaas/references/advanced-patterns.md` - Patterns avances

**Exports, Editions, Ecrans**
- `skills/magic-unipaas/references/exports-guide.md` - IO, Media T/G/S/R, FormIO
- `skills/magic-unipaas/references/editions-guide.md` - Rapports, Area, Groups
- `skills/magic-unipaas/references/ecrans-guide.md` - Controles GUI, Events
- `skills/magic-unipaas/references/gaps-analysis-complete.md` - Reference complete XML

## Important

- Expliquer la logique metier, pas juste la structure XML
- Identifier le but fonctionnel du programme
- Signaler les patterns complexes (boucles imbriquees, transactions)
- Lister les dependances vers d'autres programmes
