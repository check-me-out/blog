using System.Web.Mvc;
using System.Web.Routing;

namespace Blog.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "version",
                url: "ver",
                defaults: new { controller = "Home", action = "Version" }
            );

            routes.MapRoute(
                "blog-route",
                "Blog/{id}/{slug}",
                new { controller = "Home", action = "Post", slug = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "default-route",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "AllPosts", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                "catch-all",
                "{*url}",
                new { controller = "Error", action = "InvalidUrl" }
            );
        }
    }
}
