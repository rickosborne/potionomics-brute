/**
 * @param {*} value
 * @returns {value is object}
 */
const isDefined = (value) => value != null;

/**
 * @param {*} value
 * @param {string} name
 * @returns {object}
 */
const assertIsDefined = (value, name) => {
	if (!isDefined(value)) {
		throw new Error(`Expected a value: ${name}`);
	}
	return value;
};

module.exports = {assertIsDefined, isDefined};
