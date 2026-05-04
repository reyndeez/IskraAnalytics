using IskraAnalytics.Domain.Contracts.Requests;

namespace IskraAnalytics.Domain.Interfaces
{
    public interface IAuthService
    {
        Task<List<string>?> RegisterAsync(RegisterRequest registerRequest);
        Task<string?> LoginAsync(LoginRequest loginRequest);
    }
}
