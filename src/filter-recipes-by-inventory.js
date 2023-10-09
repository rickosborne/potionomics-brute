import {Predicate} from "./filter-pipeline.js";
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
 * @param {Predicate.<Recipe>|undefined} [predicate]
 * @returns {{recipes: Recipe[], topIngredients: {[key: string]: number}, topRecipes: Recipe[]}}
 */
export const filterRecipesByInventory = (
    recipesFile,
    inventory,
    maxIngredients = CAULDRON_SIZE_MAX,
    maxMagimins = givens.MAGIMINS_MAX,
    predicate = () => true,
) => {
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
            if (recipe.ingredientNames.length > maxIngredients || recipe.magimins > maxMagimins) {
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
            return viable && predicate(recipe) ? recipe : undefined;
        });
    return {
        recipes,
        topIngredients,
        topRecipes,
    };
};
