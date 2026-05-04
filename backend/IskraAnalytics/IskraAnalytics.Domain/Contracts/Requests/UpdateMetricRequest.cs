using IskraAnalytics.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpdateMetricRequest(
        [Required(ErrorMessage = "Это поле не может быть пустым")] string Name,
        [Required(ErrorMessage = "Это поле не может быть пустым")] Units Unit,
        bool IsAscending,
        string? Description,
        string? Recommendation
        );
}
