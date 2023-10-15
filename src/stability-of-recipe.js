const {expandPotion} = require("./expand-potion.js");
const {Potion} = require("./type/potion.js");
const {Recipe} = require("./type/recipe.js");

/**
 * @param {Potion} potion
 * @returns {function(Recipe):number}
 */
const stabilityOfRecipe = (potion) => {
	const {ratios} = expandPotion(potion);
	/**
	 * @param {Recipe} recipe
	 * @returns {number}
	 */
	return (recipe) => {
		const recipeSum = recipe.magimins;
		if (recipeSum === 0) {
			return 0;
		}
		let maxError = 0;
		ratios.forEach(({color, wantRatio}) => {
			const /** @type {number} */ recipeCount = recipe[color];
			const wantCount = recipeSum * wantRatio;
			const error = Math.abs(wantCount - recipeCount) / recipeSum;
			maxError = error > maxError ? error : maxError;
		});
		return 1 - maxError;
	};
};

module.exports = {stabilityOfRecipe};
