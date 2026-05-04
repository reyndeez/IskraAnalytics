using IskraAnalytics.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace IskraAnalytics.Domain.Contracts.Requests
{
    public record CreateStudentRequest (
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string FirstName,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string LastName,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] string Patronymic,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] DateTime BirthDate,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] PlayerPosition Amplua,
        string? PhotoUrl,
        [Required(ErrorMessage = "Это поле обязательно для заполнения")] Guid GroupId
        );
}
