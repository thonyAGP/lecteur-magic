namespace MagicMcp.Models;

/// <summary>
/// Represents a line in Magic task logic (operation)
/// </summary>
public class MagicLogicLine
{
    public required int LineNumber { get; init; }
    public required string Operation { get; init; }
    public string? Condition { get; init; }
    public bool IsDisabled { get; init; }
    public Dictionary<string, string> Parameters { get; init; } = new();
}
