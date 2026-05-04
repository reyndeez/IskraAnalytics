using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpdateProfileRequest(
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string FirstName,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string LastName,
        string? Patronymic,
        [EmailAddress(ErrorMessage = "Некорректный")][Required(ErrorMessage = "Это поле обязательно для заполнения")] string Email
        );
}
