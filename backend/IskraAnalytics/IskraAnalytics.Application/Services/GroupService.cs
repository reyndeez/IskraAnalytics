using AutoMapper;
using IskraAnalytics.Domain.Contracts.Requests;
using IskraAnalytics.Domain.Contracts.Responses;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;

namespace IskraAnalytics.Application.Services
{
    public class GroupService : IGroupService
    {
        readonly IGroupRepository _groupRepository;
        readonly IUserRepository _userRepository;
        readonly IMapper _mapper;
        public GroupService(IGroupRepository groupRepository, IMapper mapper, IUserRepository userRepository) 
        {
            _groupRepository = groupRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        //Создать группу
        public async Task<GroupResponse> CreateGroupAsync(CreateGroupRequest request)
        {
            var coach = await _userRepository.GetUserByIdAsync(request.CoachId);

            if(coach == null)
            {
                throw new Exception("Тренера с выбранным id не существует");
            }
            else
            {
                var group = _mapper.Map<Group>(request);

                group.Id = Guid.NewGuid();
                group.Coach = coach;

                await _groupRepository.CreateGroupAsync(group);

                return _mapper.Map<GroupResponse>(group);
            }
        }

        //Удалить группу
        public async Task SoftDeleteGroupAsync(Guid id)
        {
            var group = await _groupRepository.GetByIdAsync(id);

            if(group == null)
            {
                throw new Exception("Группы с выбранным id не существует");
            }
            else
            {
                group.IsActive = false;
                _mapper.Map<Group>(group);
                await _groupRepository.UpdateAsync(group);
            }
        }

        //Изменить группу
        public async Task<GroupResponse> UpdateGroupAsync(Guid id, UpdateGroupRequest request)
        {
            var group = await _groupRepository.GetByIdAsync(id);

            if( group == null)
            {
                throw new Exception("Группы с таким id не существует");
            }
            else
            {
                group = _mapper.Map(request, group);
                await _groupRepository.UpdateAsync(group);
                return _mapper.Map<GroupResponse>(group);
            }
        }

        //Получить все группы
        public async Task<List<GroupResponse>> GetAllGroupsAsync()
        {
            var groups = await _groupRepository.GetAllGroupsAsync();
            return _mapper.Map<List<GroupResponse>>(groups);
        }

        //Получить все активные группы
        public async Task<List<GroupResponse>> GetAllActiveGroupsAsync()
        {
            var groups = await _groupRepository.GetAllGroupsAsync();
            return _mapper.Map<List<GroupResponse>>(groups);
        }

        //Получить группу по id
        public async Task<GroupResponse> GetGroupByIdAsync(Guid id)
        {
            var group = await GetGroupByIdAsync(id);
            return _mapper.Map<GroupResponse>(group);
        }
    }
}
