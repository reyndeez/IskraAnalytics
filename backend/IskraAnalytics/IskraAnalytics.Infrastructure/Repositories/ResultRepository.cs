using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class ResultRepository : IResultRepository
    {
        readonly IskraDbContext _dbContext;
        public ResultRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить результат по его id
        public async Task<Result?> GetResultByIdAsync(Guid id)
        {
            return await _dbContext.Results.Include(r => r.Student).Include(r => r.Metric).Include(r => r.Coach).FirstOrDefaultAsync(r => r.Id == id);
        }

        //Получить список всех результатов у воспитанника
        public async Task<List<Result>> GetAllResultByStudentIdAsync(Guid studentId)
        {
            return await _dbContext.Results.Include(r => r.Student).Include(r => r.Metric).Include(r => r.Coach).Where(r => r.StudentId == studentId).ToListAsync();
        }

        //Получить список всех результатов для группы по метрике
        public async Task<List<Result>> GetResultsByGroupAndMetric(Guid groupId,  Guid metricId)
        {
            return await _dbContext.Results
                .Include(r => r.Student)
                .Include(r => r.Metric)
                .Where(r => r.Student.GroupId == groupId && r.MetricId == metricId)
                .ToListAsync();
        }
        //Получить список всех результатов для воспитанника по метрике
        public async Task<List<Result>> GetResultsByStudentAndMetric(Guid studentId, Guid metricId)
        {
            return await _dbContext.Results
                .Include(r => r.Student)
                .Include(r => r.Metric)
                .Where(r => r.StudentId == studentId && r.MetricId == metricId)
                .ToListAsync();
        }

        //Создание результата для воспитанника
        public async Task CreateResultAsync(Result result)
        {
            await _dbContext.Results.AddAsync(result);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений
        public async Task UpdateResultAsync(Result result)
        {
            _dbContext.Results.Update(result);
            await _dbContext.SaveChangesAsync();
        }

        //Удалить результат
        public async Task DeleteResultAsync(Result result)
        {
            _dbContext.Results.Remove(result);
            await _dbContext.SaveChangesAsync();
        }
    }
}
