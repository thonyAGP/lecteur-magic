"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyPrinter = exports.visit = exports.BaseVisitor = exports.getAllFunctions = exports.functionExists = exports.getFunction = exports.functionRegistry = exports.FunctionCategory = exports.ParamType = exports.getOperatorPrecedence = exports.isPrefixOperator = exports.isBinaryOperator = exports.getPrefixOperatorInfo = exports.getBinaryOperatorInfo = exports.Associativity = exports.Precedence = exports.tryParse = exports.parse = exports.Parser = exports.hasXmlEntities = exports.encodeXmlEntities = exports.decodeXmlEntities = exports.tokenize = exports.Lexer = exports.CodeGenError = exports.ParseError = exports.LexError = exports.MagicParserError = exports.isIdentifier = exports.isFunctionCall = exports.isUnaryExpression = exports.isBinaryExpression = exports.isSpecialReference = exports.isFieldReference = exports.isBooleanLiteral = exports.isStringLiteral = exports.isNumberLiteral = exports.AST = exports.UnaryOperator = exports.BinaryOperator = exports.ASTNodeKind = exports.getKeywordOperatorType = exports.isKeywordOperator = exports.isSpecialRefToken = exports.isFieldRefToken = exports.isBooleanToken = exports.isStringToken = exports.isNumberToken = exports.SpecialRefType = exports.TokenType = void 0;
exports.getPythonImports = exports.generatePython = exports.PythonGenerator = exports.generateCSharp = exports.CSharpGenerator = exports.generateTypeScript = exports.TypeScriptGenerator = exports.printAST = void 0;
exports.convert = convert;
exports.analyze = analyze;
// ===== Types =====
var tokens_1 = require("./types/tokens");
// Token types
Object.defineProperty(exports, "TokenType", { enumerable: true, get: function () { return tokens_1.TokenType; } });
Object.defineProperty(exports, "SpecialRefType", { enumerable: true, get: function () { return tokens_1.SpecialRefType; } });
Object.defineProperty(exports, "isNumberToken", { enumerable: true, get: function () { return tokens_1.isNumberToken; } });
Object.defineProperty(exports, "isStringToken", { enumerable: true, get: function () { return tokens_1.isStringToken; } });
Object.defineProperty(exports, "isBooleanToken", { enumerable: true, get: function () { return tokens_1.isBooleanToken; } });
Object.defineProperty(exports, "isFieldRefToken", { enumerable: true, get: function () { return tokens_1.isFieldRefToken; } });
Object.defineProperty(exports, "isSpecialRefToken", { enumerable: true, get: function () { return tokens_1.isSpecialRefToken; } });
Object.defineProperty(exports, "isKeywordOperator", { enumerable: true, get: function () { return tokens_1.isKeywordOperator; } });
Object.defineProperty(exports, "getKeywordOperatorType", { enumerable: true, get: function () { return tokens_1.getKeywordOperatorType; } });
var ast_1 = require("./types/ast");
Object.defineProperty(exports, "ASTNodeKind", { enumerable: true, get: function () { return ast_1.ASTNodeKind; } });
Object.defineProperty(exports, "BinaryOperator", { enumerable: true, get: function () { return ast_1.BinaryOperator; } });
Object.defineProperty(exports, "UnaryOperator", { enumerable: true, get: function () { return ast_1.UnaryOperator; } });
Object.defineProperty(exports, "AST", { enumerable: true, get: function () { return ast_1.AST; } });
// Type guards
Object.defineProperty(exports, "isNumberLiteral", { enumerable: true, get: function () { return ast_1.isNumberLiteral; } });
Object.defineProperty(exports, "isStringLiteral", { enumerable: true, get: function () { return ast_1.isStringLiteral; } });
Object.defineProperty(exports, "isBooleanLiteral", { enumerable: true, get: function () { return ast_1.isBooleanLiteral; } });
Object.defineProperty(exports, "isFieldReference", { enumerable: true, get: function () { return ast_1.isFieldReference; } });
Object.defineProperty(exports, "isSpecialReference", { enumerable: true, get: function () { return ast_1.isSpecialReference; } });
Object.defineProperty(exports, "isBinaryExpression", { enumerable: true, get: function () { return ast_1.isBinaryExpression; } });
Object.defineProperty(exports, "isUnaryExpression", { enumerable: true, get: function () { return ast_1.isUnaryExpression; } });
Object.defineProperty(exports, "isFunctionCall", { enumerable: true, get: function () { return ast_1.isFunctionCall; } });
Object.defineProperty(exports, "isIdentifier", { enumerable: true, get: function () { return ast_1.isIdentifier; } });
var errors_1 = require("./types/errors");
// Error types
Object.defineProperty(exports, "MagicParserError", { enumerable: true, get: function () { return errors_1.MagicParserError; } });
Object.defineProperty(exports, "LexError", { enumerable: true, get: function () { return errors_1.LexError; } });
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return errors_1.ParseError; } });
Object.defineProperty(exports, "CodeGenError", { enumerable: true, get: function () { return errors_1.CodeGenError; } });
// ===== Lexer =====
var lexer_1 = require("./lexer/lexer");
Object.defineProperty(exports, "Lexer", { enumerable: true, get: function () { return lexer_1.Lexer; } });
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return lexer_1.tokenize; } });
var xml_decoder_1 = require("./lexer/xml-decoder");
Object.defineProperty(exports, "decodeXmlEntities", { enumerable: true, get: function () { return xml_decoder_1.decodeXmlEntities; } });
Object.defineProperty(exports, "encodeXmlEntities", { enumerable: true, get: function () { return xml_decoder_1.encodeXmlEntities; } });
Object.defineProperty(exports, "hasXmlEntities", { enumerable: true, get: function () { return xml_decoder_1.hasXmlEntities; } });
// ===== Parser =====
var parser_1 = require("./parser/parser");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parser_1.Parser; } });
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parser_1.parse; } });
Object.defineProperty(exports, "tryParse", { enumerable: true, get: function () { return parser_1.tryParse; } });
var operator_precedence_1 = require("./parser/operator-precedence");
Object.defineProperty(exports, "Precedence", { enumerable: true, get: function () { return operator_precedence_1.Precedence; } });
Object.defineProperty(exports, "Associativity", { enumerable: true, get: function () { return operator_precedence_1.Associativity; } });
Object.defineProperty(exports, "getBinaryOperatorInfo", { enumerable: true, get: function () { return operator_precedence_1.getBinaryOperatorInfo; } });
Object.defineProperty(exports, "getPrefixOperatorInfo", { enumerable: true, get: function () { return operator_precedence_1.getPrefixOperatorInfo; } });
Object.defineProperty(exports, "isBinaryOperator", { enumerable: true, get: function () { return operator_precedence_1.isBinaryOperator; } });
Object.defineProperty(exports, "isPrefixOperator", { enumerable: true, get: function () { return operator_precedence_1.isPrefixOperator; } });
Object.defineProperty(exports, "getOperatorPrecedence", { enumerable: true, get: function () { return operator_precedence_1.getOperatorPrecedence; } });
// ===== Functions =====
var function_registry_1 = require("./functions/function-registry");
Object.defineProperty(exports, "ParamType", { enumerable: true, get: function () { return function_registry_1.ParamType; } });
Object.defineProperty(exports, "FunctionCategory", { enumerable: true, get: function () { return function_registry_1.FunctionCategory; } });
Object.defineProperty(exports, "functionRegistry", { enumerable: true, get: function () { return function_registry_1.functionRegistry; } });
Object.defineProperty(exports, "getFunction", { enumerable: true, get: function () { return function_registry_1.getFunction; } });
Object.defineProperty(exports, "functionExists", { enumerable: true, get: function () { return function_registry_1.functionExists; } });
Object.defineProperty(exports, "getAllFunctions", { enumerable: true, get: function () { return function_registry_1.getAllFunctions; } });
// ===== Visitors =====
var visitor_1 = require("./visitor/visitor");
Object.defineProperty(exports, "BaseVisitor", { enumerable: true, get: function () { return visitor_1.BaseVisitor; } });
Object.defineProperty(exports, "visit", { enumerable: true, get: function () { return visitor_1.visit; } });
Object.defineProperty(exports, "PrettyPrinter", { enumerable: true, get: function () { return visitor_1.PrettyPrinter; } });
Object.defineProperty(exports, "printAST", { enumerable: true, get: function () { return visitor_1.printAST; } });
var typescript_generator_1 = require("./visitor/typescript-generator");
Object.defineProperty(exports, "TypeScriptGenerator", { enumerable: true, get: function () { return typescript_generator_1.TypeScriptGenerator; } });
Object.defineProperty(exports, "generateTypeScript", { enumerable: true, get: function () { return typescript_generator_1.generateTypeScript; } });
var csharp_generator_1 = require("./visitor/csharp-generator");
Object.defineProperty(exports, "CSharpGenerator", { enumerable: true, get: function () { return csharp_generator_1.CSharpGenerator; } });
Object.defineProperty(exports, "generateCSharp", { enumerable: true, get: function () { return csharp_generator_1.generateCSharp; } });
var python_generator_1 = require("./visitor/python-generator");
Object.defineProperty(exports, "PythonGenerator", { enumerable: true, get: function () { return python_generator_1.PythonGenerator; } });
Object.defineProperty(exports, "generatePython", { enumerable: true, get: function () { return python_generator_1.generatePython; } });
Object.defineProperty(exports, "getPythonImports", { enumerable: true, get: function () { return python_generator_1.getPythonImports; } });
// ===== Convenience API =====
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
function convert(source, target, options) {
    const ast = parse(source);
    switch (target) {
        case 'typescript':
            return generateTypeScript(ast, options);
        case 'csharp':
            return generateCSharp(ast, options);
        case 'python':
            return generatePython(ast, options);
        default:
            throw new Error(`Unknown target language: ${target}`);
    }
}
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
function analyze(source) {
    const ast = parse(source);
    const functions = [];
    const fieldRefs = [];
    const specialRefs = [];
    let hasMainProgramRefs = false;
    // Traverse AST to collect information
    function traverse(node) {
        if ((0, ast_2.isFunctionCall)(node)) {
            functions.push(node.name);
            node.arguments.forEach(traverse);
        }
        else if ((0, ast_2.isFieldReference)(node)) {
            fieldRefs.push({ context: node.context, field: node.field });
            if (node.context === 32768) {
                hasMainProgramRefs = true;
            }
        }
        else if ((0, ast_2.isSpecialReference)(node)) {
            specialRefs.push({ type: node.refType, id: node.id, comp: node.comp });
        }
        else if ((0, ast_2.isBinaryExpression)(node)) {
            traverse(node.left);
            traverse(node.right);
        }
        else if ((0, ast_2.isUnaryExpression)(node)) {
            traverse(node.operand);
        }
    }
    traverse(ast);
    return {
        ast,
        functions: [...new Set(functions)],
        fieldRefs,
        specialRefs,
        hasMainProgramRefs,
    };
}
// Re-export type guards for convenience
const ast_2 = require("./types/ast");
//# sourceMappingURL=index.js.map