const {intFrom, maybeIntFrom} = require("./spreadsheet-helpers.js");
const {Potion, PotionsRow} = require("./type/potion.js");

/**
 * @function
 * @param {PotionsRow} row
 * @returns {Potion}
 */
const potionFromPotionsRow = (row) => ({
	A: intFrom(row.A),
	B: intFrom(row.B),
	C: intFrom(row.C),
	category: row.Category,
	D: intFrom(row.D),
	E: intFrom(row.E),
	earliestChapter: intFrom(row.EarliestChapter),
	goalChapter: maybeIntFrom(row.GoalChapter),
	name: row.Name,
});

module.exports = {potionFromPotionsRow};
