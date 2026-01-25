# Pattern: Condition VV manquante dans validation

> **Source**: PMS-1414
> **Domaine**: PBG / Validation arrivees
> **Type**: Bug logique

---

## Symptomes typiques

- Validation bloquee demandant vol retour
- GM arrive par VV (Village/Village) sans vol
- Fonctionne en validation individuelle, pas en serie
- "Code vol retour non renseigne !" alors que pas necessaire

---

## Detection

### Mots-cles dans le ticket
- "vol retour"
- "VV1", "VV2", "VV3"
- "validation groupee"
- "seminaire"
- "village/village"
- "pas de vol"

### Verification
1. Le mode transport est-il VV (Village/Village) ?
2. La validation individuelle fonctionne-t-elle ?
3. Seule la validation serie pose probleme ?

---

## Cause racine typique

| Element | Valeur |
|---------|--------|
| Zone | Tache de validation serie |
| Erreur | Expressions VV non copiees depuis validation individuelle |
| Exemple | Tache serie verifie vol retour sans condition type transport |

### Logique defaillante

```
AVANT (bug - Validation Serie):
SI vol_retour_vide ALORS erreur
-- Bloque TOUS les cas sans vol retour, meme VV

APRES (correct):
SI vol_retour_vide
   ET type_transport_retour NOT IN ('VV1','VV2','VV3')
   ET type_transport_aller <> 'A'
ALORS erreur
-- Ne bloque que si vraiment necessaire
```

### Expressions VV (reference)

| Expression | Formule | Description |
|------------|---------|-------------|
| 12 | `{0,4}='VV1' OR {0,4}='VV2' OR {0,4}='VV3'` | Transport aller = VV |
| 13 | `{0,5}='VV1' OR {0,5}='VV2' OR {0,5}='VV3'` | Transport retour = VV |

---

## Solution type

### Etape 1: Comparer validation individuelle vs serie

```
magic_get_tree(project="PBG", programId=<ide_validation>)
```

Identifier les expressions VV dans la tache individuelle.

### Etape 2: Localiser la condition de blocage

Chercher l'operation STP Mode="E" avec message "vol retour".

### Etape 3: Ajouter condition VV

Modifier la condition pour exclure les cas VV :
```
Condition = vol_retour_vide AND NOT(type_transport_retour IN VV)
```

---

## Programmes concernes (PMS-1414)

| Programme | Nom | Role |
|-----------|-----|------|
| **PBG IDE 124** | Validation Arrivants | Programme principal |
| Tache 124.3.5 | Validation Arrivant | **Individuel - expressions VV OK** |
| Tache 124.3.7 | Validation Serie | **Seminaires - expressions VV MANQUANTES** |
| Tache 124.3.7.1 | Verif Existence Groupe Vol | **Point de blocage** |

### Variables cles

| Variable | Nom | Role |
|----------|-----|------|
| {0,12} | W2-New-Code-Vol-Aller | Nouveau vol aller |
| {0,14} | W2-New-Code-Vol-Retour | Nouveau vol retour |

---

## Checklist resolution

- [ ] Compare tache validation individuelle vs serie
- [ ] Identifie expressions VV manquantes dans serie
- [ ] Localise condition blocage vol retour
- [ ] Ajoute condition OR sur type transport VV
- [ ] Teste validation serie avec VV (doit passer)
- [ ] Teste validation serie avec vol (doit demander retour)

---

*Pattern capitalise le 2026-01-25*
*Source: PMS-1414 (Recette OK - 2026-01-20)*
