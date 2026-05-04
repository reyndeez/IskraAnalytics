using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpdateGroupRequest(
        [Required(ErrorMessage = "Это поле не может быть пустым")] string Name,
        [Required(ErrorMessage = "Это поле не может быть пустым")] Guid CoachId
        );
}
