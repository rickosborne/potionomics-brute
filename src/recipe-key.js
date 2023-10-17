const {Recipe} = require("./type/recipe");
const {Ingredient} = require("./type/ingredient");
const {givens} = require("./givens");

const COUNT_CHARS = " 1234567890!@#$".split("");

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
	/** @type {{key: string, count: number}[]} */
	const pairs = [];
	let lastKey = undefined;
	for (let key of keys) {
		if (lastKey === key) {
			pairs[pairs.length - 1].count++;
		} else {
			pairs.push({count: 1, key});
			lastKey = key;
		}
	}
	return pairs.map((p) => `${p.key}${COUNT_CHARS[p.count]}`).join("");
};

module.exports = {recipeKey};
