---
description: Execute le pipeline V7.2 puis genere l'algorigramme metier S1-S6 via Claude
arguments:
  - name: args
    description: "PROJECT IDE_POSITION (ex: ADH 237)"
    required: true
---

# Spec Pipeline + Algorigramme Metier

> Pipeline V7.2 complet puis synthese metier Claude (S1-S6)

## Etape 1 : Parsing des arguments

Extraire PROJECT et IDE_POSITION depuis `$ARGUMENTS`.
Format attendu : `PROJECT IDE_POSITION` (ex: `ADH 237`, `PBG 15`).

## Etape 2 : Executer le pipeline PS1

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "tools/spec-pipeline-v72/Run-SpecPipeline.ps1" -Project "{PROJECT}" -IdePosition {IDE_POSITION}
```

Attendre la fin. Verifier que les 5 phases sont [OK].
Si echec, s'arreter et afficher l'erreur.

Recuperer dans la sortie console :
- Le chemin de `algo.json` (dans `tools/spec-pipeline-v72/output/{PROJECT}-IDE-{IDE_POSITION}/algo.json`)
- Le chemin de la spec (dans `.openspec/specs/{PROJECT}-IDE-{IDE_POSITION}.md`)

## Etape 3 : Lire algo.json

Lire le fichier `tools/spec-pipeline-v72/output/{PROJECT}-IDE-{IDE_POSITION}/algo.json`.

Si le fichier n'existe pas ou est vide :
- Afficher un warning : "algo.json absent, algorigramme basique conserve"
- STOP - ne pas modifier la spec

## Etape 4 : Synthese Claude S1-S6

Appliquer les 6 regles de synthese definies dans `skills/algorigramme/SKILL.md` sur le JSON :

### S1 - Identifier le domaine principal

Calculer un score pour chaque mot-cle candidat :
- **Nom du programme** (poids x3) : Mots du champ `program`
- **Variable la plus frequente** dans les conditions (poids x2) : Compter les occurrences de chaque variable dans `conditions[].decoded`
- **Tables en ecriture** (poids x1) : Noms metier des tables dans `tables_write`
- **Callees** (poids x1) : Noms des sous-programmes dans `callees`

Le domaine avec le score le plus eleve = domaine principal.

### S2 - Extraire les etapes cles

1. Prendre les taches **level 1** (enfants directs de la racine)
2. Filtrer par pertinence metier :
   - Garder : taches avec `has_form=true` (ecrans de saisie)
   - Garder : taches avec `source_access` W/C/D (side-effects)
   - Garder : taches avec `logic_lines > 20` (logique significative)
   - Evaluer : taches Read avec nom interrogatif (ex: "garantie?", "Gratuite?")
3. Grouper par domaine fonctionnel
4. Chaque groupe = 1 noeud d'algorigramme
5. Reduire a **10-20 noeuds** semantiques

### S3 - Selectionner les decisions

1. Compter les occurrences de chaque variable dans les conditions decodees
2. La variable la plus frequente = Decision principale
   - Si >2 valeurs distinctes → noeud multi-voies (Pattern P2)
   - Si 2 valeurs → noeud binaire (Pattern P1/P3/P4)
3. Decisions secondaires = taches interrogatives (nom finissant par "?")
4. **Eliminer** les conditions de positionnement UI (exp_type N avec valeurs decimales comme 31.125)
5. **Eliminer** les conditions de formatage/label (exp_type A qui construisent des chaines d'affichage)

### S4 - Identifier les noeuds cles metier jaunes

2 criteres simultanes :
1. Lie au domaine principal (identifie en S1)
2. Impact metier significatif (decision ou action qui change le resultat pour le client)

Regles :
- Decisions de routage → bleues (pas jaunes)
- Operations techniques → jamais jaunes
- Maximum 3-5 noeuds jaunes
- Les noeuds jaunes forment un cluster coherent

### S5 - Appliquer les patterns de branchement

4 patterns disponibles :
- **P1** Binaire convergent : `D -->|OUI| NEXT` + `D -->|NON| NEXT`
- **P2** Multi-voies : `D -->|V1| A1 --> CONV` + `D -->|V2| A2 --> CONV`
- **P3** Skip : `D -->|OUI| S1 --> AFTER` + `D -->|NON| AFTER`
- **P4** Fin alternative : `D -->|OK| NEXT --> ENDOK` + `D -->|KO| ENDKO`

### S6 - Generer le Mermaid

5 passes :
1. Declarer les noeuds avec leur forme (Terminal `([])`, Action `[]`, Decision `{}`)
2. Connecter selon le flux metier
3. Appliquer les patterns detectes en S5
4. Styles couleurs : START/ENDOK vert `#3fb950`, ENDKO rouge `#f85149`, Jaunes `#ffeb3b`, Bleus `#58a6ff`
5. Legende : `> **Legende**: Vert = START/END OK | Rouge = END KO | Jaune = Flux [domaine] | Bleu = Decisions`

**Contraintes Mermaid** :
- IDs : prefixe court MAJUSCULES, max 10 chars, sans caracteres speciaux
- Labels en francais, max 25 caracteres
- Pas de guillemets, crochets, parentheses, slashes dans les labels
- Pas de `subgraph`
- Max 20 noeuds
- Un seul START, un ou deux END (OK et/ou KO)

## Etape 5 : Generer la table de justification

Pour chaque noeud du Mermaid, creer une ligne :

```markdown
| Noeud | Source | Justification |
|-------|--------|---------------|
| ... | Tache X.Y / Expression N / Table Z | Explication metier |
```

## Etape 6 : Editer la spec

Dans le fichier `.openspec/specs/{PROJECT}-IDE-{IDE_POSITION}.md`, remplacer la section `### 9.4 Algorigramme` **jusqu'a** `<!-- TAB:Donnees -->`.

Le nouveau contenu doit etre :

```markdown
### 9.4 Algorigramme

```mermaid
flowchart TD
    [... noeuds S6 ...]
    [... styles S6 ...]
```

> **Legende**: Vert = START/END OK | Rouge = END KO | Jaune = Flux [domaine] | Bleu = Decisions

| Noeud | Source | Justification |
|-------|--------|---------------|
| ... | ... | ... |

```

**IMPORTANT** : Conserver le marqueur `<!-- TAB:Donnees -->` intact apres la section.

## Verification finale

Afficher un resume :
- Nombre de noeuds generes
- Domaine principal identifie
- Nombre de noeuds jaunes (cles metier)
- Patterns de branchement utilises
- Chemin de la spec modifiee

---

*Commande creee : 2026-02-02*
*Skill reference : skills/algorigramme/SKILL.md*
