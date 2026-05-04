using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record ChartDataRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid MetricId,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid StudentId
        );
}
