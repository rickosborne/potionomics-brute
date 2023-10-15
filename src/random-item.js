const {assertIsArray} = require("./is-array.js");
const {randInt} = require("./rand-int.js");

/**
 * @function
 * @template T
 * @param {T[]} list
 * @returns {T}
 */
const randomItem = (list) => {
	assertIsArray(list, "randomItem(list)");
	if (list.length < 1) {
		return undefined;
	}
	return list[randInt(0, list.length - 1)];
};

module.exports = {randomItem};
