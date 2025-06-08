using Fretefy.Test.Domain.Entities;
using Fretefy.Test.Infra.EntityFramework.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Fretefy.Test.Infra.EntityFramework
{
    public class TestDbContext : DbContext
    {
        public DbSet<Cidade> Cidades { get; set; }
        public DbSet<Regiao> Regioes { get; set; }
        public DbSet<RegiaoCidade> RegiaoCidades { get; set; }

        public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }
        public TestDbContext()
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CidadeMap());
            modelBuilder.ApplyConfiguration(new RegiaoMap());
            modelBuilder.ApplyConfiguration(new RegiaoCidadeMap());

            base.OnModelCreating(modelBuilder);

        }
    }
}
