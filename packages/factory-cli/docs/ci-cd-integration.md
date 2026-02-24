# CI/CD Integration Guide

> Automated expression coverage verification and quality gates

**Created**: 2026-02-24
**Version**: 1.0
**Phase**: Phase 2.4 - CI/CD Integration

---

## Overview

This guide covers the complete CI/CD integration for automated expression coverage verification, including:
- GitHub Actions workflow for PR checks
- Pre-commit hooks for local validation
- Coverage badge generation
- Quality gates and enforcement

---

## Quick Start

### 1. Enable GitHub Actions

The workflow is already configured in `.github/workflows/expression-coverage.yml`.

It runs automatically on:
- Pull requests that modify contracts or source files
- Pushes to `master` branch

**No additional setup required** - just push your changes!

### 2. Enable Pre-commit Hook (Optional)

For local validation before committing:

```bash
# Make hook executable
chmod +x .husky/pre-commit-expression-coverage

# Add to your pre-commit workflow
echo ". .husky/pre-commit-expression-coverage" >> .husky/pre-commit
```

### 3. Generate Coverage Badge

```bash
cd packages/factory-cli
pnpm badge:expression-coverage
```

Badge will be created at: `.github/badges/expression-coverage.json`

---

## GitHub Actions Workflow

### Workflow File

Location: `.github/workflows/expression-coverage.yml`

### Triggers

| Event | Paths | Action |
|-------|-------|--------|
| Pull Request | Contracts, source files | Run full coverage check |
| Push to master | Contracts only | Update badge + check |

### Steps

1. **Checkout code**
2. **Setup pnpm + Node.js 22**
3. **Install dependencies**
4. **Build factory-cli**
5. **Run expression coverage check**
   - Threshold: 70%
   - Output: JSON report
6. **Generate summary** (in GitHub UI)
7. **Upload artifact** (report JSON, 30 days retention)
8. **Comment on PR** (coverage report table)
9. **Generate badge** (master only)
10. **Commit badge** (master only)
11. **Fail if below threshold**

### Example Output

#### PR Comment

```markdown
## ✅ Expression Coverage Report

| Metric | Value |
|--------|-------|
| Total Expressions | 17 |
| Covered | 12 |
| Gaps | 5 |
| **Coverage %** | **70.6%** |
| Threshold | 70% |
| Status | ✅ PASS |

### ⚠️ Missing Expressions

- **Program 48** (Saisie Contenu Caisse): 5 missing
  - `Prg_48:Task_2:Line_20:Expr_60`: No modern file mapping
  - `Prg_48:Task_3:Line_5:Expr_22`: Test file not found
  - ... and 3 more

---
📊 [View full report](https://github.com/...)
```

#### Job Summary

GitHub shows a collapsible summary in the Actions tab with:
- Coverage percentage
- Total/covered/missing expressions
- List of programs with gaps

---

## Pre-commit Hook

### Location

`.husky/pre-commit-expression-coverage`

### Behavior

1. **Detect modified contracts** (staged files)
2. **Extract program IDs** from filenames
3. **Run coverage check** for those programs only
4. **Pass**: Allow commit
5. **Fail**: Block commit, show errors

### Output Example

```bash
🔍 Checking expression coverage on modified contracts...

Modified contracts:
  - .openspec/migration/ADH/ADH-IDE-48.contract.yaml

Running expression coverage check for programs: 48

Expression Coverage Report
══════════════════════════════════════

Program 48 (Saisie Contenu Caisse):
  Total expressions: 9
  Covered: 4 (44%)
  ❌ FAIL - Missing: Prg_48:Task_2:Line_20:Expr_60, ...

Overall:
  Total: 9
  Covered: 4 (44%)
  Coverage: 44%
  Threshold: 70%

✗ Expression coverage check failed

Options:
  1. Fix the missing expressions and add tests
  2. Update the contract with correct mappings
  3. Skip this check with: git commit --no-verify (NOT RECOMMENDED)
```

### Bypass (Emergency Only)

```bash
# NOT RECOMMENDED - only for emergencies
git commit --no-verify
```

---

## Coverage Badge

### Generation

