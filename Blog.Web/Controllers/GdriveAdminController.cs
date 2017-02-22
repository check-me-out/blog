using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using Blog.Data.Contexts.Gdrive;
using Blog.Data.Model;
using System.Web;
using System.IO;

namespace Blog.Web.Controllers
{
    public class GdriveAdminController : Controller
    {
        private GdriveDbContext db = new GdriveDbContext();

        // GET: GdriveAdmin
        public async Task<ActionResult> Index()
        {
            return View(await db.Files.ToListAsync());
        }

        // GET: GdriveAdmin/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: GdriveAdmin/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,SecurityCode")] FileContent fileContent, HttpPostedFileBase file)
        {
            if (ModelState.IsValid)
            {
                if (file != null && file.ContentLength > 0)
                {
                    fileContent.FileName = file.FileName;
                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        fileContent.Content = binaryReader.ReadBytes(file.ContentLength);
                    }
                }

                fileContent.UploadedOn = System.DateTime.Now;
                db.Files.Add(fileContent);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(fileContent);
        }

        // GET: GdriveAdmin/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            FileContent fileContent = await db.Files.FindAsync(id);
            if (fileContent == null)
            {
                return HttpNotFound();
            }
            return View(fileContent);
        }

        // POST: GdriveAdmin/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,SecurityCode")] FileContent fileContent, HttpPostedFileBase file)
        {
            if (ModelState.IsValid)
            {
                if (file != null && file.ContentLength > 0)
                {
                    fileContent.FileName = file.FileName;
                    using (var binaryReader = new BinaryReader(file.InputStream))
                    {
                        fileContent.Content = binaryReader.ReadBytes(file.ContentLength);
                    }
                }

                fileContent.UploadedOn = System.DateTime.Now;
                db.Entry(fileContent).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(fileContent);
        }

        // GET: GdriveAdmin/Download/5
        public async Task<ActionResult> Download(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            FileContent fileContent = await db.Files.FindAsync(id);
            if (fileContent == null)
            {
                return HttpNotFound();
            }
            return File(fileContent.Content, GetContentType(fileContent.FileName), fileContent.FileName);
        }

        // GET: GdriveAdmin/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            FileContent fileContent = await db.Files.FindAsync(id);
            if (fileContent == null)
            {
                return HttpNotFound();
            }
            return View(fileContent);
        }

        // POST: GdriveAdmin/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            FileContent fileContent = await db.Files.FindAsync(id);
            db.Files.Remove(fileContent);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private string GetContentType(string fileName)
        {
            var ext = fileName.Substring(fileName.LastIndexOf('.') + 1).ToUpper();
            switch (ext)
            {
                case "JPG":
                case "JPEG":
                    return "image/jpeg";

                case "PNG":
                    return "image/png";

                case "ZIP":
                    return "application/zip";

                default:
                    return "application/octet";
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
