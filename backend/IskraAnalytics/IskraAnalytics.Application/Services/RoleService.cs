using AutoMapper;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class RoleService : IRoleService
    {
        readonly IMapper _mapper;
        readonly IRoleRepository _roleRepository;
        public RoleService(IMapper mapper, IRoleRepository roleRepository)
        {
            _mapper = mapper;
            _roleRepository = roleRepository;
        }

        //Получить список всех ролей
        public async Task<List<RoleResponse>> GetAllRolesAsync()
        {
            var result = await _roleRepository.GetAllRolesAsync();
            return _mapper.Map<List<RoleResponse>>(result);
        }
    }
}
