using IskraAnalytics.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IskraAnalytics.Infrastructure.Data
{
    public class IskraDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public IskraDbContext(DbContextOptions<IskraDbContext> options) : base(options) { }
        public DbSet<Student> Students{ get; set; }
        public DbSet<Group> Groups{ get; set; }
        public DbSet<Metric> Metrics{ get; set; }
        public DbSet<Result> Results{ get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>().ToTable("Users");

            builder.ApplyConfigurationsFromAssembly(typeof(IskraDbContext).Assembly);
        }

    }
}
