using Blog.Web.Helpers;
using System.Web;
using System.Web.Mvc;

namespace Blog.Web
{
    public class AdminAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            return httpContext.User.IsInRole(Constants.Roles.Administrator);
        }
    }
}