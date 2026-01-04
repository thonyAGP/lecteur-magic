using Caisse.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Caisse.Infrastructure.Persistence.Configurations;

public class ServiceVillageConfiguration : IEntityTypeConfiguration<ServiceVillage>
{
    public void Configure(EntityTypeBuilder<ServiceVillage> builder)
    {
        builder.ToTable("caisse_ref_simp_service01");

        builder.HasKey(s => new { s.Societe, s.CodeService });

        builder.Property(s => s.Societe)
            .HasColumnName("societe")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(s => s.CodeService)
            .HasColumnName("code_service")
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(s => s.LibelleService)
            .HasColumnName("libelle_service")
            .HasMaxLength(100);

        builder.Property(s => s.CodeActivite)
            .HasColumnName("code_activite")
            .HasMaxLength(10);

        builder.Property(s => s.LibelleActivite)
            .HasColumnName("libelle_activite")
            .HasMaxLength(100);

        builder.Property(s => s.EstActif)
            .HasColumnName("est_actif")
            .HasDefaultValue(true);

        builder.Property(s => s.OrdreAffichage)
            .HasColumnName("ordre_affichage");
    }
}
