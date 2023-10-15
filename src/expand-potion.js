const {Color, COLORS} = require("./type/color.js");
const {ExpandedPotion, Potion} = require("./type/potion.js");

/**
 * @function
 * @param {Potion} potion
 * @returns {ExpandedPotion}
 */
const expandPotion = (potion) => {
	const wantSum = potion.A + potion.B + potion.C + potion.D + potion.E;
	return ({
		...potion,
		ratios: COLORS.map((color) => ({
			/** @type {Color} */
			color,
			/** @type {number} */
			wantRatio: potion[color] / wantSum,
		})),
		wantSum,
	});
};

module.exports = {expandPotion};
