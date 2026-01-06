using MagicMcp.Services;
using MagicMcp.Tools;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ModelContextProtocol.Server;

// Configuration
var projectsBasePath = Environment.GetEnvironmentVariable("MAGIC_PROJECTS_PATH")
    ?? @"D:\Data\Migration\XPA\PMS";

var projectNames = new[] { "ADH", "PBP", "REF", "VIL", "PBG", "PVE" };

// Initialize index cache
Console.Error.WriteLine($"[MagicMcp] Initializing with projects path: {projectsBasePath}");
var indexCache = new IndexCache(projectsBasePath, projectNames);
indexCache.LoadAllProjects();
Console.Error.WriteLine($"[MagicMcp] Loaded {indexCache.GetTotalProgramCount()} programs from {indexCache.GetProjectNames().Count()} projects");

// Create query service
var queryService = new MagicQueryService(indexCache);

// Build and run MCP server
var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton(queryService);

builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithToolsFromAssembly();

var app = builder.Build();

await app.RunAsync();
