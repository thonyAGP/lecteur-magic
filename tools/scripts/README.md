# Magic Analysis Scripts

> PowerShell scripts for analyzing Magic Unipaas programs

## Categories

### Expression Parser
| Script | Description | Usage |
|--------|-------------|-------|
| `magic-logic-parser-v6.ps1` | **Main parser** - Parse and decode Magic expressions | `-Project ADH -Prg 69` |
| `magic-expression-formatter.ps1` | Format decoded expressions for display | Internal |
| `get-expr.ps1` | Extract single expression by ID | `-ExprId 30` |
| `list-all-expr.ps1` | List all expressions in a program | `-Prg 121` |
| `list-expr-v2.ps1` | Enhanced expression listing with context | `-Prg 121` |

### Program Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `analyze-main-prg.ps1` | Analyze Main program structure | `-Project ADH` |
| `analyze-main-task.ps1` | Analyze Main task variables | `-Project ADH` |
| `check-prg.ps1` | Validate program structure | `-Prg 121` |
| `check-prg-positions.ps1` | Verify IDE positions | `-Project ADH` |
| `magic-program-scorer.ps1` | Score program complexity | `-Project ADH` |
| `find-prg-ide.ps1` | Find program by IDE position | `-Ide 121` |

### Flow Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `magic-flow-analyzer.ps1` | Trace CallTask chains | `-Project ADH -Prg 121` |
| `magic-task-analyzer.ps1` | Analyze task hierarchy | `-Project ADH -Prg 121` |
| `show-task-tree.ps1` | Display task tree structure | `-Prg 121` |
| `get-task-path.ps1` | Get path to specific task | `-Prg 121 -Task 3` |
| `get-task-ide-path.ps1` | Get IDE-friendly task path | `-Prg 121 -Task 3` |

### DataView Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `parse-dataview.ps1` | Parse DataView structure | `-Prg 121` |
| `parse-dv-complete.ps1` | Full DataView parsing with links | `-Prg 121` |
| `analyze-dv-lines-types.ps1` | Analyze line types in DataView | `-Prg 121` |
| `map-dv-lines.ps1` | Map DataView lines to tables | `-Prg 121` |
| `count-dv-entries.ps1` | Count DataView entries | `-Prg 121` |
| `count-dv-lines.ps1` | Count lines per DataView | `-Prg 121` |

### Variable Counting
| Script | Description | Usage |
|--------|-------------|-------|
| `count-columns.ps1` | Count columns in task | `-Prg 121 -Task 1` |
| `count-all-columns.ps1` | Count all columns across tasks | `-Prg 121` |
| `count-all-vars.ps1` | Count all variables | `-Prg 121` |
| `count-main-vars.ps1` | Count Main (VG) variables | `-Project ADH` |
| `count-main-offset.ps1` | Calculate Main VG offset | `-Project ADH` |
| `count-variable-lines.ps1` | Count variable declaration lines | `-Prg 121` |
| `count-logic-variables.ps1` | Count logic-used variables | `-Prg 121` |
| `count-all-logic-vars.ps1` | Count all logic variables | `-Project ADH` |

### Offset Calculation
| Script | Description | Usage |
|--------|-------------|-------|
| `calc-offsets.ps1` | Calculate variable offsets | `-Project ADH -Prg 121` |
| `calc-nested-offset.ps1` | Calculate nested task offsets | `-Prg 121 -Task 5` |
| `debug-offset.ps1` | Debug offset calculation | `-Project ADH` |

### Column Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `analyze-columns-detailed.ps1` | Detailed column analysis | `-Prg 121` |
| `show-column-xml.ps1` | Show raw column XML | `-Prg 121 -Col 5` |
| `count-max-fieldid.ps1` | Find max FieldID in program | `-Prg 121` |
| `check-fieldid-range.ps1` | Validate FieldID ranges | `-Prg 121` |

