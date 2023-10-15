/**
 * @param {*} value
 * @returns {value is !string}
 */
const isString = (value) => typeof value === "string";

/**
 * @param {*} value
 * @param {string} name
 * @returns {!string}
 */
const assertIsString = (value, name) => {
	if (!isString(value)) {
		throw new Error(`Expected a string: ${name} (${typeof value})`);
	}
	return value;
};

module.exports = {assertIsString, isString};
