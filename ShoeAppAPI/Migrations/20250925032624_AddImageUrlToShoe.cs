using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoeAppAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToShoe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Shoes",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Shoes");
        }
    }
}
