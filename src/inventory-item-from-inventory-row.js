import {intFrom} from "./spreadsheet-helpers.js";
import {InventoryItem, InventoryRow} from "./type/inventory.js";

export const STOCK_PLENTY = 99;

/**
 * @function
 * @param {InventoryRow} row
 * @returns {InventoryItem}
 */
export const inventoryItemFromInventoryRow = (row) => ({
    ingredientName: row.Ingredient,
    stock: row.Stock === "" ? 0 : /^\d+/.test(row.Stock) ? intFrom(row.Stock) : STOCK_PLENTY,
});
