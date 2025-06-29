/*
    This file is used to create a database context that derives from DbContext and includes a DbSet for each model
*/

using aggregates.Customer;
using aggregates.Order;
using entities.OrderItem;
using aggregates.Drink;
using entities.Voucher;
using entities.Ingredient;
using ValueObjects.IngredientUsage;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DBContext;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Drink> Drinks { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Voucher>()
            .OwnsOne(v => v.DiscountAmount, da =>
            {
                da.Property(p => p.Value).HasColumnName("DiscountAmount");
            });
        modelBuilder.Entity<Order>()
        .HasOne<Customer>()
        .WithMany()
        .HasForeignKey(o => o.CustomerId);

        modelBuilder.Entity<Order>()
        .HasOne(o => o.Voucher)
        .WithOne()
        .HasForeignKey<Order>(o => o.VoucherId);

        modelBuilder.Entity<Order>()
        .HasMany(O => O.OrderItems)
        .WithOne()
        .HasForeignKey("OrderId");

    modelBuilder.Entity<Drink>()
    .OwnsMany(d => d._ingredient, b =>
    {
        b.WithOwner().HasForeignKey("DrinkId");

        b.Property(i => i.IngredientId).HasColumnName("IngredientId");
        b.Property(i => i.Quantity).HasColumnName("Quantity");

        // Ánh xạ IngredientId <=> Ingredient
        b.HasOne(i => i.Ingredient)
         .WithMany()
         .HasForeignKey(i => i.IngredientId)
         .OnDelete(DeleteBehavior.Restrict); // hoặc Cascade nếu muốn

        b.HasKey("DrinkId", "IngredientId");

        b.ToTable("Drink_Ingredients");
    });
    }
}