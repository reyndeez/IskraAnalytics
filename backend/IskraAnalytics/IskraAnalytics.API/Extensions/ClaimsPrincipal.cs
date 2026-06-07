using System.Security.Claims;

namespace IskraAnalytics.API.Extensions
{
    public static class ClaimsPrincipal
    {
        public static Guid GetUserId(this System.Security.Claims.ClaimsPrincipal user)
        {
            var userIdValue = user.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value
                   ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? user.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdValue))
            {
                return Guid.Empty;
            }

            return Guid.TryParse(userIdValue, out var result) ? result : Guid.Empty;
        }
    }
}
