using System.Xml.Linq;
using MagicMcp.Models;

namespace MagicMcp.Services;

/// <summary>
/// Builds the Data View structure from Magic XML Logic.
/// The IDE Data View is constructed from Logic operations, not just Columns.
/// </summary>
public static class DataViewBuilder
{
    /// <summary>
    /// Build Data View lines from a task's Logic.
    /// Order: DATAVIEW_SRC → Select (params) → Remark → LNK → Select (cols) → END_LINK → etc.
    /// </summary>
    public static List<MagicDataViewLine> BuildFromLogic(XElement taskElement, Dictionary<int, ColumnDefinition> columnDefs)
    {
        var lines = new List<MagicDataViewLine>();
        int lineNum = 1;

        // Get the first LogicUnit (usually Record Main for Data View operations)
        var taskLogic = taskElement.Element("TaskLogic");
        if (taskLogic == null) return lines;

        // Find the main LogicUnit (Level=R, Type=M)
        var mainUnit = taskLogic.Elements("LogicUnit")
            .FirstOrDefault(u =>
            {
                var level = u.Element("Level")?.Attribute("val")?.Value;
                var type = u.Element("Type")?.Attribute("val")?.Value;
                return level == "R" && type == "M";
            });

        if (mainUnit == null)
        {
            // Try first LogicUnit
            mainUnit = taskLogic.Elements("LogicUnit").FirstOrDefault();
        }

        if (mainUnit == null) return lines;

        var logicLines = mainUnit.Element("LogicLines");
        if (logicLines == null) return lines;

        int currentLinkTableId = 0;
        string? currentLinkTableName = null;

        foreach (var logicLine in logicLines.Elements("LogicLine"))
        {
            var operation = logicLine.Elements().FirstOrDefault();
            if (operation == null) continue;

            var opName = operation.Name.LocalName;

            switch (opName)
            {
                case "DATAVIEW_SRC":
                    // Main Source line
                    lines.Add(new MagicDataViewLine
                    {
                        LineNumber = lineNum++,
                        LineType = "Main Source",
                        Name = "No Main Source", // Will be updated if there's a real source
                        IndexNumber = 0
                    });
                    break;

                case "Select":
                    var fieldId = GetIntAttr(operation, "FieldID");
                    var colNum = GetIntAttr(operation, "Column");
                    var type = operation.Element("Type")?.Attribute("val")?.Value ?? "V";
                    var isParam = operation.Element("IsParameter")?.Attribute("val")?.Value == "Y";

                    // Get column definition for name and type
                    var colDef = fieldId.HasValue && columnDefs.ContainsKey(fieldId.Value)
                        ? columnDefs[fieldId.Value]
                        : null;

                    var locateEl = operation.Element("Locate");
                    int? locMin = locateEl != null ? GetIntAttr(locateEl, "MIN") : null;
                    int? locMax = locateEl != null ? GetIntAttr(locateEl, "MAX") : null;

                    var rangeEl = operation.Element("Range");
                    string? rangeMin = rangeEl?.Attribute("MIN")?.Value;
                    string? rangeMax = rangeEl?.Attribute("MAX")?.Value;

                    var initEl = operation.Element("Init");
                    string? initExpr = initEl?.Attribute("val")?.Value;

                    string lineType;
                    if (type == "R")
                    {
                        lineType = "Column"; // Real column from link table
                    }
                    else if (isParam)
                    {
                        lineType = "Parameter";
                    }
                    else
                    {
                        lineType = "Virtual";
                    }

                    lines.Add(new MagicDataViewLine
                    {
                        LineNumber = lineNum++,
                        LineType = lineType,
                        FieldId = fieldId,
                        Variable = fieldId.HasValue ? IndexToVariable(fieldId.Value - 1) : null,
                        TableColumnNumber = type == "R" ? colNum : null,
                        Name = colDef?.Name ?? $"Field_{fieldId}",
                        DataType = colDef?.DataType ?? "Unknown",
                        Picture = colDef?.Picture,
                        TableId = type == "R" ? currentLinkTableId : null,
                        TableName = type == "R" ? currentLinkTableName : null,
                        LocateMin = locMin,
                        LocateMax = locMax,
                        RangeMin = rangeMin,
                        RangeMax = rangeMax,
                        InitExpression = initExpr
                    });
                    break;

                case "Remark":
                    var remarkText = operation.Element("Text")?.Attribute("val")?.Value ?? "";
                    if (string.IsNullOrWhiteSpace(remarkText) || remarkText == " ")
                    {
                        // Empty line
                        lines.Add(new MagicDataViewLine
                        {
                            LineNumber = lineNum++,
                            LineType = "Empty"
                        });
                    }
                    else
                    {
                        // Comment line (shown in IDE but not as separate line in DV)
                        // Skip for now - IDE shows these inline
                    }
                    break;

                case "LNK":
                    var linkDb = operation.Element("DB");
                    var tableId = GetIntAttr(linkDb, "obj") ?? 0;
                    var compId = linkDb?.Attribute("comp")?.Value;
                    var keyNum = GetIntAttr(operation, "Key") ?? 1;
                    var direction = operation.Attribute("Direction")?.Value ?? "A";

                    currentLinkTableId = tableId;
                    currentLinkTableName = $"Table_{tableId}";

                    lines.Add(new MagicDataViewLine
                    {
                        LineNumber = lineNum++,
                        LineType = "Link Query",
                        TableId = tableId,
                        TableName = currentLinkTableName,
                        ComponentId = compId,
                        IndexNumber = keyNum,
                        Direction = direction
                    });
                    break;

                case "END_LINK":
                    lines.Add(new MagicDataViewLine
                    {
                        LineNumber = lineNum++,
                        LineType = "End Link"
                    });
                    currentLinkTableId = 0;
                    currentLinkTableName = null;
                    break;

                // Other operations are Logic, not Data View
                default:
                    // Skip - not a Data View element
                    break;
            }
        }

        return lines;
    }

