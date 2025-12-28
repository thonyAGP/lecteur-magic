using Caisse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caisse.Infrastructure.Persistence.Configurations;

public class TransactionBarEnteteConfiguration : IEntityTypeConfiguration<TransactionBarEntete>
{
    public void Configure(EntityTypeBuilder<TransactionBarEntete> builder)
    {
        builder.ToTable("bartransacent");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("bte_id")
            .ValueGeneratedOnAdd();

        builder.Property(e => e.Societe)
            .HasColumnName("bte_societe")
            .HasMaxLength(2)
            .IsRequired();

        builder.Property(e => e.CodeGm)
            .HasColumnName("bte_code_gm");

        builder.Property(e => e.Filiation)
            .HasColumnName("bte_filiation");

        builder.Property(e => e.DateComptable)
            .HasColumnName("bte_date_comptable");

        builder.Property(e => e.HeureTransaction)
            .HasColumnName("bte_heure_transaction");

        builder.Property(e => e.TypeTransaction)
            .HasColumnName("bte_type_transaction")
            .HasMaxLength(4);

        builder.Property(e => e.ModePaiement)
            .HasColumnName("bte_mode_paiement")
            .HasMaxLength(10);

        builder.Property(e => e.MontantTotal)
            .HasColumnName("bte_montant_total");

        builder.Property(e => e.MontantTva)
            .HasColumnName("bte_montant_tva");

        builder.Property(e => e.DeviseTransaction)
            .HasColumnName("bte_devise_transaction")
            .HasMaxLength(6);

        builder.Property(e => e.TauxChange)
            .HasColumnName("bte_taux_change");

        builder.Property(e => e.NumeroTicket)
            .HasColumnName("bte_numero_ticket");

        builder.Property(e => e.Operateur)
            .HasColumnName("bte_operateur")
            .HasMaxLength(16);

        builder.Property(e => e.EtatTransaction)
            .HasColumnName("bte_etat_transaction")
            .HasMaxLength(2);

        builder.Property(e => e.NumChambre)
            .HasColumnName("bte_num_chambre")
            .HasMaxLength(10);

        builder.Property(e => e.CodeService)
            .HasColumnName("bte_code_service")
            .HasMaxLength(10);

        builder.Property(e => e.Commentaire)
            .HasColumnName("bte_commentaire")
            .HasMaxLength(100);

        builder.Property(e => e.DateAnnulation)
            .HasColumnName("bte_date_annulation");

        builder.Property(e => e.MotifAnnulation)
            .HasColumnName("bte_motif_annulation")
            .HasMaxLength(100);

        // Index for common queries
        builder.HasIndex(e => new { e.Societe, e.CodeGm, e.Filiation, e.DateComptable });
        builder.HasIndex(e => new { e.Societe, e.NumeroTicket });
    }
}
