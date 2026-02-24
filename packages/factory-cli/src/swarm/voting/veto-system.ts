/**
 * Veto System - Blocker concern detection and automatic rejection
 *
 * Un seul concern BLOCKER = rejet immédiat (veto)
 */

import type { AgentVote, ConsensusResult } from '../types.js';

/**
 * Veto detection result
 */
export interface VetoResult {
  /** Was veto triggered? */
  triggered: boolean;
  /** Which agent triggered veto (if any) */
  agent?: string;
  /** Veto reason (blocker concern text) */
  reason?: string;
  /** All blocker concerns */
  blockers: Array<{
    agent: string;
    concern: string;
    suggestion: string;
  }>;
}

/**
 * Check if any vote has BLOCKER concerns (triggers veto)
 *
 * @param votes - Agent votes to check
 * @returns Veto detection result
 */
export function detectVeto(votes: AgentVote[]): VetoResult {
  const blockers: VetoResult['blockers'] = [];

  for (const vote of votes) {
    for (const concern of vote.concerns) {
      if (concern.severity === 'BLOCKER') {
        blockers.push({
          agent: vote.agent,
          concern: concern.concern,
          suggestion: concern.suggestion,
        });
      }
    }
  }

  if (blockers.length === 0) {
    return {
      triggered: false,
      blockers: [],
    };
  }

  // Veto triggered - use first blocker as primary reason
  const firstBlocker = blockers[0];

  return {
    triggered: true,
    agent: firstBlocker.agent,
    reason: firstBlocker.concern,
    blockers,
  };
}

/**
 * Apply veto to consensus result
 *
 * Forces consensus to fail and recommendation to REJECT
 *
 * @param consensus - Original consensus result
 * @param veto - Veto detection result
 * @returns Modified consensus with veto applied
 */
export function applyVeto(
  consensus: ConsensusResult,
  veto: VetoResult,
): ConsensusResult {
  if (!veto.triggered) {
    return consensus;
  }

  // Force rejection due to veto
  return {
    ...consensus,
    passed: false,
    recommendation: 'REJECT',
  };
}

/**
 * Format veto report
 */
export function formatVetoReport(veto: VetoResult): string {
  if (!veto.triggered) {
    return 'No veto triggered';
  }

  const lines = [
    '# ⛔ VETO TRIGGERED',
    '',
    `**Agent**: ${veto.agent}`,
    `**Reason**: ${veto.reason}`,
    '',
    '## All Blocker Concerns',
    '',
  ];

  for (const blocker of veto.blockers) {
    lines.push(`### ${blocker.agent.toUpperCase()}`);
    lines.push('');
    lines.push(`**Concern**: ${blocker.concern}`);
    lines.push(`**Suggestion**: ${blocker.suggestion}`);
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    '**Action Required**: All blocker concerns must be addressed before proceeding.',
  );

  return lines.join('\n');
}

/**
 * Validate that blocker concerns are properly formed
 */
export function validateBlockerConcerns(votes: AgentVote[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const vote of votes) {
    for (const concern of vote.concerns) {
      if (concern.severity === 'BLOCKER') {
        // Blocker must have non-empty concern text
        if (!concern.concern || concern.concern.trim().length === 0) {
          errors.push(
            `${vote.agent}: Blocker concern has empty concern text`,
          );
        }

        // Blocker must have suggestion for resolution
        if (!concern.suggestion || concern.suggestion.trim().length === 0) {
          errors.push(
            `${vote.agent}: Blocker concern "${concern.concern}" missing resolution suggestion`,
          );
        }

        // Blocker should be paired with REJECT vote
        if (vote.vote !== 'REJECT') {
          errors.push(
            `${vote.agent}: Blocker concern without REJECT vote (voted ${vote.vote})`,
          );
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
