/**
 * Magic Unipaas Expression Parser
 *
 * A complete parser for Magic Unipaas v12.03 expression syntax.
 * Supports parsing, AST manipulation, and code generation to TypeScript, C#, and Python.
 *
 * @example
 * ```typescript
 * import { parse, generateTypeScript } from './parser';
 *
 * const ast = parse("IF({0,1} > 10, 'Yes', 'No')");
 * const code = generateTypeScript(ast);
 * console.log(code); // (fields?.v1 > 10 ? 'Yes' : 'No')
 * ```
 *
 * @module magic-parser
 */
export { TokenType, SpecialRefType, Token, TokenPosition, NumberToken, StringToken, BooleanToken, FieldRefToken, SpecialRefToken, isNumberToken, isStringToken, isBooleanToken, isFieldRefToken, isSpecialRefToken, isKeywordOperator, getKeywordOperatorType, } from './types/tokens';
export { ASTNode, ASTNodeKind, Expression, NumberLiteral, StringLiteral, BooleanLiteral, FieldReference, SpecialReference, BinaryExpression, UnaryExpression, FunctionCall, Identifier, BinaryOperator, UnaryOperator, AST, isNumberLiteral, isStringLiteral, isBooleanLiteral, isFieldReference, isSpecialReference, isBinaryExpression, isUnaryExpression, isFunctionCall, isIdentifier, } from './types/ast';
export { MagicParserError, LexError, ParseError, CodeGenError, } from './types/errors';
export { Lexer, tokenize, LexerOptions } from './lexer/lexer';
export { decodeXmlEntities, encodeXmlEntities, hasXmlEntities } from './lexer/xml-decoder';
export { Parser, parse, tryParse, ParserOptions } from './parser/parser';
export { Precedence, Associativity, BinaryOperatorInfo, UnaryOperatorInfo, getBinaryOperatorInfo, getPrefixOperatorInfo, isBinaryOperator, isPrefixOperator, getOperatorPrecedence, } from './parser/operator-precedence';
export { MagicFunction, ParamType, FunctionCategory, functionRegistry, getFunction, functionExists, getAllFunctions, } from './functions/function-registry';
export { ASTVisitor, BaseVisitor, visit, PrettyPrinter, printAST } from './visitor/visitor';
export { TypeScriptGenerator, TypeScriptGeneratorOptions, generateTypeScript, } from './visitor/typescript-generator';
export { CSharpGenerator, CSharpGeneratorOptions, generateCSharp, } from './visitor/csharp-generator';
export { PythonGenerator, PythonGeneratorOptions, generatePython, getPythonImports, } from './visitor/python-generator';
/**
 * Parse a Magic expression and generate code for the specified target language.
 *
 * @param source - The Magic expression to parse
 * @param target - Target language: 'typescript', 'csharp', or 'python'
 * @param options - Generator options
 * @returns Generated code string
 *
 * @example
 * ```typescript
 * const tsCode = convert("IF({0,1} > 10, 'Yes', 'No')", 'typescript');
 * const csCode = convert("Trim({0,5})", 'csharp');
 * const pyCode = convert("Upper({32768,10})", 'python');
 * ```
 */
export declare function convert(source: string, target: 'typescript' | 'csharp' | 'python', options?: TypeScriptGeneratorOptions | CSharpGeneratorOptions | PythonGeneratorOptions): string;
/**
 * Parse and analyze a Magic expression.
 *
 * @param source - The Magic expression to analyze
 * @returns Analysis result with AST and metadata
 *
 * @example
 * ```typescript
 * const result = analyze("IF({0,1} > 10, Trim({0,2}), '')");
 * console.log(result.functions); // ['IF', 'Trim']
 * console.log(result.fieldRefs); // [{context: 0, field: 1}, {context: 0, field: 2}]
 * ```
 */
export declare function analyze(source: string): {
    ast: Expression;
    functions: string[];
    fieldRefs: Array<{
        context: number;
        field: number;
    }>;
    specialRefs: Array<{
        type: string;
        id: number;
        comp: number;
    }>;
    hasMainProgramRefs: boolean;
};
import { TypeScriptGeneratorOptions } from './visitor/typescript-generator';
import { CSharpGeneratorOptions } from './visitor/csharp-generator';
import { PythonGeneratorOptions } from './visitor/python-generator';
//# sourceMappingURL=index.d.ts.map