```bash
cd packages/factory-cli
pnpm badge:expression-coverage
```

### Output

File: `.github/badges/expression-coverage.json`

```json
{
  "schemaVersion": 1,
  "label": "expression coverage",
  "message": "70.6%",
  "color": "green"
}
```

### Colors

| Coverage | Color |
|----------|-------|
| ≥ 90% | Bright Green |
| 70-89% | Green |
| 50-69% | Yellow |
| 30-49% | Orange |
| < 30% | Red |

### Add to README

```markdown
![Expression Coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/master/.github/badges/expression-coverage.json)
```

**Note**: Replace `YOUR_ORG` and `YOUR_REPO` with your GitHub repository details.

The badge updates automatically on push to `master`.

---

## Quality Gates

### Threshold Enforcement

| Threshold | Type | Level |
|-----------|------|-------|
| **70%** | Minimum | ENFORCED in CI |
| 80% | Target | Recommended |
| 90% | Excellent | Goal |
| 100% | Perfect | Ideal |

### Failure Conditions

The CI check **fails** if:
- Expression coverage < 70%
- Any contract has invalid schema
- Script execution errors

### Passing Conditions

The CI check **passes** if:
- Expression coverage ≥ 70%
- All contracts have valid schema
- All mapped files exist
- All test files exist (for verified expressions)

---

## Local Development Workflow

### Before Committing

```bash
# 1. Enrich your contract
vim .openspec/migration/ADH/ADH-IDE-XXX.contract.yaml

# 2. Run local check
cd packages/factory-cli
pnpm test:expression-coverage --programs XXX

# 3. Fix any issues
# ... implement missing expressions, add tests ...

# 4. Re-check
pnpm test:expression-coverage --programs XXX --threshold 100

# 5. Commit (hook runs automatically)
git add .openspec/migration/ADH/ADH-IDE-XXX.contract.yaml
git commit -m "feat: enrich contract XXX"
```

### PR Workflow

```bash
# 1. Create feature branch
git checkout -b feat/enrich-contracts-batch-2

# 2. Enrich contracts
# ... enrich 5-10 contracts ...

# 3. Run full check locally
pnpm test:expression-coverage --threshold 70

# 4. Commit and push
git add .openspec/migration/ADH/*.contract.yaml
git commit -m "feat: enrich batch 2 contracts"
git push origin feat/enrich-contracts-batch-2

# 5. Create PR
# GitHub Actions runs automatically

# 6. Review PR comment
# Fix any issues highlighted by the bot

# 7. Merge when green ✅
```

---

## Continuous Monitoring

### Weekly Report

Generate a weekly coverage report:

```bash
cd packages/factory-cli

# Generate report
pnpm test:expression-coverage \
  --verbose \
  --json > weekly-report-$(date +%Y-%m-%d).json

# Analyze trends
jq '.overall.coveragePct' weekly-report-*.json
```

### Dashboard Integration

Add to your migration dashboard:

```typescript
// Fetch latest coverage
const response = await fetch(
  'https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/master/.github/badges/expression-coverage.json'
);
const badge = await response.json();
const coverage = parseInt(badge.message); // "70.6%" -> 70
```

### Alerts

Set up alerts for coverage drops:

```yaml
# .github/workflows/expression-coverage.yml (add)
- name: Alert on coverage drop
  if: steps.coverage.outputs.pct < 65
  run: |
    echo "::warning::Expression coverage dropped below 65%!"
    # Send Slack notification, email, etc.
```

---

## Troubleshooting

### Hook Not Running

```bash
# Ensure hook is executable
chmod +x .husky/pre-commit-expression-coverage

# Check husky installation
ls -la .husky/

# Re-install hooks
pnpm install
```

### CI Failing on PR

**Check the PR comment** - it shows exactly what's missing.

Common fixes:
1. **Missing expressions**: Add `legacy_expressions` to contract rules
2. **Invalid expr_id**: Use correct format `Prg_XXX:Task_YYY:Line_ZZZ:Expr_NNN`
3. **File not found**: Update `mapped_to` or `test_file` paths
4. **Line:0**: Replace with actual line numbers

### Badge Not Updating

