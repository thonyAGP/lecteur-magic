/**
 * Magic Unipaas Expression Parser - XML Entity Decoder
 *
 * Handles decoding of XML entities in Magic expression strings.
 * Magic expressions are stored in XML attributes, so special characters
 * are encoded as XML entities.
 */
/**
 * Decode all XML entities in a string
 *
 * @param input - String with XML entities
 * @returns Decoded string
 *
 * @example
 * decodeXmlEntities("A &lt; B")     // "A < B"
 * decodeXmlEntities("A &amp;&amp; B") // "A && B"
 * decodeXmlEntities("1 &gt;= 0")   // "1 >= 0"
 */
export declare function decodeXmlEntities(input: string): string;
/**
 * Encode special characters as XML entities
 * (useful for generating XML output)
 *
 * @param input - String to encode
 * @returns Encoded string with XML entities
 *
 * @example
 * encodeXmlEntities("A < B")   // "A &lt; B"
 * encodeXmlEntities("A & B")   // "A &amp; B"
 */
export declare function encodeXmlEntities(input: string): string;
/**
 * Check if string contains XML entities
 */
export declare function hasXmlEntities(input: string): boolean;
//# sourceMappingURL=xml-decoder.d.ts.map