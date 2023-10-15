const {isEmpty, undefIfEmpty} = require("./is-empty.js");
const {optional} = require("./optional.js");
const {Recipe} = require("./type/recipe.js");

/**
 * @typedef RecipeRow
 * @type {object}
 * @property {string} ingredient01
 * @property {string} ingredient02
 * @property {string} ingredient03
 * @property {string} ingredient04
 * @property {string} ingredient05
 * @property {string} ingredient06
 * @property {string} ingredient07
 * @property {string} ingredient08
 * @property {string} ingredient09
 * @property {string} ingredient10
 * @property {string} ingredient11
 * @property {string} ingredient12
 * @property {string} ingredient13
 * @property {string} ingredient14
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 * @property {string} ingredientCount
 * @property {string} magimins
 * @property {string} price
 * @property {string} taste
 * @property {string} touch
 * @property {string} smell
 * @property {string} sight
 * @property {string} sound
 * @property {string} earliestChapter
 * @property {string} potionName
 * @property {string} tier
 * @property {string} stars
 * @property {string} stability
 */

/**
 * @type {RecipeRow}
 */
let RecipeRow;

/**
 * @param {string|undefined|null}text
 * @returns {number|undefined}
 */
const intFromText = (text) => optional(undefIfEmpty(text))
	.map((t) => parseInt(t, 10))
	.orElse(undefined);

/**
 * @param {RecipeRow} row
 * @returns {Recipe}
 */
const recipeFromRow = (row) => ({
	A: parseInt(row.A, 10),
	B: parseInt(row.B, 10),
	C: parseInt(row.C, 10),
	D: parseInt(row.D, 10),
	E: parseInt(row.E, 10),
	earliestChapter: parseInt(row.earliestChapter, 10),
	ingredientCount: intFromText(row.ingredientCount),
	ingredientNames: [
		row.ingredient01,
		row.ingredient02,
		row.ingredient03,
		row.ingredient04,
		row.ingredient05,
		row.ingredient06,
		row.ingredient07,
		row.ingredient08,
		row.ingredient09,
		row.ingredient10,
		row.ingredient11,
		row.ingredient12,
		row.ingredient13,
		row.ingredient14,
	].filter((i) => !isEmpty(i)),
	magimins: intFromText(row.magimins),
	potionName: undefIfEmpty(row.potionName),
	price: intFromText(row.price),
	sight: row.sight,
	smell: row.smell,
	sound: row.sound,
	stability: optional(intFromText(row.stability)).map((n) => n / 1_000).orElse(undefined),
	stars: intFromText(row.stars),
	taste: row.taste,
	tier: intFromText(row.tier),
	touch: row.touch,
});

// noinspection JSUnusedAssignment
module.exports = {recipeFromRow, RecipeRow};
