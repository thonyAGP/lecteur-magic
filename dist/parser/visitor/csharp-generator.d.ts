/**
 * Magic Unipaas Expression Parser - C# Code Generator
 *
 * Generates C# code from Magic expression AST.
 */
import { Expression, NumberLiteral, StringLiteral, BooleanLiteral, FieldReference, SpecialReference, BinaryExpression, UnaryExpression, FunctionCall, Identifier } from '../types/ast';
import { ASTVisitor } from './visitor';
/**
 * Options for C# code generation
 */
export interface CSharpGeneratorOptions {
    /** Prefix for field references (default: 'Fields') */
    fieldPrefix?: string;
    /** Prefix for main program variables (default: 'MainProgram') */
    mainProgramPrefix?: string;
    /** Whether to use nullable reference types (default: true) */
    useNullable?: boolean;
    /** Whether to use DateOnly/TimeOnly (.NET 6+) (default: true) */
    useDateOnly?: boolean;
}
/**
 * C# code generator visitor
 */
export declare class CSharpGenerator implements ASTVisitor<string> {
    private readonly options;
    constructor(options?: CSharpGeneratorOptions);
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
 * Generate C# code from AST
 */
export declare function generateCSharp(ast: Expression, options?: CSharpGeneratorOptions): string;
//# sourceMappingURL=csharp-generator.d.ts.map