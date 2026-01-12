/**
 * Magic Unipaas Expression Parser - TypeScript Code Generator
 *
 * Generates TypeScript code from Magic expression AST.
 */
import { Expression, NumberLiteral, StringLiteral, BooleanLiteral, FieldReference, SpecialReference, BinaryExpression, UnaryExpression, FunctionCall, Identifier } from '../types/ast';
import { ASTVisitor } from './visitor';
/**
 * Options for TypeScript code generation
 */
export interface TypeScriptGeneratorOptions {
    /** Prefix for field references (default: 'fields') */
    fieldPrefix?: string;
    /** Prefix for main program variables (default: 'mainProgram') */
    mainProgramPrefix?: string;
    /** Whether to use optional chaining for field access (default: true) */
    useOptionalChaining?: boolean;
    /** Whether to generate type annotations (default: false) */
    includeTypes?: boolean;
}
/**
 * TypeScript code generator visitor
 */
export declare class TypeScriptGenerator implements ASTVisitor<string> {
    private readonly options;
    constructor(options?: TypeScriptGeneratorOptions);
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
 * Generate TypeScript code from AST
 */
export declare function generateTypeScript(ast: Expression, options?: TypeScriptGeneratorOptions): string;
//# sourceMappingURL=typescript-generator.d.ts.map