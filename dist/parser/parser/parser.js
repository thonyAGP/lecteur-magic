"use strict";
/**
 * Magic Unipaas Expression Parser - Pratt Parser
 *
 * Implements a Pratt parser (top-down operator precedence parser)
 * for Magic expression syntax.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
exports.parse = parse;
exports.tryParse = tryParse;
const tokens_1 = require("../types/tokens");
const ast_1 = require("../types/ast");
const errors_1 = require("../types/errors");
const lexer_1 = require("../lexer/lexer");
const operator_precedence_1 = require("./operator-precedence");
/**
 * Magic Expression Parser
 *
 * Uses Pratt parsing technique for operator precedence.
 *
 * @example
 * const parser = new Parser("IF({0,1} > 10, 'Yes', 'No')");
 * const ast = parser.parse();
 */
class Parser {
    tokens;
    pos = 0;
    source;
    options;
    constructor(source, options = {}) {
        this.source = source;
        this.options = {
            decodeXml: options.decodeXml ?? true,
            skipWhitespace: options.skipWhitespace ?? true,
            allowUnknownFunctions: options.allowUnknownFunctions ?? true,
        };
        const lexer = new lexer_1.Lexer(source, this.options);
        this.tokens = lexer.tokenize();
    }
    /**
     * Get current token
     */
    current() {
        return this.tokens[this.pos] ?? this.tokens[this.tokens.length - 1];
    }
    /**
     * Look ahead at future tokens
     */
    peek(offset = 1) {
        const index = this.pos + offset;
        return this.tokens[index] ?? this.tokens[this.tokens.length - 1];
    }
    /**
     * Check if current token matches type
     */
    check(type) {
        return this.current().type === type;
    }
    /**
     * Check if at end of tokens
     */
    isAtEnd() {
        return this.current().type === tokens_1.TokenType.EOF;
    }
    /**
     * Advance to next token and return previous
     */
    advance() {
        if (!this.isAtEnd()) {
            this.pos++;
        }
        return this.tokens[this.pos - 1];
    }
    /**
     * Expect current token to be of given type
     */
    expect(type, message) {
        if (!this.check(type)) {
            throw errors_1.ParseError.expectedToken(type, this.current(), this.source);
        }
        return this.advance();
    }
    /**
     * Match and consume token if it matches type
     */
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    /**
     * Parse the entire expression
     */
    parse() {
        const expr = this.parseExpression();
        if (!this.isAtEnd()) {
            throw errors_1.ParseError.unexpectedToken(this.current(), 'end of expression', this.source);
        }
        return expr;
    }
    /**
     * Parse expression with given minimum precedence
     */
    parseExpression(minPrecedence = operator_precedence_1.Precedence.None) {
        let left = this.parsePrefixExpression();
        while (!this.isAtEnd()) {
            const operatorInfo = (0, operator_precedence_1.getBinaryOperatorInfo)(this.current().type);
            if (!operatorInfo) {
                break;
            }
            // Check precedence
            if (operatorInfo.precedence < minPrecedence) {
                break;
            }
            // For left-associative operators, use higher precedence for right side
            // For right-associative, use same precedence
            const nextMinPrecedence = operatorInfo.associativity === operator_precedence_1.Associativity.Left
                ? operatorInfo.precedence + 1
                : operatorInfo.precedence;
            const operatorToken = this.advance();
            const right = this.parseExpression(nextMinPrecedence);
            left = ast_1.AST.binaryExpression(operatorInfo.operator, left, right, operatorToken.position);
        }
        return left;
    }
    /**
     * Parse prefix expression (unary or primary)
     */
    parsePrefixExpression() {
        const prefixInfo = (0, operator_precedence_1.getPrefixOperatorInfo)(this.current().type);
        if (prefixInfo) {
            const operatorToken = this.advance();
            const operand = this.parseExpression(prefixInfo.precedence);
            return ast_1.AST.unaryExpression(prefixInfo.operator, operand, operatorToken.position);
        }
        return this.parsePrimaryExpression();
    }
    /**
     * Parse primary expression (literals, references, function calls, grouped)
     */
    parsePrimaryExpression() {
        const token = this.current();
        // Number literal
        if ((0, tokens_1.isNumberToken)(token)) {
            this.advance();
            return ast_1.AST.numberLiteral(token.numericValue, token.value, token.position);
        }
        // String literal
        if ((0, tokens_1.isStringToken)(token)) {
            this.advance();
            return ast_1.AST.stringLiteral(token.stringValue, token.value, token.position);
        }
        // Boolean literal
        if ((0, tokens_1.isBooleanToken)(token)) {
            this.advance();
            return ast_1.AST.booleanLiteral(token.booleanValue, token.position);
        }
        // Field reference
        if ((0, tokens_1.isFieldRefToken)(token)) {
            this.advance();
            return ast_1.AST.fieldReference(token.context, token.field, token.position);
        }
        // Special reference
        if ((0, tokens_1.isSpecialRefToken)(token)) {
            this.advance();
            return ast_1.AST.specialReference(token.refType, token.id, token.comp, token.position);
        }
        // Identifier (function call or just identifier)
        if (this.check(tokens_1.TokenType.IDENTIFIER)) {
            return this.parseIdentifierOrCall();
        }
        // Grouped expression
        if (this.check(tokens_1.TokenType.LPAREN)) {
            return this.parseGroupedExpression();
        }
        throw errors_1.ParseError.unexpectedToken(token, 'expression', this.source);
    }
    /**
     * Parse identifier or function call
     */
    parseIdentifierOrCall() {
        const nameToken = this.advance();
        const name = nameToken.value;
        // Check if it's a function call
        if (this.check(tokens_1.TokenType.LPAREN)) {
            return this.parseFunctionCall(name, nameToken);
        }
        // Just an identifier
        return ast_1.AST.identifier(name, nameToken.position);
    }
    /**
     * Parse function call: FunctionName(arg1, arg2, ...)
     */
    parseFunctionCall(name, nameToken) {
        this.expect(tokens_1.TokenType.LPAREN);
        const args = [];
        // Parse arguments
        if (!this.check(tokens_1.TokenType.RPAREN)) {
            do {
                args.push(this.parseExpression());
            } while (this.match(tokens_1.TokenType.COMMA));
        }
        this.expect(tokens_1.TokenType.RPAREN);
        return ast_1.AST.functionCall(name, args, nameToken.position);
    }
    /**
     * Parse grouped expression: (expression)
     */
    parseGroupedExpression() {
        this.expect(tokens_1.TokenType.LPAREN);
        const expr = this.parseExpression();
        this.expect(tokens_1.TokenType.RPAREN);
        return expr;
    }
}
exports.Parser = Parser;
/**
 * Convenience function to parse an expression
 */
function parse(source, options) {
    const parser = new Parser(source, options);
    return parser.parse();
}
/**
 * Parse expression and return result or error
 */
function tryParse(source, options) {
    try {
        const ast = parse(source, options);
        return { success: true, ast };
    }
    catch (error) {
        if (error instanceof errors_1.ParseError) {
            return { success: false, error };
        }
        throw error;
    }
}
//# sourceMappingURL=parser.js.map