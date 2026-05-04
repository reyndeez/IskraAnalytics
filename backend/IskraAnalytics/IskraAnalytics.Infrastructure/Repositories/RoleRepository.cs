using IskraAnalytics.Domain.Interfaces;
using IskraAnalytics.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IskraAnalytics.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        readonly IskraDbContext _dbContext;

        public RoleRepository(IskraDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Получить список ролей
        public async Task<List<IdentityRole<Guid>>> GetAllRolesAsync()
        {
            return await _dbContext.Roles.ToListAsync();
        }
    }
}
