/**
 * Magic Unipaas Expression Parser - AST Node Types
 *
 * Defines all AST node types for the parsed expression tree.
 */
import { SpecialRefType, TokenPosition } from './tokens';
/**
 * Base AST node interface
 */
export interface ASTNode {
    kind: ASTNodeKind;
    position?: TokenPosition;
}
/**
 * All possible AST node kinds
 */
export declare enum ASTNodeKind {
    NumberLiteral = "NumberLiteral",
    StringLiteral = "StringLiteral",
    BooleanLiteral = "BooleanLiteral",
    FieldReference = "FieldReference",
    SpecialReference = "SpecialReference",
    BinaryExpression = "BinaryExpression",
    UnaryExpression = "UnaryExpression",
    FunctionCall = "FunctionCall",
    Identifier = "Identifier"
}
/**
 * Number literal: 123, 45.67
 */
export interface NumberLiteral extends ASTNode {
    kind: ASTNodeKind.NumberLiteral;
    value: number;
    raw: string;
}
/**
 * String literal: 'texte'
 */
export interface StringLiteral extends ASTNode {
    kind: ASTNodeKind.StringLiteral;
    value: string;
    raw: string;
}
/**
 * Boolean literal: 'TRUE'LOG, 'FALSE'LOG
 */
export interface BooleanLiteral extends ASTNode {
    kind: ASTNodeKind.BooleanLiteral;
    value: boolean;
}
/**
 * Field reference: {context,field}
 *
 * Common contexts:
 * - 0: Current task variables
 * - 32768: Main program variables
 * - 1: Parent task parameter 1
 */
export interface FieldReference extends ASTNode {
    kind: ASTNodeKind.FieldReference;
    context: number;
    field: number;
}
/**
 * Special reference types
 *
 * Examples:
 * - '{493,-1}'PROG   -> Program 493 in local component
 * - '{38,2}'DSOURCE  -> Table 38 in component 2
 * - '{0,8}'VAR       -> Variable 8 in current context
 * - '{0,3}'FORM      -> Form for variable 3
 */
export interface SpecialReference extends ASTNode {
    kind: ASTNodeKind.SpecialReference;
    refType: SpecialRefType;
    id: number;
    comp: number;
}
/**
 * Binary operators
 */
export declare enum BinaryOperator {
    Add = "+",
    Subtract = "-",
    Multiply = "*",
    Divide = "/",
    Power = "^",
    Mod = "MOD",
    Concat = "&",
    Equal = "=",
    NotEqual = "<>",
    LessThan = "<",
    GreaterThan = ">",
    LessEqual = "<=",
    GreaterEqual = ">=",
    And = "AND",
    Or = "OR"
}
/**
 * Unary operators
 */
export declare enum UnaryOperator {
    Negate = "-",
    Not = "NOT"
}
/**
 * Binary expression: left operator right
 */
export interface BinaryExpression extends ASTNode {
    kind: ASTNodeKind.BinaryExpression;
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
/**
 * Unary expression: operator operand
 */
export interface UnaryExpression extends ASTNode {
    kind: ASTNodeKind.UnaryExpression;
    operator: UnaryOperator;
    operand: Expression;
}
/**
 * Function call: FunctionName(arg1, arg2, ...)
 *
 * Magic has 200+ built-in functions like:
 * - IF(condition, trueValue, falseValue)
 * - Trim(string)
 * - DStr(date, format)
 * - GetParam(name)
 * - etc.
 */
export interface FunctionCall extends ASTNode {
    kind: ASTNodeKind.FunctionCall;
    name: string;
    arguments: Expression[];
}
/**
 * Identifier (for unresolved names)
 */
export interface Identifier extends ASTNode {
    kind: ASTNodeKind.Identifier;
    name: string;
}
/**
 * Union type for all expression nodes
 */
export type Expression = NumberLiteral | StringLiteral | BooleanLiteral | FieldReference | SpecialReference | BinaryExpression | UnaryExpression | FunctionCall | Identifier;
/**
 * Type guards for AST nodes
 */
export declare function isNumberLiteral(node: ASTNode): node is NumberLiteral;
export declare function isStringLiteral(node: ASTNode): node is StringLiteral;
export declare function isBooleanLiteral(node: ASTNode): node is BooleanLiteral;
export declare function isFieldReference(node: ASTNode): node is FieldReference;
export declare function isSpecialReference(node: ASTNode): node is SpecialReference;
export declare function isBinaryExpression(node: ASTNode): node is BinaryExpression;
export declare function isUnaryExpression(node: ASTNode): node is UnaryExpression;
export declare function isFunctionCall(node: ASTNode): node is FunctionCall;
export declare function isIdentifier(node: ASTNode): node is Identifier;
/**
 * AST factory functions
 */
export declare const AST: {
    numberLiteral(value: number, raw: string, position?: TokenPosition): NumberLiteral;
    stringLiteral(value: string, raw: string, position?: TokenPosition): StringLiteral;
    booleanLiteral(value: boolean, position?: TokenPosition): BooleanLiteral;
    fieldReference(context: number, field: number, position?: TokenPosition): FieldReference;
    specialReference(refType: SpecialRefType, id: number, comp: number, position?: TokenPosition): SpecialReference;
    binaryExpression(operator: BinaryOperator, left: Expression, right: Expression, position?: TokenPosition): BinaryExpression;
    unaryExpression(operator: UnaryOperator, operand: Expression, position?: TokenPosition): UnaryExpression;
    functionCall(name: string, args: Expression[], position?: TokenPosition): FunctionCall;
    identifier(name: string, position?: TokenPosition): Identifier;
};
//# sourceMappingURL=ast.d.ts.map