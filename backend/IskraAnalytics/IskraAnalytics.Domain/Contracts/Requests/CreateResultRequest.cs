using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record CreateResultRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] double Value,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] DateTime CreatedAt,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid StudentId,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid CoachId,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid MetricId
        );
}
