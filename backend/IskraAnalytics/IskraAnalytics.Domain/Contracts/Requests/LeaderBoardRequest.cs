using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record LeaderBoardRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid MetricId,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid StudentId
        );
}
