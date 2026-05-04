namespace IskraAnalytics.Domain.Entities
{
    public class Group
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public Guid CoachId { get; set; }
        public User Coach { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        public List<Student> Students { get; set; } = [];
    }
}
