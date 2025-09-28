using Microsoft.EntityFrameworkCore;
using ShoeShopAPI.Data;
using ShoeShopAPI.Repositories;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services;
using ShoeShopAPI.Services.Interfaces;
using ShoeShopAPI.Middlewares;


var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IShoeRepository, ShoeRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Services
builder.Services.AddScoped<IShoeService, ShoeService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Vite default port
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Enable CORS middleware
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseGlobalException();
app.UseAuthorization();
app.MapControllers();
app.Run();
