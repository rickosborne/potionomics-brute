const {givens} = require("./givens.js");
const {inventoryItemFromInventoryRow} = require("./inventory-item-from-inventory-row.js");
const {loadSpreadsheet} = require("./load-csv.js");
const {Inventory, InventoryItem} = require("./type/inventory.js");

/**
 * @typedef LoadInventory
 * @type {object}
 * @property {boolean} [quinnOnly]
 * @property {boolean} [stockedOnly]
 */

/** @type {LoadInventory} */
let LoadInventory;


/**
 * @function
 * @param {string} filePath
 * @param {LoadInventory} config
 * @param {boolean=} [config.quinnOnly]
 * @param {boolean=} [config.stockedOnly]
 * @returns {Inventory}
 */
const loadInventory = (filePath, config = {}) => {
	const quinnOnly = config.quinnOnly ?? true;
	const stockedOnly = config.stockedOnly ?? false;
	/** @type {InventoryItem[]} */
	const items = loadSpreadsheet(filePath, inventoryItemFromInventoryRow);
	return Object.fromEntries(items
		.filter((item) => {
			const ingredient = givens.ingredients.find((ingredient) => ingredient.name === item.ingredientName);
			if (ingredient == null) {
				throw new Error(`Unknown item in inventory: ${JSON.stringify(item.ingredientName)}`);
			}
			if (quinnOnly && !item.quinn) {
				return false;
			}
			return !stockedOnly || (item.stock > 0);
		})
		.map((item) => [item.ingredientName, item.stock]));
};

// noinspection JSUnusedAssignment
module.exports = {loadInventory, LoadInventory};
