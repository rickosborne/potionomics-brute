const {givens} = require("./givens.js");
const {Quality} = require("./type/quality.js");
const {QualityTier} = require("./type/tier.js");

/**
 * @function
 * @returns {Quality}
 */
const qualityFromMagimins = (() => {
	/** @type {QualityTier[]|undefined} */
	let chart;
	/** @type {number|undefined} */
	let tierCount;
	/** @type {number|undefined} */
	let lastTier;
	/** @type {number|undefined} */
	let maxStars;
	/** @type {number|undefined} */
	let lastStars;
	/** @type {Map<number, Quality>} */
	const seen = new Map();
	/**
	 * @function
	 * @param {number} magimins
	 * @returns {Quality}
	 */
	return (magimins) => {
		chart ??= givens.qualityTiers;
		tierCount ??= chart.length;
		lastTier ??= tierCount - 1;
		maxStars ??= chart[0].levels.length;
		lastStars ??= maxStars - 1;
		const found = seen.get(magimins);
		if (found != null) {
			return found;
		}
		for (let tier = lastTier; tier >= 0; tier--) {
			const row = chart[tier];
			if (magimins < row[0]) continue;
			for (let stars = lastStars; stars >= 0; stars--) {
				if (magimins >= row.levels[stars]) {
					/**
					 * @type {Quality}
					 */
					const quality = {stars, tier};
					seen.set(magimins, quality);
					return quality;
				}
			}
		}
		throw new Error(`qualityFromMagimins(${JSON.stringify(magimins)}) failed`);
	};
})();

module.exports = {qualityFromMagimins};
