/**
 * Magic Unipaas Expression Parser - Lexer
 *
 * Tokenizes Magic expression strings into a stream of tokens.
 */
import { Token } from '../types/tokens';
/**
 * Lexer configuration options
 */
export interface LexerOptions {
    /** Decode XML entities before tokenizing (default: true) */
    decodeXml?: boolean;
    /** Skip whitespace tokens (default: true) */
    skipWhitespace?: boolean;
}
/**
 * Magic Expression Lexer
 *
 * Converts a Magic expression string into tokens.
 *
 * @example
 * const lexer = new Lexer("IF({0,1} > 10, 'Yes', 'No')");
 * const tokens = lexer.tokenize();
 */
export declare class Lexer {
    private readonly source;
    private readonly originalSource;
    private pos;
    private line;
    private column;
    private readonly options;
    constructor(source: string, options?: LexerOptions);
    /**
     * Get current position
     */
    private getPosition;
    /**
     * Check if at end of input
     */
    private isEOF;
    /**
     * Get current character without advancing
     */
    private peek;
    /**
     * Advance position and return current character
     */
    private advance;
    /**
     * Skip whitespace characters
     */
    private skipWhitespace;
    /**
     * Check if character is a digit
     */
    private isDigit;
    /**
     * Check if character can start an identifier
     */
    private isIdentifierStart;
    /**
     * Check if character can be part of an identifier
     */
    private isIdentifierPart;
    /**
     * Read a number token
     */
    private readNumber;
    /**
     * Read a string token: 'text'
     * Also handles special typed literals like 'TRUE'LOG, 'value'PROG, etc.
     */
    private readString;
    /**
     * Read type suffix after string literal (PROG, DSOURCE, VAR, FORM, LOG)
     */
    private readTypeSuffix;
    /**
     * Check if upcoming characters match given string (case-insensitive)
     */
    private matchAhead;
    /**
     * Create typed token from string value and suffix
     */
    private createTypedToken;
    /**
     * Parse special reference type from suffix
     */
    private parseSpecialRefType;
    /**
     * Read a field reference: {context,field}
     */
    private readFieldReference;
    /**
     * Read an identifier (function name, keyword, etc.)
     */
    private readIdentifier;
    /**
     * Read a two-character operator
     */
    private readOperator;
    /**
     * Read next token
     */
    private readToken;
    /**
     * Tokenize the entire input
     */
    tokenize(): Token[];
    /**
     * Create a generator for lazy tokenization
     */
    tokens(): Generator<Token>;
}
/**
 * Convenience function to tokenize an expression
 */
export declare function tokenize(source: string, options?: LexerOptions): Token[];
//# sourceMappingURL=lexer.d.ts.map