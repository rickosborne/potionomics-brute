/**
 * @typedef SpreadsheetValueSerializer
 * @template {object} T
 * @template {keyof T} K
 * @type {function(T[K], K, T): string}
 */

/** @type {SpreadsheetValueSerializer} */
let SpreadsheetValueSerializer;

/**
 * @typedef SpreadsheetHeader
 * @template T
 * @type {object}
 * @property {string} name
 * @property {SpreadsheetValueSerializer.<T, keyof T>} toString
 */

/** @type {SpreadsheetHeader} */
let SpreadsheetHeader;

// noinspection JSUnusedAssignment
module.exports = {SpreadsheetHeader, SpreadsheetValueSerializer};
