using System.ComponentModel;

namespace IskraAnalytics.Domain.Enums
{
    public enum PlayerPosition
    {
        [Description("Вратарь")]
        Goalkeeper = 1,
        [Description("Нападающий")]
        Forward = 2,
        [Description("Защитник")]
        Defender = 3
    }
}
