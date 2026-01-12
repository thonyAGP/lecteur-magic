"use strict";
/**
 * Magic Unipaas Expression Parser - AST Node Types
 *
 * Defines all AST node types for the parsed expression tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AST = exports.UnaryOperator = exports.BinaryOperator = exports.ASTNodeKind = void 0;
exports.isNumberLiteral = isNumberLiteral;
exports.isStringLiteral = isStringLiteral;
exports.isBooleanLiteral = isBooleanLiteral;
exports.isFieldReference = isFieldReference;
exports.isSpecialReference = isSpecialReference;
exports.isBinaryExpression = isBinaryExpression;
exports.isUnaryExpression = isUnaryExpression;
exports.isFunctionCall = isFunctionCall;
exports.isIdentifier = isIdentifier;
/**
 * All possible AST node kinds
 */
var ASTNodeKind;
(function (ASTNodeKind) {
    // Literals
    ASTNodeKind["NumberLiteral"] = "NumberLiteral";
    ASTNodeKind["StringLiteral"] = "StringLiteral";
    ASTNodeKind["BooleanLiteral"] = "BooleanLiteral";
    // References
    ASTNodeKind["FieldReference"] = "FieldReference";
    ASTNodeKind["SpecialReference"] = "SpecialReference";
    // Expressions
    ASTNodeKind["BinaryExpression"] = "BinaryExpression";
    ASTNodeKind["UnaryExpression"] = "UnaryExpression";
    ASTNodeKind["FunctionCall"] = "FunctionCall";
    // Special
    ASTNodeKind["Identifier"] = "Identifier";
})(ASTNodeKind || (exports.ASTNodeKind = ASTNodeKind = {}));
/**
 * Binary operators
 */
var BinaryOperator;
(function (BinaryOperator) {
    // Arithmetic
    BinaryOperator["Add"] = "+";
    BinaryOperator["Subtract"] = "-";
    BinaryOperator["Multiply"] = "*";
    BinaryOperator["Divide"] = "/";
    BinaryOperator["Power"] = "^";
    BinaryOperator["Mod"] = "MOD";
    // String
    BinaryOperator["Concat"] = "&";
    // Comparison
    BinaryOperator["Equal"] = "=";
    BinaryOperator["NotEqual"] = "<>";
    BinaryOperator["LessThan"] = "<";
    BinaryOperator["GreaterThan"] = ">";
    BinaryOperator["LessEqual"] = "<=";
    BinaryOperator["GreaterEqual"] = ">=";
    // Logical
    BinaryOperator["And"] = "AND";
    BinaryOperator["Or"] = "OR";
})(BinaryOperator || (exports.BinaryOperator = BinaryOperator = {}));
/**
 * Unary operators
 */
var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator["Negate"] = "-";
    UnaryOperator["Not"] = "NOT";
})(UnaryOperator || (exports.UnaryOperator = UnaryOperator = {}));
/**
 * Type guards for AST nodes
 */
function isNumberLiteral(node) {
    return node.kind === ASTNodeKind.NumberLiteral;
}
function isStringLiteral(node) {
    return node.kind === ASTNodeKind.StringLiteral;
}
function isBooleanLiteral(node) {
    return node.kind === ASTNodeKind.BooleanLiteral;
}
function isFieldReference(node) {
    return node.kind === ASTNodeKind.FieldReference;
}
function isSpecialReference(node) {
    return node.kind === ASTNodeKind.SpecialReference;
}
function isBinaryExpression(node) {
    return node.kind === ASTNodeKind.BinaryExpression;
}
function isUnaryExpression(node) {
    return node.kind === ASTNodeKind.UnaryExpression;
}
function isFunctionCall(node) {
    return node.kind === ASTNodeKind.FunctionCall;
}
function isIdentifier(node) {
    return node.kind === ASTNodeKind.Identifier;
}
/**
 * AST factory functions
 */
exports.AST = {
    numberLiteral(value, raw, position) {
        return { kind: ASTNodeKind.NumberLiteral, value, raw, position };
    },
    stringLiteral(value, raw, position) {
        return { kind: ASTNodeKind.StringLiteral, value, raw, position };
    },
    booleanLiteral(value, position) {
        return { kind: ASTNodeKind.BooleanLiteral, value, position };
    },
    fieldReference(context, field, position) {
        return { kind: ASTNodeKind.FieldReference, context, field, position };
    },
    specialReference(refType, id, comp, position) {
        return { kind: ASTNodeKind.SpecialReference, refType, id, comp, position };
    },
    binaryExpression(operator, left, right, position) {
        return { kind: ASTNodeKind.BinaryExpression, operator, left, right, position };
    },
    unaryExpression(operator, operand, position) {
        return { kind: ASTNodeKind.UnaryExpression, operator, operand, position };
    },
    functionCall(name, args, position) {
        return { kind: ASTNodeKind.FunctionCall, name, arguments: args, position };
    },
    identifier(name, position) {
        return { kind: ASTNodeKind.Identifier, name, position };
    },
};
//# sourceMappingURL=ast.js.map