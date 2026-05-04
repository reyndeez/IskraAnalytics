using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record StudentResponse (
        Guid Id,
        string FirstName,
        string LastName,
        string Patronymic,
        DateTime BirthDate,
        string Amplua,
        string AccessCode,
        Guid GroupId,
        string GroupName
        );
}
