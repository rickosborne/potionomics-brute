const {undefIfEmpty} = require("./is-empty.js");
const {intFrom, maybeIntFrom} = require("./spreadsheet-helpers.js");
const {Cauldron, CauldronsRow} = require("./type/cauldron.js");

/**
 * @param {CauldronsRow} row
 * @returns {Cauldron}
 */
const cauldronFromCauldronsRow = (row) => ({
	bestStars: intFrom(row.BestStars),
	bestTier: row.BestTier,
	description: row.Description,
	ingredientCost: undefIfEmpty(row.IngredientCost),
	maxIngredients: intFrom(row.MaxIngredients),
	maxMagimins: intFrom(row.MaxMagimins),
	name: row.Name,
	price: maybeIntFrom(row.Price),
	unlockDay: intFrom(row.UnlockDay),
});

module.exports = {cauldronFromCauldronsRow};
