/**
 * @typedef SpreadsheetValueSerializer
 * @template {object} T
 * @template {keyof T} K
 * @type {function(T[K], K, T): string}
 */

/** @type {SpreadsheetValueSerializer} */
export let SpreadsheetValueSerializer;

/**
 * @typedef SpreadsheetHeader
 * @template T
 * @type {object}
 * @property {string} name
 * @property {SpreadsheetValueSerializer.<T, keyof T>} toString
 */

/** @type {SpreadsheetHeader} */
export let SpreadsheetHeader;
