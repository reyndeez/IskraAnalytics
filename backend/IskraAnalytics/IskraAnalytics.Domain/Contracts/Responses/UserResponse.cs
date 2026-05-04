namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record UserResponse(
        Guid Id,
        string FirstName,
        string LastName,
        string? Patronymic,
        string Email,
        string Role
        );
}
