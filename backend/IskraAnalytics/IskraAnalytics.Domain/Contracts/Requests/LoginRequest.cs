using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record LoginRequest(
        [EmailAddress(ErrorMessage ="Некорректный формат почты")]
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string Email,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string Password 
        );
}
