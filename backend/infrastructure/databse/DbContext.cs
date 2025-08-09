/*
    This file is used to create a database context that derives from DbContext and includes a DbSet for each model
*/

using aggregates.Customer;
using backend.application.Models;
using backend.domain.Aggregates.Order;
using aggregates.Drink;
using backend.domain.Aggregates.Voucher;
using entities.Ingredient;
using backend.domain.Aggregates.Payment;
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
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Voucher>()
            .OwnsOne(v => v.DiscountAmount, da =>
            {
                da.Property(p => p.Value).HasColumnName("DiscountAmount");
            });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedNever();
        });
        
        modelBuilder.Entity<Order>()
        .HasOne<Customer>()
        .WithMany()
        .HasForeignKey(o => o.CustomerId);

        modelBuilder.Entity<Order>()
        .HasOne(o => o.Voucher)
        .WithOne()
        .HasForeignKey<Order>(o => o.VoucherId)
        .IsRequired(false);

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
            modelBuilder.Entity<Customer>(entity =>
        {
            entity.Property(e => e.Password).HasColumnName("password");
            entity.Property(e => e.Name).HasColumnName("Name");
            entity.Property(e => e.Email).HasColumnName("Email");
            entity.Property(e => e.DateOfBirth).HasColumnName("DateOfBirth");
            entity.Property(e => e.Type).HasColumnName("Type");
        });

        // Payment entity configuration
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderId).IsRequired();
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(e => e.Method).IsRequired();
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.VNPayTransactionId).HasMaxLength(100);
            entity.Property(e => e.VNPayResponseCode).HasMaxLength(10);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.ReturnUrl).HasMaxLength(500);
            entity.Property(e => e.IpAddress).HasMaxLength(50);
            entity.Property(e => e.UserId).IsRequired();
            
            // Refund properties
            entity.Property(e => e.RefundedAmount).HasColumnType("decimal(18,2)").HasDefaultValue(0);
            entity.Property(e => e.RefundTransactionId).HasMaxLength(100);
            entity.Property(e => e.RefundReason).HasMaxLength(500);
            entity.Property(e => e.RefundStatus).HasDefaultValue(RefundStatus.None);
            
            entity.HasIndex(e => e.OrderId);
            entity.HasIndex(e => e.VNPayTransactionId);
        });
    }
}