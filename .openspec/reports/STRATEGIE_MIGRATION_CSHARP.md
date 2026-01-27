# Strategie Migration C# ADH

> **Date**: 2026-01-27
> **Phase**: PDCA Phase 2
> **Etat actuel**: 22.6% (79/350 programmes)
> **Cible M+1**: 40% | **Cible M+3**: 70%

---

## 1. Etat des lieux

### 1.1 Modules migres (79 programmes)

| Module | Endpoints | Programmes | Status |
|--------|-----------|------------|--------|
| Sessions | 5 | 6 | COMPLET |
| Devises | 3 | 4 | COMPLET |
| Articles | 4 | 5 | COMPLET |
| Coffre | 8 | 12 | COMPLET |
| Ventes | 6 | 8 | COMPLET |
| Zooms | 8 | 8 | COMPLET |
| Members | 3 | 4 | COMPLET |
| Solde | 2 | 3 | COMPLET |
| Extrait | 4 | 6 | COMPLET |
| Garantie | 2 | 3 | COMPLET |
| Change | 3 | 4 | COMPLET |
| Telephone | 3 | 4 | COMPLET |
| EasyCheckOut | 3 | 4 | COMPLET |
| Factures | 4 | 5 | COMPLET |
| Identification | 2 | 3 | COMPLET |
| **TOTAL** | **~60** | **79** | **22.6%** |

### 1.2 Programmes restants (271 programmes)

| Module | Programmes | Complexite | Priorite |
|--------|------------|------------|----------|
| **Ventes (reste)** | ~30 | Moyenne | P0 |
| **Reports/Editions** | ~40 | Haute | P1 |
| **Batch/Background** | ~20 | Moyenne | P1 |
| **Utilitaires** | ~50 | Basse | P2 |
| **Archives** | ~88 | N/A | IGNORE |
| **Divers** | ~43 | Variable | P2 |

---

## 2. Strategie d'acceleration

### 2.1 Approche Blueprint-First

Utiliser le generateur de blueprints pour accelerer la migration:

```powershell
# Generer squelette C# depuis spec
.\tools\spec-generator\Generate-MigrationBlueprint.ps1 -Project ADH -IDE 250 -Output migration/caisse/
```

**Avantages:**
- Structure CQRS generee automatiquement
- DTOs types depuis les tables
- Handlers avec TODO pour la logique
- Tests scaffoldes

### 2.2 Batch Processing par module

| Semaine | Module | Programmes | Objectif |
|---------|--------|------------|----------|
| S1 | Ventes (reste) | 250-280 | 30 progs |
| S2 | Reports partie 1 | 280-300 | 20 progs |
| S3 | Reports partie 2 | 300-320 | 20 progs |
| S4 | Batch/Background | 140-160 | 20 progs |

### 2.3 Workflow de migration

```
1. Generer spec V3.5 si absent
   .\Generate-ProgramSpecV2.ps1 -Project ADH -IDE $ide

2. Generer blueprint C#
   .\Generate-MigrationBlueprint.ps1 -Project ADH -IDE $ide

3. Implementer logique metier
   - Lire spec section 2.4 (algorigramme)
   - Traduire expressions cles
   - Mapper tables vers EF Core

4. Ajouter tests unitaires
   .\Generate-TestsFromSpec.ps1 -SpecPath .openspec/specs/ADH-IDE-$ide.md

5. Valider avec tests existants
   dotnet test migration/caisse/Caisse.Tests/
```

---

## 3. Priorites detaillees

### 3.1 P0 - Ventes (reste) - 30 programmes

| IDE | Programme | Description | Effort |
|-----|-----------|-------------|--------|
| 251-255 | Gestion remises | Calcul et application remises | 2h |
| 256-260 | Historique ventes | Consultation et export | 1h |
| 261-270 | Services VRL/VSL | Location vehicules/ski | 4h |
| 271-280 | Transferts | Inter-compte | 2h |

