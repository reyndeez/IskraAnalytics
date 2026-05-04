using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpdateResultRequest(
        [Required(ErrorMessage = "Это поле не может быть пустым")] double Value,
        [Required(ErrorMessage = "Это поле не может быть пустым")] DateTime CreatedAt,
        [Required(ErrorMessage = "Это поле не может быть пустым")] Guid StudentId,
        [Required(ErrorMessage = "Это поле не может быть пустым")] Guid CoachId,
        [Required(ErrorMessage = "Это поле не может быть пустым")] Guid MetricId
        );
}
