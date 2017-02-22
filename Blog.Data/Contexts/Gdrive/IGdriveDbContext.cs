using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
using Blog.Data.Model;

namespace Blog.Data.Contexts.Gdrive
{
    public interface IGdriveDbContext : IDisposable
    {
        int SaveChanges();

        Task<int> SaveChangesAsync();

        DbEntityEntry Entry(object entity);

        DbSet<FileContent> Files { get; set; }
    }
}
