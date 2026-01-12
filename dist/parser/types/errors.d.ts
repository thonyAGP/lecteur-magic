/**
 * Magic Unipaas Expression Parser - Error Types
 *
 * Custom error classes for lexer and parser errors.
 */
import { TokenPosition, Token, TokenType } from './tokens';
/**
 * Base class for all parser-related errors
 */
export declare abstract class MagicParserError extends Error {
    readonly position?: TokenPosition;
    readonly source?: string;
    constructor(message: string, position?: TokenPosition, source?: string);
    /**
     * Format error message with position context
     */
    format(): string;
}
/**
 * Error during lexical analysis (tokenization)
 */
export declare class LexError extends MagicParserError {
    constructor(message: string, position?: TokenPosition, source?: string);
    /**
     * Create error for unexpected character
     */
    static unexpectedCharacter(char: string, position: TokenPosition, source?: string): LexError;
    /**
     * Create error for unterminated string
     */
    static unterminatedString(position: TokenPosition, source?: string): LexError;
    /**
     * Create error for invalid number format
     */
    static invalidNumber(value: string, position: TokenPosition, source?: string): LexError;
    /**
     * Create error for invalid field reference
     */
    static invalidFieldReference(value: string, position: TokenPosition, source?: string): LexError;
    /**
     * Create error for invalid special reference
     */
    static invalidSpecialReference(value: string, position: TokenPosition, source?: string): LexError;
    /**
     * Create error for unknown special reference type
     */
    static unknownSpecialRefType(type: string, position: TokenPosition, source?: string): LexError;
}
/**
 * Error during parsing
 */
export declare class ParseError extends MagicParserError {
    readonly token?: Token;
    constructor(message: string, token?: Token, source?: string);
    /**
     * Create error for unexpected token
     */
    static unexpectedToken(token: Token, expected?: string, source?: string): ParseError;
    /**
     * Create error for expected token type
     */
    static expectedToken(expected: TokenType | TokenType[], actual: Token, source?: string): ParseError;
    /**
     * Create error for unexpected end of input
     */
    static unexpectedEOF(position?: TokenPosition, source?: string): ParseError;
    /**
     * Create error for invalid expression
     */
    static invalidExpression(message: string, token?: Token, source?: string): ParseError;
    /**
     * Create error for unknown function
     */
    static unknownFunction(name: string, token?: Token, source?: string): ParseError;
    /**
     * Create error for wrong argument count
     */
    static wrongArgumentCount(functionName: string, expected: string, actual: number, token?: Token, source?: string): ParseError;
}
/**
 * Error during code generation
 */
export declare class CodeGenError extends MagicParserError {
    constructor(message: string, position?: TokenPosition, source?: string);
    /**
     * Create error for unsupported node type
     */
    static unsupportedNode(nodeKind: string, position?: TokenPosition, source?: string): CodeGenError;
    /**
     * Create error for unsupported operator
     */
    static unsupportedOperator(operator: string, position?: TokenPosition, source?: string): CodeGenError;
    /**
     * Create error for unmapped function
     */
    static unmappedFunction(functionName: string, position?: TokenPosition, source?: string): CodeGenError;
}
//# sourceMappingURL=errors.d.ts.map