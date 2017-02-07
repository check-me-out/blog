﻿using System.Reflection;
using Blog.Data.Context;
using log4net;
using Ninject;
using Ninject.Modules;

namespace Blog.Web
{
    public class ModuleLoader : NinjectModule
    {
        public override void Load()
        {
            var logger = LogManager.GetLogger("BlogLogger");
            Bind<ILog>().ToConstant<ILog>(logger).Named("BlogLogger");
            Bind<IBlogDbContext>().To<BlogDbContext>();
        }

        private static readonly StandardKernel Instance = CreateInstance();

        public static StandardKernel Dependencies { get { return Instance; } }

        private static StandardKernel CreateInstance()
        {
            var kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            return kernel;
        }
    }
}