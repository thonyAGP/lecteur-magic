using System.Xml.Linq;
using MagicMcp.Models;

namespace MagicMcp.Services;

/// <summary>
/// Parses Magic XML files and builds an index
/// </summary>
public class XmlIndexer
{
    private readonly string _projectsBasePath;

    public XmlIndexer(string projectsBasePath)
    {
        _projectsBasePath = projectsBasePath;
    }

    public MagicProject IndexProject(string projectName)
    {
        var sourcePath = Path.Combine(_projectsBasePath, projectName, "Source");
        if (!Directory.Exists(sourcePath))
            throw new DirectoryNotFoundException($"Project source path not found: {sourcePath}");

        var project = new MagicProject
        {
            Name = projectName,
            SourcePath = sourcePath
        };

        // 1. Parse Progs.xml for IDE positions
        var progsPath = Path.Combine(sourcePath, "Progs.xml");
        var programPositions = ParseProgsXml(progsPath);

        // 2. Parse ProgramHeaders.xml for metadata
        var headersPath = Path.Combine(sourcePath, "ProgramHeaders.xml");
        var programHeaders = ParseProgramHeaders(headersPath);

        // 3. Parse each program file
        foreach (var (prgId, idePosition) in programPositions)
        {
            project.ProgramIdToIdePosition[prgId] = idePosition;

            var prgPath = Path.Combine(sourcePath, $"Prg_{prgId}.xml");
            if (File.Exists(prgPath))
            {
                var header = programHeaders.GetValueOrDefault(prgId);
                var program = ParseProgramFile(prgPath, prgId, idePosition, header);
                project.Programs[prgId] = program;
            }
        }

        return project;
    }

    private Dictionary<int, int> ParseProgsXml(string path)
    {
        var positions = new Dictionary<int, int>();
        if (!File.Exists(path)) return positions;

        var doc = XDocument.Load(path);
        var programs = doc.Descendants("Program").ToList();

        for (int i = 0; i < programs.Count; i++)
        {
            var idAttr = programs[i].Attribute("id");
            if (idAttr != null && int.TryParse(idAttr.Value, out int id))
            {
                positions[id] = i + 1; // 1-based IDE position
            }
        }

        return positions;
    }

    private Dictionary<int, ProgramHeader> ParseProgramHeaders(string path)
    {
        var headers = new Dictionary<int, ProgramHeader>();
        if (!File.Exists(path)) return headers;

        var doc = XDocument.Load(path);
        foreach (var header in doc.Descendants("Header"))
        {
            var idAttr = header.Attribute("id");
            if (idAttr != null && int.TryParse(idAttr.Value, out int id))
            {
                headers[id] = new ProgramHeader
                {
                    Id = id,
                    Name = header.Attribute("Description")?.Value ?? $"Program_{id}",
                    PublicName = header.Attribute("PublicName")?.Value
                };
            }
        }

        return headers;
    }

    private MagicProgram ParseProgramFile(string path, int prgId, int idePosition, ProgramHeader? header)
    {
        var doc = XDocument.Load(path);

        var program = new MagicProgram
        {
            Id = prgId,
            Name = header?.Name ?? $"Program_{prgId}",
            PublicName = header?.PublicName,
            IdePosition = idePosition
        };

        // Parse tasks
        ParseTasks(doc, program, idePosition);

        // Parse expressions
        ParseExpressions(doc, program);

        return program;
    }

