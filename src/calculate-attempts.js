const {givens} = require("./givens");
const {COLORS, Color} = require("./type/color");
const {Ingredient} = require("./type/ingredient");
const {Potion} = require("./type/potion");
const {multiChooseCount} = require("./combinations");

/**
 * @typedef CalculateAttemptsConfig
 * @type {object}
 * @property {number} [chapter]
 * @property {Ingredient[]} [ingredients]
 * @property {number} [ingredientCount]
 * @property {string[]} [ingredientNames]
 * @property {number} itemCount
 * @property {boolean} [logging]
 * @property {Potion[]} [potions]
 * @property {string[]} [potionNames]
 */

/** @type {CalculateAttemptsConfig} */
let CalculateAttemptsConfig;

/**
 * @param {CalculateAttemptsConfig} config
 * @returns {number}
 */
const calculateAttempts = (config = {}) => {
	let {ingredientCount, itemCount, logging} = config;
	if (ingredientCount == null) {
		let ingredients = config.ingredients ?? givens.ingredients;
		if (Array.isArray(config.ingredientNames)) {
			ingredients = ingredients.filter((i) => config.ingredientNames.includes(i.name));
		}
		if (typeof config.chapter === "number") {
			ingredients = ingredients.filter((i) => config.chapter >= i.earliestChapter);
		}
		let potions = config.potions ?? givens.potions;
		if (Array.isArray(config.potionNames)) {
			potions = potions.filter((p) => config.potionNames.includes(p.name));
		}
		/** @type {Record.<Color, boolean>} */
		const wantColors = Object.fromEntries(COLORS.map((c) => [c, false]));
		potions.forEach((potion) => {
			COLORS.forEach((color) => {
				if (potion[color] > 0) {
					wantColors[color] = true;
				}
			});
		});
		const colorsUnwanted = COLORS.filter((color) => !wantColors[color]);
		if (colorsUnwanted.length > 0) {
			ingredients = ingredients.filter((i) => {
				return colorsUnwanted.every((color) => i[color] === 0);
			});
		}
		ingredientCount = ingredients.length;
	}
	if (ingredientCount < 1 || itemCount == null || itemCount < 1) {
		return 0;
	}
	return multiChooseCount(ingredientCount, config.itemCount, logging ?? false);
};

// noinspection JSUnusedAssignment
module.exports = {calculateAttempts, CalculateAttemptsConfig};
