const {cauldronFromCauldronsRow} = require("./cauldron-from-cauldrons-row.js");
const {ingredientFromIngredientsRow} = require("./ingredient-from-ingredients-row.js");
const {loadSpreadsheet} = require("./load-csv.js");
const {locationFromLocationsRow} = require("./location-from-locations-row.js");
const {potionFromPotionsRow} = require("./potion-from-potions-row.js");
const {readJsonSync} = require("./read-json-sync.js");
const {Cauldron, CAULDRON_SIZE_MAX} = require("./type/cauldron.js");
const {Chapter} = require("./type/chapter.js");
const {Ingredient} = require("./type/ingredient.js");
const {Location} = require("./type/location.js");
const {Potion} = require("./type/potion.js");
const {QualityTier, TierName} = require("./type/tier.js");

/**
 * @typedef Givens
 * @type {object}
 * @property {Cauldron[]} cauldrons
 * @property {{[key: LocationName]: Chapter}} chaptersByLocation
 * @property {Ingredient[]} ingredients
 * @property {Record.<string, Ingredient>} ingredientsByKey
 * @property {Record.<string, Ingredient>} ingredientsByName
 * @property {Location[]} locations
 * @property {number} MAGIMINS_MAX
 * @property {Potion[]} potions
 * @property {QualityTier[]} qualityTiers
 * @property {TierName[]} tierNames
 */

/** @type {Givens} */
let Givens;

/** @type {Givens} */
const givens = (() => {
	/** @type {Cauldron[]|undefined} */
	let cauldrons;
	/** @type {{[key: LocationName]: Chapter}} */
	let chaptersByLocation;
	/** @type {Ingredient[]|undefined} */
	let ingredients;
	/** @type {Record.<string, Ingredient>|undefined} */
	let ingredientsByName;
	/** @type {Record.<string, Ingredient>|undefined} */
	let ingredientsByKey;
	/** @type {Location[]|undefined} */
	let locations;
	/** @type {number|undefined} */
	let MAGIMINS_MAX;
	/** @type {Potion[]|undefined} */
	let potions;
	/** @type {QualityTier[]|undefined} */
	let qualityTiers;
	/** @type {TierName[]|undefined} */
	let tierNames;
	const _givens = Object.freeze({
		/** @returns {Cauldron[]} */
		get cauldrons() {
			cauldrons ??= Object.freeze(loadSpreadsheet("data/cauldrons.tsv", cauldronFromCauldronsRow));
			return cauldrons;
		},
		/** @returns {{[key: LocationName]: Chapter}} */
		get chaptersByLocation() {
			chaptersByLocation ??= Object.fromEntries(_givens.locations.map((l) => [l.name, l.chapter]));
			return chaptersByLocation;
		},
		/** @returns {Ingredient[]} */
		get ingredients() {
			ingredients ??= Object.freeze(loadSpreadsheet("data/ingredients.tsv", ingredientFromIngredientsRow));
			return ingredients;
		},
		/** @returns {Record.<string, Ingredient>} */
		get ingredientsByKey() {
			ingredientsByKey ??= Object.freeze(Object.fromEntries(_givens.ingredients.map((i) => [i.key, i])));
			return ingredientsByKey;
		},
		/** @returns {Record.<string, Ingredient>} */
		get ingredientsByName() {
			ingredientsByName ??= Object.freeze(Object.fromEntries(_givens.ingredients.map((i) => [i.name, i])));
			return ingredientsByName;
		},
		/** @returns {Location[]} */
		get locations() {
			locations ??= Object.freeze(loadSpreadsheet("data/locations.tsv", locationFromLocationsRow));
			return locations;
		},
		/** @returns {number} */
		get MAGIMINS_MAX() {
			MAGIMINS_MAX ??= _givens.ingredients.map((i) => i.magimins).reduce((p, c) => Math.max(p, c)) * CAULDRON_SIZE_MAX;
			return MAGIMINS_MAX;
		},
		/** @returns {Potion[]} */
		get potions() {
			potions ??= Object.freeze(loadSpreadsheet("data/potions.tsv", potionFromPotionsRow));
			return potions;
		},
		/** @returns {QualityTier[]} */
		get qualityTiers() {
			qualityTiers ??= Object.freeze(readJsonSync("data/quality-tiers.json"));
			return qualityTiers;
		},
		/** @returns {TierName[]} */
		get tierNames() {
			tierNames ??= Object.freeze(_givens.qualityTiers.map((tier) => tier.name));
			return tierNames;
		},
	});
	return _givens;
})();

// noinspection JSUnusedAssignment
module.exports = {
	givens,
	Givens,
};