    private void ParseTasks(XDocument doc, MagicProgram program, int prgIdePosition)
    {
        var tasks = doc.Descendants("Task").ToList();
        var taskStack = new Stack<(int Isn2, int Level, string IdePosition)>();
        var levelCounters = new Dictionary<int, int>();

        foreach (var taskElement in tasks)
        {
            var headerElement = taskElement.Element("TaskDefinition")?.Element("Header");
            if (headerElement == null) continue;

            var isn2Attr = headerElement.Attribute("ISN_2");
            if (isn2Attr == null || !int.TryParse(isn2Attr.Value, out int isn2)) continue;

            var description = headerElement.Attribute("Description")?.Value ?? "";
            var taskType = headerElement.Attribute("TaskType")?.Value ?? "B";

            // Calculate level by XML nesting
            int level = 0;
            var parent = taskElement.Parent;
            while (parent != null)
            {
                if (parent.Name == "Task") level++;
                parent = parent.Parent;
            }

            // Calculate IDE position
            string idePosition;
            if (isn2 == 1)
            {
                // Root task = program number only
                idePosition = prgIdePosition.ToString();
            }
            else
            {
                // Build IDE position based on hierarchy
                if (!levelCounters.ContainsKey(level))
                    levelCounters[level] = 0;
                levelCounters[level]++;

                // Reset counters for deeper levels
                for (int l = level + 1; l <= levelCounters.Keys.Max(); l++)
                    levelCounters.Remove(l);

                idePosition = BuildIdePosition(prgIdePosition, levelCounters);
            }

            // Determine parent ISN_2
            int? parentIsn2 = null;
            while (taskStack.Count > 0 && taskStack.Peek().Level >= level)
                taskStack.Pop();
            if (taskStack.Count > 0)
                parentIsn2 = taskStack.Peek().Isn2;

            taskStack.Push((isn2, level, idePosition));

            // Parse DataView
            var dataView = ParseDataView(taskElement);

            // Parse Logic
            var logicLines = ParseLogicLines(taskElement);

            program.Tasks[isn2] = new MagicTask
            {
                Isn2 = isn2,
                Description = description,
                Level = level,
                IdePosition = idePosition,
                ParentIsn2 = parentIsn2,
                TaskType = taskType,
                DataView = dataView,
                LogicLines = logicLines
            };
        }
    }

    private string BuildIdePosition(int prgPosition, Dictionary<int, int> levelCounters)
    {
        var parts = new List<string> { prgPosition.ToString() };
        foreach (var level in levelCounters.Keys.OrderBy(k => k))
        {
            parts.Add(levelCounters[level].ToString());
        }
        return string.Join(".", parts);
    }

    private MagicDataView? ParseDataView(XElement taskElement)
    {
        var dvElement = taskElement.Element("DataView");
        if (dvElement == null) return null;

        var dataView = new MagicDataView();

        // Parse Main Source
        var taskTablesElement = dvElement.Element("TaskTables");
        var mainSourceElement = taskTablesElement?.Element("Source");
        if (mainSourceElement != null)
        {
            var tableIdAttr = mainSourceElement.Attribute("SourceDataSourceNumber");
            if (tableIdAttr != null && int.TryParse(tableIdAttr.Value, out int tableId))
            {
                dataView = dataView with
                {
                    MainSource = new MagicMainSource
                    {
                        TableId = tableId,
                        TableName = $"Table_{tableId}",
                        AccessMode = mainSourceElement.Attribute("AccessMode")?.Value ?? "R"
                    }
                };
            }
        }

        // Parse Links
        var links = new List<MagicLink>();
        var linkElements = taskTablesElement?.Elements("Link") ?? Enumerable.Empty<XElement>();
        int linkId = 1;
        foreach (var linkElement in linkElements)
        {
            var tableIdAttr = linkElement.Attribute("SourceDataSourceNumber");
            if (tableIdAttr != null && int.TryParse(tableIdAttr.Value, out int tableId))
            {
                links.Add(new MagicLink
                {
                    Id = linkId++,
                    TableId = tableId,
                    TableName = $"Table_{tableId}",
                    LinkType = linkElement.Attribute("LinkType")?.Value ?? "J"
                });
            }
        }
        if (links.Count > 0)
        {
            dataView = dataView with { Links = links };
        }

        // Parse Columns
        var columns = ParseColumns(dvElement.Element("Resource")?.Element("Columns"));
        if (columns.Count > 0)
        {
            dataView = dataView with { Columns = columns };
        }

        return dataView;
    }

