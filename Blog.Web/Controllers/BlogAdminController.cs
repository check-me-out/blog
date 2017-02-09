using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Blog.Data.Context;
using Blog.Data.Model;

namespace Blog.Web.Controllers
{
    public class BlogAdminController : Controller
    {
        private readonly IBlogDbContext _db;

        public BlogAdminController(IBlogDbContext db)
        {
            _db = db;
        }

        // GET: BlogAdmin
        public async Task<ActionResult> Index()
        {
            return View(await _db.Posts.ToListAsync());
        }

        // GET: BlogAdmin/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: BlogAdmin/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Title,ShortDescription,Content,UrlSlug,Published,PostedOn,ModifiedOn")] Post post)
        {
            if (ModelState.IsValid)
            {
                _db.Posts.Add(post);
                await _db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(post);
        }

        // GET: BlogAdmin/Edit/5
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
            return View(post);
        }

        // POST: BlogAdmin/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Title,ShortDescription,Content,UrlSlug,Published,PostedOn,ModifiedOn")] Post post)
        {
            if (ModelState.IsValid)
            {
                _db.Entry(post).State = EntityState.Modified;
                await _db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(post);
        }

        // GET: BlogAdmin/Delete/5
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

        // POST: BlogAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Post post = await _db.Posts.FindAsync(id);
            _db.Posts.Remove(post);
            await _db.SaveChangesAsync();
            return RedirectToAction("Index");
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
