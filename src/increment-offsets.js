/**
 * @param {number[]} offsets
 * @param {number} maxIndex
 * @returns {number[]}
 */
const incrementOffsets = (offsets, maxIndex) => {
	const offs = offsets.slice();
	const digits = offs.length;
	for (let depth = digits - 1; depth >= 0; depth--) {
		const index = offs[depth];
		if (index < maxIndex) {
			offs[depth] = index + 1;
			for (let right = depth + 1; right < digits; right++) {
				offs[right] = index + 1;
			}
			return offs;
		}
		offs[depth] = 0;
	}
	return offs.concat(0);
};

module.exports = {incrementOffsets};
