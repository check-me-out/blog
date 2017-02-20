using System.Collections.Generic;
using Blog.Data.Model;

namespace Blog.Web.ViewModels
{
    public class CommentViewModel
    {
        public int PostId { get; set; }

        public ICollection<Comment> AllComments { get; set; }

        public Comment NewComment { get; set; }
        public bool DisableNewComment { get; set; }
    }
}