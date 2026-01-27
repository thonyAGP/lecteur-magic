# Pattern : Probleme configuration equipement (pas un bug code)

> **Source** : CMDS-176818 - Tickets Epson police trop grande
> **Auteur** : Anthony Le Berre
> **Date** : 2026-01-27

## Description

Ce pattern documente les tickets qui ressemblent a des bugs logiciels mais sont en realite des problemes de configuration materielle. Important pour eviter de perdre du temps a analyser le code Magic.

## Symptomes typiques

| Symptome | Cause probable | Verification |
|----------|---------------|--------------|
| Texte tronque/coupe | Largeur papier mal configuree | Parametres imprimante |
| Police trop grande | Resolution/DPI incorrecte | Driver imprimante |
| Caracteres etranges | Encodage imprimante | Charset/codepage |
| Impression decalee | Marges imprimante | Configuration papier |
| Couleurs incorrectes | Profil couleur | Parametres driver |

## Diagnostic rapide

### Etape 1 : Identifier l'equipement

| Question | Information a collecter |
|----------|------------------------|
| Quel equipement ? | Marque, modele |
| Depuis quand ? | Date debut probleme |
| Changement recent ? | Mise a jour, remplacement |
| Un seul poste ? | Isole ou generalise |

### Etape 2 : Test de comparaison

Tester sur un autre equipement du meme type :
- Si OK ailleurs = probleme configuration locale
- Si KO partout = potentiellement bug code

### Etape 3 : Verifier configuration

```
Imprimante Epson ticket :
├── Largeur papier : 80mm (standard)
├── Mode impression : Normal (pas draft/compressed)
├── Police : 12 CPI (caracteres/inch)
├── Resolution : 180 DPI
└── Charset : PC850 ou UTF-8
```

## Cas CMDS-176818 : Tickets Epson

**Symptome** : Tickets avec police trop grande, partie droite coupee

**Diagnostic** :
- Probleme sur UN seul village (Valmorel)
- Autres villages OK avec meme version PMS
- **Conclusion** : Configuration imprimante locale

**Resolution** :
1. Reset parametres imprimante Epson
2. Reinstaller driver si necessaire
3. Verifier largeur papier (80mm)

## Red flags "pas un bug code"

| Indicateur | Signification |
|------------|---------------|
| Un seul site affecte | Probleme local |
| Apres changement materiel | Configuration |
| Intermittent sans pattern | Hardware |
| "Ca marchait avant" sans changement code | Environment |

## Workflow de triage

```
Ticket recu
    │
    ▼
Probleme sur un seul site ?
    │
    ├── OUI → Probleme configuration locale
    │           └── Escalader au support technique
    │
    └── NON → Probleme generalise
                └── Analyser le code Magic
```

## Communication

### Template de reponse

```
Ce ticket a ete analyse et ne semble pas etre un probleme de code PMS.

**Diagnostic** : Probleme de configuration equipement
**Equipement** : [Marque/Modele]
**Village** : [Code village]

**Actions recommandees** :
1. Verifier les parametres de l'equipement
2. Contacter le support technique local
3. Tester sur un autre equipement si disponible

**Impact code Magic** : Aucun
```

### Escalade support

Si le probleme persiste apres verification equipement :
1. Collecter logs/screenshots
2. Verifier version driver
3. Escalader au support IT local

## Points d'attention

1. **Ne pas perdre de temps** : Si les indicateurs pointent vers du hardware, ne pas analyser le code
2. **Documenter** : Garder trace du diagnostic pour reference future
3. **Patterns similaires** : Si plusieurs villages ont le meme probleme, alors c'est potentiellement un bug code
4. **Changelog** : Verifier si des changements recents ont ete deployes

---

## Specs concernees

Aucune spec impactee - ce pattern concerne le triage des tickets.

---

*Pattern documente: 2026-01-27*
*Ticket source: CMDS-176818*
