const {maybeBoolFrom} = require("./bool-from.js");
const {maybeIntFrom} = require("./spreadsheet-helpers.js");
const {InventoryItem, InventoryRow} = require("./type/inventory.js");

const STOCK_PLENTY = 99;

/**
 * @function
 * @param {InventoryRow} row
 * @returns {InventoryItem}
 */
const inventoryItemFromInventoryRow = (row) => {
	const stock = maybeIntFrom(row.Stock) ?? 0;
	const quinn = maybeBoolFrom(row.Quinn) ?? (stock > 0);
	return {
		ingredientName: row.Ingredient ?? row.Name,
		quinn,
		stock,
	};
};

module.exports = {inventoryItemFromInventoryRow, STOCK_PLENTY};
