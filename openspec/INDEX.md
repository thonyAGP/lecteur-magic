# OpenSpec - Migration Magic Unipaas

## Index des specifications

| Module | Projet | Statut | Derniere MAJ | Fichier |
|--------|--------|--------|--------------|---------|
| MECANO | PBP | VALIDE | 2025-12-22 | [mecano/MECANO_SPEC.md](mecano/MECANO_SPEC.md) |
| ADH | ADH | EN ANALYSE | 2025-12-24 | [adh/ADH_SPEC.md](adh/ADH_SPEC.md) |
| Gestion Caisse | ADH | ANALYSE | 2025-12-24 | [adh/GESTION_CAISSE_SPEC.md](adh/GESTION_CAISSE_SPEC.md) |

## Suivi global

Voir **[PROJECT_STATUS.md](PROJECT_STATUS.md)** pour l'etat complet du projet.

## Projets Magic sources

| Projet | Chemin | Programmes | Statut |
|--------|--------|------------|--------|
| REF | `D:\Data\Migration\XPA\PMS\REF\Source\` | ~700 | Reference (tables) |
| PBP | `D:\Data\Migration\XPA\PMS\PBP\Source\` | ~430 | MECANO valide |
| ADH | `D:\Data\Migration\XPA\PMS\ADH\Source\` | 350 | En analyse |
| PBG | `D:\Data\Migration\XPA\PMS\PBG\Source\` | ? | A explorer |

## Bases de donnees

### Base de reference validee
- **Serveur**: LENOVO_LB2I\SQLEXPRESS
- **Base**: CSK0912
- **Type**: Production
- **Modules testes**: MECANO

### Bases en attente de test
- Base 1: (a definir)
- Base 2: (a definir)
- Base 3: (a definir)

## Niveaux de progression

| Niveau | Description | Statut |
|--------|-------------|--------|
| 1 | Programmes Browse simples | VALIDE |
| 2 | CallTask et parametres | VALIDE |
| 3 | Expressions IF/CASE complexes | VALIDE |
| 4 | Editions/exports | PARTIEL |

## Structure du projet

```
D:\Projects\Lecteur Magic\
├── openspec/                    -- Specifications OpenSpec
│   ├── INDEX.md                -- Ce fichier
│   ├── PROJECT_STATUS.md       -- Suivi global projet
│   ├── mecano/
│   │   ├── MECANO_SPEC.md      -- Spec MECANO (VALIDE)
│   │   └── RESUME_CONTEXT.md   -- Contexte reprise
│   └── adh/
│       └── ADH_SPEC.md         -- Spec ADH (EN COURS)
│
├── migration/
│   └── mecano/
│       ├── README.md           -- Documentation migration
│       └── sql/                -- Scripts SQL
│           ├── 00-09           -- Scripts de test
│           └── 10-12           -- Scripts production
│
├── skills/
│   └── magic-unipaas/          -- Skill Claude Code
│
└── DSIOPtmp_ecrmec_dat.TXT     -- Fichier reference Magic
```

## Workflow de validation

1. **Analyse Magic** -> Comprendre le flux des programmes
2. **Creation SQL** -> Vues et procedures stockees
3. **Test donnees fictives** -> Base PMS_Test
4. **Test donnees reelles** -> Base production
5. **Comparaison** -> Fichier Magic vs sortie SQL
6. **Documentation** -> OpenSpec + README

---

*Derniere mise a jour: 2025-12-24*
