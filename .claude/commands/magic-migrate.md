---
description: Migre un programme Magic vers TypeScript, C# ou Python
arguments:
  - name: args
    description: "ID du programme et options (ex: 671 --target=ts)"
    required: true
---

# Migration de programme Magic

Migre le programme Magic vers un langage moderne.

Arguments : `$ARGUMENTS`

## Parsing des arguments

Format attendu : `<program_id> --target=<ts|cs|py> [--output=<path>]`

- `program_id` : ID du programme a migrer
- `--target` : Langage cible (ts=TypeScript, cs=C#, py=Python)
- `--output` : Chemin de sortie (optionnel)

## Etapes de migration

1. **Analyser le programme source**
   - Utiliser la meme logique que `/magic-analyze`
   - Extraire toutes les structures

2. **Mapper les types de donnees**
   Selon `skills/magic-unipaas/references/data-types-mapping.md` :

   | Magic | TypeScript | C# | Python |
   |-------|------------|-----|--------|
   | Alpha | string | string | str |
   | Numeric | number/Decimal | decimal | Decimal |
   | Logical | boolean | bool | bool |
   | Date | Date | DateOnly | date |
   | Time | Date | TimeOnly | time |
   | BLOB | Buffer | byte[] | bytes |

3. **Convertir les expressions**
   Pour chaque expression Magic, generer l'equivalent :

   **TypeScript**
   ```typescript
   // IF({0,1} > 10, 'Yes', 'No')
   (fields.v1 > 10 ? 'Yes' : 'No')

   // Trim({0,5})
   fields.v5.trim()

   // {0,1} & ' - ' & {0,2}
   `${fields.v1} - ${fields.v2}`
   ```

   **C#**
   ```csharp
   // IF({0,1} > 10, 'Yes', 'No')
   (Fields.V1 > 10 ? "Yes" : "No")

   // Trim({0,5})
   Fields.V5.Trim()
   ```

   **Python**
   ```python
   # IF({0,1} > 10, 'Yes', 'No')
   'Yes' if fields.v1 > 10 else 'No'

   # Trim({0,5})
   fields.v5.strip()
   ```

4. **Generer la structure du code**

   **TypeScript**
   ```typescript
   interface Program671Input {
     dateDebut: Date;
     dateFin: Date;
   }

   async function program671(input: Program671Input): Promise<void> {
     // Task Prefix
     // ...

     // Record Loop
     for await (const record of queryAdherents(input)) {
       // Record Prefix
       // Record Main
       // Record Suffix
     }

     // Task Suffix
   }
   ```

5. **Convertir les operations**
   Selon `skills/magic-unipaas/references/logic-operations.md` :

   | Magic | TypeScript |
   |-------|------------|
   | CallTask | await callProgram(...) |
   | Update | variable = expression |
   | Evaluate | expression (side effect) |
   | STP | throw new Error(...) ou alert(...) |
   | FormIO | await writeToFile(...) |

6. **Afficher le code genere**
   ```
   Programme [ID] : [Description]
   Migre vers : [TypeScript/C#/Python]

   === Code Genere ===
   [code source complet]

   === Notes de Migration ===
   - [avertissements]
   - [fonctions non supportees]
   - [dependances requises]
   ```

## References

**Types et Operations**
- `skills/magic-unipaas/references/data-types-mapping.md` - Mapping des types
- `skills/magic-unipaas/references/logic-operations.md` - Operations logiques
- `skills/magic-unipaas/references/magic-functions.md` - Fonctions Magic (200+)
- `skills/magic-unipaas/references/advanced-patterns.md` - Patterns avances

**Exports, Editions, Ecrans**
- `skills/magic-unipaas/references/exports-guide.md` - Conversion IO/FormIO vers FileWriter
- `skills/magic-unipaas/references/editions-guide.md` - Conversion rapports vers PDF
- `skills/magic-unipaas/references/ecrans-guide.md` - Conversion Forms vers React/HTML

## Important

- Preserver la logique metier exacte
- Ajouter des commentaires explicatifs
- Signaler les fonctions Magic sans equivalent direct
- Proposer des alternatives pour les patterns UI (STP, SetCrsr)