    private List<MagicColumn> ParseColumns(XElement? columnsElement)
    {
        var columns = new List<MagicColumn>();
        if (columnsElement == null) return columns;

        var columnElements = columnsElement.Elements("Column").ToList();
        for (int i = 0; i < columnElements.Count; i++)
        {
            var colElement = columnElements[i];
            var idAttr = colElement.Attribute("id");
            var nameAttr = colElement.Attribute("name");

            if (idAttr == null || !int.TryParse(idAttr.Value, out int xmlId)) continue;

            // Get data type from Model element
            var modelElement = colElement.Descendants("Model").FirstOrDefault();
            var dataType = ParseFieldType(modelElement?.Attribute("attr_obj")?.Value);

            // Get picture
            var pictureElement = colElement.Descendants("Picture").FirstOrDefault();
            var picture = pictureElement?.Attribute("valUnicode")?.Value
                       ?? pictureElement?.Attribute("val")?.Value;

            // Get definition (2=Virtual, 1=Real, 3=Parameter)
            var defElement = colElement.Descendants("Definition").FirstOrDefault();
            var defVal = defElement?.Attribute("val")?.Value;
            var definition = defVal switch
            {
                "1" => "R",  // Real
                "2" => "V",  // Virtual
                "3" => "P",  // Parameter
                _ => "V"
            };

            // Get source info for Real columns
            int? sourceColumnNumber = null;
            var initElement = colElement.Descendants("Init").FirstOrDefault();
            if (initElement != null)
            {
                var srcColAttr = initElement.Attribute("SrcFldIdx");
                if (srcColAttr != null && int.TryParse(srcColAttr.Value, out int srcCol))
                {
                    sourceColumnNumber = srcCol;
                }
            }

            // Get locate expression
            int? locateExprId = null;
            var locateElement = colElement.Descendants("Locate").FirstOrDefault();
            if (locateElement != null)
            {
                var locValAttr = locateElement.Attribute("val");
                if (locValAttr != null && int.TryParse(locValAttr.Value, out int locId))
                {
                    locateExprId = locId;
                }
            }

            columns.Add(new MagicColumn
            {
                LineNumber = i + 1,  // 1-based line number
                XmlId = xmlId,
                Variable = MagicColumn.IndexToVariable(i),
                Name = nameAttr?.Value ?? $"Col_{xmlId}",
                DataType = dataType,
                Picture = picture,
                Definition = definition,
                SourceColumnNumber = sourceColumnNumber,
                LocateExpressionId = locateExprId
            });
        }

        return columns;
    }

    private static string ParseFieldType(string? attrObj)
    {
        return attrObj switch
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
    }

    private List<MagicLogicLine> ParseLogicLines(XElement taskElement)
    {
        var lines = new List<MagicLogicLine>();
        int lineNum = 1;  // Continuous numbering across all handlers

        var logicTable = taskElement.Element("TaskDefinition")?.Element("TaskLogicUnitsTable");
        if (logicTable == null) return lines;

        // Order of handlers in IDE: Task Prefix, Record Prefix, Record Main, Record Suffix, Task Suffix, then Handlers
        var handlerOrder = new[]
        {
            ("TaskPrefix", "TP"),
            ("RecordPrefix", "RP"),
            ("RecordMain", "RM"),
            ("RecordSuffix", "RS"),
            ("TaskSuffix", "TS")
        };

        foreach (var (elementName, handlerType) in handlerOrder)
        {
            var handlerElement = logicTable.Element(elementName);
            if (handlerElement != null)
            {
                lineNum = ParseLogicUnit(handlerElement, handlerType, lines, lineNum);
            }
        }

        // Parse additional handlers (events)
        foreach (var handler in logicTable.Elements("LogicUnit"))
        {
            var handlerName = handler.Attribute("Name")?.Value ?? "H";
            lineNum = ParseLogicUnit(handler, handlerName, lines, lineNum);
        }

        return lines;
    }

