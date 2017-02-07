using System;
using System.Configuration;

namespace Blog.Web.Helpers
{
    public class ConfigManager
    {
        public static T Get<T>(string key, T defaultValue = default(T))
        {
            try
            {
                var value = ConfigurationManager.AppSettings[key];
                return (T)Convert.ChangeType(value, typeof(T));
            }
            catch (Exception)
            {
                return defaultValue;
            }
        }
    }
}