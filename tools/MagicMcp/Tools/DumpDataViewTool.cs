using System.ComponentModel;
using System.Xml.Linq;
using MagicMcp.Models;
using MagicMcp.Services;
using ModelContextProtocol.Server;

namespace MagicMcp.Tools;

[McpServerToolType]
public static class DumpDataViewTool
{
    [McpServerTool(Name = "magic_dump_dataview")]
    [Description("Dump the complete Data View structure as seen in Magic IDE. Built from Logic operations (DATAVIEW_SRC, Select, LNK, END_LINK, Remark).")]
    public static string DumpDataView(
        IndexCache cache,
        [Description("Project name (ADH, PBP, REF, VIL, PBG, PVE)")] string project,
        [Description("Task position in IDE format (e.g., '69' for program 69 root task, '69.3' for subtask)")] string taskPosition)
    {
        // Parse task position
        var parts = taskPosition.Split('.');
        if (parts.Length == 0 || !int.TryParse(parts[0], out int prgIdePosition))
            return $"ERROR: Invalid task position format '{taskPosition}'";

        // Find project
        var projectData = cache.GetProject(project);
        if (projectData == null)
            return $"ERROR: Project {project} not found. Available: {string.Join(", ", cache.GetProjectNames())}";

        // Find program by IDE position
        var program = projectData.Programs.Values.FirstOrDefault(p => p.IdePosition == prgIdePosition);
        if (program == null)
            return $"ERROR: No program found at IDE position {prgIdePosition} in {project}";

        // Find task by IDE position
        MagicTask? task = null;
        if (parts.Length == 1)
        {
            // Root task
            task = program.Tasks.Values.FirstOrDefault(t => t.IdePosition == taskPosition)
                ?? program.Tasks.GetValueOrDefault(1);
        }
        else
        {
            task = program.Tasks.Values.FirstOrDefault(t => t.IdePosition == taskPosition);
        }

        if (task is null)
            return $"ERROR: Task {taskPosition} not found in program {program.Id}";

        // Load the XML file directly to parse Data View from Logic
        var xmlPath = System.IO.Path.Combine(projectData.SourcePath, $"Prg_{program.Id}.xml");
        if (!System.IO.File.Exists(xmlPath))
            return $"ERROR: XML file not found: {xmlPath}";

        var doc = XDocument.Load(xmlPath);

        // Find the task element by ISN_2
        var taskElement = doc.Descendants("Task")
            .FirstOrDefault(t =>
            {
                var header = t.Element("Header");
                var isn2Attr = header?.Attribute("ISN_2");
                return isn2Attr != null && isn2Attr.Value == task.Isn2.ToString();
            });

        if (taskElement == null)
            return $"ERROR: Task element with ISN_2={task.Isn2} not found in XML";

        // Parse column definitions
        var columnDefs = DataViewBuilder.ParseColumnDefinitions(taskElement);

        // Build Data View from Logic
        var dvLines = DataViewBuilder.BuildFromLogic(taskElement, columnDefs);

        // Format output
        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"## Data View: {project.ToUpper()} IDE {taskPosition}");
        sb.AppendLine($"**Task:** {task.Description} (ISN_2={task.Isn2})");
        sb.AppendLine($"**Source:** Prg_{program.Id}.xml");
        sb.AppendLine();

        if (dvLines.Count == 0)
        {
            sb.AppendLine("*No Data View lines found*");
            return sb.ToString();
        }

        sb.AppendLine("| Line | Type | Var | ColNum | Name | DataType | Picture | Table | Locate |");
        sb.AppendLine("|------|------|-----|--------|------|----------|---------|-------|--------|");

        foreach (var line in dvLines)
        {
            var varStr = line.Variable ?? "";
            var colNumStr = line.TableColumnNumber?.ToString() ?? "";
            var nameStr = line.Name ?? "";
            if (nameStr.Length > 25) nameStr = nameStr.Substring(0, 25) + "...";

            var typeStr = line.DataType ?? "";
            var pictureStr = line.Picture ?? "";
            if (pictureStr.Length > 15) pictureStr = pictureStr.Substring(0, 15) + "...";

            var tableStr = line.TableId.HasValue ? $"{line.TableId}" : "";
            var locateStr = "";
            if (line.LocateMin.HasValue || line.LocateMax.HasValue)
            {
                locateStr = $"{line.LocateMin}→{line.LocateMax}";
            }

            switch (line.LineType)
            {
                case "Main Source":
                    sb.AppendLine($"| {line.LineNumber} | **Main Source** | | | {nameStr} | | | | Index: {line.IndexNumber} |");
                    break;
                case "Link Query":
                    sb.AppendLine($"| {line.LineNumber} | **Link Query** | | | Table {line.TableId} | | | {tableStr} | Index: {line.IndexNumber} |");
                    break;
                case "End Link":
                    sb.AppendLine($"| {line.LineNumber} | **End Link** | | | | | | | |");
                    break;
                case "Empty":
                    sb.AppendLine($"| {line.LineNumber} | *(empty)* | | | | | | | |");
                    break;
                default:
                    sb.AppendLine($"| {line.LineNumber} | {line.LineType} | {varStr} | {colNumStr} | {nameStr} | {typeStr} | {pictureStr} | {tableStr} | {locateStr} |");
                    break;
            }
        }

        sb.AppendLine();
        sb.AppendLine($"**Total lines:** {dvLines.Count}");

        return sb.ToString();
    }
}
