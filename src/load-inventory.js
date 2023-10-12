import {givens} from "./givens.js";
import {inventoryItemFromInventoryRow} from "./inventory-item-from-inventory-row.js";
import {loadSpreadsheet} from "./load-csv.js";
import {Inventory, InventoryItem} from "./type/inventory.js";

/**
 * @typedef LoadInventory
 * @type {object}
 * @property {boolean} [quinnOnly]
 * @property {boolean} [stockedOnly]
 */

/** @type {LoadInventory} */
export let LoadInventory;


/**
 * @function
 * @param {string} filePath
 * @param {LoadInventory} config
 * @param {boolean=} [config.quinnOnly]
 * @param {boolean=} [config.stockedOnly]
 * @returns {Inventory}
 */
export const loadInventory = (filePath, config = {}) => {
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
