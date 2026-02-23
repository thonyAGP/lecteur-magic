# Magic Spec Pipeline - Token Cost & Performance Analysis

## Executive Summary

The Magic spec pipeline generates **361 detailed specifications** for ADH project programs (IDE 1-350). 
- **Largest spec**: ADH-IDE-237 (234 KB, 6,101 lines)
- **Typical spec**: ~5 KB, ~200 lines
- **Total directory**: 3.5 MB
- **Processing time (ADH-IDE-237)**: 27 seconds

---

## 1. INVENTORY METRICS

### Specs Count
| Metric | Value |
|--------|-------|
| Total files | 363 |
| Detailed specs | 361 |
| Template files | 2 |
| IDE range | 1-350 |
| Missing IDEs | ~11 (gap analysis needed) |

### Size Distribution
| Spec Type | Count | Size | Notes |
|-----------|-------|------|-------|
| Typical small | ~300 | 4-5 KB | ~195 lines (ADH-IDE-1, 50, 100) |
| Medium | ~50 | 10-20 KB | ~500-1000 lines |
| Large | ~10 | 50-100 KB | ~2000-3000 lines |
| Largest | 1 | 234 KB | 6,101 lines (ADH-IDE-237) |
| **Total** | **361** | **3.5 MB** | Average: ~9.7 KB |

---

## 2. TOKEN COST CALCULATION

### Haiku 4.5 Token Pricing
- **Input**: $0.80 / 1M tokens
- **Output**: $4.00 / 1M tokens
- **Typical token ratio**: 1 KB ≈ 250 tokens (text-heavy content)

### ADH-IDE-237 (Largest Spec) - Detailed Cost

```
File: ADH-IDE-237.md
Size: 234 KB
Lines: 6,101
Estimated tokens: 234 * 250 = 58,500 tokens

Cost to process (with output):
- Input: 58,500 / 1,000,000 * $0.80 = $0.047
- Output (estimate ~2x input): 117,000 / 1,000,000 * $4.00 = $0.468
- Per-spec cost: ~$0.52
```

### Full Pipeline Cost Estimation

**Scenario 1: Process all 361 specs**

```
Total input tokens: 3.5 MB * 1024 * 250 tokens/KB = 896,000,000 tokens
Average output: 2x input = 1,792,000,000 tokens

Total cost:
- Input: 896M / 1M * $0.80 = $716.80
- Output: 1.792B / 1M * $4.00 = $7,168.00
- TOTAL: $7,884.80

Time estimate (at 27s per spec): 
361 * 27s ≈ 9,747 seconds ≈ 2.7 hours (sequential)
```

**Scenario 2: Process high-priority specs only (top 50)**

```
Average size (prioritized): 15 KB per spec
Total input: 50 * 15 KB * 1024 * 250 = 192,000,000 tokens

Cost:
- Input: 192M / 1M * $0.80 = $153.60
- Output: 384M / 1M * $4.00 = $1,536.00
- TOTAL: $1,689.60

Time: 50 * 27s ≈ 1,350s ≈ 22.5 minutes
```

**Scenario 3: Batch processing (divide into 4 concurrent sessions)**

```
Total cost same: $7,884.80
Time: 361 / 4 sessions * 27s ≈ 2,430s ≈ 40.5 minutes
Parallelization: 4x speedup (limited by resource availability)
```

---

## 3. PIPELINE PERFORMANCE METRICS

### ADH-IDE-237 Processing
| Phase | Duration | Notes |
|-------|----------|-------|
| Phase 1-4 | 27s | Initial analysis phases |
| Assemblage | Included | Output generation |
| Total | ~27s | Includes all transformations |

### Extrapolated Performance
```
Average spec processing: 27s
Total estimated time (sequential): 361 specs * 27s = 9,747s = 2.7 hours

With 4 parallel workers:
Time = 361 / 4 specs/worker * 27s = 2,430s = 40.5 minutes

Bottlenecks:
- API rate limiting (Anthropic Claude models)
- File I/O (reading XML, writing markdown)
- Network latency (KnowledgeBase queries)
```

---

## 4. CONTENT COMPLEXITY BREAKDOWN

### ADH-IDE-237 Analysis (as reference)
```
Core Metrics:
- Taches (tasks): 49
- Visible screens: 12
- Logic lines: 1,818
- Expressions: 305
- Tables modified: 9
- Sub-programs called: 20
- Disabled code: 0.5% (9 lines)

Code Distribution (estimated):
- Functional description: ~400 lines (6.5%)
- Technical analysis: ~800 lines (13%)
- Mapping/dependencies: ~600 lines (10%)
- Migration plan: ~300 lines (5%)
- Metadata/tables: ~2,000 lines (33%)
- Details/tasks breakdown: ~2,000 lines (33%)
```

