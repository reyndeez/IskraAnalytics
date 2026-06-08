using IskraAnalytics.Application.Mappings;
using IskraAnalytics.Application.Services;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using IskraAnalytics.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// Настройки из конфигурации
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

// CORS - настраиваем политику
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", b =>
        b.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader());
});

// Инфраструктура и Identity
builder.Services.AddDbContext<IskraDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 8;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<IskraDbContext>()
.AddDefaultTokenProviders();

// Регистрация сервисов и репозиториев
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IResultRepository, ResultRepository>();
builder.Services.AddScoped<IMetricRepository, MetricRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IGroupService, GroupService>();
builder.Services.AddScoped<IResultService, ResultService>();
builder.Services.AddScoped<IMetricService, MetricService>();
builder.Services.AddScoped<IAnalyticService, AnalyticService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();

// Аутентификация
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Введите JWT токен: Bearer {токен}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } } });
});

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "IskraAnalytics API v1"); });

app.UseRouting(); 
app.UseCors("DevCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Инициализация БД
using (var scope = app.Services.CreateScope())
{
    try { await DbInitializer.Initialize(scope.ServiceProvider); }
    catch (Exception ex) { scope.ServiceProvider.GetRequiredService<ILogger<Program>>().LogError(ex, "Ошибка БД"); }
}

app.Run();