const console = require("node:console");

/**
 * @param {number} range
 * @param {number} count
 * @param {boolean} log
 * @returns {number}
 */
const multiChooseCount = (range, count, log = false) => {
	// (n + k - 1)! / (k! * (n - 1)!)
	// n=10,k=3: (10 + 3 - 1)!/(3! * (10 - 1)!) => 12!/(3!*9!)
	// => (12*11*10)/3!
	let num = 1;
	let den = 1;
	for (let i = 0; i < count; i++) {
		num *= range + i;
		den *= 1 + i;
	}
	const total = Math.round(num / den);
	if (log) {
		console.log(`${range} multichoose ${count} => ${total.toLocaleString()}`);
	}
	return total;
};

module.exports = {multiChooseCount};
