using System.Web.Http.Dependencies;
using Ninject;

namespace Blog.Web
{
    public class DependencyResolver : DependencyScope, IDependencyResolver, System.Web.Mvc.IDependencyResolver
    {
        private readonly IKernel _kernel;

        public DependencyResolver(IKernel kernel) : base(kernel)
        {
            _kernel = kernel;
        }

        public IDependencyScope BeginScope()
        {
            return new DependencyScope(_kernel.BeginBlock());
        }
    }
}