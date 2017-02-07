using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Blog.Web.Controllers;
using System.Web.Http;
using Blog.Web.Helpers;
using log4net;
using Newtonsoft.Json;
using Ninject;

namespace Blog.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();

            // lazy load DI.
            var logger = ModuleLoader.Dependencies.Get<ILog>("BlogLogger");
            EmailEngine.Logger(logger);

            var diResolver = new DependencyResolver(ModuleLoader.Dependencies);
            System.Web.Mvc.DependencyResolver.SetResolver(diResolver); // MVC
            GlobalConfiguration.Configuration.DependencyResolver = diResolver; // WebAPI

            // To resolve self referencing loop error.
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.Re‌ferenceLoopHandling = ReferenceLoopHandling.Ignore;

            WebApiConfig.Register(GlobalConfiguration.Configuration);

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            GlobalConfiguration.Configuration.EnsureInitialized();
        }

        protected void Application_Error()
        {
            var ex = Server.GetLastError();

            try
            {
                var logger = ModuleLoader.Dependencies.Get<ILog>("BlogLogger");
                logger.Error("Application_Error", ex);
            }
            catch (Exception)
            {
            }

            Server.ClearError();
            Response.Clear();
            Response.ContentType = "text/html";
            Response.StatusCode = (ex is HttpException) ? (ex as HttpException).GetHttpCode() : 500;

            // Hack for GoDaddy Hosting
            Response.TrySkipIisCustomErrors = true;

            // if the request is AJAX return JSON else view.
            if (IsAjax())
            {
                var errorMsg = (ex != null ? ex.Message : string.Empty);
                errorMsg += (ex != null && ex.InnerException != null ? ex.InnerException.Message : string.Empty);
                errorMsg += (ex != null && ex.InnerException != null && ex.InnerException.InnerException != null ? ex.InnerException.InnerException.Message : string.Empty);
                Context.Session["JSON_ERROR_MESSAGE"] = errorMsg;

                Context.Response.Redirect("~/Error/AjaxResponse", false);
                return;
            }

            var model = new HandleErrorInfo(ex, "UNKNOWN", "UNKNOWN");

            RouteData routeData = new RouteData();
            routeData.Values.Add("controller", "Error");
            routeData.Values.Add("action", "Index");
            routeData.Values.Add("errorInfo", model);

            IController errorController = new ErrorController();
            errorController.Execute(new RequestContext(new HttpContextWrapper(Context), routeData));
        }

        private bool IsAjax()
        {
            return Context.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }
    }
}
