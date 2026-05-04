using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Domain.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<List<RoleResponse>>> GetAllRoles()
        {
            var result = await _roleService.GetAllRolesAsync();
            return Ok(result);
        }
    }
}
