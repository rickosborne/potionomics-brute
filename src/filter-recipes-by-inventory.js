import {givens} from "./givens.js";
import {groupIngredientNames} from "./group-ingredients.js";
import {loadSpreadsheet} from "./load-csv.js";
import {recipeFromRow, RecipeRow} from "./recipe-from-row.js";
import {CAULDRON_SIZE_MAX} from "./type/cauldron.js";
import {Inventory} from "./type/inventory.js";
import {Recipe} from "./type/recipe.js";

/**
 * @function
 * @param {string} recipesFile
 * @param {Inventory} inventory
 * @param {number|undefined} [maxIngredients]
 * @param {number|undefined} [maxMagimins]
 * @returns {{recipes: Recipe[], topIngredients: {[key: string]: number}, topRecipes: Recipe[]}}
 */
export const filterRecipesByInventory = (recipesFile, inventory, maxIngredients, maxMagimins) => {
    const maxItems = maxIngredients ?? CAULDRON_SIZE_MAX;
    const magiminsMax = maxMagimins ?? givens.MAGIMINS_MAX;
    let topMagimins = 0;
    /** @type {{[key: string]: number}} */
    let topIngredients = {};
    /** @type {Recipe[]} */
    let topRecipes = [];
    let anyMatch = false;
    const recipes = loadSpreadsheet(
        recipesFile,
        /**
         * @param {RecipeRow} row
         * @returns {Recipe|undefined}
         */
        (row) => {
            const recipe = recipeFromRow(row);
            if (recipe.ingredientNames.length > maxItems || recipe.magimins > magiminsMax) {
                return undefined;
            }
            if (recipe.magimins > topMagimins) {
                topMagimins = recipe.magimins;
                topIngredients = {};
                topRecipes = [];
            }
            if (!anyMatch && (recipe.magimins === topMagimins)) {
                topRecipes.push(recipe);
            }
            const needs = groupIngredientNames(recipe.ingredientNames);
            const viable = Object.entries(needs)
                .filter(([name]) => {
                    if (!anyMatch && (recipe.magimins === topMagimins)) {
                        topIngredients[name] = (topIngredients[name] ?? 0) + 1;
                    }
                    return true;
                })
                .every(([name, need]) => {
                    const stock = inventory[name] ?? 0;
                    return stock >= need;
                });
            if (viable && !anyMatch) {
                anyMatch = true;
                topRecipes = [];
                topIngredients = {};
            }
            return viable ? recipe : undefined;
        });
    return {
        recipes,
        topIngredients,
        topRecipes,
    };
};
