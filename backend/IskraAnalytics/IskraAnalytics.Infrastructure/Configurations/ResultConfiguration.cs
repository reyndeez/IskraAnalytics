using IskraAnalytics.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IskraAnalytics.Infrastructure.Configurations
{
    public class ResultConfiguration : IEntityTypeConfiguration<Result>
    {
        public void Configure(EntityTypeBuilder<Result> builder)
        {
            builder.HasKey(r => r.Id);

            builder.HasOne(r => r.Student)
                .WithMany()
                .HasForeignKey(r => r.StudentId);

            builder.HasOne(r => r.Metric)
                .WithMany()
                .HasForeignKey(r =>r.MetricId);
        }
    }
}
