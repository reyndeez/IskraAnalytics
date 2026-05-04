using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        readonly IskraDbContext _dbContext;

        public StudentRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Создание воспитанника
        public async Task CreateAsync(Student student)
        {
            await _dbContext.Students.AddAsync(student);
            await _dbContext.SaveChangesAsync();
        }

        //Получить воспитанника по Id
        public async Task<Student?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Students.Include(s => s.Group).FirstOrDefaultAsync(s => s.Id == id);
        }

        //Получить воспитанника по инвайт-коду
        public async Task<Student?> GetByAccessCodeAsync(string code)
        {
            return await _dbContext.Students
                .Include(s => s.Group)
                .Include(s => s.Parents)
                .FirstOrDefaultAsync(s => s.AccessCode == code);
        }

        //Получить список всех детей по Id родителя
        public async Task<List<Student>> GetChildrenAsync(Guid userId)
        {
            return await _dbContext.Students
                .AsNoTracking()
                .Where(s => s.IsActive && s.Parents.Any(p => p.Id == userId))
                .Include(s => s.Group)
                .ToListAsync();
        }

        //Сохранение любых изменений, также мягкое удаление
        public async Task UpdateAsync(Student student)
        {
            _dbContext.Students.Update(student);
            await _dbContext.SaveChangesAsync();
        }

        //Получить список всех "активных" учеников
        public async Task<List<Student>> GetAllActiveAsync()
        {
            return await _dbContext.Students.Include(s => s.Group).Where(s => s.IsActive == true).ToListAsync();
        }

        //Получить список воспитанников по группе
        public async Task<List<Student>> GetStudentsByGroupIdAsync(Guid grouId)
        {
            return await _dbContext.Students.Where(s => s.IsActive == true).Include(s => s.Group).Where(s => s.GroupId == grouId).ToListAsync();
        }
    }
}
