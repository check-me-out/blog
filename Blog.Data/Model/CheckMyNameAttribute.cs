using System.ComponentModel.DataAnnotations;

namespace Blog.Data.Model
{
    class CheckMyNameAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var valueToCheck = value != null ? value.ToString() : string.Empty;
            if (valueToCheck.ToLower().Contains("guru"))
            {
                return new ValidationResult("Sorry, Guru is my name and taken already.");
            }

            return ValidationResult.Success;
        }
    }
}
