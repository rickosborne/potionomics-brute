const {randInt} = require("./rand-int.js");

/**
 * @template T
 * @param {T[]} list
 * @returns {T[]}
 */
const fisherYatesShuffle = (list) => {
	const n = list.length;
	const lastI = n - 2;
	for (let i = 0; i < lastI; i++) {
		const j = randInt(i, n);
		if (i !== j) {
			const hold = list[i];
			list[i] = list[j];
			list[j] = hold;
		}
	}
	return list;
};

module.exports = {fisherYatesShuffle};
