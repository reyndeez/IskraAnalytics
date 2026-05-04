using IskraAnalytics.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record UpdateStudentRequest(
        [Required(ErrorMessage = "Это поле не может быть пустым")] string FirstName,
        [Required(ErrorMessage = "Это поле не может быть пустым")] string LastName,
        [Required(ErrorMessage = "Это поле не может быть пустым")] string Patronymic,
        [Required(ErrorMessage = "Это поле не может быть пустым")] DateTime BirthDate,
        [Required(ErrorMessage = "Это поле не может быть пустым")] PlayerPosition Amplua,
        string? PhotoUrl
        );
}
