using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Web.Http.Dependencies;
using Ninject;
using Ninject.Syntax;

namespace Blog.Web
{
    public class DependencyScope : IDependencyScope
    {
        private IResolutionRoot _resolver;

        internal DependencyScope(IResolutionRoot resolver)
        {
            Contract.Assert(resolver != null);

            this._resolver = resolver;
        }

        public object GetService(Type serviceType)
        {
            if (this._resolver == null)
            {
                throw new ObjectDisposedException("this", "This scope has already been disposed");
            }

            return this._resolver.TryGet(serviceType);
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            if (this._resolver == null)
            {
                throw new ObjectDisposedException("this", "This scope has already been disposed");
            }

            return this._resolver.GetAll(serviceType);
        }

        public void Dispose()
        {
            var disposable = this._resolver as IDisposable;
            if (disposable != null)
            {
                disposable.Dispose();
            }

            this._resolver = null;
        }
    }
}