    /// <summary>
    /// Parse column definitions from the Resource/Columns element
    /// </summary>
    public static Dictionary<int, ColumnDefinition> ParseColumnDefinitions(XElement taskElement)
    {
        var defs = new Dictionary<int, ColumnDefinition>();

        var columnsElement = taskElement.Element("Resource")?.Element("Columns");
        if (columnsElement == null) return defs;

        foreach (var col in columnsElement.Elements("Column"))
        {
            var id = GetIntAttr(col, "id");
            if (!id.HasValue) continue;

            var name = col.Attribute("name")?.Value ?? $"Col_{id}";
            var propList = col.Element("PropertyList");
            var modelEl = propList?.Element("Model");
            var pictureEl = propList?.Element("Picture");

            var dataType = modelEl?.Attribute("attr_obj")?.Value switch
            {
                "FIELD_ALPHA" => "Alpha",
                "FIELD_NUMERIC" => "Numeric",
                "FIELD_DATE" => "Date",
                "FIELD_TIME" => "Time",
                "FIELD_LOGICAL" => "Logical",
                "FIELD_BLOB" => "Blob",
                "FIELD_MEMO" => "Memo",
                "FIELD_UNICODE" => "Unicode",
                _ => "Unknown"
            };

            var picture = pictureEl?.Attribute("valUnicode")?.Value
                       ?? pictureEl?.Attribute("val")?.Value;

            defs[id.Value] = new ColumnDefinition
            {
                Id = id.Value,
                Name = name,
                DataType = dataType,
                Picture = picture
            };
        }

        return defs;
    }

    private static int? GetIntAttr(XElement? element, string attrName)
    {
        var attr = element?.Attribute(attrName);
        if (attr != null && int.TryParse(attr.Value, out int val))
            return val;
        return null;
    }

    private static string IndexToVariable(int index)
    {
        if (index < 0) return "?";
        if (index < 26)
            return ((char)('A' + index)).ToString();
        int first = (index / 26);
        int second = index % 26;
        return $"{(char)('A' + first - 1)}{(char)('A' + second)}";
    }

    public record ColumnDefinition
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
        public required string DataType { get; init; }
        public string? Picture { get; init; }
    }
}
