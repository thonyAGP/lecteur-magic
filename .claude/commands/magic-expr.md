---
description: Decode et explique une expression Magic
arguments:
  - name: expression
    description: Expression Magic a decoder (entre guillemets si espaces)
    required: true
---

# Decodage d'expression Magic

Decode et explique l'expression : `$ARGUMENTS`

## Etapes

1. **Decoder les entites XML**
   - `&lt;` → `<`
   - `&gt;` → `>`
   - `&amp;` → `&`

2. **Identifier les elements**

   **References de champs**
   - `{0,N}` : Variable N de la tache courante
   - `{32768,N}` : Variable N du Main Program
   - `{1,N}` : Parametre N du parent

   **References speciales**
   - `'{id,comp}'PROG` : Programme id du composant comp
   - `'{id,comp}'DSOURCE` : Table id du composant comp
   - `'{id,comp}'VAR` : Variable par reference
   - `'{id,comp}'FORM` : Formulaire

   **Operateurs**
   - Arithmetiques : `+`, `-`, `*`, `/`, `^`, `MOD`
   - Comparaison : `=`, `<>`, `<`, `>`, `<=`, `>=`
   - Logiques : `AND`, `OR`, `NOT`
   - Concatenation : `&`

   **Fonctions**
   Consulter `skills/magic-unipaas/references/magic-functions.md`

3. **Afficher l'explication**
   ```
   Expression originale:
   [expression brute]

   Expression decodee:
   [expression avec XML decode]

   Analyse:
   - Type de resultat: [Alpha/Numeric/Logical/Date/Time]
   - References utilisees:
     - {0,5} : Variable 5 (contexte courant)
     - {32768,10} : Variable 10 (Main Program)
   - Fonctions appelees:
     - IF() : Condition ternaire
     - Trim() : Supprime les espaces

   Logique:
   [explication en francais de ce que fait l'expression]

   Equivalent TypeScript:
   [code TypeScript]

   Equivalent C#:
   [code C#]

   Equivalent Python:
   [code Python]
   ```

## Exemples

**Expression simple**
```
{0,1} > 10
→ Variable 1 superieure a 10
→ TypeScript: fields.v1 > 10
```

**Condition IF**
```
IF({0,14}='F','Me',IF({0,14}<>'','M',''))
→ Si var14 = 'F' alors 'Me'
  Sinon si var14 non vide alors 'M'
  Sinon chaine vide
→ TypeScript: fields.v14 === 'F' ? 'Me' : (fields.v14 !== '' ? 'M' : '')
```

**CASE**
```
CASE({0,12},'TR','Gare','PL','Aeroport','TE','Terminal',{0,12})
→ Switch sur var12:
  'TR' → 'Gare'
  'PL' → 'Aeroport'
  'TE' → 'Terminal'
  default → valeur de var12
```

**Reference speciale**
```
CallProg('{493,-1}'PROG, DbName('{38,2}'DSOURCE))
→ Appelle le programme 493 (local)
  avec le nom physique de la table 38 (composant 2)
```

## References

- `skills/magic-unipaas/references/expressions-syntax.md`
- `skills/magic-unipaas/references/magic-functions.md`
- `skills/magic-unipaas/references/advanced-patterns.md`
