using Caisse.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Caisse.Application.Zooms.Queries;

/// <summary>
/// Query for Prg_265: Zoom Services Village
/// Retrieves available services at the village/resort
/// Table: caisse_ref_simp_service01 (services village)
/// </summary>
public record GetServicesVillageQuery(
    string? Societe = null
) : IRequest<List<ServiceVillageDto>>;

public record ServiceVillageDto(
    string CodeService,
    string LibelleService,
    string? CodeActivite,
    string? LibelleActivite,
    bool EstActif,
    int? OrdreAffichage);

public class GetServicesVillageQueryHandler : IRequestHandler<GetServicesVillageQuery, List<ServiceVillageDto>>
{
    private readonly ICaisseDbContext _context;

    public GetServicesVillageQueryHandler(ICaisseDbContext context)
    {
        _context = context;
    }

    public async Task<List<ServiceVillageDto>> Handle(
        GetServicesVillageQuery request,
        CancellationToken cancellationToken)
    {
        // Query services from caisse_ref_simp_service01 table
        var query = _context.ServicesVillage.AsQueryable();

        if (!string.IsNullOrEmpty(request.Societe))
        {
            query = query.Where(s => s.Societe == request.Societe);
        }

        var services = await query
            .Where(s => s.EstActif)
            .OrderBy(s => s.OrdreAffichage)
            .ThenBy(s => s.LibelleService)
            .Select(s => new ServiceVillageDto(
                s.CodeService,
                s.LibelleService ?? "",
                s.CodeActivite,
                s.LibelleActivite,
                s.EstActif,
                s.OrdreAffichage))
            .ToListAsync(cancellationToken);

        return services;
    }
}
