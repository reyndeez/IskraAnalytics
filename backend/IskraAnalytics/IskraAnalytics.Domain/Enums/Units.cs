using System.ComponentModel;

namespace IskraAnalytics.Domain.Enums
{
    public enum Units
    {
        [Description("сек.")]
        Seconds = 1,
        [Description("мин.")]
        Minutes = 2,
        [Description("см")]
        Centimeters = 3,
        [Description("кг")]
        Kilograms = 4,
        [Description("%")]
        Percentage = 5, //% попаданий из 10 попыток
        [Description("раз")]
        Count = 6,
        [Description("м")]
        Meters = 7,
        [Description("км/ч")]
        KmPerHour = 8,
        [Description("м/c")]
        MetersPerSecond = 9,
        [Description("очков")]
        Points = 10
    }
}
