/**
 * LLM Types
 *
 * Types for LLM integration (messages, responses, config, errors)
 */

/**
 * Cache control pour prompt caching (Phase K1)
 */
export interface CacheControl {
  type: 'ephemeral';
}

/**
 * Message LLM (format Anthropic)
 */
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  /** Prompt caching control (optional, Phase K1) */
  cache_control?: CacheControl;
}

/**
 * Réponse LLM avec usage tokens
 */
export interface LLMResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    /** Cached input tokens (Phase K1) - read from cache */
    cachedInputTokens?: number;
    totalCost: number; // en USD
  };
  model: string;
  finishReason: 'stop' | 'length' | 'error';
}

/**
 * Configuration LLM
 */
export interface LLMConfig {
  apiKey: string;
  model: 'opus' | 'sonnet' | 'haiku';
  maxTokens?: number; // défaut 4096
  temperature?: number; // défaut 0.3
  timeout?: number; // défaut 60000 ms
}

/**
 * Type pour pricing d'un modèle (Phase K1: ajout cached input)
 */
export type ModelPricing = {
  input: number;
  output: number;
  /** Cache read pricing (10% of input, Phase K1) */
  cachedInput: number;
};

/**
 * Mapping modèles → model IDs Anthropic
 */
export const MODEL_IDS = {
  opus: 'claude-opus-4-20250514',
  sonnet: 'claude-sonnet-3-5-20241022',
  haiku: 'claude-3-5-haiku-20241022',
};

/**
 * Prix par modèle (USD par 1M tokens)
 * Phase K1: ajout cachedInput (10% of input)
 */
export const MODEL_PRICING = {
  opus: { input: 15, output: 75, cachedInput: 1.5 },
  sonnet: { input: 3, output: 15, cachedInput: 0.3 },
  haiku: { input: 1, output: 5, cachedInput: 0.1 },
};

/**
 * Erreurs LLM structurées
 */
export class LLMError extends Error {
  code: string;
  statusCode?: number;
  retryable: boolean;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    retryable: boolean = false,
  ) {
    super(message);
    this.name = 'LLMError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }
}
