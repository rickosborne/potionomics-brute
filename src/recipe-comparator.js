const {Comparator, comparatorBuilder, ComparatorBuilder} = require("./comparator.js");
const {Recipe} = require("./type/recipe.js");

/**
 *
 * @returns {Comparator.<Recipe>}
 */
const sortRecipesTopMagimin = () => {
	/** @type {ComparatorBuilder.<Recipe>} */
	const recipeSortBuilder = comparatorBuilder();
	/** @type {Comparator.<Recipe>} */
	return recipeSortBuilder
		.numbers((recipe) => recipe.magimins).reversed()
		.numbers((/**Recipe*/recipe) => recipe.price)
		.numbers((/**Recipe*/recipe) => recipe.ingredientCount)
		.build();
};

module.exports = {sortRecipesTopMagimin};
