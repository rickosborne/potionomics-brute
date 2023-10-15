const {combineSensations} = require("./combine-sensations.js");
const {maybeAdd} = require("./maybe-add.js");
const {Ingredient} = require("./type/ingredient.js");
const {Recipe} = require("./type/recipe.js");

/**
 * @function
 * @param {Recipe} recipe
 * @param {Ingredient} ingredient
 * @returns {Recipe}
 */
const addIngredient = (recipe, ingredient) => {
	const taste = combineSensations(recipe.taste, ingredient.taste);
	const touch = combineSensations(recipe.touch, ingredient.touch);
	const sight = combineSensations(recipe.sight, ingredient.sight);
	const smell = combineSensations(recipe.smell, ingredient.smell);
	const sound = combineSensations(recipe.sound, ingredient.sound);
	return {
		A: recipe.A + ingredient.A,
		B: recipe.B + ingredient.B,
		C: recipe.C + ingredient.C,
		D: recipe.D + ingredient.D,
		E: recipe.E + ingredient.E,
		earliestChapter: Math.max(recipe.earliestChapter, ingredient.earliestChapter),
		ingredientCount: recipe.ingredientCount + 1,
		ingredientNames: recipe.ingredientNames.concat(ingredient.name),
		magimins: recipe.magimins + ingredient.magimins,
		price: maybeAdd(recipe.price, ingredient.price),
		sight,
		smell,
		sound,
		taste,
		touch,
	};
};

module.exports = {addIngredient};
