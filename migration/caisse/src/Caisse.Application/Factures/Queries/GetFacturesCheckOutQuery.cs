using Caisse.Application.Common;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Caisse.Application.Factures.Queries;

/// <summary>
/// Query pour récupérer les factures Check Out d'un client
/// Migration du programme Magic Prg_54 "FACTURES_CHECK_OUT"
///
/// Paramètres originaux Magic:
/// 1. Societe (A1)
/// 2. Code_Gm (N8)
/// 3. Filiation (N3)
/// 4. NumeroFact (A)
/// 5. TypeFacture (A)
/// 6. Operateur (A)
/// 7. Commentaire (U)
/// 8. EditionAuto (B)
/// </summary>
public record GetFacturesCheckOutQuery(
    string Societe,
    int CodeGm,
    int Filiation
) : IRequest<GetFacturesCheckOutResult>;

public record GetFacturesCheckOutResult
{
    public bool Success { get; init; }
    public string Societe { get; init; } = string.Empty;
    public int CodeGm { get; init; }
    public int Filiation { get; init; }
    public int NombreFactures { get; init; }
    public decimal TotalHT { get; init; }
    public decimal TotalTVA { get; init; }
    public decimal TotalTTC { get; init; }
    public List<FactureDto> Factures { get; init; } = new();
}

public record FactureDto
{
    public string NumeroFacture { get; init; } = string.Empty;
    public DateOnly DateFacture { get; init; }
    public string TypeFacture { get; init; } = string.Empty;
    public decimal MontantHT { get; init; }
    public decimal MontantTVA { get; init; }
    public decimal MontantTTC { get; init; }
    public string Etat { get; init; } = string.Empty;
    public string LibelleEtat { get; init; } = string.Empty;
}

public class GetFacturesCheckOutQueryValidator : AbstractValidator<GetFacturesCheckOutQuery>
{
    public GetFacturesCheckOutQueryValidator()
    {
        RuleFor(x => x.Societe)
            .NotEmpty().WithMessage("Societe is required")
            .MaximumLength(2).WithMessage("Societe must be at most 2 characters");

        RuleFor(x => x.CodeGm)
            .GreaterThan(0).WithMessage("CodeGm must be positive");

        RuleFor(x => x.Filiation)
            .GreaterThanOrEqualTo(0).WithMessage("Filiation must be non-negative");
    }
}

public class GetFacturesCheckOutQueryHandler : IRequestHandler<GetFacturesCheckOutQuery, GetFacturesCheckOutResult>
{
    private readonly ICaisseDbContext _context;

    public GetFacturesCheckOutQueryHandler(ICaisseDbContext context)
    {
        _context = context;
    }

    public async Task<GetFacturesCheckOutResult> Handle(
        GetFacturesCheckOutQuery request,
        CancellationToken cancellationToken)
    {
        // Récupérer les transactions comme factures potentielles
        var transactions = await _context.TransactionsBarEntete
            .AsNoTracking()
            .Where(t => t.Societe == request.Societe &&
                       t.CodeGm == request.CodeGm &&
                       t.Filiation == request.Filiation &&
                       t.EtatTransaction == "V") // Only validated transactions
            .OrderByDescending(t => t.DateComptable)
            .ToListAsync(cancellationToken);

        var factures = transactions.Select((t, index) => new FactureDto
        {
            NumeroFacture = $"F{t.DateComptable:yyyyMMdd}{t.NumeroTicket:D3}",
            DateFacture = t.DateComptable,
            TypeFacture = t.TypeTransaction,
            MontantHT = (decimal)(t.MontantTotal - t.MontantTva),
            MontantTVA = (decimal)t.MontantTva,
            MontantTTC = (decimal)t.MontantTotal,
            Etat = t.EtatTransaction,
            LibelleEtat = t.IsValidee ? "Validée" : t.IsAnnulee ? "Annulée" : "En cours"
        }).ToList();

        var totalTTC = factures.Sum(f => f.MontantTTC);
        var totalHT = factures.Sum(f => f.MontantHT);
        var totalTVA = factures.Sum(f => f.MontantTVA);

        return new GetFacturesCheckOutResult
        {
            Success = true,
            Societe = request.Societe,
            CodeGm = request.CodeGm,
            Filiation = request.Filiation,
            NombreFactures = factures.Count,
            TotalHT = totalHT,
            TotalTVA = totalTVA,
            TotalTTC = totalTTC,
            Factures = factures
        };
    }
}
