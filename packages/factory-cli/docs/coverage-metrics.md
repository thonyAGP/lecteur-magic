# Coverage Metrics Guide

> Test coverage metrics with vitest and v8 provider

---

## Overview

Code coverage measures how much of your code is executed by your tests. Factory CLI uses **vitest** with **v8 coverage provider** to track:

- **Lines**: % of code lines executed
- **Functions**: % of functions called
- **Branches**: % of if/else branches taken
- **Statements**: % of statements executed

---

## Quick Start

### Run Coverage

```bash
# Basic coverage report (terminal)
pnpm test:coverage

# Coverage with UI (browser-based)
pnpm test:coverage:ui
```

### Output

```
% Coverage report from v8
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   73.22 |    60.59 |   64.37 |   72.45 |
 core               |   89.58 |    79.76 |   86.66 |   89.58 |
  contract.ts       |   93.83 |    81.48 |     100 |   93.83 |
  correlation.ts    |   97.93 |       75 |     100 |   97.93 |
  coverage.ts       |     100 |      100 |     100 |     100 |
  graph.ts          |   81.81 |       75 |   71.42 |   81.81 |
  pipeline.ts       |     100 |      100 |     100 |     100 |
  tracker.ts        |   83.67 |    78.04 |      75 |   83.67 |
 utils              |     100 |    66.66 |     100 |     100 |
  logger.ts         |     100 |    66.66 |     100 |     100 |
--------------------|---------|----------|---------|---------|

Test Files  44 passed (44)
     Tests  562 passed (562)
```

---

## Configuration

Configuration is in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      // Files to include
      include: ['src/**/*.ts'],

      // Files to exclude
      exclude: [
        'src/**/*.test.ts',
        'src/cli.ts',         // CLI entry point
        'src/**/types.ts',    // Type definitions
        'src/**/index.ts',    // Re-exports
        'dist/**',
        'tests/**',
        'scripts/**',
      ],

      // Thresholds (fail build if not met)
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 60,
        statements: 70,
      },

      clean: true,
      all: true,
    },
  },
});
```

---

## Coverage Thresholds

### Current Baseline (2026-02-24)

| Metric | Current | Threshold | Status |
|--------|---------|-----------|--------|
| Lines | 72.45% | 70% | ✅ Pass |
| Functions | 64.37% | 60% | ✅ Pass |
| Branches | 60.59% | 60% | ✅ Pass |
| Statements | 73.22% | 70% | ✅ Pass |

### Target (Phase 2)

| Metric | Target | Improvement |
|--------|--------|-------------|
| Lines | 80% | +7.55% |
| Functions | 75% | +10.63% |
| Branches | 70% | +9.41% |
| Statements | 80% | +6.78% |

**Strategy**: Increase thresholds by +5% every sprint

---

## Interpreting Metrics

### Lines Coverage

**What it measures**: % of code lines executed by tests

```typescript
function calculateTotal(items: Item[]) {
  let total = 0;                    // ✅ Covered
  for (const item of items) {       // ✅ Covered
    total += item.price;            // ✅ Covered
  }
  return total;                     // ✅ Covered
}
```

**100% lines coverage** = all 4 lines executed

### Functions Coverage

**What it measures**: % of functions called by tests

```typescript
function add(a: number, b: number) { return a + b; }  // ✅ Covered (called in tests)
function subtract(a: number, b: number) { return a - b; }  // ❌ Not covered (never called)
```

**50% functions coverage** = 1 out of 2 functions called

### Branches Coverage

**What it measures**: % of if/else/switch branches taken

```typescript
function getDiscount(user: User) {
  if (user.isPremium) {         // ✅ Branch 1 taken
    return 0.20;
  } else {                      // ❌ Branch 2 NOT taken (no test for non-premium)
    return 0.05;
  }
}
```

**50% branches coverage** = only "if" branch tested, not "else"

**To reach 100%**: Add test for non-premium users

### Statements Coverage

**What it measures**: % of statements executed

```typescript
const user = getUser();                    // ✅ Statement 1
const discount = calculateDiscount(user);  // ✅ Statement 2
applyDiscount(discount);                   // ❌ Statement 3 (not reached in tests)
```

**66% statements coverage** = 2 out of 3 statements executed

---

## Low Coverage Areas

### Identified (2026-02-24)

| Module | Coverage | Priority | Reason |
|--------|----------|----------|--------|
| `migrate/phases/` | 8.15% | 🔴 High | Complex integration code, needs E2E tests |
| `verifiers/` | 21.12% | 🔴 High | NEW module, needs comprehensive tests |
| `orchestrator/` | 2.85% | 🟠 Medium | Orchestration logic, needs integration tests |
| `server/api-routes.ts` | 54.02% | 🟡 Low | HTTP handlers, test happy paths |

### Action Plan

1. **Phase 2 Week 1**: Add tests for `migrate/phases/` (+40% coverage)
2. **Phase 2 Week 2**: Add tests for `verifiers/` (+60% coverage)
3. **Phase 2 Week 3**: Add tests for `orchestrator/` (+50% coverage)

---

## HTML Report

Coverage generates an HTML report in `coverage/index.html`:

```bash
# Generate coverage with HTML report
pnpm test:coverage

# Open in browser (Windows)
start coverage/index.html

# Open in browser (macOS)
open coverage/index.html

