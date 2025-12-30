# Points a Valider - Skill Magic Unipaas

## Date: 2025-12-24

Ce document liste les elements qui necessitent validation par l'utilisateur (captures d'ecran, tests reels, documentation officielle).

---

## 1. InternalEventID

Les ID d'evenements internes ne sont pas documentes publiquement. Voici ce qui a ete observe:

| ID | Signification supposee | A valider |
|----|------------------------|-----------|
| 14 | Exit/Fermer | [ ] |
| 34 | OK/Valider (Entree) | [ ] |
| 42 | Evenement personnalise | [ ] |
| 63 | Refresh? | [ ] |
| 219 | Annuler/Abandon | [ ] |
| 220 | Continuer/OK | [ ] |
| 393 | ? | [ ] |

**Action requise**: Capturer les handlers d'evenements dans Magic Studio pour confirmer.

---

## 2. Codes Font

Les codes de police n'ont pas de correspondance documentee.

| Code | Police supposee | A valider |
|------|-----------------|-----------|
| 8 | Arial 8pt | [ ] |
| 11 | Arial 10pt | [ ] |
| 33 | Arial 14pt Bold | [ ] |
| 131 | Arial 12pt Bold | [ ] |
| 132 | Arial 12pt Bold | [ ] |
| 167 | Arial 8pt | [ ] |

**Action requise**: Ouvrir un formulaire dans Magic Studio et verifier les polices.

---

## 3. Codes Couleur

| Code | Couleur supposee | A valider |
|------|------------------|-----------|
| 1 | Rouge | [ ] |
| 2 | Vert | [ ] |
| 3 | Bleu | [ ] |
| 4 | Cyan | [ ] |
| 5 | Magenta | [ ] |
| 6 | Blanc | [ ] |
| 7 | Noir | [ ] |
| 8 | Jaune | [ ] |

**Action requise**: Verifier dans l'editeur de couleurs Magic.

---

## 4. Media Types

| Code | Signification | Valide |
|------|---------------|--------|
| T | Text file | [x] (teste avec Prg_995) |
| G | Graphic Printer | [x] (teste avec Prg_77) |
| S | Screen | [x] (teste avec Prg_323) |
| R | Requester/Report | [ ] |
| N | Null/None | [ ] |
| V | Variable | [ ] |

**Action requise**: Tester les types R, N, V avec des exemples reels.

---

## 5. Area Types (Rapports)

| Code | Zone | Valide |
|------|------|--------|
| H | Header | [x] |
| F | Footer | [x] |
| N | Normal | [x] |
| G | Group | [x] |
| P | Page | [ ] |

**Action requise**: Confirmer le type P avec un exemple.

---

## 6. PaperSize Codes

| Code | Taille supposee | A valider |
|------|-----------------|-----------|
| 68 | A4 | [ ] |
| 1 | Letter | [ ] |
| 5 | Legal | [ ] |

**Action requise**: Verifier dans les parametres d'impression Magic.

---

## 7. Fonctions Magic

### 7.1 Page()
```
Page(device, type)
```
- device: 0 = par defaut
- type: 1 = numero courant, 2 = total pages?

**A valider**: Signification du parametre type.

### 7.2 Counter()
```
Counter(level)
```
- level: 0 = global, 1+ = groupe

**Valide**: Observe dans plusieurs fichiers.

### 7.3 MlsTrans()
```
MlsTrans('key')
```
Traduction multilingue.

**A valider**: Source des traductions (fichier externe?).

---

## 8. Hierarchie des controles

### 8.1 ISN_FATHER
Lien parent-enfant entre controles.

**Valide**: Observe pour TABLE > COLUMN, TABLE > EDIT.

### 8.2 ControlLayer
Position de la colonne dans un tableau.

**A valider**: Est-ce 0-based ou 1-based?

---

## 9. Tests de conversion suggeres

### 9.1 Export simple
- **Fichier**: Prg_995.xml (Export MECANO)
- **Test**: Generer un fichier TXT equivalent
- **Validation**: Comparer avec sortie reelle

### 9.2 Rapport avec groupes
- **Fichier**: Prg_102.xml
- **Test**: Generer un PDF avec ruptures
- **Validation**: Comparer avec impression reelle

### 9.3 Ecran interactif
- **Fichier**: Prg_12.xml (Calendrier)
- **Test**: Generer un composant React
- **Validation**: Comparer visuellement

---

## 10. Documents de reference a obtenir

- [ ] Documentation officielle Magic xpa (si disponible)
- [ ] Liste des Internal Event IDs
- [ ] Table de correspondance Font codes
- [ ] Fichiers de traduction MLS

---

## Resume

| Categorie | Elements documentes | A valider |
|-----------|---------------------|-----------|
| Exports | IO, Media, FormIO, FORM_TEXT | 3 types Media |
| Editions | Area, Groups, Page, Counter | PaperSize, P area |
| Ecrans | 17 controles, Events | InternalEventID, Fonts |

**Prochaine etape recommandee**: Validation avec captures d'ecran Magic Studio.

---

*Document genere par Claude Code - 2025-12-24*
