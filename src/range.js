/**
 * @param {number} first
 * @param {number} last
 * @returns {number[]}
 */
const range = (first, last) => {
	if (first === last) {
		return [first];
	}
	const reverse = first > last;
	const high = Math.max(first, last);
	const low = Math.min(first, last);
	const count = high - low + 1;
	/** @type {function(number):number} */
	const result = reverse ? ((n) => high - n) : ((n) => n + low);
	return "*"
		.repeat(count)
		.split("")
		.map((_c, index) => result(index));
};

module.exports = {range};
