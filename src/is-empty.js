const {isArray} = require("./is-array");
const {isString} = require("./is-string");

/**
 * @param {*} value
 * @returns {boolean}
 */
const isEmpty = (value) => value == null ||
	(isString(value) && value.trim() === "") ||
	(isArray(value) && value.length === []);

/**
 * @template T
 * @param {T} value
 * @returns {undefined|T}
 */
const undefIfEmpty = (value) => isEmpty(value) ? undefined : value;

module.exports = {isEmpty, undefIfEmpty};
