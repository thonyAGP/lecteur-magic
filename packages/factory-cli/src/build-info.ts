/**
 * Build information (auto-generated at compile time)
 * Used to verify server is running latest code
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let commitHash = 'unknown';
try {
  const commitFile = join(__dirname, '..', '.build-commit');
  commitHash = readFileSync(commitFile, 'utf8').trim();
} catch {
  // Fallback if .build-commit doesn't exist
}

export const BUILD_INFO = {
  version: '1.0.0-qa-phase2-3',
  buildTimestamp: new Date().toISOString(),
  commit: commitHash,
  phase: 'QA Phase 2+3 Complete',
} as const;
