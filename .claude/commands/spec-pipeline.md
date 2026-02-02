---
description: Execute le pipeline V7.2 puis genere l'algorigramme metier S1-S6 via Claude
arguments:
  - name: args
    description: "PROJECT IDE_POSITION (ex: ADH 237)"
    required: true
---

# Spec Pipeline + Algorigramme Metier

> Pipeline V7.2 complet puis synthese metier Claude (S1-S6) + description fonctionnelle enrichie

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

## Etape 4 : Synthese Claude - Description fonctionnelle (section 2)

Réécrire la section `## 2. DESCRIPTION FONCTIONNELLE` de la spec avec une description metier enrichie.

### 4.1 - Grouper les taches par domaine fonctionnel

A partir des taches level 1 dans `algo.json`, regrouper par domaine selon ces criteres :

| Domaine | Criteres de groupement |
|---------|----------------------|
| Controles pre-vente | Taches qui lisent/ecrivent des verrous, flags, tests reseau. Noms contenant "test", "cloture", "blocage", "reseau" |
| Saisie | Taches avec `has_form=true`. Regrouper ecran principal + ecrans conditionnels par type |
| Forfait et tarification | Taches liees a "forfait", "prestation", calcul tarifaire |
| Garantie et Gift Pass | Taches interrogatives ("garantie?", "Gratuite?") + calcul cartes/montants GP |
| Preparation transaction | Taches "Creation Tempo", assemblage des donnees temporaires |
| Reglements | Taches "reglement", "MOP", "TPE", "cheque". Inclure BI/UNI + erreur TPE |
| Transfert | Taches "transfert", "PAX", "affectation", "Boo_Results" (specifique TRF) |
| Liberation chambre | Taches "liberation", "LCO", "Table_1037" (specifique PYR) |
| Finalisation | Taches "RAZ", "deblocage", "increment", "reaffichage" - nettoyage post-transaction |

**Regles de groupement :**
- Un domaine doit contenir au moins 1 tache
- Si un domaine n'a qu'une tache triviale (< 5 lignes, pas de Form), le fusionner avec un domaine voisin
- Les domaines specifiques a un type d'article (TRF, PYR) doivent le mentionner explicitement
- Adapter les domaines au programme analyse (ne pas forcer les 9 domaines ci-dessus si le programme est different)

### 4.2 - Rediger un paragraphe metier par domaine

Pour chaque domaine, ecrire un paragraphe de **3 a 6 lignes** qui explique :
1. **Quoi** : ce que fait ce groupe de taches (objectif metier)
2. **Pourquoi** : la raison metier (securite comptable, obligation legale, workflow utilisateur)
3. **Comment** : les tables lues/ecrites, le mode (Edit, Create, Delete), les conditions d'execution
4. **Quand** : si conditionnel, preciser le type d'article ou la condition qui declenche ce domaine

**Niveau de detail attendu** : Un developpeur qui ne connait pas Magic doit comprendre le processus metier. Mentionner les noms de tables, les variables cles, les modes d'acces. Expliquer les sigles (VRL = Vente Residents Locaux, VSL = Village Sejour Libre, etc.).

### 4.3 - Generer le HTML avec details depliables

Format de sortie pour chaque domaine :

```markdown
### {Nom du domaine}

{Paragraphe metier detaille de 3-6 lignes. Explique le quoi, pourquoi,
comment et quand. Mentionne les tables, variables et conditions.
Liens cliquables vers les programmes appeles : [Nom (IDE N)](PROJECT-IDE-N.md)}

<details>
<summary>{N} taches : {liste courte T12, T16...}</summary>

- **T{N}** - {Nom tache} ({X} lignes{, lit/ecrit TABLE}{, **[ECRAN]** si Form})
- ...

</details>
```

**Regles de formatage :**
- Les liens vers d'autres programmes utilisent le format `[Nom Public (IDE N)](PROJECT-IDE-N.md)` pour etre cliquables dans le viewer
- Les taches avec Form sont marquees **[ECRAN]**
- Les tables sont mentionnees avec leur nom metier (pas le nom technique brut)
- L'acces est indique : "lit" (Read), "ecrit" (Write/Create), "supprime" (Delete)

### 4.4 - Assembler la section 2

Structure finale de la section 2 :

```markdown
## 2. DESCRIPTION FONCTIONNELLE

**{Nom programme}** {resume general en 2-3 lignes : objectif principal,
types d'articles/operations couverts, nombre de taches, caractere
conditionnel du flux}.

### {Domaine 1}

{Paragraphe metier}

<details>
<summary>{N} taches : T1, T2...</summary>

- **T1** - ...
- **T2** - ...

</details>

### {Domaine 2}

...
```

### 4.5 - Editer la spec (section 2)

Dans la spec `.openspec/specs/{PROJECT}-IDE-{IDE_POSITION}.md`, remplacer tout le contenu entre `## 2. DESCRIPTION FONCTIONNELLE` et `## 3.` (exclu) par le nouveau contenu genere.

**IMPORTANT** : Ne pas toucher les sections 1 et 3+. Remplacer UNIQUEMENT la section 2.

## Etape 5 : Synthese Claude - Algorigramme (section 9.4)

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
3. Grouper par domaine fonctionnel (memes domaines qu'a l'etape 4)
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

## Etape 6 : Generer la table de justification

Pour chaque noeud du Mermaid, creer une ligne :

```markdown
| Noeud | Source | Justification |
|-------|--------|---------------|
| ... | Tache X.Y / Expression N / Table Z | Explication metier |
```

## Etape 7 : Editer la spec (section 9.4)

Dans le fichier `.openspec/specs/{PROJECT}-IDE-{IDE_POSITION}.md`, remplacer la section `### 9.4 Algorigramme` **jusqu'a** `<!-- TAB:Donnees -->`.

Le nouveau contenu doit etre :

```markdown
### 9.4 Algorigramme

` ``mermaid
flowchart TD
    [... noeuds S6 ...]
    [... styles S6 ...]
` ``

> **Legende**: Vert = START/END OK | Rouge = END KO | Jaune = Flux [domaine] | Bleu = Decisions

| Noeud | Source | Justification |
|-------|--------|---------------|
| ... | ... | ... |

```

**IMPORTANT** : Conserver le marqueur `<!-- TAB:Donnees -->` intact apres la section.

## Verification finale

Afficher un resume :
- Nombre de domaines fonctionnels identifies (section 2)
- Nombre de noeuds algorigramme generes (section 9.4)
- Domaine principal identifie
- Nombre de noeuds jaunes (cles metier)
- Patterns de branchement utilises
- Chemin de la spec modifiee

---

*Commande creee : 2026-02-02*
*Mise a jour : 2026-02-02 - Ajout enrichissement section 2 (domaines + details depliables)*
*Skill reference : skills/algorigramme/SKILL.md*
