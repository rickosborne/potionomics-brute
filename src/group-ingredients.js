const {IngredientName} = require("./type/ingredient.js");
const {Inventory} = require("./type/inventory.js");

/**
 * @param {IngredientName[]} ingredientNames
 * @returns {Inventory}
 */
const groupIngredientNames = (ingredientNames) => {
	/** @type {{[key: string]: number}} */
	const counts = {};
	ingredientNames.forEach((name) => {
		counts[name] = (counts[name] ?? 0) + 1;
	});
	return counts;
};

module.exports = {groupIngredientNames};
