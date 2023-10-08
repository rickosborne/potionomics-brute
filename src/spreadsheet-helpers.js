import {undefIfEmpty} from "./is-empty.js";
import {optional} from "./optional.js";

/**
 * @function
 * @param {*} v
 * @returns {string}
 */
export const simpleToString = (v) => v == null ? "" : v.toString();
/**
 * @function
 * @param {string} name
 * @returns {{name: string, toString: (function(*): string)}}
 */
export const simpleColumn = (name) => ({name, toString: simpleToString});

/**
 * @param {string} value
 * @returns {number}
 */
export const intFrom = (value) => parseInt(value, 10);

/**
 * @param {string} [value]
 * @returns {number|undefined}
 */
export const maybeIntFrom = (value) => optional(undefIfEmpty(value)).map((s) => parseInt(s, 10)).orElse(undefined);
