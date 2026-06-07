namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record StudentShortResponse(
        Guid Id,
        string FullName
        )
        {
        public StudentShortResponse() : this(Guid.Empty, string.Empty) { }
        }
}
