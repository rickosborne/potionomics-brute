const {givens} = require("./givens.js");
const {groupIngredientNames} = require("./group-ingredients.js");
const {priceModForRecipe} = require("./price-mod-for-recipe.js");
const {rarityForRecipe} = require("./rarity-for-recipe.js");
const {COLORS} = require("./type/color.js");
const {Recipe} = require("./type/recipe.js");

/**
 * @param {Recipe} recipe
 * @returns {string}
 */
const formatRecipe = (recipe) => {
	const needs = Object.entries(groupIngredientNames(recipe.ingredientNames))
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([name, count]) => `${count}x${name}`)
		.join(" + ");
	const tier = givens.tierNames[recipe.tier];
	const priceMod = priceModForRecipe(recipe);
	const rarity = rarityForRecipe(recipe);
	const stats = COLORS.map((color) => recipe[color]).join(" ");
	return `${recipe.magimins}mm ${recipe.stars}⭐️ ${tier} ${priceMod.mods} ${recipe.potionName} for ${priceMod.price}, ${rarity.rarityName}: ${stats}\n\t${needs}`;
};

module.exports = {formatRecipe};
