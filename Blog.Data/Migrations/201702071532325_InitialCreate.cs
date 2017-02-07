namespace Blog.Data.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BadWords",
                c => new
                    {
                        Keyword = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => t.Keyword);
            
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        UrlSlug = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Posts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        ShortDescription = c.String(),
                        Content = c.String(),
                        UrlSlug = c.String(),
                        Published = c.Boolean(nullable: false),
                        PostedOn = c.DateTime(nullable: false),
                        ModifiedOn = c.DateTime(),
                        Category_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Categories", t => t.Category_Id)
                .Index(t => t.Category_Id);
            
            CreateTable(
                "dbo.Comments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Email = c.String(),
                        Content = c.String(nullable: false, maxLength: 3000),
                        CommentedOn = c.DateTime(nullable: false),
                        NotifyOnComments = c.Boolean(nullable: false),
                        NotifyOnPosts = c.Boolean(nullable: false),
                        Post_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Posts", t => t.Post_Id)
                .Index(t => t.Post_Id);
            
            CreateTable(
                "dbo.Tags",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        UrlSlug = c.String(),
                        Description = c.String(),
                        Class = c.String(),
                        Post_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Posts", t => t.Post_Id)
                .Index(t => t.Post_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Tags", "Post_Id", "dbo.Posts");
            DropForeignKey("dbo.Comments", "Post_Id", "dbo.Posts");
            DropForeignKey("dbo.Posts", "Category_Id", "dbo.Categories");
            DropIndex("dbo.Tags", new[] { "Post_Id" });
            DropIndex("dbo.Comments", new[] { "Post_Id" });
            DropIndex("dbo.Posts", new[] { "Category_Id" });
            DropTable("dbo.Tags");
            DropTable("dbo.Comments");
            DropTable("dbo.Posts");
            DropTable("dbo.Categories");
            DropTable("dbo.BadWords");
        }
    }
}
