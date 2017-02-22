using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
using Blog.Data.Model;

namespace Blog.Data.Contexts.Blog
{
    public interface IBlogDbContext : IDisposable
    {
        int SaveChanges();

        Task<int> SaveChangesAsync();

        DbEntityEntry Entry(object entity);

        DbSet<Post> Posts { get; set; }
        DbSet<Category> Categories { get; set; }
        DbSet<Tag> Tags { get; set; }
        DbSet<BadWords> BadWords { get; set; }
    }
}
