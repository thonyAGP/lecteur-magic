/**
 * Magic Unipaas Expression Parser - AST Visitor Interface
 *
 * Defines the visitor pattern interface for traversing and transforming AST nodes.
 */
import { Expression, NumberLiteral, StringLiteral, BooleanLiteral, FieldReference, SpecialReference, BinaryExpression, UnaryExpression, FunctionCall, Identifier } from '../types/ast';
/**
 * Visitor interface for AST traversal
 *
 * Each visit method receives a node and returns a result of type T.
 */
export interface ASTVisitor<T> {
    visitNumberLiteral(node: NumberLiteral): T;
    visitStringLiteral(node: StringLiteral): T;
    visitBooleanLiteral(node: BooleanLiteral): T;
    visitFieldReference(node: FieldReference): T;
    visitSpecialReference(node: SpecialReference): T;
    visitBinaryExpression(node: BinaryExpression): T;
    visitUnaryExpression(node: UnaryExpression): T;
    visitFunctionCall(node: FunctionCall): T;
    visitIdentifier(node: Identifier): T;
}
/**
 * Visit an AST node with the given visitor
 */
export declare function visit<T>(node: Expression, visitor: ASTVisitor<T>): T;
/**
 * Base visitor with default implementations that can be overridden
 */
export declare abstract class BaseVisitor<T> implements ASTVisitor<T> {
    /**
     * Default implementation for visiting children
     */
    protected abstract defaultValue(): T;
    visitNumberLiteral(node: NumberLiteral): T;
    visitStringLiteral(node: StringLiteral): T;
    visitBooleanLiteral(node: BooleanLiteral): T;
    visitFieldReference(node: FieldReference): T;
    visitSpecialReference(node: SpecialReference): T;
    visitBinaryExpression(node: BinaryExpression): T;
    visitUnaryExpression(node: UnaryExpression): T;
    visitFunctionCall(node: FunctionCall): T;
    visitIdentifier(node: Identifier): T;
}
/**
 * Pretty printer visitor for debugging
 */
export declare class PrettyPrinter implements ASTVisitor<string> {
    private indent;
    private getIndent;
    visitNumberLiteral(node: NumberLiteral): string;
    visitStringLiteral(node: StringLiteral): string;
    visitBooleanLiteral(node: BooleanLiteral): string;
    visitFieldReference(node: FieldReference): string;
    visitSpecialReference(node: SpecialReference): string;
    visitBinaryExpression(node: BinaryExpression): string;
    visitUnaryExpression(node: UnaryExpression): string;
    visitFunctionCall(node: FunctionCall): string;
    visitIdentifier(node: Identifier): string;
}
/**
 * Print AST as a tree for debugging
 */
export declare function printAST(node: Expression): string;
//# sourceMappingURL=visitor.d.ts.map