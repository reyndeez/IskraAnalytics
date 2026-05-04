using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record RecommendationRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid StudentId
        );
}
