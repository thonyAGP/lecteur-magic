/**
 * Magic Unipaas Expression Parser - Python Code Generator
 *
 * Generates Python code from Magic expression AST.
 */
import { Expression, NumberLiteral, StringLiteral, BooleanLiteral, FieldReference, SpecialReference, BinaryExpression, UnaryExpression, FunctionCall, Identifier } from '../types/ast';
import { ASTVisitor } from './visitor';
/**
 * Options for Python code generation
 */
export interface PythonGeneratorOptions {
    /** Prefix for field references (default: 'fields') */
    fieldPrefix?: string;
    /** Prefix for main program variables (default: 'main_program') */
    mainProgramPrefix?: string;
    /** Whether to use type hints (default: false) */
    includeTypeHints?: boolean;
    /** Use Decimal for numeric (default: true) */
    useDecimal?: boolean;
}
/**
 * Python code generator visitor
 */
export declare class PythonGenerator implements ASTVisitor<string> {
    private readonly options;
    constructor(options?: PythonGeneratorOptions);
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
 * Generate Python code from AST
 */
export declare function generatePython(ast: Expression, options?: PythonGeneratorOptions): string;
/**
 * Generate Python imports needed for the generated code
 */
export declare function getPythonImports(): string;
//# sourceMappingURL=python-generator.d.ts.map