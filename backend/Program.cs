using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Infrastructure.DBContext;
using Infrastructure.Database;

// Repository interfaces
using Repositories.DrinkRepository;
using interfaces.command;
using backend.domain.Repositories.IOrderRepository;
using Repositories.CustomerRepository;

// Repository implementations
using Infrastructure.Repositories.CustomerRepository;
using Infrastructure.Repositories.DrinkRepository;
using Infrastructure.Repositories.OrderRepository;
using Infrastructure.Commands.IngredientCommand;
using Infrastructure.Commands;

// UseCase interfaces
using service.usecase;
using service.usecase.IOrderUseCase;

// UseCase implementations
using service.usecase.implement;
using service.implement;

var builder = WebApplication.CreateBuilder(args);

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://coffee-shop-2-w2ms.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(DbConfigurationHelper.GetConnectionString()));

// Register Repositories
builder.Services.AddScoped<IDrinkRepository, DrinkRepository>();
builder.Services.AddScoped<IIngredientCommand, IngredientCommandService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IVoucherCommand, VoucherCommand>();

// Register UseCases
builder.Services.AddScoped<IDrinkUseCase, DrinkUseCase>();
builder.Services.AddScoped<IOrderUseCase, OrderUseCase>();
builder.Services.AddScoped<ICustomersUseCase, CustomerUseCase>();

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Coffee Shop API", Version = "v1" });
});

var app = builder.Build();

// Enable CORS policy
app.UseCors("AllowLocalhost3000");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Coffee Shop API V1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
