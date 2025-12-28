using Caisse.Application.Common;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Caisse.Application.Ventes.Queries;

/// <summary>
/// Query pour récupérer l'historique des ventes
/// Migration des programmes Magic Prg_239-241 "Histo ventes payantes"
/// </summary>
public record GetHistoVentesQuery(
    string Societe,
    int CodeGm,
    int Filiation,
    DateOnly? DateDebut = null,
    DateOnly? DateFin = null,
    int Limit = 50) : IRequest<GetHistoVentesResult>;

public record GetHistoVentesResult
{
    public bool Found { get; init; }
    public int TotalTransactions { get; init; }
    public double MontantTotal { get; init; }
    public List<VenteDto> Ventes { get; init; } = new();
}

public record VenteDto
{
    public long TransactionId { get; init; }
    public DateOnly DateComptable { get; init; }
    public TimeOnly HeureTransaction { get; init; }
    public string TypeTransaction { get; init; } = string.Empty;
    public string ModePaiement { get; init; } = string.Empty;
    public double MontantTotal { get; init; }
    public double MontantTva { get; init; }
    public string DeviseTransaction { get; init; } = string.Empty;
    public int NumeroTicket { get; init; }
    public string Operateur { get; init; } = string.Empty;
    public string EtatTransaction { get; init; } = string.Empty;
    public string CodeService { get; init; } = string.Empty;
    public string Commentaire { get; init; } = string.Empty;
    public List<VenteLigneDto> Lignes { get; init; } = new();
}

public record VenteLigneDto
{
    public string CodeArticle { get; init; } = string.Empty;
    public string LibelleArticle { get; init; } = string.Empty;
    public int Quantite { get; init; }
    public double PrixUnitaire { get; init; }
    public double MontantLigne { get; init; }
}

public class GetHistoVentesQueryValidator : AbstractValidator<GetHistoVentesQuery>
{
    public GetHistoVentesQueryValidator()
    {
        RuleFor(x => x.Societe)
            .NotEmpty().WithMessage("Societe is required")
            .MaximumLength(2).WithMessage("Societe must be at most 2 characters");

        RuleFor(x => x.CodeGm)
            .GreaterThan(0).WithMessage("CodeGm must be positive");

        RuleFor(x => x.Filiation)
            .GreaterThanOrEqualTo(0).WithMessage("Filiation must be non-negative");

        RuleFor(x => x.Limit)
            .InclusiveBetween(1, 500).WithMessage("Limit must be between 1 and 500");
    }
}

public class GetHistoVentesQueryHandler : IRequestHandler<GetHistoVentesQuery, GetHistoVentesResult>
{
    private readonly ICaisseDbContext _context;

    public GetHistoVentesQueryHandler(ICaisseDbContext context)
    {
        _context = context;
    }

    public async Task<GetHistoVentesResult> Handle(
        GetHistoVentesQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.TransactionsBarEntete
            .AsNoTracking()
            .Where(t =>
                t.Societe == request.Societe &&
                t.CodeGm == request.CodeGm &&
                t.Filiation == request.Filiation &&
                t.EtatTransaction != "A"); // Exclure les annulées

        if (request.DateDebut.HasValue)
            query = query.Where(t => t.DateComptable >= request.DateDebut.Value);

        if (request.DateFin.HasValue)
            query = query.Where(t => t.DateComptable <= request.DateFin.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var totalMontant = await query.SumAsync(t => t.MontantTotal, cancellationToken);

        var transactions = await query
            .OrderByDescending(t => t.DateComptable)
            .ThenByDescending(t => t.HeureTransaction)
            .Take(request.Limit)
            .Select(t => new VenteDto
            {
                TransactionId = t.Id,
                DateComptable = t.DateComptable,
                HeureTransaction = t.HeureTransaction,
                TypeTransaction = t.TypeTransaction,
                ModePaiement = t.ModePaiement,
                MontantTotal = t.MontantTotal,
                MontantTva = t.MontantTva,
                DeviseTransaction = t.DeviseTransaction,
                NumeroTicket = t.NumeroTicket,
                Operateur = t.Operateur,
                EtatTransaction = t.EtatTransaction,
                CodeService = t.CodeService,
                Commentaire = t.Commentaire
            })
            .ToListAsync(cancellationToken);

        // Récupérer les lignes de détail pour chaque transaction
        var transactionIds = transactions.Select(t => t.TransactionId).ToList();
        var lignes = await _context.TransactionsBarDetail
            .AsNoTracking()
            .Where(d => transactionIds.Contains(d.TransactionId))
            .ToListAsync(cancellationToken);

        foreach (var vente in transactions)
        {
            vente.Lignes.AddRange(
                lignes.Where(l => l.TransactionId == vente.TransactionId)
                    .Select(l => new VenteLigneDto
                    {
                        CodeArticle = l.CodeArticle,
                        LibelleArticle = l.LibelleArticle,
                        Quantite = l.Quantite,
                        PrixUnitaire = l.PrixUnitaire,
                        MontantLigne = l.MontantLigne
                    })
            );
        }

        return new GetHistoVentesResult
        {
            Found = transactions.Count > 0,
            TotalTransactions = totalCount,
            MontantTotal = totalMontant,
            Ventes = transactions
        };
    }
}