**Objectif**: +30 programmes = 109/350 = **31%**

### 3.2 P1 - Reports/Editions - 40 programmes

| IDE | Programme | Description | Effort |
|-----|-----------|-------------|--------|
| 280-290 | Editions journalieres | CA, mouvements | 3h |
| 291-300 | Recapitulatifs | Syntheses periodiques | 3h |
| 301-310 | Exports | CSV, PDF, Excel | 2h |
| 311-320 | Impressions | Tickets, factures | 2h |

**Objectif**: +40 programmes = 149/350 = **43%**

### 3.3 P1 - Batch/Background - 20 programmes

| IDE | Programme | Description | Effort |
|-----|-----------|-------------|--------|
| 140-150 | Calculs fin journee | Totaux, ecarts | 2h |
| 151-160 | Synchronisations | Autres systemes | 2h |

**Objectif**: +20 programmes = 169/350 = **48%**

---

## 4. Architecture cible

### 4.1 Structure solution

```
migration/caisse/
├── Caisse.Domain/           # Entities, Value Objects
├── Caisse.Application/      # CQRS Handlers, DTOs
├── Caisse.Infrastructure/   # EF Core, Repositories
├── Caisse.Api/              # Minimal API endpoints
├── Caisse.Shared/           # Cross-cutting concerns
└── Caisse.Tests/            # Unit + Integration tests
```

### 4.2 Mapping Tables Magic → EF Core

| Table Magic | Entite C# | DbSet |
|-------------|-----------|-------|
| cafil001_dat | ReseauCloture | ReseauxCloture |
| cafil010_dat | Prestation | Prestations |
| cafil028_dat | TauxChange | TauxChanges |
| operations_dat | Operation | Operations |
| ez_card | EzCard | EzCards |

### 4.3 Conventions de nommage

| Magic | C# |
|-------|-----|
| ADH IDE 237 | `Modules/Ventes/VenteGpModule.cs` |
| Table cafil001 | `Entities/ReseauCloture.cs` |
| Param P.societe | `dto.Societe` |
| VG38 | `_globalState.GiftPassV2Actif` |

---

## 5. Metriques de suivi

| KPI | Actuel | M+1 | M+3 | M+6 |
|-----|--------|-----|-----|-----|
| % Migration | 22.6% | 40% | 70% | 100% |
| Programmes | 79 | 140 | 245 | 350 |
| Endpoints API | ~60 | 100 | 180 | 250 |
| Tests unitaires | 527 | 800 | 1200 | 1500 |

---

## 6. Outils disponibles

| Outil | Role | Commande |
|-------|------|----------|
| Generate-ProgramSpecV2.ps1 | Spec V2.0 depuis XML | `-Project ADH -IDE 250` |
| Upgrade-SpecsToV35.ps1 | Upgrade vers V3.5 | `-StartIDE 1 -EndIDE 350` |
| Generate-MigrationBlueprint.ps1 | Squelette C# CQRS | `-Project ADH -IDE 250` |
| Generate-TestsFromSpec.ps1 | Tests scaffoldes | `-SpecPath ...` |
| magic_migration_inventory | Inventaire MCP | Via Claude |
| magic_migration_stats | Stats projet | Via Claude |

---

## 7. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Expressions complexes non traduites | Haut | Decoder avec MCP avant migration |
| Tables manquantes mapping | Moyen | Verifier DataSources.xml |
| Logique metier incorrecte | Haut | Tests + validation fonctionnelle |
| Performance degradee | Moyen | Profiling + cache |

---

## 8. Actions immediates

1. [ ] Generer blueprints pour IDE 250-280 (Ventes reste)
2. [ ] Implementer module Remises (5 progs)
3. [ ] Ajouter tests integration
4. [ ] Valider avec donnees reelles CSK0912
5. [ ] Documenter endpoints Swagger

---

*Strategie definie: 2026-01-27*
*Prochaine revue: 2026-02-03*