    private int ParseLogicUnit(XElement unitElement, string handlerType, List<MagicLogicLine> lines, int startLineNum)
    {
        var lineNum = startLineNum;
        var logicLines = unitElement.Elements("LogicLine");

        foreach (var logicLine in logicLines)
        {
            // Get the first child element (the operation)
            var operation = logicLine.Elements().FirstOrDefault();
            if (operation == null) continue;

            var opName = operation.Name.LocalName;
            var isDisabled = operation.Attribute("Disabled")?.Value == "1";

            // Build parameters dictionary
            var parameters = new Dictionary<string, string>
            {
                ["Handler"] = handlerType
            };

            foreach (var attr in operation.Attributes())
            {
                if (attr.Name.LocalName != "Disabled")
                    parameters[attr.Name.LocalName] = attr.Value;
            }

            // Extract specific operation details
            var condition = operation.Element("Condition")?.Attribute("val")?.Value;
            if (condition == null && operation.Attribute("Condition") != null)
            {
                condition = operation.Attribute("Condition")?.Value;
            }

            // Add call target info for Call operations
            if (opName == "Call")
            {
                var callDb = operation.Element("DB");
                if (callDb != null)
                {
                    parameters["TargetComp"] = callDb.Attribute("comp")?.Value ?? "";
                    parameters["TargetPrg"] = callDb.Attribute("obj")?.Value ?? "";
                }
            }

            // Add link table info for LNK operations
            if (opName == "LNK")
            {
                var linkDb = operation.Element("DB");
                if (linkDb != null)
                {
                    parameters["TableComp"] = linkDb.Attribute("comp")?.Value ?? "";
                    parameters["TableId"] = linkDb.Attribute("obj")?.Value ?? "";
                }
            }

            // Add verify message for Verify operations
            if (opName == "Verify")
            {
                var msgElement = operation.Element("Message");
                if (msgElement != null)
                {
                    parameters["MessageExpr"] = msgElement.Attribute("val")?.Value ?? "";
                }
                var returnElement = operation.Element("Return");
                if (returnElement != null)
                {
                    parameters["ReturnVar"] = returnElement.Attribute("FieldID")?.Value ?? "";
                }
            }

            lines.Add(new MagicLogicLine
            {
                LineNumber = lineNum++,
                Operation = MapOperationName(opName),
                Condition = condition,
                IsDisabled = isDisabled,
                Parameters = parameters
            });
        }

        return lineNum;
    }

    private static string MapOperationName(string xmlName)
    {
        return xmlName switch
        {
            "DATAVIEW_SRC" => "Data View Source",
            "Select" => "Select",
            "Update" => "Update",
            "Call" => "Call Task",
            "LNK" => "Link",
            "END_LINK" => "End Link",
            "Remark" => "Remark",
            "Block" => "Block",
            "EndBlock" => "End Block",
            "Verify" => "Verify",
            "Evaluate" => "Evaluate",
            "Raise" => "Raise Event",
            "Action" => "Action",
            "Input" => "Input",
            "Output" => "Output",
            "Form" => "Form",
            "Browse" => "Browse",
            _ => xmlName
        };
    }

    private void ParseExpressions(XDocument doc, MagicProgram program)
    {
        var exprsElement = doc.Descendants("ExpressionsTable").FirstOrDefault();
        if (exprsElement == null) return;

        var expressions = exprsElement.Elements("Expression").ToList();
        int idePosition = 1;

        foreach (var expr in expressions)
        {
            var idAttr = expr.Attribute("id");
            if (idAttr == null || !int.TryParse(idAttr.Value, out int id)) continue;

            var content = expr.Value ?? "";
            var comment = expr.Attribute("Comment")?.Value;

            program.Expressions[id] = new MagicExpression
            {
                Id = id,
                IdePosition = idePosition++,
                Content = content,
                Comment = comment
            };
        }
    }

    private record ProgramHeader(int Id, string Name, string? PublicName)
    {
        public ProgramHeader() : this(0, "", null) { }
    }
}
