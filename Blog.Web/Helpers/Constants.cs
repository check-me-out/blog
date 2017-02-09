
namespace Blog.Web.Helpers
{
    public static class Constants
    {
        public static class Roles
        {
            public const string Administrator = "Administrator";
        }

        public static class ConfigKey
        {
            public const string Blog_AllPosts_PageSize = "Blog.AllPosts.PageSize";
            public const string Blog_Posts_MaxComments = "Blog.Posts.MaxComments";
            public const string Blog_Post_Comment_Badwords_ErrorMsg = "Blog.Post.Comment.Badwords.ErrorMsg";
        }
    }
}