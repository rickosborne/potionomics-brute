import {Comparator, comparatorBuilder, ComparatorBuilder} from "./comparator.js";
import {Recipe} from "./type/recipe.js";

/**
 *
 * @returns {Comparator.<Recipe>}
 */
export const sortRecipesTopMagimin = () => {
	/** @type {ComparatorBuilder.<Recipe>} */
	const recipeSortBuilder = comparatorBuilder();
	/** @type {Comparator.<Recipe>} */
	return recipeSortBuilder
		.numbers((recipe) => recipe.magimins).reversed()
		.numbers((/**Recipe*/recipe) => recipe.price)
		.numbers((/**Recipe*/recipe) => recipe.ingredientCount)
		.build();
};
