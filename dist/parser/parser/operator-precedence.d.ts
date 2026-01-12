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
import { TokenType } from '../types/tokens';
import { BinaryOperator, UnaryOperator } from '../types/ast';
/**
 * Operator associativity
 */
export declare enum Associativity {
    Left = "Left",
    Right = "Right"
}
/**
 * Precedence levels (higher = binds tighter)
 */
export declare enum Precedence {
    None = 0,
    Or = 1,
    And = 2,
    Comparison = 3,
    Concat = 4,
    Term = 5,// + -
    Factor = 6,// * / MOD
    Power = 7,// ^
    Unary = 8,// NOT -
    Call = 9,// function()
    Primary = 10
}
/**
 * Binary operator info
 */
export interface BinaryOperatorInfo {
    precedence: Precedence;
    associativity: Associativity;
    operator: BinaryOperator;
}
/**
 * Map of token types to binary operator info
 */
export declare const BINARY_OPERATORS: Partial<Record<TokenType, BinaryOperatorInfo>>;
/**
 * Unary operator info
 */
export interface UnaryOperatorInfo {
    precedence: Precedence;
    operator: UnaryOperator;
}
/**
 * Map of token types to unary operator info (prefix)
 */
export declare const PREFIX_OPERATORS: Partial<Record<TokenType, UnaryOperatorInfo>>;
/**
 * Get binary operator info for a token type
 */
export declare function getBinaryOperatorInfo(tokenType: TokenType): BinaryOperatorInfo | undefined;
/**
 * Get prefix operator info for a token type
 */
export declare function getPrefixOperatorInfo(tokenType: TokenType): UnaryOperatorInfo | undefined;
/**
 * Check if token type is a binary operator
 */
export declare function isBinaryOperator(tokenType: TokenType): boolean;
/**
 * Check if token type is a prefix operator
 */
export declare function isPrefixOperator(tokenType: TokenType): boolean;
/**
 * Get precedence for a binary operator token
 */
export declare function getOperatorPrecedence(tokenType: TokenType): Precedence;
//# sourceMappingURL=operator-precedence.d.ts.map