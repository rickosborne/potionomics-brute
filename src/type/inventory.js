import {IngredientName} from "./ingredient.js";

/**
 * @typedef InventoryRow
 * @type {object}
 * @property {string} Ingredient
 * @property {string} Stock
 */

/** @type {InventoryRow} */
export let InventoryRow;

/**
 * @typedef InventoryItem
 * @type {object}
 * @property {IngredientName} ingredientName
 * @property {number} stock
 */

/** @type {InventoryItem} */
export let InventoryItem;

/**
 * @typedef Inventory
 * @type {{[key: IngredientName]: number}}
 */

/** @type {Inventory} */
export let Inventory;
