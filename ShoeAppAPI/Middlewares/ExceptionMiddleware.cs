using System.Text.Json;

namespace ShoeShopAPI.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400; // ✅ client error
                context.Response.ContentType = "application/json";

                var response = new
                {
                    success = false,
                    message = ex.Message
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }

    // ✅ Extension method for clean Program.cs registration
    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalException(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
