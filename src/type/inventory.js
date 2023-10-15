const {IngredientName} = require("./ingredient.js");

/**
 * @typedef InventoryRow
 * @type {object}
 * @property {string} Ingredient
 * @property {string} Name
 * @property {string} Quinn
 * @property {string} Stock
 */

/** @type {InventoryRow} */
let InventoryRow;

/**
 * @typedef InventoryItem
 * @type {object}
 * @property {IngredientName} ingredientName
 * @property {boolean} quinn
 * @property {number} stock
 */

/** @type {InventoryItem} */
let InventoryItem;

/**
 * @typedef Inventory
 * @type {{[key: IngredientName]: number}}
 */

/** @type {Inventory} */
let Inventory;

// noinspection JSUnusedAssignment
module.exports = {Inventory, InventoryItem, InventoryRow};
