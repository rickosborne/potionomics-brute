/**
 * @param {*} value
 * @returns {value is (function(...*): *)}
 */
const isFunction = (value) => typeof value === "function";

/**
 * @param {*} value
 * @param {string} name
 * @returns {function(...*): *}
 */
const assertIsFunction = (value, name) => {
	if (!isFunction(value)) {
		throw new Error(`Not a function: ${name} (${typeof value})`);
	}
	return value;
};

module.exports = {assertIsFunction, isFunction};
