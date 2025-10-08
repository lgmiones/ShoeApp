using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ShoeShopAPI.Data;
using ShoeShopAPI.Models;
using ShoeShopAPI.Repositories;
using ShoeShopAPI.Repositories.Interfaces;
using ShoeShopAPI.Services;
using ShoeShopAPI.Services.Interfaces;
using ShoeShopAPI.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// -------------------- DATABASE SETUP --------------------
// Register EF Core DbContext with SQL Server using connection string
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// -------------------- IDENTITY (USER + ROLES) --------------------
// Configure Identity with int keys for users/roles
builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.Password.RequiredLength = 6;
    opt.Password.RequireNonAlphanumeric = false;
    opt.Password.RequireUppercase = false;
})
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<AppUser>>()
    .AddDefaultTokenProviders();

// -------------------- JWT AUTHENTICATION --------------------
var jwtSection = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Validation rules for incoming JWTs
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// -------------------- AUTHORIZATION POLICIES --------------------
// Define policy for Admin-only endpoints
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

// -------------------- DEPENDENCY INJECTION --------------------
// Register repositories (data access layer)
builder.Services.AddScoped<IShoeRepository, ShoeRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Register services (business logic layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IShoeService, ShoeService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// -------------------- CONTROLLERS + SWAGGER --------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger documentation with JWT "Authorize" button
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ShoeShopAPI", Version = "v1" });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        Description = "Put **ONLY** your JWT Bearer token here.",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// -------------------- CORS --------------------
// Allow frontend (React/Vue/etc.) to call API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
var showSwagger = app.Environment.IsDevelopment() ||
                  builder.Configuration.GetValue<bool>("ShowSwagger");

// -------------------- SEED ROLES + ADMIN USER --------------------
// Ensure Admin and Customer roles exist, and create default Admin if missing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Apply pending migrations

    var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    foreach (var roleName in new[] { "Admin", "Customer" })
    {
        if (!await roleMgr.RoleExistsAsync(roleName))
            await roleMgr.CreateAsync(new IdentityRole<int>(roleName));
    }

    var adminEmail = "admin@shoes.local"; //defaul admin email
    var admin = await userMgr.FindByEmailAsync(adminEmail);
    if (admin == null)
    {
        admin = new AppUser { UserName = adminEmail, Email = adminEmail };
        await userMgr.CreateAsync(admin, "Admin123!");    // default admin password
        await userMgr.AddToRoleAsync(admin, "Admin");
    }
}

// -------------------- MIDDLEWARE PIPELINE --------------------
if (showSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShoeShopAPI v1");
    });
}

app.UseCors("AllowFrontend");     // Enable CORS for frontend
app.UseGlobalException();         // Custom global exception middleware
app.UseAuthentication();          // Enable JWT auth
app.UseAuthorization();           // Enable role-based access control
app.MapControllers();             // Map controller routes
app.Run();                        // Start the application
