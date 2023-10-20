using System;

namespace AppCode
{
    public static class ToStringOrDefaultExtension
    {
        public static string ToStringOrDefault(this DateTime? source, string format, string defaultValue)
        {
            if (source != null)
            {
                return source.Value.ToString(format);
            }
            else
            {
                return String.IsNullOrEmpty(defaultValue) ? String.Empty : defaultValue;
            }
        }

        public static string ToStringOrDefault(this DateTime? source, string format)
        {
            return ToStringOrDefault(source, format, null);
        }

        public static string ToStringOrDefault(this DateTime source, string format, string defaultValue)
        {
            if (source != null && source != DateTime.MinValue)
            {
                return source.ToString(format);
            }
            else
            {
                return String.IsNullOrEmpty(defaultValue) ? String.Empty : defaultValue;
            }
        }

        public static string ToStringOrDefault(this DateTime source, string format)
        {
            return ToStringOrDefault(source, format, null);
        }
    }
}