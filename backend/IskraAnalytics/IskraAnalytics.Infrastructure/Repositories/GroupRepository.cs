using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        readonly IskraDbContext _dbContext;

        public GroupRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить группу по её Id
        public async Task<Group?> GetByIdAsync(Guid groupId)
        {
            return await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == groupId);
        }

        //Получить список групп конкретного тренера
        public async Task<List<Group>> GetGroupsByCoachId(Guid coachId)
        {
            return await _dbContext.Groups.Where(g => g.CoachId == coachId).ToListAsync();
        }

        //Создание группы
        public async Task CreateGroupAsync(Group group)
        {
            await _dbContext.Groups.AddAsync(group);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений, мягкое удаление
        public async Task UpdateAsync(Group group)
        {
            _dbContext.Update(group);
            await _dbContext.SaveChangesAsync();
        }

        //Получить все "активные" группы
        public async Task<List<Group>> GetAllActiveGroupsAsync()
        {
            return await _dbContext.Groups.Where(g =>  g.IsActive).ToListAsync();
        }

        //Получить все группы
        public async Task<List<Group>> GetAllGroupsAsync()
        {
            return await _dbContext.Groups.ToListAsync();
        }

        //Получить группу по id воспитанника
        public async Task<Group?> GetGroupByStudentId(Guid studentId)
        {
            return await _dbContext.Groups
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.IsActive == true && g.Students.Any(s => s.Id == studentId));
        }
    }
}
