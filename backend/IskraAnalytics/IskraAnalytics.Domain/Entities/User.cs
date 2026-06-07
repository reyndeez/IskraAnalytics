using Microsoft.AspNetCore.Identity;

namespace IskraAnalytics.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        //Id, Email, PasswordHash внутри Identity
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Patronymic { get; set; } = string.Empty;
        public string? PhotoUrl { get; set; }

        //При новом запуске БД убрать знак вопроса!!!
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        //Для родителя (дети)
        public List<Student> Children { get; set; } = [];
        //Для тренера (группы)
        public List<Group> ManagedGroups { get; set; } = [];
    }
}
