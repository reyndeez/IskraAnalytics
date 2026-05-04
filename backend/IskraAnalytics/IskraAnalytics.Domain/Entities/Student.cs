using IskraAnalytics.Domain.Enums;

namespace IskraAnalytics.Domain.Entities
{
    public class Student
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public PlayerPosition Amplua {  get; set; }
        public string AccessCode { get; set; } = string.Empty;
        public string? PhotoUrl {  get; set; }
        public bool IsActive { get; set; } = true;

        public Guid GroupId { get; set; }
        public Group Group { get; set; } = null!;

        public List<User> Parents { get; set; } = [];
    }
}
