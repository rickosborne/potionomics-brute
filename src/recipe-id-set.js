const {givens} = require("./givens.js");
const {IngredientName} = require("./type/ingredient.js");
const {Recipe} = require("./type/recipe.js");

/**
 * @typedef RecipeSet
 * @type {object}
 * @property {function(Recipe|string[]):void} add
 * @property {function(Recipe|string[]):boolean} has
 */

/** @type {RecipeSet} */
let RecipeSet;

/**
 * @function
 * @returns {RecipeSet}
 */
const recipeSet = () => {
	const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".split("");
	const pairs = chars.flatMap((a) => chars.map((b) => `${a}${b}`));
	/** @type {Map.<IngredientName,string>} */
	const ingredientIds = givens.ingredients.reduce((p, c, index) => {
		p.set(c.name, pairs[index]);
		return p;
	}, new Map());
	const recipeId = (recipe) => {
		const ingredientNames = Array.isArray(recipe) ? recipe : recipe.ingredientNames;
		return ingredientNames.map((name) => ingredientIds.get(name)).join("");
	};
	/** @type {Set.<string>} */
	const ids = new Set();
	return {
		add: (/**Recipe*/recipe) => {
			ids.add(recipeId(recipe));
		},
		has: (/**Recipe*/recipe) => {
			return ids.has(recipeId(recipe));
		},
	};
};

// noinspection JSUnusedAssignment
module.exports = {recipeSet, RecipeSet};
