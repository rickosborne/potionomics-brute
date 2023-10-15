const {simpleColumn} = require("./spreadsheet-helpers.js");

/**
 * @type {[{name: string, toString:(function(*,string): string)}]}
 */
const INGREDIENTS_TSV_COLUMNS = [
	simpleColumn("name"),
	simpleColumn("A"),
	simpleColumn("B"),
	simpleColumn("C"),
	simpleColumn("D"),
	simpleColumn("E"),
	simpleColumn("price"),
	simpleColumn("taste"),
	simpleColumn("touch"),
	simpleColumn("smell"),
	simpleColumn("sight"),
	simpleColumn("sound"),
	simpleColumn("type"),
	simpleColumn("rarity"),
	simpleColumn("location"),
	simpleColumn("earliestChapter"),
];

module.exports = {INGREDIENTS_TSV_COLUMNS};
