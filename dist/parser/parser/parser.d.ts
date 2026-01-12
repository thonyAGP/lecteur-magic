/**
 * Magic Unipaas Expression Parser - Pratt Parser
 *
 * Implements a Pratt parser (top-down operator precedence parser)
 * for Magic expression syntax.
 */
import { Expression } from '../types/ast';
import { ParseError } from '../types/errors';
import { LexerOptions } from '../lexer/lexer';
/**
 * Parser configuration options
 */
export interface ParserOptions extends LexerOptions {
    /** Allow unknown functions (default: true) */
    allowUnknownFunctions?: boolean;
}
/**
 * Magic Expression Parser
 *
 * Uses Pratt parsing technique for operator precedence.
 *
 * @example
 * const parser = new Parser("IF({0,1} > 10, 'Yes', 'No')");
 * const ast = parser.parse();
 */
export declare class Parser {
    private tokens;
    private pos;
    private readonly source;
    private readonly options;
    constructor(source: string, options?: ParserOptions);
    /**
     * Get current token
     */
    private current;
    /**
     * Look ahead at future tokens
     */
    private peek;
    /**
     * Check if current token matches type
     */
    private check;
    /**
     * Check if at end of tokens
     */
    private isAtEnd;
    /**
     * Advance to next token and return previous
     */
    private advance;
    /**
     * Expect current token to be of given type
     */
    private expect;
    /**
     * Match and consume token if it matches type
     */
    private match;
    /**
     * Parse the entire expression
     */
    parse(): Expression;
    /**
     * Parse expression with given minimum precedence
     */
    private parseExpression;
    /**
     * Parse prefix expression (unary or primary)
     */
    private parsePrefixExpression;
    /**
     * Parse primary expression (literals, references, function calls, grouped)
     */
    private parsePrimaryExpression;
    /**
     * Parse identifier or function call
     */
    private parseIdentifierOrCall;
    /**
     * Parse function call: FunctionName(arg1, arg2, ...)
     */
    private parseFunctionCall;
    /**
     * Parse grouped expression: (expression)
     */
    private parseGroupedExpression;
}
/**
 * Convenience function to parse an expression
 */
export declare function parse(source: string, options?: ParserOptions): Expression;
/**
 * Parse expression and return result or error
 */
export declare function tryParse(source: string, options?: ParserOptions): {
    success: true;
    ast: Expression;
} | {
    success: false;
    error: ParseError;
};
//# sourceMappingURL=parser.d.ts.map