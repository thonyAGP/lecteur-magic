#!/usr/bin/env tsx
/**
 * Generate expression coverage badge for README.
 *
 * Creates a shields.io compatible JSON badge endpoint.
 *
 * Usage:
 *   tsx scripts/generate-coverage-badge.ts
 *
 * Output:
 *   .github/badges/expression-coverage.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

interface BadgeData {
  schemaVersion: 1;
  label: string;
  message: string;
  color: string;
}

interface Options {
  contractDir: string;
  outputDir: string;
  badgeFile: string;
  verbose: boolean;
}

const parseOptions = (): Options => {
  const { values } = parseArgs({
    options: {
      'contract-dir': { type: 'string', short: 'c', default: '../../.openspec/migration/ADH' },
      'output-dir': { type: 'string', short: 'o', default: '../adh-web/src' },
      'badge-file': { type: 'string', short: 'b', default: '../../.github/badges/expression-coverage.json' },
      verbose: { type: 'boolean', short: 'v', default: false },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help) {
    console.log(`
Usage: tsx scripts/generate-coverage-badge.ts [options]

Options:
  -c, --contract-dir <path>    Contract directory (default: ../../.openspec/migration/ADH)
  -o, --output-dir <path>      Output directory (default: ../adh-web/src)
  -b, --badge-file <path>      Badge output file (default: ../../.github/badges/expression-coverage.json)
  -v, --verbose                Verbose output
  -h, --help                   Show this help message
`);
    process.exit(0);
  }

  return {
    contractDir: values['contract-dir'] as string,
    outputDir: values['output-dir'] as string,
    badgeFile: values['badge-file'] as string,
    verbose: values.verbose as boolean,
  };
};

const getCoverageColor = (pct: number): string => {
  if (pct >= 90) return 'brightgreen';
  if (pct >= 70) return 'green';
  if (pct >= 50) return 'yellow';
  if (pct >= 30) return 'orange';
  return 'red';
};

const getCoverageFromReport = (reportFile: string): number | null => {
  try {
    if (!fs.existsSync(reportFile)) {
      return null;
    }

    const report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
    return report.overall?.coveragePct ?? null;
  } catch (error) {
    console.error('Error reading coverage report:', error);
    return null;
  }
};

const main = async (): Promise<void> => {
  const options = parseOptions();

  console.log('🎨 Generating expression coverage badge...\n');

  if (options.verbose) {
    console.log('Options:', options, '\n');
  }

  // Try to get coverage from existing report
  const reportFile = path.join(process.cwd(), 'coverage-report.json');
  let coveragePct = getCoverageFromReport(reportFile);

  if (coveragePct === null) {
    // Run coverage check to get fresh data
    console.log('⚠️  No existing coverage report found, running fresh check...\n');

    const { execSync } = await import('node:child_process');

    try {
      execSync(
        `pnpm test:expression-coverage --contract-dir "${options.contractDir}" --output-dir "${options.outputDir}" --json > coverage-report.json`,
        { stdio: 'inherit' }
      );

      coveragePct = getCoverageFromReport(reportFile);
    } catch {
      console.error('❌ Failed to run coverage check');
      process.exit(1);
    }
  }

  if (coveragePct === null) {
    console.error('❌ Could not determine coverage percentage');
    process.exit(1);
  }

  // Generate badge data
  const color = getCoverageColor(coveragePct);
  const badgeData: BadgeData = {
    schemaVersion: 1,
    label: 'expression coverage',
    message: `${coveragePct}%`,
    color: color,
  };

  // Ensure output directory exists
  const badgeFilePath = path.resolve(options.badgeFile);
  const badgeDir = path.dirname(badgeFilePath);

  if (!fs.existsSync(badgeDir)) {
    fs.mkdirSync(badgeDir, { recursive: true });
  }

  // Write badge file
  fs.writeFileSync(badgeFilePath, JSON.stringify(badgeData, null, 2), 'utf8');

  console.log(`✓ Badge generated: ${badgeFilePath}`);
  console.log(`  Coverage: ${coveragePct}%`);
  console.log(`  Color: ${color}`);
  console.log('');
  console.log('📝 Add to README.md:');
  console.log('');
  console.log('```markdown');
  console.log('![Expression Coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/master/.github/badges/expression-coverage.json)');
  console.log('```');
  console.log('');
  console.log('Or use the JSON endpoint directly:');
  console.log(`  ${badgeFilePath}`);
};

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
