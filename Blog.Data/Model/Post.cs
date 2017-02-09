using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Blog.Data.Model
{
    public class Post
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [DataType(DataType.MultilineText)]
        public string ShortDescription { get; set; }

        [DataType(DataType.MultilineText)]
        public string Content { get; set; }

        public string UrlSlug { get; set; }

        public bool Published { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime PostedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public Category Category { get; set; }

        public ICollection<Tag> Tags { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public Post()
        {
            Tags = new HashSet<Tag>();
        }
    }
}
