using MagicMcp.Models;

namespace MagicMcp.Services;

/// <summary>
/// Query service for Magic index
/// </summary>
public class MagicQueryService
{
    private readonly IndexCache _cache;

    public MagicQueryService(IndexCache cache)
    {
        _cache = cache;
    }

    /// <summary>
    /// Get IDE position for a program/task
    /// Example: "ADH 121.6 Nom: Pilotage"
    /// </summary>
    public string GetPosition(string projectName, int programId, int? isn2 = null)
    {
        var program = _cache.GetProgram(projectName, programId);
        if (program == null)
            return $"ERROR: Program {programId} not found in project {projectName}";

        if (isn2.HasValue)
        {
            var task = _cache.GetTask(projectName, programId, isn2.Value);
            if (task == null)
                return $"ERROR: Task ISN_2={isn2.Value} not found in program {programId}";

            return $"**{projectName.ToUpper()} {task.IdePosition}** Nom : **{task.Description}**";
        }

        return $"**{projectName.ToUpper()} {program.IdePosition}** Nom : **{program.Name}**" +
               (program.PublicName != null ? $" (Public: {program.PublicName})" : "");
    }

    /// <summary>
    /// Get full task tree for a program
    /// </summary>
    public string GetTree(string projectName, int programId)
    {
        var program = _cache.GetProgram(projectName, programId);
        if (program == null)
            return $"ERROR: Program {programId} not found in project {projectName}";

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"**{projectName.ToUpper()} {program.IdePosition}** - {program.Name}");
        sb.AppendLine();
        sb.AppendLine("| IDE | ISN_2 | Nom | Niveau |");
        sb.AppendLine("|-----|-------|-----|--------|");

        foreach (var task in program.Tasks.Values.OrderBy(t => t.IdePosition))
        {
            sb.AppendLine($"| {task.IdePosition} | {task.Isn2} | {task.Description} | {task.Level} |");
        }

        return sb.ToString();
    }

    /// <summary>
    /// Get DataView details for a task
    /// </summary>
    public string GetDataView(string projectName, int programId, int? isn2 = null)
    {
        var program = _cache.GetProgram(projectName, programId);
        if (program == null)
            return $"ERROR: Program {programId} not found in project {projectName}";

        // Default to root task (ISN_2=1)
        var taskIsn2 = isn2 ?? 1;
        var task = _cache.GetTask(projectName, programId, taskIsn2);
        if (task == null)
            return $"ERROR: Task ISN_2={taskIsn2} not found";

        if (task.DataView == null)
            return $"Task {task.IdePosition} has no DataView";

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"**DataView pour {projectName.ToUpper()} {task.IdePosition}** - {task.Description}");
        sb.AppendLine();

        // Main Source
        if (task.DataView.MainSource != null)
        {
            var main = task.DataView.MainSource;
            sb.AppendLine("**Main Source:**");
            sb.AppendLine($"- Table: {main.TableName} (#{main.TableId})");
            sb.AppendLine($"- Access: {main.AccessMode}");
            if (main.IndexId.HasValue)
                sb.AppendLine($"- Index: #{main.IndexId}");
            sb.AppendLine();
        }

        // Links
        if (task.DataView.Links.Count > 0)
        {
            sb.AppendLine("**Links:**");
            sb.AppendLine("| # | Table | Type |");
            sb.AppendLine("|---|-------|------|");
            foreach (var link in task.DataView.Links)
            {
                sb.AppendLine($"| {link.Id} | {link.TableName} (#{link.TableId}) | {link.LinkType} |");
            }
            sb.AppendLine();
        }

        // Range
        if (task.DataView.Range != null)
        {
            sb.AppendLine($"**Range:** Direction={task.DataView.Range.Direction}");
            if (task.DataView.Range.Segments.Count > 0)
            {
                sb.AppendLine("| # | Mode | Min | Max |");
                sb.AppendLine("|---|------|-----|-----|");
                foreach (var seg in task.DataView.Range.Segments)
                {
                    sb.AppendLine($"| {seg.Id} | {seg.Mode} | {seg.MinExpression} | {seg.MaxExpression} |");
                }
            }
        }

        return sb.ToString();
    }

    /// <summary>
    /// Get expression content by ID
    /// </summary>
    public string GetExpression(string projectName, int programId, int expressionId)
    {
        var expression = _cache.GetExpression(projectName, programId, expressionId);
        if (expression == null)
            return $"ERROR: Expression #{expressionId} not found in program {programId}";

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"**Expression #{expression.Id}** (IDE #{expression.IdePosition})");
        if (expression.Comment != null)
            sb.AppendLine($"// {expression.Comment}");
        sb.AppendLine("```");
        sb.AppendLine(expression.Content);
        sb.AppendLine("```");

        return sb.ToString();
    }

    /// <summary>
    /// Get logic line details
    /// </summary>
    public string GetLogic(string projectName, int programId, int isn2, int? lineNumber = null)
    {
        var task = _cache.GetTask(projectName, programId, isn2);
        if (task == null)
            return $"ERROR: Task ISN_2={isn2} not found";

        var sb = new System.Text.StringBuilder();
        sb.AppendLine($"**Logic pour {projectName.ToUpper()} {task.IdePosition}** - {task.Description}");
        sb.AppendLine();

        var lines = task.LogicLines;
        if (lineNumber.HasValue)
        {
            var line = lines.FirstOrDefault(l => l.LineNumber == lineNumber.Value);
            if (line == null)
                return $"ERROR: Line {lineNumber.Value} not found";
            lines = new List<MagicLogicLine> { line };
        }

        sb.AppendLine("| # | Operation | Condition | Disabled |");
        sb.AppendLine("|---|-----------|-----------|----------|");

        foreach (var line in lines)
        {
            var disabled = line.IsDisabled ? "Yes" : "";
            var condition = line.Condition ?? "";
            sb.AppendLine($"| {line.LineNumber} | {line.Operation} | {condition} | {disabled} |");
        }

        if (lineNumber.HasValue && lines.Count == 1)
        {
            var line = lines[0];
            if (line.Parameters.Count > 0)
            {
                sb.AppendLine();
                sb.AppendLine("**Parameters:**");
                foreach (var param in line.Parameters)
                {
                    sb.AppendLine($"- {param.Key}: {param.Value}");
                }
            }
        }

        return sb.ToString();
    }
}
