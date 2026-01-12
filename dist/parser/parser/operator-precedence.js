"use strict";
/**
 * Magic Unipaas Expression Parser - Operator Precedence
 *
 * Defines operator precedence and associativity for the Pratt parser.
 *
 * Magic operator precedence (lowest to highest):
 * 1. OR          (logical or)
 * 2. AND         (logical and)
 * 3. =, <>, <, >, <=, >=  (comparison)
 * 4. &           (string concatenation)
 * 5. +, -        (addition, subtraction)
 * 6. *, /, MOD   (multiplication, division, modulo)
 * 7. ^           (power)
 * 8. NOT, -      (unary)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFIX_OPERATORS = exports.BINARY_OPERATORS = exports.Precedence = exports.Associativity = void 0;
exports.getBinaryOperatorInfo = getBinaryOperatorInfo;
exports.getPrefixOperatorInfo = getPrefixOperatorInfo;
exports.isBinaryOperator = isBinaryOperator;
exports.isPrefixOperator = isPrefixOperator;
exports.getOperatorPrecedence = getOperatorPrecedence;
const tokens_1 = require("../types/tokens");
const ast_1 = require("../types/ast");
/**
 * Operator associativity
 */
var Associativity;
(function (Associativity) {
    Associativity["Left"] = "Left";
    Associativity["Right"] = "Right";
})(Associativity || (exports.Associativity = Associativity = {}));
/**
 * Precedence levels (higher = binds tighter)
 */
var Precedence;
(function (Precedence) {
    Precedence[Precedence["None"] = 0] = "None";
    Precedence[Precedence["Or"] = 1] = "Or";
    Precedence[Precedence["And"] = 2] = "And";
    Precedence[Precedence["Comparison"] = 3] = "Comparison";
    Precedence[Precedence["Concat"] = 4] = "Concat";
    Precedence[Precedence["Term"] = 5] = "Term";
    Precedence[Precedence["Factor"] = 6] = "Factor";
    Precedence[Precedence["Power"] = 7] = "Power";
    Precedence[Precedence["Unary"] = 8] = "Unary";
    Precedence[Precedence["Call"] = 9] = "Call";
    Precedence[Precedence["Primary"] = 10] = "Primary";
})(Precedence || (exports.Precedence = Precedence = {}));
/**
 * Map of token types to binary operator info
 */
exports.BINARY_OPERATORS = {
    // Logical
    [tokens_1.TokenType.OR]: {
        precedence: Precedence.Or,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Or,
    },
    [tokens_1.TokenType.AND]: {
        precedence: Precedence.And,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.And,
    },
    // Comparison
    [tokens_1.TokenType.EQUAL]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Equal,
    },
    [tokens_1.TokenType.NOT_EQUAL]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.NotEqual,
    },
    [tokens_1.TokenType.LESS_THAN]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.LessThan,
    },
    [tokens_1.TokenType.GREATER_THAN]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.GreaterThan,
    },
    [tokens_1.TokenType.LESS_EQUAL]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.LessEqual,
    },
    [tokens_1.TokenType.GREATER_EQUAL]: {
        precedence: Precedence.Comparison,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.GreaterEqual,
    },
    // String
    [tokens_1.TokenType.CONCAT]: {
        precedence: Precedence.Concat,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Concat,
    },
    // Arithmetic
    [tokens_1.TokenType.PLUS]: {
        precedence: Precedence.Term,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Add,
    },
    [tokens_1.TokenType.MINUS]: {
        precedence: Precedence.Term,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Subtract,
    },
    [tokens_1.TokenType.MULTIPLY]: {
        precedence: Precedence.Factor,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Multiply,
    },
    [tokens_1.TokenType.DIVIDE]: {
        precedence: Precedence.Factor,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Divide,
    },
    [tokens_1.TokenType.MOD]: {
        precedence: Precedence.Factor,
        associativity: Associativity.Left,
        operator: ast_1.BinaryOperator.Mod,
    },
    // Power (right associative: 2^3^4 = 2^(3^4))
    [tokens_1.TokenType.POWER]: {
        precedence: Precedence.Power,
        associativity: Associativity.Right,
        operator: ast_1.BinaryOperator.Power,
    },
};
/**
 * Map of token types to unary operator info (prefix)
 */
exports.PREFIX_OPERATORS = {
    [tokens_1.TokenType.NOT]: {
        precedence: Precedence.Unary,
        operator: ast_1.UnaryOperator.Not,
    },
    [tokens_1.TokenType.MINUS]: {
        precedence: Precedence.Unary,
        operator: ast_1.UnaryOperator.Negate,
    },
};
/**
 * Get binary operator info for a token type
 */
function getBinaryOperatorInfo(tokenType) {
    return exports.BINARY_OPERATORS[tokenType];
}
/**
 * Get prefix operator info for a token type
 */
function getPrefixOperatorInfo(tokenType) {
    return exports.PREFIX_OPERATORS[tokenType];
}
/**
 * Check if token type is a binary operator
 */
function isBinaryOperator(tokenType) {
    return tokenType in exports.BINARY_OPERATORS;
}
/**
 * Check if token type is a prefix operator
 */
function isPrefixOperator(tokenType) {
    return tokenType in exports.PREFIX_OPERATORS;
}
/**
 * Get precedence for a binary operator token
 */
function getOperatorPrecedence(tokenType) {
    return exports.BINARY_OPERATORS[tokenType]?.precedence ?? Precedence.None;
}
//# sourceMappingURL=operator-precedence.js.map