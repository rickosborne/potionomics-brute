import {Predicate} from "./filter-pipeline.js";
import {givens} from "./givens.js";
import {checkRecipeFromInventory} from "./inventory-can-make.js";
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
 * @param {boolean|undefined} [ignoreStock]
 * @param {Predicate.<Recipe>|undefined} [predicate]
 * @returns {{recipes: Recipe[], topIngredients: {[key: string]: number}, topRecipes: Recipe[]}}
 */
export const filterRecipesByInventory = (
    recipesFile,
    inventory,
    maxIngredients = CAULDRON_SIZE_MAX,
    maxMagimins = givens.MAGIMINS_MAX,
    ignoreStock = false,
    predicate = () => true,
) => {
    let topMagimins = 0;
    /** @type {{[key: string]: number}} */
    let topIngredients = {};
    /** @type {Recipe[]} */
    let topRecipes = [];
    let anyMatch = false;
    const recipeChecker = checkRecipeFromInventory(inventory, ignoreStock, (recipe, need) => {
        if (!anyMatch && (recipe.magimins === topMagimins)) {
            topIngredients[need] = (topIngredients[need] ?? 0) + 1;
        }
    });
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
            const viable = recipeChecker(recipe);
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
