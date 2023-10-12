import {Predicate} from "./filter-pipeline.js";
import {givens} from "./givens.js";
import {checkRecipeFromInventory} from "./inventory-can-make.js";
import {loadSpreadsheet} from "./load-csv.js";
import {recipeFromRow, RecipeRow} from "./recipe-from-row.js";
import {CAULDRON_SIZE_MAX} from "./type/cauldron.js";
import {Inventory} from "./type/inventory.js";
import {PotionName} from "./type/potion.js";
import {Recipe} from "./type/recipe.js";

/**
 * @function
 * @param {string} recipesFile
 * @param {Inventory} inventory
 * @param {number|undefined} [minIngredients]
 * @param {number|undefined} [maxIngredients]
 * @param {number|undefined} [maxMagimins]
 * @param {boolean|undefined} [ignoreStock]
 * @param {boolean|undefined} [matchInventory]
 * @param {Predicate.<PotionName>} [matchPotionName]
 * @param {Predicate.<Recipe>|undefined} [predicate]
 * @returns {{recipes: Recipe[], topIngredients: {[key: string]: number}, topMagimins: number, topRecipes: Recipe[]}}
 */
export const filterRecipesByInventory = (
	recipesFile,
	inventory,
	minIngredients = 2,
	maxIngredients = CAULDRON_SIZE_MAX,
	maxMagimins = givens.MAGIMINS_MAX,
	ignoreStock = false,
	matchInventory = false,
	matchPotionName = () => true,
	predicate = () => true,
) => {
	let topMagimins = 0;
	/** @type {{[key: string]: number}} */
	let topIngredients = {};
	/** @type {Recipe[]} */
	let topRecipes = [];
	let anyMatch = false;
	/** @type {Predicate.<Recipe>} */
	const matchInventoryCheck = matchInventory ? ((/**Recipe*/recipe) => {
		return recipe.ingredientNames.every((name) => name in inventory);
	}) : (() => true);
	const recipeChecker = checkRecipeFromInventory(inventory, ignoreStock, (recipe, need) => {
		if (!anyMatch && (recipe.magimins === topMagimins) && (!matchInventory || need in inventory)) {
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
			if (recipe.ingredientNames.length > maxIngredients || recipe.ingredientNames.length < minIngredients || recipe.magimins > maxMagimins || recipe.price == null || !matchPotionName(recipe.potionName) || !matchInventoryCheck(recipe)) {
				return undefined;
			}
			if (recipe.magimins > topMagimins) {
				topMagimins = recipe.magimins;
				if (topRecipes.length > 25) {
					topIngredients = {};
					topRecipes = topRecipes.length > 25 ? [] : topRecipes;
				}
			}
			if (!anyMatch && (recipe.magimins === topMagimins)) {
				topRecipes.push(recipe);
			}
			const viable = recipeChecker(recipe);
			const predicateResult = predicate(recipe);
			if (viable && !anyMatch && predicateResult) {
				anyMatch = true;
				topRecipes = [];
				topIngredients = {};
			}
			return viable && predicateResult ? recipe : undefined;
		});
	return {
		recipes,
		topIngredients,
		topMagimins,
		topRecipes,
	};
};
