using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record CreateGroupRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string Name,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid CoachId
        );
}
