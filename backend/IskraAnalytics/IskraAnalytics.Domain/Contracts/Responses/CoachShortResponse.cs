namespace IskraAnalytics.Domain.Contracts.Responses
{
    public record CoachShortResponse(
        Guid Id,
        string FullName
        )
    {
        public CoachShortResponse() : this(Guid.Empty, string.Empty) { }
    }
}
