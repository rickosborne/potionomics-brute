import {IngredientName} from "./type/ingredient.js";
import {Inventory} from "./type/inventory.js";

/**
 * @param {IngredientName[]} ingredientNames
 * @returns {Inventory}
 */
export const groupIngredientNames = (ingredientNames) => {
    /** @type {{[key: string]: number}} */
    const counts = {};
    ingredientNames.forEach((name) => {
        counts[name] = (counts[name] ?? 0) + 1;
    });
    return counts;
};
