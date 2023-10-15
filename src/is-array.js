/**
 * @param {*} value
 * @returns {value is []}
 */
const isArray = (value) => Array.isArray(value);

/**
 * @param {*} value
 * @param {string} name
 * @returns {[]}
 */
const assertIsArray = (value, name) => {
	if (!isArray(value)) {
		throw new Error(`Expected array: ${name} (${typeof value})`);
	}
	return value;
};

module.exports = {assertIsArray, isArray};
