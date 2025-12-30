# OpenSpec: Etat Global du Projet Migration Magic

## Vue d'ensemble

| Projet | Programmes | Statut | Progression |
|--------|------------|--------|-------------|
| REF | ~700 | Reference | Tables partagees |
| PBP | ~430 | En cours | MECANO valide |
| ADH | 350 | Nouveau | A analyser |
| PBG | ? | A explorer | Non charge |

---

## Niveaux de Progression du Skill

### Echelle de maturite

| Niveau | Description | Statut |
|--------|-------------|--------|
| 1 | Programmes Browse simples | VALIDE |
| 2 | CallTask et parametres | VALIDE |
| 3 | Expressions IF/CASE complexes | VALIDE |
| 4 | Editions/exports | PARTIEL |

### Details Niveau 4

- [x] Lecture structure editions
- [x] Identification tables temporaires
- [ ] Generation complete des exports
- [ ] Formats de sortie multiples

---

## Modules valides

### MECANO (PBP) - Liste Mecanographique

| Element | Statut | Date |
|---------|--------|------|
| Analyse flux | COMPLETE | 2025-12-22 |
| Mapping colonnes | VALIDE | 2025-12-22 |
| Scripts SQL | CREES | 2025-12-22 |
| Tests | PASSES | 2025-12-22 |
| Documentation | COMPLETE | 2025-12-22 |

**Fichier reference**: `DSIOPtmp_ecrmec_dat.TXT`
**Base validee**: CSK0912 sur LENOVO_LB2I\SQLEXPRESS

---

## En cours d'analyse

### ADH - Gestion Adherents/Caisse

| Element | Statut | Notes |
|---------|--------|-------|
| Structure projet | IDENTIFIEE | 350 progs, 27 dossiers |
| Tables | A IDENTIFIER | Via REF.ecf |
| Flux principaux | A ANALYSER | Priorite: Gestion Caisse |
| Documentation | INITIEE | ADH_SPEC.md cree |

---

## Backlog projets

### PBP - Editions (autres que MECANO)
- [ ] Autres editions a identifier
- [ ] Exports CSV/Excel

### REF - Composant Reference
- [ ] Inventaire complet des tables
- [ ] Documentation DataSources.xml

### ADH - Modules prioritaires
1. [ ] Gestion Caisse (41 progs)
2. [ ] Ventes (24 progs)
3. [ ] Facturation V3 (10 progs)
4. [ ] Telephone (20 progs)

### PBG - Planification
- [ ] Charger et explorer
- [ ] Identifier le scope

---

## Bases de donnees

### Production validee
- **Serveur**: LENOVO_LB2I\SQLEXPRESS
- **Base**: CSK0912
- **Modules testes**: MECANO

### A tester
- Base 1: (a definir)
- Base 2: (a definir)
- Base 3: (a definir)

---

## Arborescence projet

```
D:\Projects\Lecteur Magic\
├── openspec/                    -- Specifications OpenSpec
│   ├── INDEX.md                -- Index des specs
│   ├── PROJECT_STATUS.md       -- CE FICHIER
│   ├── mecano/
│   │   ├── MECANO_SPEC.md      -- Spec MECANO (VALIDE)
│   │   └── RESUME_CONTEXT.md   -- Contexte reprise
│   └── adh/
│       └── ADH_SPEC.md         -- Spec ADH (EN COURS)
│
├── migration/
│   └── mecano/
│       ├── README.md           -- Documentation migration
│       └── sql/                -- Scripts SQL valides
│
├── skills/
│   └── magic-unipaas/          -- Skill Claude Code
│       ├── SKILL.md            -- Definition skill
│       └── references/         -- Documentation technique
│
└── .claude/
    └── commands/               -- Commandes slash
        ├── magic-load.md
        ├── magic-tree.md
        ├── magic-analyze.md
        └── ...
```

---

## Sources Magic

```
D:\Data\Migration\XPA\PMS\
├── REF\Source\     -- Composant reference (tables)
├── PBP\Source\     -- Editions/Exports (~430 progs)
├── ADH\Source\     -- Adherents/Caisse (350 progs)
└── PBG\Source\     -- Planification (?)
```

---

## Historique des sessions

| Date | Action | Resultat |
|------|--------|----------|
| 2025-12-22 | Migration MECANO | VALIDE |
| 2025-12-24 | Ajout projet ADH | EN COURS |

---

*Derniere mise a jour: 2025-12-24*