```bash
# 1. Check badge file exists
cat .github/badges/expression-coverage.json

# 2. Regenerate badge
cd packages/factory-cli
pnpm badge:expression-coverage

# 3. Commit and push
git add .github/badges/expression-coverage.json
git commit -m "chore: update coverage badge"
git push
```

### Coverage Lower Than Expected

```bash
# Run with verbose output to see details
pnpm test:expression-coverage --verbose

# Check specific program
pnpm test:expression-coverage --programs 48 --verbose

# Verify contract structure
cat .openspec/migration/ADH/ADH-IDE-48.contract.yaml | grep -A 10 "legacy_expressions"
```

---

## Advanced Configuration

### Custom Thresholds Per Program

```typescript
// In verify-expression-coverage.ts
const programThresholds: Record<number, number> = {
  48: 100,  // Critical program - require 100%
  138: 100,
  154: 80,  // Less critical - allow 80%
};
```

### Exclude Programs

```bash
# Skip certain programs from checks
pnpm test:expression-coverage \
  --exclude 22,43,179,180,181,182  # N/A programs
```

### Custom Badge Styles

```bash
# Generate with custom style
pnpm badge:expression-coverage

# Edit .github/badges/expression-coverage.json
# Change "color": "green" to any valid color
```

---

## Integration with Other Tools

### Slack Notifications

```yaml
# Add to .github/workflows/expression-coverage.yml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Expression coverage check failed",
        "coverage": "${{ steps.coverage.outputs.pct }}%"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Jira Integration

```yaml
# Create Jira ticket for missing expressions
- name: Create Jira Issue
  if: steps.coverage.outputs.gaps > 0
  run: |
    curl -X POST https://your-domain.atlassian.net/rest/api/3/issue \
      -H "Content-Type: application/json" \
      -d '{"fields": {...}}'
```

### Email Reports

```bash
# Schedule daily reports
# cron: 0 9 * * * (every day at 9am)
pnpm test:expression-coverage --json | \
  mail -s "Expression Coverage Report" team@example.com
```

---

## Commands Reference

```bash
# Local checks
pnpm test:expression-coverage                    # All programs
pnpm test:expression-coverage --programs 48      # Specific program
pnpm test:expression-coverage --threshold 100    # Custom threshold
pnpm test:expression-coverage --verbose          # Detailed output
pnpm test:expression-coverage --json > report.json  # JSON output

# Badge generation
pnpm badge:expression-coverage                   # Generate badge

# CI-specific
pnpm ci:expression-coverage                      # CI check with JSON output

# Validation only
tsx scripts/validate-contract-schema.ts \
  --contract .openspec/migration/ADH/ADH-IDE-48.contract.yaml
```

---

## Best Practices

### 1. Run Locally Before Pushing

Always run `pnpm test:expression-coverage` locally before pushing to avoid CI failures.

### 2. Fix Issues Immediately

Don't let coverage drop below threshold. Fix missing expressions as soon as they're detected.

### 3. Review PR Comments

The automated PR comment shows exactly what needs to be fixed. Read it carefully.

### 4. Keep Badge Updated

Badge updates automatically on master, but you can regenerate manually if needed.

### 5. Monitor Trends

Track coverage percentage over time to ensure it's improving, not degrading.

---

## Metrics to Track

| Metric | How to Calculate |
|--------|------------------|
| Overall coverage % | Total covered / total expressions |
| Coverage per program | Program covered / program total |
| Trending (weekly) | Compare coverage reports week-over-week |
| Time to fix gaps | Timestamp from PR comment to merge |
| Failure rate | Failed CI runs / total CI runs |

---

## Summary

✅ **CI/CD integration complete**

**Automated checks**:
- GitHub Actions workflow on PR and push
- Pre-commit hook for local validation
- Coverage badge auto-updates

**Quality gates**:
- 70% minimum threshold enforced
- Schema validation required
- File existence checks

**Visibility**:
- PR comments with coverage report
- Badge in README
- Downloadable JSON reports

**Commands**:
```bash
pnpm test:expression-coverage      # Check coverage
pnpm badge:expression-coverage     # Generate badge
pnpm ci:expression-coverage        # CI check
```

🚀 **Ready for production use!**
