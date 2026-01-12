"use strict";
/**
 * Magic Unipaas Expression Parser - Error Types
 *
 * Custom error classes for lexer and parser errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenError = exports.ParseError = exports.LexError = exports.MagicParserError = void 0;
/**
 * Base class for all parser-related errors
 */
class MagicParserError extends Error {
    position;
    source;
    constructor(message, position, source) {
        super(message);
        this.name = this.constructor.name;
        this.position = position;
        this.source = source;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    /**
     * Format error message with position context
     */
    format() {
        let result = `${this.name}: ${this.message}`;
        if (this.position) {
            result += `\n  at line ${this.position.line}, column ${this.position.column}`;
        }
        if (this.source && this.position) {
            const lines = this.source.split('\n');
            const line = lines[this.position.line - 1];
            if (line) {
                result += `\n\n  ${line}`;
                result += `\n  ${' '.repeat(this.position.column - 1)}^`;
            }
        }
        return result;
    }
}
exports.MagicParserError = MagicParserError;
/**
 * Error during lexical analysis (tokenization)
 */
class LexError extends MagicParserError {
    constructor(message, position, source) {
        super(message, position, source);
    }
    /**
     * Create error for unexpected character
     */
    static unexpectedCharacter(char, position, source) {
        return new LexError(`Unexpected character '${char}'`, position, source);
    }
    /**
     * Create error for unterminated string
     */
    static unterminatedString(position, source) {
        return new LexError('Unterminated string literal', position, source);
    }
    /**
     * Create error for invalid number format
     */
    static invalidNumber(value, position, source) {
        return new LexError(`Invalid number format '${value}'`, position, source);
    }
    /**
     * Create error for invalid field reference
     */
    static invalidFieldReference(value, position, source) {
        return new LexError(`Invalid field reference '${value}'`, position, source);
    }
    /**
     * Create error for invalid special reference
     */
    static invalidSpecialReference(value, position, source) {
        return new LexError(`Invalid special reference '${value}'`, position, source);
    }
    /**
     * Create error for unknown special reference type
     */
    static unknownSpecialRefType(type, position, source) {
        return new LexError(`Unknown special reference type '${type}'`, position, source);
    }
}
exports.LexError = LexError;
/**
 * Error during parsing
 */
class ParseError extends MagicParserError {
    token;
    constructor(message, token, source) {
        super(message, token?.position, source);
        this.token = token;
    }
    /**
     * Create error for unexpected token
     */
    static unexpectedToken(token, expected, source) {
        const expectedPart = expected ? `, expected ${expected}` : '';
        return new ParseError(`Unexpected token '${token.value}' (${token.type})${expectedPart}`, token, source);
    }
    /**
     * Create error for expected token type
     */
    static expectedToken(expected, actual, source) {
        const expectedStr = Array.isArray(expected) ? expected.join(' or ') : expected;
        return new ParseError(`Expected ${expectedStr}, got '${actual.value}' (${actual.type})`, actual, source);
    }
    /**
     * Create error for unexpected end of input
     */
    static unexpectedEOF(position, source) {
        const error = new ParseError('Unexpected end of expression', undefined, source);
        if (position) {
            error.position = position;
        }
        return error;
    }
    /**
     * Create error for invalid expression
     */
    static invalidExpression(message, token, source) {
        return new ParseError(`Invalid expression: ${message}`, token, source);
    }
    /**
     * Create error for unknown function
     */
    static unknownFunction(name, token, source) {
        return new ParseError(`Unknown function '${name}'`, token, source);
    }
    /**
     * Create error for wrong argument count
     */
    static wrongArgumentCount(functionName, expected, actual, token, source) {
        return new ParseError(`Function '${functionName}' expects ${expected} arguments, got ${actual}`, token, source);
    }
}
exports.ParseError = ParseError;
/**
 * Error during code generation
 */
class CodeGenError extends MagicParserError {
    constructor(message, position, source) {
        super(message, position, source);
    }
    /**
     * Create error for unsupported node type
     */
    static unsupportedNode(nodeKind, position, source) {
        return new CodeGenError(`Unsupported AST node type '${nodeKind}'`, position, source);
    }
    /**
     * Create error for unsupported operator
     */
    static unsupportedOperator(operator, position, source) {
        return new CodeGenError(`Unsupported operator '${operator}'`, position, source);
    }
    /**
     * Create error for unmapped function
     */
    static unmappedFunction(functionName, position, source) {
        return new CodeGenError(`No mapping defined for function '${functionName}'`, position, source);
    }
}
exports.CodeGenError = CodeGenError;
//# sourceMappingURL=errors.js.map