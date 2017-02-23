using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using Blog.Data.Contexts.Blog;
using Blog.Data.Model;
using System.Linq;
using System.Collections.Generic;

namespace Blog.Web.Controllers
{
    [Authorize]
    public class BlogAdminController : Controller
    {
        private readonly IBlogDbContext _db;

        public BlogAdminController(IBlogDbContext db)
        {
            _db = db;
        }

        public async Task<ActionResult> Index()
        {
            return View(await _db.Posts.OrderByDescending(o => o.PostedOn).ToListAsync());
        }

        public ActionResult Create()
        {
            ViewBag.AvailableCategories = GetAailableCategories();

            Post post = new Post();
            post.PostedOn = System.DateTime.Now;

            return View(post);
        }

        [AdminAuthorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public async Task<ActionResult> Create([Bind(Include = "Id,Title,ShortDescription,Content,UrlSlug,NewCategory,NewTags,Published,PostedOn,ModifiedOn")] Post post)
        {
            if (ModelState.IsValid)
            {
                post.Category = (await _db.Categories.FirstOrDefaultAsync(c => c.Name.Equals(post.NewCategory, System.StringComparison.CurrentCultureIgnoreCase)) 
                                ?? new Category { Name = post.NewCategory, UrlSlug = post.NewCategory.ToLower().Replace(" ", "-"), Description = post.NewCategory });

                if (post.Category.Id == 0)
                {
                    _db.Categories.Add(post.Category);
                    _db.Entry(post.Category).State = EntityState.Added;
                    await _db.SaveChangesAsync();
                }

                post.CategoryId = post.Category.Id;
                _db.Posts.Add(post);
                await _db.SaveChangesAsync();

                if (!string.IsNullOrWhiteSpace(post.NewTags))
                {
                    post.Tags = post.NewTags.Split(new string[] { "," }, System.StringSplitOptions.RemoveEmptyEntries).Select(s => new Tag { Name = s.Trim(), Description = s.Trim(), UrlSlug = s.Trim().ToLower().Replace(" ", "-"), Post = post }).ToList();
                    await _db.SaveChangesAsync();
                }

                return RedirectToAction("Index");
            }

            ViewBag.AvailableCategories = GetAailableCategories();

            return View(post);
        }

        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Post post = await _db.Posts.FindAsync(id);
            if (post == null)
            {
                return HttpNotFound();
            }

            ViewBag.AvailableCategories = GetAailableCategories();

            post.ModifiedOn = System.DateTime.Now;
            post.NewCategory = post.Category.Name;
            _db.Entry(post).Collection("Tags").Load();
            post.NewTags = string.Join(", ", post.Tags.Select(s => s.Name).OrderBy(o => o));

            return View(post);
        }

        [AdminAuthorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Title,ShortDescription,Content,UrlSlug,NewCategory,NewTags,Published,PostedOn,ModifiedOn")] Post post)
        {
            ViewBag.AvailableCategories = GetAailableCategories();

            if (ModelState.IsValid)
            {
                post.ModifiedOn = System.DateTime.Now;
                post.Category = (await _db.Categories.FirstOrDefaultAsync(c => c.Name.Equals(post.NewCategory, System.StringComparison.CurrentCultureIgnoreCase))
                                ?? new Category { Name = post.NewCategory, UrlSlug = post.NewCategory.ToLower().Replace(" ", "-"), Description = post.NewCategory });

                if (post.Category.Id == 0)
                {
                    _db.Categories.Add(post.Category);
                    _db.Entry(post.Category).State = EntityState.Added;
                    await _db.SaveChangesAsync();
                }

                post.CategoryId = post.Category.Id;
                _db.Entry(post).State = EntityState.Modified;
                await _db.SaveChangesAsync();

                var newTags = new List<Tag>();
                if (!string.IsNullOrWhiteSpace(post.NewTags))
                {
                    newTags = post.NewTags.Split(new string[] { "," }, System.StringSplitOptions.RemoveEmptyEntries).Select(s => new Tag { Name = s.Trim(), Description = s.Trim(), UrlSlug = s.Trim().ToLower().Replace(" ", "-"), Post = post }).ToList();
                }
                var tagNames = newTags.Select(s => s.Name);
                _db.Tags.RemoveRange(_db.Tags.Where(t => t.Post.Id == post.Id && !tagNames.Contains(t.Name)));
                newTags.RemoveAll(t => _db.Tags.Any(a => a.Post.Id == post.Id && a.Name == t.Name));
                _db.Tags.AddRange(newTags);
                await _db.SaveChangesAsync();

                _db.Entry(post).Collection("Tags").Load();
                post.NewTags = string.Join(", ", post.Tags.Select(s => s.Name).OrderBy(o => o).ToList());

                return View(post);
            }

            return View(post);
        }

        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Post post = await _db.Posts.FindAsync(id);
            if (post == null)
            {
                return HttpNotFound();
            }
            return View(post);
        }

        [AdminAuthorize]
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            _db.Tags.RemoveRange(_db.Tags.Where(t => t.Post.Id == id));
            Post post = await _db.Posts.FindAsync(id);
            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private string GetAailableCategories()
        {
            IEnumerable<string> categories = _db.Categories.ToList().Select(s => s.Name).Distinct().OrderBy(o => o);
            categories = categories.Select(s => "<a href='#' onclick=\"$('#NewCategory').val('" + s + "');return false;\">" + s + "</a>");
            return string.Join("<span>, </span>", categories);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
