using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IskraAnalytics.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMetric : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAscending",
                table: "Metrics",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAscending",
                table: "Metrics");
        }
    }
}
