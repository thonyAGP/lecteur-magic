# Tickets Actifs

> Accès rapide aux résolutions de tickets en cours.
> **Convention** : Format IDE Magic obligatoire (`[PROJET] IDE [N°] - [Nom]`)

---

## PMS-1373 - Masquer annulations dans extrait compte

**Statut** : SPEC COMPLETE - Prêt pour implémentation

### Références Magic IDE

| Élément | IDE | Description |
|---------|-----|-------------|
| Table | **Table n°40** | `cafil018_dat` (operations) |
| Programme | **ADH IDE 69** | EXTRAIT_COMPTE (point d'entrée) |
| Programme | **ADH IDE 70** | EXTRAIT_NOM |
| Programme | **ADH IDE 71** | EXTRAIT_DATE |
| Programme | **ADH IDE 72** | EXTRAIT_CUM |
| Programme | **ADH IDE 73** | EXTRAIT_IMP |
| Programme | **ADH IDE 76** | EXTRAIT_SERVICE |

### Liens

| Type | Lien |
|------|------|
| **Résolution** | [resolution.md](file:///D:/Projects/Lecteur%20Magic/.openspec/tickets/PMS-1373/resolution.md) |
| Analyse | [analysis.md](file:///D:/Projects/Lecteur%20Magic/.openspec/tickets/PMS-1373/analysis.md) |
| Implémentation | [implementation.md](file:///D:/Projects/Lecteur%20Magic/.openspec/tickets/PMS-1373/implementation.md) |
| Jira | [PMS-1373](https://clubmed.atlassian.net/browse/PMS-1373) |
| Git | [feature/PMS-1373](https://github.com/thonyAGP/PMS-Magic-Sources/tree/feature/PMS-1373-masquer-annulations) |

**Principe** : Filtrer sur champ `cte_flag_annulation` de **Table n°40** = 'Normal'

---

## CMDS-174321 - Bug date arrivée PB027

**Statut** : RÉSOLU - Données corrompues en base (import PMS)

### Références Magic IDE

| Élément | IDE | Description |
|---------|-----|-------------|
| Table | **Table n°14** | `cafil014_dat` (client_gm) |
| Table | **Table n°171** | Table temporaire planning |
| Programme | **PBP IDE 62** | PB027 - préparation données |
| Programme | **PBP IDE 63** | PB027 - affichage GUI |
| Programme | **PBG IDE 315** | Import NA (SUSPECT) |

### Liens

| Type | Lien |
|------|------|
| **Résolution** | [resolution.md](file:///D:/Projects/Lecteur%20Magic/.openspec/tickets/CMDS-174321/resolution.md) |
| Analyse | [analysis.md](file:///D:/Projects/Lecteur%20Magic/.openspec/tickets/CMDS-174321/analysis.md) |
| Jira | [CMDS-174321](https://clubmed.atlassian.net/browse/CMDS-174321) |

**Cause** : Bug **PBG IDE 315** - inversion MM/DD lors import fichiers NA

---

*Dernière mise à jour : 2026-01-08*
