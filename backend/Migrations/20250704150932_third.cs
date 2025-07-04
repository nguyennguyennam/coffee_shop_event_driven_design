using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Drinks_DrinkId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_DrinkId",
                table: "OrderItems");

            migrationBuilder.AlterColumn<string>(
                name: "DrinkName",
                table: "OrderItems",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "DrinkName",
                table: "OrderItems",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_DrinkId",
                table: "OrderItems",
                column: "DrinkId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Drinks_DrinkId",
                table: "OrderItems",
                column: "DrinkId",
                principalTable: "Drinks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
