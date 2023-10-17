const {givens} = require("./givens");
const {COLORS, Color} = require("./type/color");
const {Ingredient} = require("./type/ingredient");
const {Potion} = require("./type/potion");
const {multiChooseCount} = require("./combinations");

/**
 * @typedef CalculateSpaceConfig
 * @type {object}
 * @property {number} [chapter]
 * @property {Ingredient[]} [ingredients]
 * @property {string[]} [ingredientNames]
 * @property {number} itemCount
 * @property {boolean} [logging]
 * @property {Potion[]} [potions]
 * @property {string[]} [potionNames]
 */

/** @type {CalculateSpaceConfig} */
let CalculateSpaceConfig;

/**
 * @typedef BruteSpace
 * @type {object}
 * @property {number} combinations
 * @property {string} key
 */

/** @type {BruteSpace} */
let BruteSpace;

/**
 * @param {CalculateSpaceConfig} config
 * @returns {BruteSpace}
 */
const calculateSpace = (config = {}) => {
	let {itemCount, logging} = config;
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
	const key = [
		potions.map((p) => p.key).sort().join(""),
		itemCount,
		ingredients.map((i) => i.key).sort().join(""),
	].join("-");
	const ingredientCount = ingredients.length;
	let combinations = 0;
	if (ingredientCount > 0 && itemCount > 0) {
		combinations = multiChooseCount(ingredientCount, itemCount, logging ?? false);
	}
	return {
		combinations,
		key,
	};
};

// noinspection JSUnusedAssignment
module.exports = {BruteSpace, calculateSpace, CalculateSpaceConfig};
