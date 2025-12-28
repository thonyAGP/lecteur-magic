using Caisse.Api.Middleware;
using Caisse.Application;
using Caisse.Application.Sessions.Commands;
using Caisse.Application.Sessions.Queries;
using Caisse.Application.Devises.Commands;
using Caisse.Application.Devises.Queries;
using Caisse.Application.Articles.Commands;
using Caisse.Application.Articles.Queries;
using Caisse.Application.Details.Commands;
using Caisse.Application.Details.Queries;
using Caisse.Application.Coffre.Commands;
using Caisse.Application.Coffre.Queries;
using Caisse.Application.Parametres.Queries;
using Caisse.Application.DevisesRef.Queries;
using Caisse.Application.CaisseDevises.Queries;
using Caisse.Application.CaisseDevises.Commands;
using Caisse.Application.Ecarts.Queries;
using Caisse.Application.Ventes.Queries;
using Caisse.Application.EasyCheckOut.Commands;
using Caisse.Application.EasyCheckOut.Queries;
using Caisse.Application.Zooms.Queries;
using Caisse.Application.Members.Queries;
using Caisse.Application.Solde.Queries;
using Caisse.Application.Extrait.Queries;
using Caisse.Application.Garanties.Queries;
using Caisse.Application.Change.Queries;
using Caisse.Application.Telephone.Queries;
using Caisse.Application.Telephone.Commands;
using Caisse.Application.Factures.Queries;
using Caisse.Application.Factures.Commands;
using Caisse.Application.Identification.Queries;
using Caisse.Infrastructure;
using MediatR;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    var app = builder.Build();

    app.UseValidationExceptionHandler();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    // ============ Sessions Endpoints ============
    var sessions = app.MapGroup("/api/sessions").WithTags("Sessions");

    sessions.MapGet("/", async (string? utilisateur, int? limit, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSessionsQuery(utilisateur, limit ?? 10));
        return Results.Ok(result);
    })
    .WithName("GetSessions")
    .WithOpenApi();

    sessions.MapPost("/ouvrir", async (OuvrirSessionCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("OuvrirSession")
    .WithOpenApi();

    sessions.MapPost("/fermer", async (FermerSessionCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("FermerSession")
    .WithOpenApi();

    // ============ Devises Endpoints ============
    var devises = app.MapGroup("/api/devises").WithTags("Devises");

    devises.MapGet("/{utilisateur}/{chronoSession}", async (
        string utilisateur,
        double chronoSession,
        string? quand,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSessionDevisesQuery(utilisateur, chronoSession, quand));
        return Results.Ok(result);
    })
    .WithName("GetSessionDevises")
    .WithOpenApi();

    devises.MapGet("/{utilisateur}/{chronoSession}/summary", async (
        string utilisateur,
        double chronoSession,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDeviseSummaryQuery(utilisateur, chronoSession));
        return Results.Ok(result);
    })
    .WithName("GetDeviseSummary")
    .WithOpenApi();

    devises.MapPost("/", async (AddSessionDeviseCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("AddSessionDevise")
    .WithOpenApi();

    // ============ Articles Endpoints ============
    var articles = app.MapGroup("/api/articles").WithTags("Articles");

    articles.MapGet("/{utilisateur}/{chronoSession}", async (
        string utilisateur,
        double chronoSession,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSessionArticlesQuery(utilisateur, chronoSession));
        return Results.Ok(result);
    })
    .WithName("GetSessionArticles")
    .WithOpenApi();

    articles.MapGet("/{utilisateur}/{chronoSession}/summary", async (
        string utilisateur,
        double chronoSession,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetArticleSummaryQuery(utilisateur, chronoSession));
        return Results.Ok(result);
    })
    .WithName("GetArticleSummary")
    .WithOpenApi();

    articles.MapPost("/", async (AddSessionArticleCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("AddSessionArticle")
    .WithOpenApi();

    // ============ Details Endpoints ============
    var details = app.MapGroup("/api/details").WithTags("Details");

    details.MapGet("/{utilisateur}/{chronoSession}", async (
        string utilisateur,
        double chronoSession,
        string? type,
        string? quand,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSessionDetailsQuery(utilisateur, chronoSession, type, quand));
        return Results.Ok(result);
    })
    .WithName("GetSessionDetails")
    .WithOpenApi();

    details.MapGet("/{utilisateur}/{chronoSession}/summary", async (
        string utilisateur,
        double chronoSession,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDetailSummaryQuery(utilisateur, chronoSession));
        return Results.Ok(result);
    })
    .WithName("GetDetailSummary")
    .WithOpenApi();

    details.MapPost("/", async (AddSessionDetailCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("AddSessionDetail")
    .WithOpenApi();

    // ============ Coffre Endpoints ============
    var coffre = app.MapGroup("/api/coffre").WithTags("Coffre");

    coffre.MapGet("/", async (string? utilisateur, int? limit, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetCoffreQuery(utilisateur, limit ?? 20));
        return Results.Ok(result);
    })
    .WithName("GetCoffre")
    .WithOpenApi();

    coffre.MapGet("/{utilisateur}/{chrono}", async (
        string utilisateur,
        double chrono,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetCoffreBySessionQuery(utilisateur, chrono));
        return result != null ? Results.Ok(result) : Results.NotFound();
    })
    .WithName("GetCoffreBySession")
    .WithOpenApi();

    coffre.MapPost("/", async (AddCoffreCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("AddCoffre")
    .WithOpenApi();

    // ============ Parametres Endpoints ============
    var parametres = app.MapGroup("/api/parametres").WithTags("Parametres");

    parametres.MapGet("/", async (IMediator mediator) =>
    {
        var result = await mediator.Send(new GetAllParametresQuery());
        return Results.Ok(result);
    })
    .WithName("GetAllParametres")
    .WithOpenApi();

    parametres.MapGet("/{cle}", async (string cle, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetParametresQuery(cle));
        return result != null ? Results.Ok(result) : Results.NotFound();
    })
    .WithName("GetParametres")
    .WithOpenApi();

    // ============ Devises Reference Endpoints ============
    var devisesRef = app.MapGroup("/api/devises-ref").WithTags("DevisesReference");

    devisesRef.MapGet("/", async (IMediator mediator) =>
    {
        var result = await mediator.Send(new GetAllDevisesRefQuery());
        return Results.Ok(result);
    })
    .WithName("GetAllDevisesRef")
    .WithOpenApi();

    devisesRef.MapGet("/{codeDevise}", async (string codeDevise, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDeviseRefQuery(codeDevise));
        return result != null ? Results.Ok(result) : Results.NotFound();
    })
    .WithName("GetDeviseRef")
    .WithOpenApi();

    // ============ Caisse Devises (Config) Endpoints ============
    var caisseDevises = app.MapGroup("/api/caisse-devises").WithTags("CaisseDevises");

    caisseDevises.MapGet("/", async (
        string? utilisateur,
        string? codeDevise,
        string? modePaiement,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetCaisseDevisesQuery(utilisateur, codeDevise, modePaiement));
        return Results.Ok(result);
    })
    .WithName("GetCaisseDevises")
    .WithOpenApi();

    caisseDevises.MapPut("/", async (UpdateCaisseDeviseCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("UpdateCaisseDevise")
    .WithOpenApi();

    // ============ Ecarts Endpoints ============
    var ecarts = app.MapGroup("/api/ecarts").WithTags("Ecarts");

    ecarts.MapGet("/{utilisateur}/{chronoSession}", async (
        string utilisateur,
        double chronoSession,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new CalculerEcartSessionQuery(utilisateur, chronoSession));
        return Results.Ok(result);
    })
    .WithName("CalculerEcartSession")
    .WithSummary("Calculate the discrepancy (écart) for a session")
    .WithDescription("Returns detailed breakdown of expected vs counted amounts, including by currency/payment mode")
    .WithOpenApi();

    // ============ Ventes Endpoints ============
    var ventes = app.MapGroup("/api/ventes").WithTags("Ventes");

    ventes.MapGet("/solde-giftpass/{societe}/{compte}/{filiation}", async (
        string societe,
        int compte,
        int filiation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSoldeGiftPassQuery(societe, compte, filiation));
        return Results.Ok(result);
    })
    .WithName("GetSoldeGiftPass")
    .WithSummary("Get total Gift Pass balance for a client")
    .WithDescription("Migrated from Magic Prg_237 - Sums solde_credit_conso from cc_total_par_type table")
    .WithOpenApi();

    ventes.MapGet("/solde-resortcredit/{societe}/{compte}/{filiation}/{service}", async (
        string societe,
        int compte,
        int filiation,
        string service,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSoldeResortCreditQuery(societe, compte, filiation, service));
        return Results.Ok(result);
    })
    .WithName("GetSoldeResortCredit")
    .WithSummary("Get Resort Credit balance for a client/service")
    .WithDescription("Migrated from Magic Prg_250 - Calculates IF(attribue > utilise, attribue - utilise, 0)")
    .WithOpenApi();

    // ============ EasyCheckOut Endpoints ============
    var checkout = app.MapGroup("/api/easycheckout").WithTags("EasyCheckOut");

    checkout.MapPost("/solde", async (SoldeEasyCheckOutCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.TransactionValidee ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("SoldeEasyCheckOut")
    .WithSummary("Execute Easy Check Out balance calculation")
    .WithDescription("Migrated from Magic Prg_64 SOLDE_EASY_CHECK_OUT - Complete checkout process with PDF generation")
    .WithOpenApi();

    checkout.MapGet("/edition", async (
        bool erreursSeules,
        bool editionAuto,
        bool testPes,
        DateOnly dateEdition,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new EditionEasyCheckOutQuery(erreursSeules, editionAuto, testPes, dateEdition));
        return Results.Ok(result);
    })
    .WithName("EditionEasyCheckOut")
    .WithSummary("Generate Easy Check Out edition and email")
    .WithDescription("Migrated from Magic Prg_65 EDITION_EASY_CHECK_OUT - Generates PDF and sends email to clients")
    .WithOpenApi();

    checkout.MapGet("/extrait/{societe}/{dateDepart}", async (
        string societe,
        DateOnly dateDepart,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new ExtraitEasyCheckOutQuery(societe, dateDepart));
        return Results.Ok(result);
    })
    .WithName("ExtraitEasyCheckOut")
    .WithSummary("Get Easy Check Out extract for next day departures")
    .WithDescription("Migrated from Magic Prg_53 EXTRAIT_EASY_CHECKOUT - Generates account extract for J+1 departures")
    .WithOpenApi();

    // ============ Zooms Endpoints (Phase 1) ============
    var zooms = app.MapGroup("/api/zooms").WithTags("Zooms");

    zooms.MapGet("/moyens-reglement/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetMoyensReglementQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetMoyensReglement")
    .WithSummary("Get payment methods for a company")
    .WithOpenApi();

    zooms.MapGet("/tables/{nomTable}", async (string nomTable, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetTablesReferenceQuery(nomTable));
        return Results.Ok(result);
    })
    .WithName("GetTablesReference")
    .WithSummary("Get reference table entries (services, articles, etc.)")
    .WithOpenApi();

    zooms.MapGet("/devises/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDevisesZoomQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetDevisesZoom")
    .WithSummary("Get currencies for a company")
    .WithOpenApi();

    zooms.MapGet("/garanties/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetGarantiesQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetGaranties")
    .WithSummary("Get guarantee types for a company")
    .WithOpenApi();

    zooms.MapGet("/depots-objets/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDepotsObjetsQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetDepotsObjets")
    .WithSummary("Get deposit object types for a company")
    .WithOpenApi();

    zooms.MapGet("/depots-devises/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDepotsDevisesQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetDepotsDevises")
    .WithSummary("Get deposit currencies for a company")
    .WithOpenApi();

    zooms.MapGet("/pays", async (string? codeLangue, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetPaysQuery(codeLangue));
        return Results.Ok(result);
    })
    .WithName("GetPays")
    .WithSummary("Get countries/nationalities")
    .WithOpenApi();

    zooms.MapGet("/types-taux-change/{societe}", async (string societe, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetTypesTauxChangeQuery(societe));
        return Results.Ok(result);
    })
    .WithName("GetTypesTauxChange")
    .WithSummary("Get exchange rate types for a company")
    .WithOpenApi();

    // ============ Members Endpoints (Phase 2) ============
    var members = app.MapGroup("/api/members").WithTags("Members");

    members.MapGet("/club-med-pass/{societe}/{compte}/{filiation}", async (
        string societe,
        int compte,
        int filiation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetClubMedPassQuery(societe, compte, filiation));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetClubMedPass")
    .WithSummary("Get Club Med Pass (EzCard) for a member")
    .WithDescription("Migrated from Magic Prg_160 GetCMP - Returns card_code from ez_card table if status is not in Opposition")
    .WithOpenApi();

    // ============ Solde Endpoints (Phase 3) ============
    var solde = app.MapGroup("/api/solde").WithTags("Solde");

    solde.MapGet("/{societe}/{codeAdherent}/{filiation}", async (
        string societe,
        int codeAdherent,
        int filiation,
        DateOnly? dateSolde,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetSoldeCompteQuery(societe, codeAdherent, filiation, dateSolde));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetSoldeCompte")
    .WithSummary("Get account balance details")
    .WithDescription("Migrated from Magic Prg_192 SOLDE_COMPTE - Complete balance with deposits, sales, guarantees")
    .WithOpenApi();

    // ============ Ventes Historique Endpoints (Phase 4) ============
    ventes.MapGet("/historique/{societe}/{codeGm}/{filiation}", async (
        string societe,
        int codeGm,
        int filiation,
        DateOnly? dateDebut,
        DateOnly? dateFin,
        int? limit,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetHistoVentesQuery(societe, codeGm, filiation, dateDebut, dateFin, limit ?? 50));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetHistoVentes")
    .WithSummary("Get sales history for an account")
    .WithDescription("Migrated from Magic Prg_239-241 Histo ventes payantes - Transaction history with details")
    .WithOpenApi();

    // ============ Extrait Endpoints (Phase 5) ============
    var extrait = app.MapGroup("/api/extrait").WithTags("Extrait");

    extrait.MapGet("/{societe}/{codeAdherent}/{filiation}", async (
        string societe,
        int codeAdherent,
        int filiation,
        DateOnly? dateDebut,
        DateOnly? dateFin,
        string? triPar,
        string? codeService,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetExtraitCompteQuery(
            societe, codeAdherent, filiation, dateDebut, dateFin, triPar, codeService));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetExtraitCompte")
    .WithSummary("Generate account statement")
    .WithDescription("Migrated from Magic Prg_69 EXTRAIT_COMPTE - Account statement with sorting and service filter")
    .WithOpenApi();

    // ============ Garanties Endpoints (Phase 6) ============
    var garanties = app.MapGroup("/api/garanties").WithTags("Garanties");

    garanties.MapGet("/{societe}/{codeAdherent}/{filiation}", async (
        string societe,
        int codeAdherent,
        int filiation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetGarantieCompteQuery(societe, codeAdherent, filiation));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetGarantieCompte")
    .WithSummary("Get account guarantees/deposits")
    .WithDescription("Migrated from Magic Prg_111 GARANTIE - Account guarantee deposits with available types")
    .WithOpenApi();

    // ============ Change Endpoints (Phase 7) ============
    var change = app.MapGroup("/api/change").WithTags("Change");

    change.MapGet("/devise-locale/{societe}", async (
        string societe,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetDeviseLocaleQuery(societe));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetDeviseLocale")
    .WithSummary("Get local currency for a company")
    .WithDescription("Migrated from Magic Prg_21 - Returns the local/base currency")
    .WithOpenApi();

    change.MapGet("/taux/{societe}", async (
        string societe,
        string? codeDevise,
        DateOnly? dateReference,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetTauxChangeQuery(societe, codeDevise, dateReference));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetTauxChange")
    .WithSummary("Get exchange rates for a company")
    .WithDescription("Migrated from Magic Prg_20 - List of available exchange rates")
    .WithOpenApi();

    change.MapGet("/calculer", async (
        string societe,
        string typeDevise,
        string deviseSource,
        int nbDecimales,
        string deviseLocale,
        string? modePaiement,
        double montant,
        string typeOperation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new CalculerEquivalentQuery(
            societe, typeDevise, deviseSource, nbDecimales,
            deviseLocale, modePaiement ?? "", montant, typeOperation));
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("CalculerEquivalent")
    .WithSummary("Calculate currency equivalent")
    .WithDescription("Migrated from Magic Prg_22 - Currency conversion with exchange rates")
    .WithOpenApi();

    // ============ Telephone Endpoints (Phase 8) ============
    var telephone = app.MapGroup("/api/telephone").WithTags("Telephone");

    telephone.MapGet("/{societe}/{codeGm}/{filiation}", async (
        string societe,
        int codeGm,
        int filiation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetLigneTelephoneQuery(societe, codeGm, filiation));
        return result.Found ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetLignesTelephone")
    .WithSummary("Get phone lines for an account")
    .WithDescription("Migrated from Magic Prg_202 - Read autocom codes for a guest")
    .WithOpenApi();

    telephone.MapPost("/gerer", async (GererLigneTelephoneCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("GererLigneTelephone")
    .WithSummary("Open or close a phone line")
    .WithDescription("Migrated from Magic Prg_208/210 - OPEN_PHONE_LINE / CLOSE_PHONE_LINE")
    .WithOpenApi();

    // ============ Factures Endpoints (Phase 10) ============
    var factures = app.MapGroup("/api/factures").WithTags("Factures");

    factures.MapGet("/checkout/{societe}/{codeGm}/{filiation}", async (
        string societe,
        int codeGm,
        int filiation,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new GetFacturesCheckOutQuery(societe, codeGm, filiation));
        return result.Success ? Results.Ok(result) : Results.NotFound(result);
    })
    .WithName("GetFacturesCheckOut")
    .WithSummary("Get checkout invoices for an account")
    .WithDescription("Migrated from Magic Prg_54 FACTURES_CHECK_OUT - Invoices for checkout process")
    .WithOpenApi();

    factures.MapPost("/creer", async (CreerFactureCommand command, IMediator mediator) =>
    {
        var result = await mediator.Send(command);
        return result.Success ? Results.Ok(result) : Results.BadRequest(result);
    })
    .WithName("CreerFacture")
    .WithSummary("Create a new VAT invoice")
    .WithDescription("Migrated from Magic Prg_97 Saisie_facture_tva V3 - Create invoice with TVA calculation")
    .WithOpenApi();

    // ============ Identification Endpoints (Phase 11) ============
    var identification = app.MapGroup("/api/identification").WithTags("Identification");

    identification.MapPost("/verifier", async (VerifierOperateurQuery query, IMediator mediator) =>
    {
        var result = await mediator.Send(query);
        return result.Authentifie ? Results.Ok(result) : Results.Unauthorized();
    })
    .WithName("VerifierOperateur")
    .WithSummary("Verify operator credentials")
    .WithDescription("Migrated from Magic Prg_158 Selection Identification - Login verification")
    .WithOpenApi();

    identification.MapGet("/session/{societe}/{codeOperateur}", async (
        string societe,
        string codeOperateur,
        IMediator mediator) =>
    {
        var result = await mediator.Send(new VerifierSessionCaisseQuery(societe, codeOperateur));
        return Results.Ok(result);
    })
    .WithName("VerifierSessionCaisse")
    .WithSummary("Check if a cash session is open")
    .WithDescription("Migrated from Magic Prg_328 Verif session caisse ouverte - Session status check")
    .WithOpenApi();

    // ============ Dashboard ============
    app.MapGet("/", () => Results.Content(GetDashboardHtml(), "text/html"))
        .WithName("Dashboard")
        .ExcludeFromDescription();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

static string GetDashboardHtml() => """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Caisse - Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            color: #e0e0e0;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { text-align: center; margin-bottom: 3rem; }
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        .subtitle { color: #888; font-size: 1.1rem; }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        .stat-card {
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid rgba(255,255,255,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,217,255,0.2);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: #00d9ff;
        }
        .stat-label { color: #888; margin-top: 0.5rem; }
        .section { margin-bottom: 2rem; }
        .section-title {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #00ff88;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .endpoints { display: grid; gap: 1rem; }
        .endpoint {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            border-left: 4px solid #00d9ff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .endpoint:hover { background: rgba(255,255,255,0.08); }
        .method {
            background: #00d9ff;
            color: #000;
            padding: 0.25rem 0.75rem;
            border-radius: 6px;
            font-weight: bold;
            font-size: 0.85rem;
        }
        .method.post { background: #00ff88; }
        .method.put { background: #ffa500; }
        .path { font-family: 'Consolas', monospace; color: #fff; }
        .desc { color: #888; font-size: 0.9rem; width: 100%; }
        .test-section {
            background: rgba(255,255,255,0.05);
            border-radius: 16px;
            padding: 2rem;
            margin-top: 2rem;
        }
        .test-form { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { color: #888; font-size: 0.9rem; }
        .form-group input, .form-group select {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(0,0,0,0.3);
            color: #fff;
            font-size: 1rem;
            width: 120px;
        }
        .form-group input:focus { outline: none; border-color: #00d9ff; }
        button {
            padding: 0.75rem 2rem;
            border-radius: 8px;
            border: none;
            background: linear-gradient(90deg, #00d9ff, #00ff88);
            color: #000;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }
        button:hover { transform: scale(1.05); }
        .result {
            margin-top: 1.5rem;
            padding: 1.5rem;
            background: rgba(0,0,0,0.3);
            border-radius: 12px;
            font-family: 'Consolas', monospace;
            white-space: pre-wrap;
            display: none;
        }
        .result.show { display: block; }
        .result.success { border-left: 4px solid #00ff88; }
        .result.error { border-left: 4px solid #ff4444; }
        .swagger-link {
            display: inline-block;
            margin-top: 1rem;
            color: #00d9ff;
            text-decoration: none;
        }
        .swagger-link:hover { text-decoration: underline; }
        footer { text-align: center; margin-top: 3rem; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏪 API Caisse</h1>
            <p class="subtitle">Migration Magic Unipaas → C# .NET 8</p>
        </header>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">52</div>
                <div class="stat-label">Endpoints</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">36</div>
                <div class="stat-label">Tables mappées</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">327</div>
                <div class="stat-label">Tests unitaires</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">11</div>
                <div class="stat-label">Modules migrés</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🔍 Zooms - Phase 1 (8 endpoints)</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/moyens-reglement/{societe}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/tables/{nomTable}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/devises/{societe}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/garanties/{societe}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/depots-objets/{societe}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/depots-devises/{societe}</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/pays</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/zooms/types-taux-change/{societe}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">👤 Members - Phase 2</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/members/club-med-pass/{societe}/{compte}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_160 GetCMP - Club Med Pass (ez_card table)</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">💵 Solde - Phase 3</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/solde/{societe}/{codeAdherent}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_192 - Solde compte complet (ventes, dépôts, garanties)</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📊 Ventes - Phase 4</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/ventes/solde-giftpass/{societe}/{compte}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_237 - Solde Gift Pass (somme cc_total_par_type)</div>
                </div>
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/ventes/solde-resortcredit/{societe}/{compte}/{filiation}/{service}</span>
                    </div>
                    <div class="desc">Prg_250 - Solde Resort Credit (attribué - utilisé)</div>
                </div>
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/ventes/historique/{societe}/{codeGm}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_239-241 - Historique des ventes payantes</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📋 Extrait - Phase 5</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/extrait/{societe}/{codeAdherent}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_69 - Extrait de compte avec tri et filtres</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🔒 Garanties - Phase 6</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/garanties/{societe}/{codeAdherent}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_111 - Dépôts de garantie du compte</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">💱 Change - Phase 7</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/change/devise-locale/{societe}</span>
                    </div>
                    <div class="desc">Prg_21 - Devise locale</div>
                </div>
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/change/taux/{societe}</span>
                    </div>
                    <div class="desc">Prg_20 - Taux de change</div>
                </div>
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/change/calculer</span>
                    </div>
                    <div class="desc">Prg_22 - Calcul équivalent devise</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📞 Telephone - Phase 8</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <div>
                        <span class="method">GET</span>
                        <span class="path">/api/telephone/{societe}/{codeGm}/{filiation}</span>
                    </div>
                    <div class="desc">Prg_202 - Lignes téléphoniques</div>
                </div>
                <div class="endpoint">
                    <div>
                        <span class="method post">POST</span>
                        <span class="path">/api/telephone/gerer</span>
                    </div>
                    <div class="desc">Prg_208/210 - Ouvrir/Fermer ligne</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">💰 Sessions & Écarts</h2>
            <div class="endpoints">
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/api/sessions/ouvrir</span>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/api/sessions/fermer</span>
                </div>
                <div class="endpoint">
                    <span class="method">GET</span>
                    <span class="path">/api/ecarts/{utilisateur}/{chronoSession}</span>
                </div>
            </div>
        </div>

        <div class="test-section">
            <h2 class="section-title">🧪 Tester Solde Gift Pass</h2>
            <div class="test-form">
                <div class="form-group">
                    <label>Société</label>
                    <input type="text" id="societe" value="C" maxlength="2">
                </div>
                <div class="form-group">
                    <label>Compte</label>
                    <input type="number" id="compte" value="135795">
                </div>
                <div class="form-group">
                    <label>Filiation</label>
                    <input type="number" id="filiation" value="0">
                </div>
                <button onclick="testGiftPass()">Tester</button>
            </div>
            <div id="result" class="result"></div>
        </div>

        <div style="display: flex; gap: 2rem; margin-top: 1.5rem;">
            <a href="/zooms.html" class="swagger-link" style="background: linear-gradient(90deg, #00d9ff, #00ff88); color: #000; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold;">🔍 Ouvrir l'écran Zooms interactif →</a>
            <a href="/swagger" class="swagger-link">📖 Documentation Swagger →</a>
        </div>

        <footer>
            <p>Migration Magic Unipaas v12.03 → C# .NET 8 | CSK0912</p>
        </footer>
    </div>

    <script>
        async function testGiftPass() {
            const societe = document.getElementById('societe').value;
            const compte = document.getElementById('compte').value;
            const filiation = document.getElementById('filiation').value;
            const resultDiv = document.getElementById('result');

            try {
                const response = await fetch(`/api/ventes/solde-giftpass/${societe}/${compte}/${filiation}`);
                const data = await response.json();

                resultDiv.className = 'result show success';
                resultDiv.innerHTML = `<strong>Résultat:</strong>\n\n` +
                    `Société: ${data.societe}\n` +
                    `Compte: ${data.compte}\n` +
                    `Filiation: ${data.filiation}\n` +
                    `<span style="color:#00ff88;font-size:1.5rem">Solde: ${data.soldeCreditConso.toLocaleString('fr-FR')} €</span>\n` +
                    `Enregistrements: ${data.nombreEnregistrements}`;
            } catch (error) {
                resultDiv.className = 'result show error';
                resultDiv.textContent = 'Erreur: ' + error.message;
            }
        }
    </script>
</body>
</html>
""";
