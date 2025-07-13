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
using backend.infrastructure.repositories;
using Infrastructure.Commands.IngredientCommand;
using Infrastructure.Commands;

// UseCase interfaces
using service.usecase;
using service.usecase.IOrderUseCase;

// UseCase implementations
using service.usecase.implement;
using service.implement;

// EventStore & Kafka
using EventStore.Client;
using Infrastructure.EventStore;
using backend.infrastructure.Messaging;
using backend.infrastructure.Services;

// Command Handlers
using Application.Orders.Handlers;
using backend.application.Orders.Handlers;
using backend.application.interfaces.command;
using backend.infrastructure.command;
using backend.application.interfaces.queries;
using backend.infrastructure.queries;

var builder = WebApplication.CreateBuilder(args);

// --------------------------
// ✅ CORS Config
// --------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://coffee-shop-2hot.onrender.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// --------------------------
// ✅ PostgreSQL + EF Core
// --------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(DbConfigurationHelper.GetConnectionString()));

// --------------------------
// ✅ Kafka Subscribe configuration
// --------------------------
builder.Services.AddSingleton<KafkaEventSubscribe>();

// --------------------------
// ✅ Repositories
// --------------------------
builder.Services.AddScoped<IDrinkRepository, DrinkRepository>();
builder.Services.AddScoped<IIngredientCommand, IngredientCommandService>();
builder.Services.AddScoped<IOrderAggregate, OrderAggregateRepository>(); 
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IVoucherCommand, VoucherCommand>();
builder.Services.AddScoped<IOrderCommand, OrderCommand>();
builder.Services.AddScoped<IOrderQuery, OrderQuery>();

// --------------------------
// ✅ Use Cases
// --------------------------
builder.Services.AddScoped<IDrinkUseCase, DrinkUseCase>();
builder.Services.AddScoped<IOrderUseCase, OrderUseCase>();
builder.Services.AddScoped<ICustomersUseCase, CustomerUseCase>();


// --------------------------
// ✅ Event Store (EventStoreDB)
// --------------------------
builder.Services.AddSingleton(sp =>
{
    var settings = EventStoreClientSettings.Create("esdb://localhost:2113?tls=false");
    return new EventStoreClient(settings);
});
builder.Services.AddSingleton<IEventStore, EventStoreDb>();

// --------------------------
// ✅ Kafka Event Publisher
// --------------------------
builder.Services.AddSingleton(sp =>
    new KafkaEventPublish("localhost:9092", "order-events")
);

// --------------------------
// ✅ Event Service: Save & Publish
// --------------------------
builder.Services.AddScoped<EventPublishService>();

// --------------------------
// ✅ Command Handlers
// --------------------------
builder.Services.AddScoped<PlaceOrderHandler>();
builder.Services.AddScoped<AssignShipperHandler>();
builder.Services.AddScoped<UpdateOrderStatusHandler>();


// --------------------------
// ✅ Swagger & Controllers
// --------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Coffee Shop API",
        Version = "v1"
    });
});

// --------------------------
// ✅ App Pipeline
// --------------------------
var app = builder.Build();

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
