using System.ComponentModel.DataAnnotations;

namespace Blog.Data.Model
{
    public class BadWords
    {
        [Key]
        public string Keyword { get; set; }
    }
}
