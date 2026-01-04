namespace Caisse.Domain.Entities;

/// <summary>
/// Table caisse_ref_simp_service01 - Services disponibles au village
/// Pour Prg_265: Zoom services village
/// </summary>
public class ServiceVillage
{
    public string Societe { get; set; } = null!;
    public string CodeService { get; set; } = null!;
    public string? LibelleService { get; set; }
    public string? CodeActivite { get; set; }
    public string? LibelleActivite { get; set; }
    public bool EstActif { get; set; } = true;
    public int? OrdreAffichage { get; set; }
}
