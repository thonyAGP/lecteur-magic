namespace Caisse.Domain.Entities;

/// <summary>
/// En-tête Transaction Bar - Table bartransacent
/// Utilisé par: Prg_233-236 (Ventes), Prg_243 (Déversement)
/// </summary>
public class TransactionBarEntete
{
    public long Id { get; private set; }
    public string Societe { get; private set; } = string.Empty;
    public int CodeGm { get; private set; }
    public int Filiation { get; private set; }
    public DateOnly DateComptable { get; private set; }
    public TimeOnly HeureTransaction { get; private set; }
    public string TypeTransaction { get; private set; } = string.Empty;
    public string ModePaiement { get; private set; } = string.Empty;
    public double MontantTotal { get; private set; }
    public double MontantTva { get; private set; }
    public string DeviseTransaction { get; private set; } = string.Empty;
    public double TauxChange { get; private set; }
    public int NumeroTicket { get; private set; }
    public string Operateur { get; private set; } = string.Empty;
    public string EtatTransaction { get; private set; } = string.Empty;
    public string NumChambre { get; private set; } = string.Empty;
    public string CodeService { get; private set; } = string.Empty;
    public string Commentaire { get; private set; } = string.Empty;
    public DateOnly? DateAnnulation { get; private set; }
    public string MotifAnnulation { get; private set; } = string.Empty;

    private TransactionBarEntete() { }

    // Business logic
    public bool IsAnnulee => EtatTransaction == "A";
    public bool IsValidee => EtatTransaction == "V";
    public bool IsPending => EtatTransaction == "P";
}
