const {Stats, statSync} = require("node:fs");
const {isFunction} = require("./is-function.js");

/**
 * @function
 * @param {string} path
 * @param {function(Stats):boolean} [predicate]
 * @returns {boolean}
 */
const existsSync = (path, predicate) => {
	try {
		const stat = statSync(path);
		if (isFunction(predicate)) {
			return predicate(stat);
		}
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = {existsSync};
