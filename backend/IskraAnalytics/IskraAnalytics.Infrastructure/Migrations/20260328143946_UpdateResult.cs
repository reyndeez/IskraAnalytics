using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IskraAnalytics.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Unit",
                table: "Metrics");

            migrationBuilder.AddColumn<int>(
                name: "Unit",
                table: "Metrics",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Metrics",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Metrics");

            migrationBuilder.AlterColumn<string>(
                name: "Unit",
                table: "Metrics",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
