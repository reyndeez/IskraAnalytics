using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IskraAnalytics.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MetricRecommendation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Recommendation",
                table: "Metrics",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Recommendation",
                table: "Metrics");
        }
    }
}
