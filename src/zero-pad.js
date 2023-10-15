/**
 * @param {number} value
 * @param {number} digits
 * @returns {string}
 */
const zeroPad = (value, digits) => {
	const s = value.toString();
	if (s.length >= digits) {
		return s;
	}
	const zeroes = digits - s.length;
	return "0".repeat(zeroes).concat(s);
};

module.exports = {zeroPad};
