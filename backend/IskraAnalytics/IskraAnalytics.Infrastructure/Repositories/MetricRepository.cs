using IskraAnalytics.Domain.Entities;
using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class MetricRepository : IMetricRepository
    {
        readonly IskraDbContext _dbContext;
        public MetricRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить метрику по её id
        public async Task<Metric?> GetMetricByIdAsync(Guid id)
        {
            return await _dbContext.Metrics.FirstOrDefaultAsync(m => m.Id == id);
        }

        //Получить список всех метрик
        public async Task<List<Metric>> GetAllMetricsAsync()
        {
            return await _dbContext.Metrics.ToListAsync();
        }

        //Получить список всех "активных" метрик
        public async Task<List<Metric>> GetAllActiveMetricsAsync()
        {
            return await _dbContext.Metrics.Where(m => m.IsActive).ToListAsync();
        }

        //Создание метрики
        public async Task CreateMetricAsync(Metric metric)
        {
            await _dbContext.Metrics.AddAsync(metric);
            await _dbContext.SaveChangesAsync();
        }

        //Сохранение любых изменений, мягкое удаление
        public async Task UpdateAsync(Metric metric)
        {
            _dbContext.Update(metric);
            await _dbContext.SaveChangesAsync();
        }
    }
}
