using System.Data.Entity;
using Blog.Data.Model;

namespace Blog.Data.Contexts.Gdrive
{
    public class GdriveDbContext : DbContext, IGdriveDbContext
    {
        public GdriveDbContext()
            : base("name=BlogDbConnection")
        {
            Configuration.ProxyCreationEnabled = false;
        }

        public virtual DbSet<FileContent> Files { get; set; }
    }
}
