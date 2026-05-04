using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IskraAnalytics.Application.Services
{
    public class AuthService : IAuthService
    {
        readonly UserManager<User> _userManager;
        readonly RoleManager<IdentityRole<Guid>> _roleManager;
        readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }
        public async Task<string?> LoginAsync(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.Email);            

            if (user != null && await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {

                var claims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new(ClaimTypes.Email, user.Email!),
                    new("FirstName", user.FirstName),
                    new("LastName", user.LastName)
                };

                var roles = await _userManager.GetRolesAsync(user);
                var mainRole = roles.FirstOrDefault();

                if(mainRole != null)
                {
                    var claim = new Claim(ClaimTypes.Role, mainRole);
                    claims.Add(claim);
                }

                var key = _configuration["Jwt:Key"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];

                var authKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!));
                var credentials = new SigningCredentials(authKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: credentials
                    );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            else
            {
                return null;
            }
        }

        public async Task<List<string>?> RegisterAsync(RegisterRequest registerRequest)
        {
            var user = new User
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                Email = registerRequest.Email,
                UserName = registerRequest.Email,
                CreatedAt = DateTime.UtcNow,
            };

            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                return null;
            }
            else
            {
                return [.. result.Errors.Select(e => e.Description)];
            }
        }
    }
}
