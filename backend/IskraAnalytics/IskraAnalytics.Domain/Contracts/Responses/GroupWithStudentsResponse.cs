namespace IskraAnalytics.Domain.Contracts.Responses
{
    public class GroupWithStudentsResponse
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = string.Empty;

        public List<StudentShortResponse> Students { get; init; } = [];
    }
}
