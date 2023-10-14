import {maybeBoolFrom} from "./bool-from.js";
import {maybeIntFrom} from "./spreadsheet-helpers.js";
import {InventoryItem, InventoryRow} from "./type/inventory.js";

export const STOCK_PLENTY = 99;

/**
 * @function
 * @param {InventoryRow} row
 * @returns {InventoryItem}
 */
export const inventoryItemFromInventoryRow = (row) => {
	const stock = maybeIntFrom(row.Stock) ?? 0;
	const quinn = maybeBoolFrom(row.Quinn) ?? (stock > 0);
	return {
		ingredientName: row.Ingredient ?? row.Name,
		quinn,
		stock,
	};
};
