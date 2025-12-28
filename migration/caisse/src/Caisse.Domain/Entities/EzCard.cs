namespace Caisse.Domain.Entities;

/// <summary>
/// Table ez_card (ezcard) - Cartes EzCard / Club Med Pass
/// Source: Magic Table ID 312 (REF component)
/// </summary>
public class EzCard
{
    public string Societe { get; private set; } = string.Empty;
    public int CodeGm { get; private set; }
    public int Filiation { get; private set; }
    public string CardCode { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public double Plafond { get; private set; }
    public string Type { get; private set; } = string.Empty;
    public DateOnly? DateOperation { get; private set; }
    public TimeOnly? TimeOperation { get; private set; }
    public string Utilisateur { get; private set; } = string.Empty;

    private EzCard() { }

    /// <summary>
    /// Indique si la carte est valide (pas en opposition)
    /// </summary>
    public bool IsValid => Status != "O";
}
