# Patterns Magic - Knowledge Base

> Capitalisation des patterns de modification Magic Unipaas
> Utilise par le skill `/ticket-analyze` pour suggerer des solutions

## Index des patterns

| Pattern | Fichier | Ticket source | Description |
|---------|---------|---------------|-------------|
| **Inversion format date** | `date-format-inversion.md` | CMDS-174321 | Parsing YYMMDD avec inversion MM/DD |
| **Ajout parametre filtre** | `add-filter-parameter.md` | PMS-1373 | Ajouter un Boolean pour filtrer des lignes via Range Expression |
| **Format Picture incorrect** | `picture-format-mismatch.md` | CMDS-176521 | Picture Format N10 au lieu de N10.2 (decimales) |
| **Liaison table manquante** | `table-link-missing.md` | PMS-1451 | Link Table manquant dans DataView |
| **Calcul duree location ski** | `ski-rental-duration-calc.md` | PMS-1446 | Calcul MODEDAYINC base sur duree sejour |
| **Date vide sans limite** | `empty-date-as-noend.md` | PMS-1332 | Accepter 00/00/0000 comme "sans date de fin" |
| **Enrichissement colonnes rapport** | `report-column-enhancement.md` | PMS-1400 | Ajouter colonnes, Payment Type, totaux a un rapport |
| **Filtres non implementes** | `filter-not-implemented.md` | PMS-1404 | Filtres demandes mais jamais codes |
| **Probleme config equipement** | `equipment-config-issue.md` | CMDS-176818 | Diagnostic ticket hardware vs code |
| **Config locale regression** | `local-config-regression.md` | PMS-1407 | Fausse regression due Magic.ini local |
| **Affichage date MODEDAYINC** | `modedayinc-date-display.md` | PMS-1437 | Decalage date avec mode jour inclus |
| **Concurrence session** | `session-concurrency-check.md` | PMS-1337 | Controle double ouverture session caisse |
| **Colonne DataView manquante** | `missing-dataview-column.md` | - | Variable absente du DataView |
| **Condition VV manquante** | `missing-vv-condition.md` | - | Virtual Variable sans condition |
| **Validation heure manquante** | `missing-time-validation.md` | - | Validation time field absente |
| **Extension = arrivee** | `extension-treated-as-arrival.md` | - | Extension sejour traitee comme nouvelle arrivee |

## Stats

- **16 patterns** documentes (vs 12 initiaux)
- **Couverture tickets resolus** : 80%+

## Structure d'un pattern

Chaque pattern documente :

1. **Symptomes typiques** : Comment identifier ce pattern
2. **Detection** : Mots-cles et verification
3. **Cause racine typique** : Element et erreur
4. **Solution type** : Etapes de correction
5. **Exemple concret** : Cas du ticket source
6. **Checklist resolution** : Points a valider

## Utilisation avec /ticket-analyze

Le skill `/ticket-analyze` :
1. Extrait les mots-cles du symptome
2. Compare avec `symptoms` et `keywords` de chaque pattern
3. Score par nombre de matches
4. Suggere les top 3 patterns avec score > 2

## Algorithme de matching

```
score = 0
pour chaque mot_cle dans symptome_ticket:
    si mot_cle in pattern.keywords: score += 1
    si mot_cle in pattern.symptoms: score += 1
retourner patterns ou score >= 2
```

## Contribution

Apres chaque resolution de ticket :
1. Verifier si un pattern similaire existe
2. Si non, creer un nouveau fichier `.md`
3. Mettre a jour cet index et `patterns.json`
4. Utiliser `/ticket-learn {KEY}` pour automatiser

---

*Derniere mise a jour: 2026-01-27*
*Index mis a jour suite audit PDCA*
