import {givens} from "./givens.js";
import {inventoryItemFromInventoryRow} from "./inventory-item-from-inventory-row.js";
import {loadSpreadsheet} from "./load-csv.js";
import {Inventory, InventoryItem} from "./type/inventory.js";

/**
 * @function
 * @param {string} filePath
 * @returns {Inventory}
 */
export const loadInventory = (filePath) => {
    /** @type {InventoryItem[]} */
    const items = loadSpreadsheet(filePath, inventoryItemFromInventoryRow);
    return Object.fromEntries(items
        .filter((item) => {
            const ingredient = givens.ingredients.find((ingredient) => ingredient.name === item.ingredientName);
            if (ingredient == null) {
                throw new Error(`Unknown item in inventory: ${JSON.stringify(item.ingredientName)}`);
            }
            return item.stock > 0;
        })
        .map((item) => [item.ingredientName, item.stock]));
};
