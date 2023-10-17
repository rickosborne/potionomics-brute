const {givens} = require("./givens.js");
const {RARITY_NAME_BY_NUM, RARITY_NUM_BY_NAME, RarityName} = require("./type/rarity.js");
const {Recipe} = require("./type/recipe.js");

/**
 *
 * @param {Recipe} recipe
 * @returns {{rarity: number, rarityName: RarityName}}
 */
const rarityForRecipe = (recipe) => {
	const rarity = recipe.ingredientNames.map((name) => givens.ingredientsByName[name].rarity)
		.map((rarity) => RARITY_NUM_BY_NAME[rarity])
		.reduce((p, c) => Math.max(p, c));
	const rarityName = RARITY_NAME_BY_NUM[rarity];
	return {rarity, rarityName};
};

module.exports = {rarityForRecipe};
