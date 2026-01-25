# Pattern: Controle concurrence sessions utilisateur

> **Source**: PMS-1337
> **Domaine**: Caisse / Sessions
> **Type**: Bug logique

---

## Symptomes typiques

- Utilisateur peut ouvrir 2 fenetres du meme ecran
- Ecrasement de donnees entre fenetres
- "Session deja ouverte" non detectee
- Transactions perdues lors de double instance

---

## Detection

### Mots-cles dans le ticket
- "2 instances"
- "double fenetre"
- "session ecrasee"
- "transactions perdues"
- "double-clic"
- "meme utilisateur"

### Verification
1. Le controle existant verifie-t-il le terminal uniquement ?
2. L'utilisateur connecte est-il pris en compte ?
3. Y a-t-il un mecanisme de heartbeat/ping ?

---

## Cause racine typique

| Element | Valeur |
|---------|--------|
| Zone | Programme de verification session |
| Erreur | Controle sur terminal seul, pas utilisateur |
| Exemple | `SELECT WHERE terminal = @term` au lieu de `WHERE terminal = @term AND user = @user` |

### Logique defaillante

```
AVANT (bug):
SI session_ouverte(terminal) ALORS erreur
-- Permet a 2 utilisateurs d'ouvrir sur meme terminal
-- Permet au meme utilisateur d'ouvrir 2 fenetres

APRES (correct):
SI session_ouverte(terminal, utilisateur) ALORS erreur
-- Bloque meme utilisateur sur meme terminal
```

---

## Solution type

### Etape 1: Localiser le programme de verification

```
magic_kb_search("verif session", project="ADH")
magic_kb_search("session ouverte", project="ADH")
```

### Etape 2: Analyser la condition

| Element | Verifier |
|---------|----------|
| Table session | Quel champ identifie l'utilisateur ? |
| Condition | Le WHERE inclut-il l'utilisateur ? |
| Retour | Le flag booleen est-il correct ? |

### Etape 3: Modifier la condition

Ajouter la verification utilisateur dans la condition existante.

---

## Programmes concernes (PMS-1337)

| Programme | Nom | Role |
|-----------|-----|------|
| **ADH IDE 121** | Gestion Caisse | Ecran principal (CA0142) |
| **ADH IDE 122** | Ouverture caisse | Declencheur |
| **ADH IDE 156** | Verif session ouverte2 | **Verification a modifier** |
| ADH IDE 116 | Calcul concurrence | Concurrence coffre |

### Tables de tracking

| Table | Nom | Usage |
|-------|-----|-------|
| 227 | caisse_concurrences | Concurrence coffre |
| 246 | caisse_session | Sessions principales |
| 249 | caisse_session_detail | Details evenements |

---

## Checklist resolution

- [ ] Identifie le programme de verification session
- [ ] Verifie la condition actuelle (terminal seul ?)
- [ ] Ajoute verification utilisateur
- [ ] Teste avec 2 fenetres meme utilisateur
- [ ] Teste avec 2 utilisateurs differents (doit fonctionner)

---

*Pattern capitalise le 2026-01-25*
*Source: PMS-1337 (Recette OK - 2026-01-22)*
