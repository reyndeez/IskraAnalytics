using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
         public async Task<IActionResult> Register(RegisterRequest registerRequest)
         {
            var errors = await _authService.RegisterAsync(registerRequest);
            if(errors == null)
            {
                return Ok();
            }
            return BadRequest(errors);
         }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var token = await _authService.LoginAsync(loginRequest);
            if(token == null)
            {
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }
            return Ok(new {Token = token});
        }

    }
}