### Scalability to Full Pipeline
```
Assuming ADH-IDE-237 is in top 10% complexity:

Average spec (361 total):
- Taches: ~10-15 (vs 49)
- Logic lines: ~300-500 (vs 1,818)
- Expressions: ~50-100 (vs 305)
- Tables modified: ~2-3 (vs 9)
- Sub-programs: ~3-5 (vs 20)
- Output size: ~200-300 lines (vs 6,101)
- Average size: ~5-6 KB (vs 234 KB)
```

---

## 5. RECOMMENDATION & OPTIMIZATION STRATEGIES

### Cost Optimization

**Option A: Phased Rollout (Recommended)**
```
Phase 1: High-priority specs (50 specs, 30-100+ KB each)
- Cost: ~$1,690
- Time: 22.5 minutes
- Output: 50 detailed specs for core business processes

Phase 2: Medium-priority specs (100 specs)
- Cost: ~$1,690
- Time: 45 minutes

Phase 3: Remaining specs (200+ specs)
- Cost: ~$3,400
- Time: 90+ minutes

Total: $7,885 for full coverage
```

**Option B: Batch Processing (Speed)**
```
Use 4 concurrent workers to reduce wall-clock time from 2.7h to 40min
Cost: Same ($7,885)
Requires: API quota management + worker coordination
```

**Option C: Differential Updates (Cost Reduction)**
```
On subsequent runs, only process changed/new specs:
- Identify new IDEs or modified specs
- Process incrementally (not full 361)
- Estimated savings: 60-80% on recurring runs
```

### Quality Assurance

**Pre-Generation**
- Validate XML structure (Magic files)
- Verify IDE references exist
- Check for orphaned programs

**Post-Generation**
- Coverage: Ensure all 361 specs generated
- Size anomalies: Flag specs < 2 KB or > 500 KB
- Link validation: Verify cross-references (IDE links)

---

## 6. TOKEN BUDGET IMPACT

### Haiku 4.5 Usage (this project context)
```
Current session context: ~20,000 tokens (reserved)
Analysis document generated: ~2,000 tokens
Per full pipeline execution: 896M input tokens + 1.8B output tokens

Recommended monthly allocation:
- If running pipeline daily: 896M * 30 = 26.88B tokens/month
- If running weekly: 26.88B / 4 ≈ 6.7B tokens/month
- If running monthly: 896M tokens/month

Current Anthropic limits: Evaluate your subscription tier
```

### Cost per IDE Program
```
Average cost per spec: $7,885 / 361 = $21.84 per spec
- Input: $0.80 per 1M tokens * (1 spec avg 2.5M tokens) = $2
- Output: $4.00 per 1M tokens * (2 specs avg 5M tokens) = $20
- Total: ~$22 per detailed specification
```

---

## 7. NEXT STEPS & QUESTIONS

### For Implementation
1. **Schedule first batch**: Process top 50 priority specs (business-critical)
2. **Monitor costs**: Track actual vs estimated token usage
3. **Parallelization**: Evaluate 4-worker concurrent processing
4. **Incremental updates**: Plan monthly differential updates

### Open Questions
1. Are all 361 IDEs still valid, or can we prune missing/orphaned ones?
2. What's the priority ranking? (Business criticality, complexity, etc.)
3. Can output be reused across multiple projects (PBP, PVE, PBG)?
4. Do we need real-time updates, or is daily/weekly batch sufficient?

---

## APPENDIX: Raw Metrics

```
Specs Directory: D:\Projects\Lecteur_Magic\.openspec\specs\
Total size: 3.5 MB
File count: 363

Top 5 largest specs (estimated):
1. ADH-IDE-237: 234 KB (6,101 lines)
2. ADH-IDE-121: ~100 KB (estimated)
3-5. Medium specs: 50-100 KB range

File formats: Markdown (.md)
Latest update: 2026-02-03 00:06
Pipeline version: V7.2 Enrichi

Output examples:
- D:\Projects\Lecteur_Magic\tools\spec-pipeline-v72\output\ADH-IDE-237\
- D:\Projects\Lecteur_Magic\tools\spec-pipeline-v72\output\ADH-IDE-121\
```

---

**Generated**: 2026-02-03  
**Analysis Method**: Bash file metrics + token estimation  
**Token Cost Model**: Haiku 4.5 pricing ($0.80/M input, $4.00/M output)
