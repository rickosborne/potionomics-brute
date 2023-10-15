const {NEUTRAL, RANDOM, Sensation} = require("./type/sense.js");

/**
 * @function
 * @param {Sensation} a
 * @param {Sensation} b
 * @returns {Sensation}
 */
const combineSensations = (a, b) => {
	if (a === b) {
		return a;
	}
	if (a === NEUTRAL) {
		return b;
	}
	if (b === NEUTRAL) {
		return a;
	}
	return RANDOM;
};

module.exports = {combineSensations};
