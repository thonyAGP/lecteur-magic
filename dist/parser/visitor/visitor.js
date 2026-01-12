"use strict";
/**
 * Magic Unipaas Expression Parser - AST Visitor Interface
 *
 * Defines the visitor pattern interface for traversing and transforming AST nodes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyPrinter = exports.BaseVisitor = void 0;
exports.visit = visit;
exports.printAST = printAST;
const ast_1 = require("../types/ast");
/**
 * Visit an AST node with the given visitor
 */
function visit(node, visitor) {
    switch (node.kind) {
        case ast_1.ASTNodeKind.NumberLiteral:
            return visitor.visitNumberLiteral(node);
        case ast_1.ASTNodeKind.StringLiteral:
            return visitor.visitStringLiteral(node);
        case ast_1.ASTNodeKind.BooleanLiteral:
            return visitor.visitBooleanLiteral(node);
        case ast_1.ASTNodeKind.FieldReference:
            return visitor.visitFieldReference(node);
        case ast_1.ASTNodeKind.SpecialReference:
            return visitor.visitSpecialReference(node);
        case ast_1.ASTNodeKind.BinaryExpression:
            return visitor.visitBinaryExpression(node);
        case ast_1.ASTNodeKind.UnaryExpression:
            return visitor.visitUnaryExpression(node);
        case ast_1.ASTNodeKind.FunctionCall:
            return visitor.visitFunctionCall(node);
        case ast_1.ASTNodeKind.Identifier:
            return visitor.visitIdentifier(node);
        default:
            throw new Error(`Unknown AST node kind: ${node.kind}`);
    }
}
/**
 * Base visitor with default implementations that can be overridden
 */
class BaseVisitor {
    visitNumberLiteral(node) {
        return this.defaultValue();
    }
    visitStringLiteral(node) {
        return this.defaultValue();
    }
    visitBooleanLiteral(node) {
        return this.defaultValue();
    }
    visitFieldReference(node) {
        return this.defaultValue();
    }
    visitSpecialReference(node) {
        return this.defaultValue();
    }
    visitBinaryExpression(node) {
        visit(node.left, this);
        visit(node.right, this);
        return this.defaultValue();
    }
    visitUnaryExpression(node) {
        visit(node.operand, this);
        return this.defaultValue();
    }
    visitFunctionCall(node) {
        for (const arg of node.arguments) {
            visit(arg, this);
        }
        return this.defaultValue();
    }
    visitIdentifier(node) {
        return this.defaultValue();
    }
}
exports.BaseVisitor = BaseVisitor;
/**
 * Pretty printer visitor for debugging
 */
class PrettyPrinter {
    indent = 0;
    getIndent() {
        return '  '.repeat(this.indent);
    }
    visitNumberLiteral(node) {
        return `${this.getIndent()}NumberLiteral(${node.value})`;
    }
    visitStringLiteral(node) {
        return `${this.getIndent()}StringLiteral("${node.value}")`;
    }
    visitBooleanLiteral(node) {
        return `${this.getIndent()}BooleanLiteral(${node.value})`;
    }
    visitFieldReference(node) {
        return `${this.getIndent()}FieldRef{${node.context},${node.field}}`;
    }
    visitSpecialReference(node) {
        return `${this.getIndent()}SpecialRef{${node.id},${node.comp}}'${node.refType}`;
    }
    visitBinaryExpression(node) {
        this.indent++;
        const left = visit(node.left, this);
        const right = visit(node.right, this);
        this.indent--;
        return `${this.getIndent()}BinaryExpr(${node.operator})\n${left}\n${right}`;
    }
    visitUnaryExpression(node) {
        this.indent++;
        const operand = visit(node.operand, this);
        this.indent--;
        return `${this.getIndent()}UnaryExpr(${node.operator})\n${operand}`;
    }
    visitFunctionCall(node) {
        this.indent++;
        const args = node.arguments.map((arg) => visit(arg, this)).join('\n');
        this.indent--;
        return `${this.getIndent()}FunctionCall(${node.name})\n${args}`;
    }
    visitIdentifier(node) {
        return `${this.getIndent()}Identifier(${node.name})`;
    }
}
exports.PrettyPrinter = PrettyPrinter;
/**
 * Print AST as a tree for debugging
 */
function printAST(node) {
    return visit(node, new PrettyPrinter());
}
//# sourceMappingURL=visitor.js.map