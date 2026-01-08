namespace MagicMcp.Models;

/// <summary>
/// Represents a column in Magic DataView (variables A, B, C, etc.)
/// </summary>
public class MagicColumn
{
    /// <summary>Line number in IDE (1-based)</summary>
    public required int LineNumber { get; init; }

    /// <summary>Internal XML id</summary>
    public required int XmlId { get; init; }

    /// <summary>Variable letter (A, B, ..., Z, AA, AB, etc.)</summary>
    public required string Variable { get; init; }

    /// <summary>Column name from XML</summary>
    public required string Name { get; init; }

    /// <summary>Data type (ALPHA, NUMERIC, DATE, TIME, LOGICAL, BLOB)</summary>
    public required string DataType { get; init; }

    /// <summary>Picture format</summary>
    public string? Picture { get; init; }

    /// <summary>Column definition: Real (R), Virtual (V), Parameter (P)</summary>
    public string Definition { get; init; } = "V";

    /// <summary>Source: MainSource (M) or Link number (L1, L2, etc.)</summary>
    public string? Source { get; init; }

    /// <summary>Column number in source table (if Real)</summary>
    public int? SourceColumnNumber { get; init; }

    /// <summary>Locate expression ID (if any)</summary>
    public int? LocateExpressionId { get; init; }

    /// <summary>
    /// Convert 0-based index to Magic variable letter(s)
    /// 0-25 = A-Z, 26-51 = AA-AZ, 52-77 = BA-BZ, etc.
    /// </summary>
    public static string IndexToVariable(int index)
    {
        if (index < 26)
            return ((char)('A' + index)).ToString();

        int first = index / 26;
        int second = index % 26;
        return $"{(char)('A' + first - 1)}{(char)('A' + second)}";
    }
}