### Task Counting
| Script | Description | Usage |
|--------|-------------|-------|
| `count-all-tasks.ps1` | Count tasks across project | `-Project ADH` |
| `list-tasks.ps1` | List all tasks in program | `-Prg 121` |
| `count-selects.ps1` | Count Select operations | `-Prg 121` |
| `show-selects.ps1` | Show Select details | `-Prg 121` |

### Table/Range Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `get-ranges.ps1` | Get Range/Locate conditions | `-Prg 121` |
| `get-ranges-v2.ps1` | Enhanced range extraction | `-Prg 121` |
| `get-ranges-v3.ps1` | Full range with expressions | `-Prg 121` |
| `count-with-links.ps1` | Count table links | `-Prg 121` |
| `table-mapping-utils.ps1` | Table mapping utilities | Library |

### Logic Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `check-all-logic.ps1` | Check all logic lines | `-Project ADH` |
| `check-init-condition.ps1` | Check Init handler conditions | `-Prg 121` |
| `debug-line-types.ps1` | Debug logic line types | `-Prg 121` |

### Code Generation
| Script | Description | Usage |
|--------|-------------|-------|
| `Generate-ProgramSpec.ps1` | Generate program spec markdown | `-Project ADH -Ide 121` |
| `generate-form-html.ps1` | Generate HTML from Form | `-Project ADH -Ide 121` |
| `validate-generated-code.ps1` | Validate generated code | `-Path output.cs` |
| `magic-config-generator.ps1` | Generate config files | `-Project ADH` |

### Ticket Support
| Script | Description | Usage |
|--------|-------------|-------|
| `ticket-doc-generator.ps1` | Generate ticket documentation | `-TicketKey PMS-1234` |
| `ticket-extract-context.ps1` | Extract context for ticket | `-TicketKey PMS-1234` |

### ECF Components
| Script | Description | Usage |
|--------|-------------|-------|
| `extract-ecf-candidates.ps1` | Find ECF shared programs | `-Project ADH` |

### Function Analysis
| Script | Description | Usage |
|--------|-------------|-------|
| `analyze-function-usage.ps1` | Analyze Magic function usage | `-Project ADH` |
| `extract-magic-functions.ps1` | Extract function calls | `-Prg 121` |

### Debug/Development
| Script | Description | Usage |
|--------|-------------|-------|
| `debug-main-pve.ps1` | Debug PVE Main program | Internal |
| `debug-progs.ps1` | Debug program loading | `-Project ADH` |
| `show-full-tree-detail.ps1` | Show full program tree | `-Prg 121` |
| `show-xml-task-order.ps1` | Show XML task ordering | `-Prg 121` |
| `show-update-xml.ps1` | Show Update handler XML | `-Prg 121` |
| `check-product-dv.ps1` | Check product DataView | Specific |
| `get-ide-position.ps1` | Get IDE position mapping | `-Project ADH -Prg 121` |
| `get-ide-pos-v2.ps1` | Enhanced IDE position | `-Project ADH -Prg 121` |

## Common Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `-Project` | Magic project name | `ADH`, `PBP`, `VIL` |
| `-Prg` | Program number (internal) | `121`, `69` |
| `-Ide` | IDE position (visible) | `121`, `69` |
| `-Task` | Task number | `1`, `3`, `5` |
| `-ExprId` | Expression ISN | `30`, `45` |

## Usage Examples

```powershell
# Analyze program 121 in ADH
.\magic-logic-parser-v6.ps1 -Project ADH -Prg 121

# Generate spec for ADH IDE 237
.\Generate-ProgramSpec.ps1 -Project ADH -Ide 237

# Trace call flow
.\magic-flow-analyzer.ps1 -Project ADH -Prg 162

# Count variables
.\count-all-vars.ps1 -Prg 121
```

## Dependencies

- **MCP Server**: Most scripts use `magic_*` MCP tools
- **Knowledge Base**: `~/.magic-kb/knowledge.db`
- **Source XML**: `D:\Data\Migration\XPA\PMS\{Project}\Source\`

## See Also

- `tools/ticket-pipeline/` - Automated ticket analysis
- `tools/spec-generator/` - Batch spec generation
- `tools/MagicMcp/` - MCP server implementation
