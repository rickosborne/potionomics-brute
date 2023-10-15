/**
 * @function
 * @param {*} obj
 * @returns {boolean|undefined}
 */
const maybeBoolFrom = (obj) => {
	if (typeof obj === "boolean") {
		return obj;
	}
	if (typeof obj === "number" && !isNaN(obj)) {
		return obj !== 0;
	}
	if (typeof obj === "string") {
		const lc = obj.trim().toLowerCase();
		if (lc === "y" || lc === "t" || lc === "true" || lc === "yes") {
			return true;
		}
		if (lc === "n" || lc === "no" || lc === "false" || lc === "f") {
			return false;
		}
		return undefined;
	}
	return undefined;
};

/**
 * @function
 * @param {*} obj
 * @param {boolean=} [defaultValue]
 * @returns {boolean}
 */
const boolFrom = (obj, defaultValue = false) => {
	return maybeBoolFrom(obj) ?? defaultValue;
};

module.exports = {boolFrom, maybeBoolFrom};
