/**
 * Stagnation Detector - Identifies when voting rounds stop improving
 *
 * Détecte quand les scores de consensus stagnent (arrêt précoce)
 */

/**
 * Round score history
 */
export interface RoundScore {
  roundNumber: number;
  consensusScore: number;
  timestamp: Date;
}

/**
 * Stagnation detection result
 */
export interface StagnationResult {
  /** Is stagnation detected? */
  detected: boolean;
  /** Which round stagnation was detected (if any) */
  detectedAtRound?: number;
  /** Number of consecutive stagnant rounds */
  stagnantRounds?: number;
  /** Score that is stagnating */
  stagnantScore?: number;
  /** Recommendation */
  recommendation?: 'CONTINUE' | 'STOP_EARLY' | 'ESCALATE';
  /** Explanation */
  explanation?: string;
}

/**
 * Stagnation detector configuration
 */
export interface StagnationConfig {
  /** Number of consecutive unchanged scores to trigger stagnation */
  threshold: number;
  /** Score delta tolerance (scores within this range are considered "same") */
  scoreTolerance: number;
}

/**
 * Default stagnation configuration
 */
export const DEFAULT_STAGNATION_CONFIG: StagnationConfig = {
  threshold: 2, // 2 consecutive rounds with same score
  scoreTolerance: 0.5, // Scores within 0.5% are considered same
};

/**
 * Detect stagnation in voting rounds
 *
 * @param scores - History of round scores
 * @param config - Stagnation detection configuration
 * @returns Stagnation detection result
 */
export function detectStagnation(
  scores: RoundScore[],
  config: StagnationConfig = DEFAULT_STAGNATION_CONFIG,
): StagnationResult {
  // Need at least threshold+1 rounds to detect stagnation
  if (scores.length < config.threshold + 1) {
    return {
      detected: false,
      recommendation: 'CONTINUE',
    };
  }

  // Sort by round number (ascending)
  const sortedScores = [...scores].sort((a, b) => a.roundNumber - b.roundNumber);

  // Check last N rounds for stagnation
  const recentScores = sortedScores.slice(-(config.threshold + 1));

  let stagnantCount = 0;
  const stagnantScore = recentScores[recentScores.length - 1].consensusScore;

  // Count consecutive stagnant rounds (working backwards)
  for (let i = recentScores.length - 1; i > 0; i--) {
    const current = recentScores[i].consensusScore;
    const previous = recentScores[i - 1].consensusScore;
    const delta = Math.abs(current - previous);

    if (delta <= config.scoreTolerance) {
      stagnantCount++;
    } else {
      break; // Stagnation streak broken
    }
  }

  // Stagnation detected if count >= threshold
  if (stagnantCount >= config.threshold) {
    const currentRound = recentScores[recentScores.length - 1].roundNumber;

    // Determine recommendation based on score level
    let recommendation: StagnationResult['recommendation'];
    if (stagnantScore >= 70) {
      // High score but stagnant → probably good enough, stop early
      recommendation = 'STOP_EARLY';
    } else if (stagnantScore >= 50) {
      // Medium score but stagnant → needs human decision
      recommendation = 'ESCALATE';
    } else {
      // Low score and stagnant → unlikely to improve, escalate
      recommendation = 'ESCALATE';
    }

    const explanation = buildStagnationExplanation(
      stagnantCount,
      stagnantScore,
      recommendation,
    );

    return {
      detected: true,
      detectedAtRound: currentRound,
      stagnantRounds: stagnantCount,
      stagnantScore,
      recommendation,
      explanation,
    };
  }

  return {
    detected: false,
    recommendation: 'CONTINUE',
  };
}

/**
 * Build human-readable explanation
 */
function buildStagnationExplanation(
  stagnantRounds: number,
  score: number,
  recommendation: StagnationResult['recommendation'],
): string {
  const roundsText = stagnantRounds === 1 ? 'round' : 'rounds';

  const parts = [
    `Consensus score has remained at ~${score.toFixed(1)}% for ${stagnantRounds} consecutive ${roundsText}.`,
  ];

  switch (recommendation) {
    case 'STOP_EARLY':
      parts.push(
        `Score is acceptable (≥70%). Further iterations unlikely to yield significant improvement.`,
      );
      parts.push(`Recommendation: Accept current consensus and proceed.`);
      break;
    case 'ESCALATE':
      parts.push(
        `Score is ${score >= 50 ? 'moderate' : 'low'} (<70%). Revisions have not improved consensus.`,
      );
      parts.push(
        `Recommendation: Human intervention needed to break deadlock or approve with caveats.`,
      );
      break;
  }

  return parts.join(' ');
}