# Open in browser (Linux)
xdg-open coverage/index.html
```

**Features**:
- 📊 Visual coverage by file
- 🔍 Line-by-line highlighting (covered vs uncovered)
- 📈 Trend analysis
- 🎯 Click to see exact uncovered lines

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test-coverage.yml
name: Test Coverage

on:
  pull_request:
    paths:
      - 'packages/factory-cli/src/**'
      - 'packages/factory-cli/tests/**'

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm build

      - name: Run Coverage
        working-directory: packages/factory-cli
        run: pnpm test:coverage

      - name: Upload Coverage Report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: packages/factory-cli/coverage/

      - name: Comment PR with Coverage
        uses: codecov/codecov-action@v4
        with:
          files: packages/factory-cli/coverage/lcov.info
          flags: factory-cli
```

### Pre-push Hook

```bash
# .husky/pre-push
#!/bin/sh

cd packages/factory-cli

# Run tests with coverage
pnpm test:coverage

if [ $? -ne 0 ]; then
  echo "❌ Coverage thresholds not met. Push blocked."
  exit 1
fi
```

---

## Improving Coverage

### Strategy 1: Test Uncovered Functions

```typescript
// Before: function never called in tests
function calculateDiscount(user: User): number {
  return user.isPremium ? 0.20 : 0.05;
}

// Add test
describe('calculateDiscount', () => {
  it('should return 20% for premium users', () => {
    const user = { isPremium: true };
    expect(calculateDiscount(user)).toBe(0.20);
  });

  it('should return 5% for non-premium users', () => {
    const user = { isPremium: false };
    expect(calculateDiscount(user)).toBe(0.05);
  });
});
```

**Result**: +50% branches coverage (both if/else tested)

### Strategy 2: Test Error Paths

```typescript
// Before: only happy path tested
try {
  const result = await fetchData();
  return result;
} catch (error) {
  logError(error);  // ❌ Not covered
  throw error;
}

// Add test for error path
it('should log error when fetch fails', async () => {
  fetchData.mockRejectedValue(new Error('Network error'));

  await expect(myFunction()).rejects.toThrow('Network error');
  expect(logError).toHaveBeenCalled();  // ✅ Now covered
});
```

### Strategy 3: Test Edge Cases

```typescript
function divide(a: number, b: number): number {
  if (b === 0) {              // ❌ Not tested
    throw new Error('Division by zero');
  }
  return a / b;               // ✅ Tested
}

// Add edge case test
it('should throw on division by zero', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});
```

---

## Coverage vs Quality

⚠️ **Warning**: 100% coverage ≠ bug-free code

### Good Coverage

```typescript
// ✅ GOOD: Tests behavior, not implementation
it('should calculate total with discount', () => {
  const items = [{ price: 100 }, { price: 200 }];
  const user = { isPremium: true };

  const total = calculateTotal(items, user);

  expect(total).toBe(240); // 300 - 20% discount
});
```

### Bad Coverage

```typescript
// ❌ BAD: Just calling functions for coverage
it('should call calculateTotal', () => {
  calculateTotal([], {});  // No assertions!
});
```

### Best Practices

| ✅ DO | ❌ DON'T |
|-------|----------|
| Test behavior | Test implementation details |
| Test edge cases | Write tests just for coverage |
| Test error paths | Skip assertions |
| Test integrations | Mock everything |
| Refactor for testability | Add dead code for coverage |

---

## Troubleshooting

### Coverage not generated

```bash
# Install coverage provider
pnpm add -D @vitest/coverage-v8

# Verify vitest.config.ts exists
cat vitest.config.ts
```

### Thresholds failing

```bash
# Check current coverage
pnpm test:coverage | grep "All files"

# Adjust thresholds in vitest.config.ts
thresholds: {
  lines: 60,    // Lower if needed
  branches: 50,
}
```

### Slow coverage generation

```typescript
// Exclude more files in vitest.config.ts
exclude: [
  'src/**/*.test.ts',
  'src/cli.ts',
  'src/**/types.ts',
  'dist/**',
  'tests/**',
],
```

---

## Metrics Evolution

Track coverage over time:

```bash
# Save coverage baseline
pnpm test:coverage > coverage-baseline.txt

# Compare after changes
pnpm test:coverage > coverage-current.txt
diff coverage-baseline.txt coverage-current.txt
```

### Target Timeline

| Phase | Target | Date |
|-------|--------|------|
| Baseline | 72% lines, 60% branches | 2026-02-24 ✅ |
| Phase 2 | 80% lines, 70% branches | 2026-03-10 |
| Phase 3 | 85% lines, 75% branches | 2026-03-24 |
| Stable | 90% lines, 80% branches | 2026-04-07 |

---

## Summary

**Current Status**: ✅ Coverage tracking enabled

**Next Steps**:
1. Add tests for `migrate/phases/` (+40% coverage)
2. Add tests for `verifiers/` (+60% coverage)
3. Increase thresholds progressively

**Commands**:
```bash
pnpm test                # Run tests without coverage
pnpm test:coverage       # Run tests with coverage
pnpm test:coverage:ui    # Coverage with browser UI
```

**Reports**:
- Terminal: Immediate summary
- HTML: `coverage/index.html` (detailed)
- JSON: `coverage/coverage-final.json` (CI/CD)
- LCOV: `coverage/lcov.info` (Codecov, Coveralls)
