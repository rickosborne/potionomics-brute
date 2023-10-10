import {groupIngredientNames} from "./group-ingredients.js";
import {Inventory} from "./type/inventory.js";
import {Recipe} from "./type/recipe.js";

/**
 * @typedef RecipeChecker
 * @type {function(Recipe):boolean}
 */

/** @type {RecipeChecker} */
export let RecipeChecker;

/**
 * @param {Inventory} inventory
 * @param {boolean|undefined} [ignoreStock]
 * @param {function(Recipe,string,number):void} onNeed
 * @returns {RecipeChecker}
 */
export const checkRecipeFromInventory = (inventory, ignoreStock = false, onNeed = undefined) => {
    return (recipe) => {
        const needs = groupIngredientNames(recipe.ingredientNames);
        let entries = Object.entries(needs);
        if (onNeed != null) {
            entries.forEach((entry) => onNeed(recipe, entry[0], entry[1]));
        }
        return entries.every(([name, need]) => {
            const stock = inventory[name] ?? 0;
            return (ignoreStock && stock != null) || (stock >= need);
        });
    };
};

/**
 * @param {Inventory} inventory
 * @param {Recipe} recipe
 * @param {boolean|undefined} [ignoreStock]
 * @returns {boolean}
 */
export const inventoryCanMake = (inventory, recipe, ignoreStock = false) => {
    return checkRecipeFromInventory(inventory, ignoreStock)(recipe);
};