/**
 * Calculate score trend (improving/declining/stable)
 */
export function calculateScoreTrend(scores: RoundScore[]): {
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  averageChange: number;
  volatility: number;
} {
  if (scores.length < 2) {
    return {
      trend: 'STABLE',
      averageChange: 0,
      volatility: 0,
    };
  }

  const sortedScores = [...scores].sort((a, b) => a.roundNumber - b.roundNumber);

  // Calculate deltas between consecutive rounds
  const deltas: number[] = [];
  for (let i = 1; i < sortedScores.length; i++) {
    const delta = sortedScores[i].consensusScore - sortedScores[i - 1].consensusScore;
    deltas.push(delta);
  }

  // Average change
  const averageChange =
    deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;

  // Volatility (standard deviation of deltas)
  const variance =
    deltas.reduce((sum, delta) => sum + Math.pow(delta - averageChange, 2), 0) /
    deltas.length;
  const volatility = Math.sqrt(variance);

  // Determine trend
  let trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  if (Math.abs(averageChange) < 1.0) {
    trend = 'STABLE';
  } else if (averageChange > 0) {
    trend = 'IMPROVING';
  } else {
    trend = 'DECLINING';
  }

  return {
    trend,
    averageChange,
    volatility,
  };
}

/**
 * Predict if consensus likely to reach threshold
 *
 * Simple linear regression prediction
 */
export function predictConsensusReachability(
  scores: RoundScore[],
  threshold: number,
  maxRounds: number,
): {
  likelyToReach: boolean;
  estimatedRound?: number;
  confidence: number;
} {
  if (scores.length < 3) {
    // Not enough data for prediction
    return {
      likelyToReach: false,
      confidence: 0,
    };
  }

  const sortedScores = [...scores].sort((a, b) => a.roundNumber - b.roundNumber);

  // Simple linear regression: score = a * round + b
  const n = sortedScores.length;
  const sumX = sortedScores.reduce((sum, s) => sum + s.roundNumber, 0);
  const sumY = sortedScores.reduce((sum, s) => sum + s.consensusScore, 0);
  const sumXY = sortedScores.reduce(
    (sum, s) => sum + s.roundNumber * s.consensusScore,
    0,
  );
  const sumX2 = sortedScores.reduce((sum, s) => sum + s.roundNumber ** 2, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  const intercept = (sumY - slope * sumX) / n;

  // Predict score at maxRounds
  const predictedScore = slope * maxRounds + intercept;

  // Calculate R² (goodness of fit)
  const meanY = sumY / n;
  const ssTotal = sortedScores.reduce(
    (sum, s) => sum + Math.pow(s.consensusScore - meanY, 2),
    0,
  );
  const ssResidual = sortedScores.reduce(
    (sum, s) =>
      sum +
      Math.pow(s.consensusScore - (slope * s.roundNumber + intercept), 2),
    0,
  );
  const rSquared = 1 - ssResidual / ssTotal;

  // Estimate round when threshold reached
  let estimatedRound: number | undefined;
  if (slope > 0) {
    estimatedRound = Math.ceil((threshold - intercept) / slope);
  }

  const likelyToReach =
    predictedScore >= threshold &&
    (!estimatedRound || estimatedRound <= maxRounds);

  return {
    likelyToReach,
    estimatedRound:
      estimatedRound && estimatedRound > 0 ? estimatedRound : undefined,
    confidence: Math.max(0, Math.min(100, rSquared * 100)),
  };
}

/**
 * Format stagnation report
 */
export function formatStagnationReport(stagnation: StagnationResult): string {
  if (!stagnation.detected) {
    return '✅ No stagnation detected - consensus is evolving';
  }

  const lines = [
    '# ⏸️ Stagnation Detected',
    '',
    `**Round**: ${stagnation.detectedAtRound}`,
    `**Stagnant Score**: ${stagnation.stagnantScore?.toFixed(1)}%`,
    `**Consecutive Stagnant Rounds**: ${stagnation.stagnantRounds}`,
    '',
    '## Explanation',
    '',
    stagnation.explanation || '',
    '',
    '## Recommendation',
    '',
  ];

  switch (stagnation.recommendation) {
    case 'STOP_EARLY':
      lines.push(
        '✅ **STOP EARLY** - Current consensus is acceptable, further iterations unlikely to help',
      );
      break;
    case 'ESCALATE':
      lines.push(
        '⚠️ **ESCALATE** - Human intervention needed to resolve deadlock',
      );
      break;
    case 'CONTINUE':
      lines.push('🔄 **CONTINUE** - Keep trying to reach consensus');
      break;
  }

  return lines.join('\n');
}
