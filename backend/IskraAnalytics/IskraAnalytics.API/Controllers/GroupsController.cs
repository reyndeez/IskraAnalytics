using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IskraAnalytics.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class GroupsController : ControllerBase
    {
        readonly IGroupService _groupService;
        public GroupsController(IGroupService groupService) 
        {
            _groupService = groupService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupResponse>>> GetAllActiveGroups()
        {
            var result = await _groupService.GetAllActiveGroupsAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<ActionResult> CreateGroup([FromBody] CreateGroupRequest request)
        {
            var result = await _groupService.CreateGroupAsync(request);
            return Ok(result);
        }

        [HttpPut("{groupId}")]
        public async Task<ActionResult<GroupResponse>> UpdateGroup(Guid groupId, UpdateGroupRequest request)
        {
            var result = await _groupService.UpdateGroupAsync(groupId, request);
            return Ok(result);
        }

        [HttpDelete("delete/{groupId}")]
        public async Task<IActionResult> DeleteGroup(Guid groupId)
        {
            await _groupService.SoftDeleteGroupAsync(groupId);
            return NoContent();
        }

    }
}
