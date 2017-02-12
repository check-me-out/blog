using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode =true)]
        public DateTime PostedOn { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public int CategoryId { get; set; }
        //[ForeignKey("Category_Id")]
        public virtual Category Category { get; set; }

        [NotMapped]
        [Required]
        public string NewCategory { get; set; }

        public ICollection<Tag> Tags { get; set; }

        [NotMapped]
        public string NewTags { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public Post()
        {
            Tags = new HashSet<Tag>();
        }
    }
}
