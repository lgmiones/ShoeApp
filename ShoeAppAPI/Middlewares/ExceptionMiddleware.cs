using System.Text.Json; // For serializing error responses into JSON

namespace ShoeShopAPI.Middlewares
{
    // Custom middleware to handle exceptions globally
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next; // Delegate for the next middleware in pipeline

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next; // Save the next middleware reference
        }

        // This method runs for every incoming HTTP request
        public async Task Invoke(HttpContext context)
        {
            try
            {
                // Pass the request down the pipeline
                await _next(context);
            }
            catch (Exception ex)
            {
                // If any unhandled exception occurs → catch it here

                context.Response.StatusCode = 400; // Respond with "Bad Request" (can also be 500)
                context.Response.ContentType = "application/json"; // Return JSON format

                // Standardized error response
                var response = new
                {
                    success = false,   // Mark request as failed
                    message = ex.Message // Include exception message for debugging
                };

                // Write the JSON response back to the client
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }

    // Extension method for registering the middleware in Program.cs
    public static class ExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalException(this IApplicationBuilder builder)
        {
            // Clean way to add middleware to the request pipeline
            return builder.UseMiddleware<ExceptionMiddleware>();
        }
    }
}
