/*
    This file is used to connect to the PostgreSQL database.
    It contains the DbContext class which is used to interact with the database.
*/


using Npgsql;

namespace Infrastructure.Database;
public static class DbConfigurationHelper
{
    private static readonly IConfiguration _configuration;
    static DbConfigurationHelper()
    {
        var builder = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
        _configuration = builder.Build();
    }

    public static string GetConnectionString()
    {
        return _configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found in appsettings.json.");
    }

    public static async Task<NpgsqlConnection> GetDbConnection()
    {
        var connectionString = GetConnectionString();
        var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        return connection;
    }
}