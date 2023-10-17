const {Recipe} = require("./type/recipe");
const {Ingredient} = require("./type/ingredient");
const {givens} = require("./givens");

/**
 * @param {Recipe|string[]|Ingredient[]} known
 * @returns {string}
 */
const recipeKey = (known) => {
	let ingredients;
	if (Array.isArray(known)) {
		ingredients = known.map((k) => typeof k === "string" ? givens.ingredientsByName[k] : k);
	} else if ("ingredientNames" in known) {
		if (typeof known.key === "string" && known.key !== "") {
			return known.key;
		}
		ingredients = known.ingredientNames.map((name) => givens.ingredientsByName[name]);
	} else {
		throw new Error(`recipeKeyFromIngredients: bad known: ${JSON.stringify(known)}`);
	}
	if (ingredients.length === 0) {
		return "";
	}
	const keys = ingredients.map((i) => {
		if (i == null || typeof i.key != "string") {
			throw new Error(`recipeKeyFromIngredients: bad ingredients: ${JSON.stringify(ingredients)}`);
		}
		return i.key;
	}).sort();
	const pairs = [];
	let lastKey = undefined;
	for (let key of keys) {
		if (lastKey === key) {
			pairs[pairs.length - 1]++;
		} else {
			pairs.push(key);
			pairs.push(1);
			lastKey = key;
		}
	}
	return pairs.join("");
};

module.exports = {recipeKey};
