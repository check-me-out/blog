using System.Web.Optimization;

namespace Blog.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //BUNDLES: BundleConfig.cs bundle (which is dynamic content) is not used due to load on the web server when compressing dynamic content.
            //Instead, a JS task runner (Grunt) is used to generate build-time static content bundles to take advantage of static file compression &caching by IIS.

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/app/*.js"));
        }
    }
}
