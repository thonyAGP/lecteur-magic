"use strict";
/**
 * Magic Unipaas Expression Parser - Lexer
 *
 * Tokenizes Magic expression strings into a stream of tokens.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
exports.tokenize = tokenize;
const tokens_1 = require("../types/tokens");
const errors_1 = require("../types/errors");
const xml_decoder_1 = require("./xml-decoder");
/**
 * Magic Expression Lexer
 *
 * Converts a Magic expression string into tokens.
 *
 * @example
 * const lexer = new Lexer("IF({0,1} > 10, 'Yes', 'No')");
 * const tokens = lexer.tokenize();
 */
class Lexer {
    source;
    originalSource;
    pos = 0;
    line = 1;
    column = 1;
    options;
    constructor(source, options = {}) {
        this.originalSource = source;
        this.options = {
            decodeXml: options.decodeXml ?? true,
            skipWhitespace: options.skipWhitespace ?? true,
        };
        this.source = this.options.decodeXml ? (0, xml_decoder_1.decodeXmlEntities)(source) : source;
    }
    /**
     * Get current position
     */
    getPosition() {
        return {
            line: this.line,
            column: this.column,
            offset: this.pos,
        };
    }
    /**
     * Check if at end of input
     */
    isEOF() {
        return this.pos >= this.source.length;
    }
    /**
     * Get current character without advancing
     */
    peek(offset = 0) {
        return this.source[this.pos + offset] ?? '';
    }
    /**
     * Advance position and return current character
     */
    advance() {
        const char = this.source[this.pos];
        this.pos++;
        if (char === '\n') {
            this.line++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return char;
    }
    /**
     * Skip whitespace characters
     */
    skipWhitespace() {
        while (!this.isEOF() && /\s/.test(this.peek())) {
            this.advance();
        }
    }
    /**
     * Check if character is a digit
     */
    isDigit(char) {
        return /[0-9]/.test(char);
    }
    /**
     * Check if character can start an identifier
     */
    isIdentifierStart(char) {
        return /[a-zA-Z_]/.test(char);
    }
    /**
     * Check if character can be part of an identifier
     */
    isIdentifierPart(char) {
        return /[a-zA-Z0-9_]/.test(char);
    }
    /**
     * Read a number token
     */
    readNumber() {
        const startPos = this.getPosition();
        let value = '';
        // Integer part
        while (!this.isEOF() && this.isDigit(this.peek())) {
            value += this.advance();
        }
        // Decimal part
        if (this.peek() === '.' && this.isDigit(this.peek(1))) {
            value += this.advance(); // '.'
            while (!this.isEOF() && this.isDigit(this.peek())) {
                value += this.advance();
            }
        }
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            throw errors_1.LexError.invalidNumber(value, startPos, this.originalSource);
        }
        return {
            type: tokens_1.TokenType.NUMBER,
            value,
            position: startPos,
            numericValue,
        };
    }
    /**
     * Read a string token: 'text'
     * Also handles special typed literals like 'TRUE'LOG, 'value'PROG, etc.
     */
    readString() {
        const startPos = this.getPosition();
        this.advance(); // Skip opening quote
        let value = '';
        while (!this.isEOF() && this.peek() !== "'") {
            // Handle escaped quotes
            if (this.peek() === "'" && this.peek(1) === "'") {
                value += "'";
                this.advance();
                this.advance();
            }
            else {
                value += this.advance();
            }
        }
        if (this.isEOF()) {
            throw errors_1.LexError.unterminatedString(startPos, this.originalSource);
        }
        this.advance(); // Skip closing quote
        // Check for type suffix
        const suffix = this.readTypeSuffix();
        if (suffix) {
            return this.createTypedToken(value, suffix, startPos);
        }
        return {
            type: tokens_1.TokenType.STRING,
            value: `'${value}'`,
            position: startPos,
            stringValue: value,
        };
    }
    /**
     * Read type suffix after string literal (PROG, DSOURCE, VAR, FORM, LOG)
     */
    readTypeSuffix() {
        // Check for type suffix (PROG, DSOURCE, VAR, FORM, LOG)
        const suffixes = ['DSOURCE', 'PROG', 'FORM', 'VAR', 'LOG'];
        for (const suffix of suffixes) {
            if (this.matchAhead(suffix)) {
                // Consume the suffix
                for (let i = 0; i < suffix.length; i++) {
                    this.advance();
                }
                return suffix;
            }
        }
        return null;
    }
    /**
     * Check if upcoming characters match given string (case-insensitive)
     */
    matchAhead(str) {
        for (let i = 0; i < str.length; i++) {
            const char = this.peek(i);
            if (char.toUpperCase() !== str[i].toUpperCase()) {
                return false;
            }
        }
        // Make sure it's not part of a longer identifier
        const nextChar = this.peek(str.length);
        return !this.isIdentifierPart(nextChar);
    }
    /**
     * Create typed token from string value and suffix
     */
    createTypedToken(value, suffix, position) {
        const upperSuffix = suffix.toUpperCase();
        // Boolean literal: 'TRUE'LOG or 'FALSE'LOG
        if (upperSuffix === 'LOG') {
            const upperValue = value.toUpperCase();
            if (upperValue === 'TRUE' || upperValue === 'FALSE') {
                return {
                    type: tokens_1.TokenType.BOOLEAN,
                    value: `'${value}'${suffix}`,
                    position,
                    booleanValue: upperValue === 'TRUE',
                };
            }
            throw errors_1.LexError.invalidSpecialReference(value, position, this.originalSource);
        }
        // Special reference: '{id,comp}'TYPE
        const match = value.match(/^\{(-?\d+),(-?\d+)\}$/);
        if (!match) {
            throw errors_1.LexError.invalidSpecialReference(value, position, this.originalSource);
        }
        const refType = this.parseSpecialRefType(upperSuffix, position);
        return {
            type: tokens_1.TokenType.SPECIAL_REF,
            value: `'${value}'${suffix}`,
            position,
            refType,
            id: parseInt(match[1], 10),
            comp: parseInt(match[2], 10),
        };
    }
    /**
     * Parse special reference type from suffix
     */
    parseSpecialRefType(suffix, position) {
        switch (suffix) {
            case 'PROG':
                return tokens_1.SpecialRefType.PROG;
            case 'DSOURCE':
                return tokens_1.SpecialRefType.DSOURCE;
            case 'VAR':
                return tokens_1.SpecialRefType.VAR;
            case 'FORM':
                return tokens_1.SpecialRefType.FORM;
            default:
                throw errors_1.LexError.unknownSpecialRefType(suffix, position, this.originalSource);
        }
    }
    /**
     * Read a field reference: {context,field}
     */
    readFieldReference() {
        const startPos = this.getPosition();
        this.advance(); // Skip '{'
        // Read context number
        let context = '';
        while (!this.isEOF() && this.peek() !== ',') {
            context += this.advance();
        }
        if (this.peek() !== ',') {
            throw errors_1.LexError.invalidFieldReference(`{${context}`, startPos, this.originalSource);
        }
        this.advance(); // Skip ','
        // Read field number
        let field = '';
        while (!this.isEOF() && this.peek() !== '}') {
            field += this.advance();
        }
        if (this.peek() !== '}') {
            throw errors_1.LexError.invalidFieldReference(`{${context},${field}`, startPos, this.originalSource);
        }
        this.advance(); // Skip '}'
        const contextNum = parseInt(context.trim(), 10);
        const fieldNum = parseInt(field.trim(), 10);
        if (isNaN(contextNum) || isNaN(fieldNum)) {
            throw errors_1.LexError.invalidFieldReference(`{${context},${field}}`, startPos, this.originalSource);
        }
        return {
            type: tokens_1.TokenType.FIELD_REF,
            value: `{${context},${field}}`,
            position: startPos,
            context: contextNum,
            field: fieldNum,
        };
    }
    /**
     * Read an identifier (function name, keyword, etc.)
     */
    readIdentifier() {
        const startPos = this.getPosition();
        let value = '';
        while (!this.isEOF() && this.isIdentifierPart(this.peek())) {
            value += this.advance();
        }
        // Check if it's a keyword operator
        const upperValue = value.toUpperCase();
        if (upperValue in tokens_1.KEYWORD_OPERATORS) {
            return {
                type: tokens_1.KEYWORD_OPERATORS[upperValue],
                value,
                position: startPos,
            };
        }
        return {
            type: tokens_1.TokenType.IDENTIFIER,
            value,
            position: startPos,
        };
    }
    /**
     * Read a two-character operator
     */
    readOperator() {
        const startPos = this.getPosition();
        const char = this.peek();
        const nextChar = this.peek(1);
        // Two-character operators
        const twoChar = char + nextChar;
        if (twoChar === '<>' || twoChar === '<=' || twoChar === '>=') {
            this.advance();
            this.advance();
            const type = twoChar === '<>'
                ? tokens_1.TokenType.NOT_EQUAL
                : twoChar === '<='
                    ? tokens_1.TokenType.LESS_EQUAL
                    : tokens_1.TokenType.GREATER_EQUAL;
            return { type, value: twoChar, position: startPos };
        }
        // Single-character operators
        this.advance();
        const operatorMap = {
            '+': tokens_1.TokenType.PLUS,
            '-': tokens_1.TokenType.MINUS,
            '*': tokens_1.TokenType.MULTIPLY,
            '/': tokens_1.TokenType.DIVIDE,
            '^': tokens_1.TokenType.POWER,
            '&': tokens_1.TokenType.CONCAT,
            '=': tokens_1.TokenType.EQUAL,
            '<': tokens_1.TokenType.LESS_THAN,
            '>': tokens_1.TokenType.GREATER_THAN,
            '(': tokens_1.TokenType.LPAREN,
            ')': tokens_1.TokenType.RPAREN,
            ',': tokens_1.TokenType.COMMA,
        };
        const type = operatorMap[char];
        if (type) {
            return { type, value: char, position: startPos };
        }
        throw errors_1.LexError.unexpectedCharacter(char, startPos, this.originalSource);
    }
    /**
     * Read next token
     */
    readToken() {
        if (this.options.skipWhitespace) {
            this.skipWhitespace();
        }
        if (this.isEOF()) {
            return {
                type: tokens_1.TokenType.EOF,
                value: '',
                position: this.getPosition(),
            };
        }
        const char = this.peek();
        // Number
        if (this.isDigit(char)) {
            return this.readNumber();
        }
        // String literal (and potentially typed literals)
        if (char === "'") {
            return this.readString();
        }
        // Field reference
        if (char === '{') {
            return this.readFieldReference();
        }
        // Identifier or keyword
        if (this.isIdentifierStart(char)) {
            return this.readIdentifier();
        }
        // Operators and delimiters
        return this.readOperator();
    }
    /**
     * Tokenize the entire input
     */
    tokenize() {
        const tokens = [];
        while (true) {
            const token = this.readToken();
            tokens.push(token);
            if (token.type === tokens_1.TokenType.EOF) {
                break;
            }
        }
        return tokens;
    }
    /**
     * Create a generator for lazy tokenization
     */
    *tokens() {
        while (true) {
            const token = this.readToken();
            yield token;
            if (token.type === tokens_1.TokenType.EOF) {
                break;
            }
        }
    }
}
exports.Lexer = Lexer;
/**
 * Convenience function to tokenize an expression
 */
function tokenize(source, options) {
    const lexer = new Lexer(source, options);
    return lexer.tokenize();
}
//# sourceMappingURL=lexer.js.map