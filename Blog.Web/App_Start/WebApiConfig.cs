using System.Web.Http;

namespace Blog.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "Blog_ApiByActionAndId",
                routeTemplate: "api/{action}/{slug}",
                defaults: new { controller = "Blog", slug = RouteParameter.Optional }
            );

            // IDs
            config.Routes.MapHttpRoute(
                name: "Blog_ApiById",
                routeTemplate: "api/{action}/{id}/{slug}",
                defaults: new { controller = "Blog", slug = RouteParameter.Optional },
                constraints: new { id = @"^\d+$" }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
