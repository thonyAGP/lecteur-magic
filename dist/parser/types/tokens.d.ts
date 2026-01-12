/**
 * Magic Unipaas Expression Parser - Token Types
 *
 * Defines all token types recognized by the lexer for Magic expressions.
 */
export declare enum TokenType {
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",
    FIELD_REF = "FIELD_REF",// {context,field}
    SPECIAL_REF = "SPECIAL_REF",// '{id,comp}'TYPE
    IDENTIFIER = "IDENTIFIER",// Function names, etc.
    PLUS = "PLUS",// +
    MINUS = "MINUS",// -
    MULTIPLY = "MULTIPLY",// *
    DIVIDE = "DIVIDE",// /
    POWER = "POWER",// ^
    MOD = "MOD",// MOD
    CONCAT = "CONCAT",// &
    EQUAL = "EQUAL",// =
    NOT_EQUAL = "NOT_EQUAL",// <>
    LESS_THAN = "LESS_THAN",// <
    GREATER_THAN = "GREATER_THAN",// >
    LESS_EQUAL = "LESS_EQUAL",// <=
    GREATER_EQUAL = "GREATER_EQUAL",// >=
    AND = "AND",
    OR = "OR",
    NOT = "NOT",
    LPAREN = "LPAREN",// (
    RPAREN = "RPAREN",// )
    LBRACE = "LBRACE",// {
    RBRACE = "RBRACE",// }
    COMMA = "COMMA",// ,
    EOF = "EOF"
}
/**
 * Special reference types in Magic expressions
 */
export declare enum SpecialRefType {
    PROG = "PROG",// Program reference
    DSOURCE = "DSOURCE",// Data source (table) reference
    VAR = "VAR",// Variable reference
    FORM = "FORM",// Form reference
    LOG = "LOG"
}
/**
 * Token position in source
 */
export interface TokenPosition {
    line: number;
    column: number;
    offset: number;
}
/**
 * Base token interface
 */
export interface Token {
    type: TokenType;
    value: string;
    position: TokenPosition;
}
/**
 * Number token with parsed numeric value
 */
export interface NumberToken extends Token {
    type: TokenType.NUMBER;
    numericValue: number;
}
/**
 * String token with unquoted value
 */
export interface StringToken extends Token {
    type: TokenType.STRING;
    stringValue: string;
}
/**
 * Boolean token
 */
export interface BooleanToken extends Token {
    type: TokenType.BOOLEAN;
    booleanValue: boolean;
}
/**
 * Field reference token {context,field}
 */
export interface FieldRefToken extends Token {
    type: TokenType.FIELD_REF;
    context: number;
    field: number;
}
/**
 * Special reference token '{id,comp}'TYPE
 */
export interface SpecialRefToken extends Token {
    type: TokenType.SPECIAL_REF;
    refType: SpecialRefType;
    id: number;
    comp: number;
}
/**
 * Type guard for NumberToken
 */
export declare function isNumberToken(token: Token): token is NumberToken;
/**
 * Type guard for StringToken
 */
export declare function isStringToken(token: Token): token is StringToken;
/**
 * Type guard for BooleanToken
 */
export declare function isBooleanToken(token: Token): token is BooleanToken;
/**
 * Type guard for FieldRefToken
 */
export declare function isFieldRefToken(token: Token): token is FieldRefToken;
/**
 * Type guard for SpecialRefToken
 */
export declare function isSpecialRefToken(token: Token): token is SpecialRefToken;
/**
 * Operator tokens that are keywords
 */
export declare const KEYWORD_OPERATORS: Record<string, TokenType>;
/**
 * Check if identifier is a keyword operator
 */
export declare function isKeywordOperator(identifier: string): boolean;
/**
 * Get token type for keyword operator
 */
export declare function getKeywordOperatorType(identifier: string): TokenType | undefined;
//# sourceMappingURL=tokens.d.ts.map