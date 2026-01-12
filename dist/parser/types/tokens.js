"use strict";
/**
 * Magic Unipaas Expression Parser - Token Types
 *
 * Defines all token types recognized by the lexer for Magic expressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYWORD_OPERATORS = exports.SpecialRefType = exports.TokenType = void 0;
exports.isNumberToken = isNumberToken;
exports.isStringToken = isStringToken;
exports.isBooleanToken = isBooleanToken;
exports.isFieldRefToken = isFieldRefToken;
exports.isSpecialRefToken = isSpecialRefToken;
exports.isKeywordOperator = isKeywordOperator;
exports.getKeywordOperatorType = getKeywordOperatorType;
var TokenType;
(function (TokenType) {
    // Literals
    TokenType["NUMBER"] = "NUMBER";
    TokenType["STRING"] = "STRING";
    TokenType["BOOLEAN"] = "BOOLEAN";
    // References
    TokenType["FIELD_REF"] = "FIELD_REF";
    TokenType["SPECIAL_REF"] = "SPECIAL_REF";
    // Identifiers
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    // Arithmetic operators
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["MULTIPLY"] = "MULTIPLY";
    TokenType["DIVIDE"] = "DIVIDE";
    TokenType["POWER"] = "POWER";
    TokenType["MOD"] = "MOD";
    // String operators
    TokenType["CONCAT"] = "CONCAT";
    // Comparison operators
    TokenType["EQUAL"] = "EQUAL";
    TokenType["NOT_EQUAL"] = "NOT_EQUAL";
    TokenType["LESS_THAN"] = "LESS_THAN";
    TokenType["GREATER_THAN"] = "GREATER_THAN";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    // Logical operators
    TokenType["AND"] = "AND";
    TokenType["OR"] = "OR";
    TokenType["NOT"] = "NOT";
    // Delimiters
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACE"] = "LBRACE";
    TokenType["RBRACE"] = "RBRACE";
    TokenType["COMMA"] = "COMMA";
    // Special
    TokenType["EOF"] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
/**
 * Special reference types in Magic expressions
 */
var SpecialRefType;
(function (SpecialRefType) {
    SpecialRefType["PROG"] = "PROG";
    SpecialRefType["DSOURCE"] = "DSOURCE";
    SpecialRefType["VAR"] = "VAR";
    SpecialRefType["FORM"] = "FORM";
    SpecialRefType["LOG"] = "LOG";
})(SpecialRefType || (exports.SpecialRefType = SpecialRefType = {}));
/**
 * Type guard for NumberToken
 */
function isNumberToken(token) {
    return token.type === TokenType.NUMBER;
}
/**
 * Type guard for StringToken
 */
function isStringToken(token) {
    return token.type === TokenType.STRING;
}
/**
 * Type guard for BooleanToken
 */
function isBooleanToken(token) {
    return token.type === TokenType.BOOLEAN;
}
/**
 * Type guard for FieldRefToken
 */
function isFieldRefToken(token) {
    return token.type === TokenType.FIELD_REF;
}
/**
 * Type guard for SpecialRefToken
 */
function isSpecialRefToken(token) {
    return token.type === TokenType.SPECIAL_REF;
}
/**
 * Operator tokens that are keywords
 */
exports.KEYWORD_OPERATORS = {
    AND: TokenType.AND,
    OR: TokenType.OR,
    NOT: TokenType.NOT,
    MOD: TokenType.MOD,
};
/**
 * Check if identifier is a keyword operator
 */
function isKeywordOperator(identifier) {
    return identifier.toUpperCase() in exports.KEYWORD_OPERATORS;
}
/**
 * Get token type for keyword operator
 */
function getKeywordOperatorType(identifier) {
    return exports.KEYWORD_OPERATORS[identifier.toUpperCase()];
}
//# sourceMappingURL=tokens.js.map