# Lecteur Magic - Migration Magic Unipaas

Migration d'applications Magic Unipaas v12.03 vers C# .NET 8.

## Modules

### API Caisse (Complet)

API REST pour la gestion de caisse, migrée depuis le module ADH/Gestion Caisse (41 programmes Magic).

**Solution:** `migration/caisse/Caisse.sln`

#### Stack Technique

- .NET 8 / ASP.NET Core Minimal API
- Entity Framework Core 8 + SQL Server
- MediatR 12 (CQRS)
- FluentValidation
- Serilog

#### Architecture Clean

```
src/
├── Caisse.Api/            # Minimal API endpoints
├── Caisse.Application/    # CQRS Commands/Queries, Services
├── Caisse.Domain/         # Entities, Value Objects, Interfaces
├── Caisse.Infrastructure/ # EF Core, Repositories
└── Caisse.Shared/         # DTOs, Result pattern

tests/
└── Caisse.Application.Tests/  # 108 unit tests
```

#### Tables Mappées (9)

| Table | Description |
|-------|-------------|
| caisse_session | Sessions ouverture/fermeture |
| caisse_session_detail | Détails mouvements |
| caisse_session_article | Articles vendus |
| caisse_session_devise | Devises par session |
| caisse_session_coffre2 | Coffre réserve |
| caisse_devise | Config devises |
| caisse_parametres | Paramètres globaux |
| cafil045_dat | Table paramètres |
| devisein_par | Référence devises |

#### Endpoints Principaux

```
POST /api/sessions/ouvrir     # Ouvrir session avec coffre
POST /api/sessions/fermer     # Fermer session avec validation écart
GET  /api/sessions/{user}     # Liste sessions utilisateur
GET  /api/details/{user}/{id} # Détails session
GET  /api/ecarts/{user}/{id}  # Calcul écarts
```

#### Flux Ouverture/Fermeture

**Ouverture:**
- Crée session + 4 détails (I=Initial, C=Comptage, K=CoffretVers, L=CoffretLeve)
- Crée entrée coffre si montant > 0

**Fermeture:**
- Calcule écart (attendu vs compté)
- Bloque si écart > seuil (configurable)
- Force avec `ForceClosureOnEcart=true`

#### Lancer l'API

```bash
cd migration/caisse/src/Caisse.Api
dotnet run
```

Swagger: http://localhost:5287/swagger

#### Tests

```bash
cd migration/caisse
dotnet test
```

108 tests unitaires (validators, écarts, coffre).

#### Configuration

Modifier `appsettings.json` pour la connexion SQL Server:

```json
{
  "ConnectionStrings": {
    "CaisseDb": "Server=...;Database=...;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

---

### MECANO (Complet)

Scripts SQL pour liste mécanographique.

**Chemin:** `migration/mecano/sql/`

---

## Projets Magic Sources

| Projet | Programmes | Rôle | Statut |
|--------|------------|------|--------|
| REF | ~700 | Tables partagées | Référence |
| PBP | ~430 | Editions/Exports | MECANO validé |
| ADH | 350 | Adhérents/Caisse | API complète |
| PBG | 394 | Planification/Batch | Exploré |
| PVE | 448 | Point de Vente/POS | Exploré |

## Documentation

- `.openspec/spec.md` - Spécification complète du projet
- `skills/magic-unipaas/` - Skill d'analyse Magic

## Licence

Propriétaire - Usage interne uniquement.
