# Patterns Magic - Knowledge Base

> Capitalisation des patterns de modification Magic Unipaas

## Index des patterns

| Pattern | Fichier | Ticket source | Description |
|---------|---------|---------------|-------------|
| **Ajout parametre filtre** | `add-filter-parameter.md` | PMS-1373 | Ajouter un Boolean pour filtrer des lignes via Range Expression |

## Structure d'un pattern

Chaque pattern documente :

1. **Contexte** : Quel probleme resoudre
2. **Implementation** : Etapes XML detaillees
3. **Fichiers modifies** : Liste exhaustive
4. **Points d'attention** : Pieges a eviter
5. **Variantes** : Adaptations possibles

## Utilisation

Avant de modifier du code Magic, consulter cette base pour :
- Reutiliser un pattern existant
- Eviter les erreurs connues
- Capitaliser les nouvelles solutions

## Contribution

Apres chaque correction/evolution Magic :
1. Analyser le commit avec `git show <hash>`
2. Extraire le pattern general
3. Documenter dans un nouveau fichier `.md`
4. Mettre a jour cet index

---

*Cree: 2026-01-12*
