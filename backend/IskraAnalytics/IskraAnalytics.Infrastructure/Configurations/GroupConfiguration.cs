using IskraAnalytics.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IskraAnalytics.Infrastructure.Configurations
{
    public class GroupConfiguration : IEntityTypeConfiguration<Group>
    {
        public void Configure(EntityTypeBuilder<Group> builder)
        {
            builder.HasKey(g => g.Id);
            builder.Property(g => g.Name).IsRequired().HasMaxLength(100);

            builder.HasOne(g => g.Coach)
                .WithMany(u => u.ManagedGroups)
                .HasForeignKey(g => g.CoachId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
