const {undefIfEmpty} = require("./is-empty.js");
const {optional} = require("./optional.js");

/**
 * @function
 * @param {*} v
 * @returns {string}
 */
const simpleToString = (v) => v == null ? "" : v.toString();
/**
 * @function
 * @param {string} name
 * @returns {{name: string, toString: (function(*): string)}}
 */
const simpleColumn = (name) => ({name, toString: simpleToString});

/**
 * @param {string} value
 * @returns {number}
 */
const intFrom = (value) => parseInt(value, 10);

/**
 * @param {string} [value]
 * @returns {number|undefined}
 */
const maybeIntFrom = (value) => optional(undefIfEmpty(value))
	.filter((s) => /^-?\d+$/.test(s))
	.map((s) => intFrom(s))
	.orElse(undefined);

const maybeFloatFrom = (value) => optional(undefIfEmpty(value))
	.filter((s) => /^-?(\d+|\d+\.\d*|\.\d+)$/.test(s))
	.map((s) => parseFloat(s))
	.orElse(undefined);

module.exports = {
	intFrom, maybeFloatFrom, maybeIntFrom, simpleColumn, simpleToString,
};
