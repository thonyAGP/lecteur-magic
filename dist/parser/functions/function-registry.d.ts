/**
 * Magic Unipaas Expression Parser - Function Registry
 *
 * Registry of all Magic built-in functions with metadata for validation
 * and code generation.
 */
/**
 * Function parameter type
 */
export declare enum ParamType {
    Alpha = "A",// String
    Numeric = "N",// Number
    Logical = "B",// Boolean
    Date = "D",// Date
    Time = "T",// Time
    Blob = "L",// BLOB
    Any = "*",// Any type
    Unicode = "U"
}
/**
 * Function metadata
 */
export interface MagicFunction {
    /** Function name (case-insensitive in Magic) */
    name: string;
    /** Minimum number of arguments */
    minArgs: number;
    /** Maximum number of arguments (-1 for unlimited) */
    maxArgs: number;
    /** Return type */
    returnType: ParamType;
    /** Parameter types (for validation) */
    paramTypes?: ParamType[];
    /** Category for documentation */
    category: FunctionCategory;
    /** Brief description */
    description: string;
}
/**
 * Function categories
 */
export declare enum FunctionCategory {
    String = "String",
    Numeric = "Numeric",
    Date = "Date",
    Time = "Time",
    Logical = "Logical",
    Flow = "Flow",
    Database = "Database",
    System = "System",
    IO = "IO",
    UI = "UI",
    Blob = "Blob",
    Conversion = "Conversion",
    Variable = "Variable",
    Environment = "Environment",
    Error = "Error",
    XML = "XML",
    Vector = "Vector",
    Buffer = "Buffer",
    DLL = "DLL",
    HTTP = "HTTP",
    COM = "COM",
    Mail = "Mail",
    Security = "Security",
    Clipboard = "Clipboard",
    Context = "Context",
    Window = "Window",
    Menu = "Menu",
    Control = "Control",
    MultiMark = "MultiMark",
    Locking = "Locking",
    I18N = "I18N"
}
/**
 * Function registry with case-insensitive lookup
 */
declare class FunctionRegistry {
    private readonly functions;
    constructor();
    /**
     * Get function by name (case-insensitive)
     */
    get(name: string): MagicFunction | undefined;
    /**
     * Check if function exists
     */
    has(name: string): boolean;
    /**
     * Get all functions
     */
    getAll(): MagicFunction[];
    /**
     * Get functions by category
     */
    getByCategory(category: FunctionCategory): MagicFunction[];
    /**
     * Validate function call arguments
     */
    validateArgs(name: string, argCount: number): {
        valid: boolean;
        error?: string;
    };
}
/**
 * Global function registry instance
 */
export declare const functionRegistry: FunctionRegistry;
/**
 * Get function info by name
 */
export declare function getFunction(name: string): MagicFunction | undefined;
/**
 * Check if function exists
 */
export declare function functionExists(name: string): boolean;
/**
 * Get all registered functions
 */
export declare function getAllFunctions(): MagicFunction[];
export {};
//# sourceMappingURL=function-registry.d.ts.map