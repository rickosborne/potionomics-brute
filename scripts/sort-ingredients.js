const {Comparator, comparatorBuilder, ComparatorBuilder} = require("../src/comparator.js");
const {givens} = require("../src/givens.js");
const {INGREDIENTS_TSV_COLUMNS} = require("../src/ingredients-tsv.js");
const {spreadsheetStream} = require("../src/spreadsheet-stream.js");
const {Ingredient} = require("../src/type/ingredient.js");

const locations = givens.locations;
const locationOrder = Object.fromEntries(locations.map((l, order) => [l.name, order]));
/** @type {ComparatorBuilder.<Ingredient>} */
const builder = comparatorBuilder();
/** @type {Comparator.<Ingredient>} */
const comparator = builder
	.numbers((i) => locationOrder[i.location])
	.numbers((i) => i.magimins)
	.strings((i) => i.name)
	.build();
const ingredients = givens.ingredients.slice().sort(comparator);
const sorted = spreadsheetStream(`data/ingredients.tsv`, INGREDIENTS_TSV_COLUMNS);
ingredients.forEach((ingredient) => {
	sorted.write(ingredient);
});
