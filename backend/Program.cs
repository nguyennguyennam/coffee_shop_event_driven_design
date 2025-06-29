using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.OpenApi.Models;
using Infrastructure.Database;
using Infrastructure.DBContext;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình DbContext dùng chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(DbConfigurationHelper.GetConnectionString()));

// Thêm các service cần thiết
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(c =>
// {
//     c.SwaggerDoc("v1", new OpenApiInfo { Title = "Coffee Shop API", Version = "v1" });
// });

var app = builder.Build();

// // Middleware pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

//app.UseHttpsRedirection();
//app.UseAuthorization();
app.MapControllers();
app.Run();
