using IskraAnalytics.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record CreateMetricRequest (
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string Name,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Units Unit,
        bool IsAscending,
        string? Description,
        string? Recommendation
        );
}
