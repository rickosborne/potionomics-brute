import {cauldronFromCauldronsRow} from "./cauldron-from-cauldrons-row.js";
import {ingredientFromIngredientsRow} from "./ingredient-from-ingredients-row.js";
import {loadSpreadsheet} from "./load-csv.js";
import {locationFromLocationsRow} from "./location-from-locations-row.js";
import {potionFromPotionsRow} from "./potion-from-potions-row.js";
import {readJsonSync} from "./read-json-sync.js";
import {Cauldron} from "./type/cauldron.js";
import {Ingredient} from "./type/ingredient.js";
import {Location} from "./type/location.js";
import {Potion} from "./type/potion.js";
import {QualityTier, TierName} from "./type/tier.js";

/**
 * @typedef Givens
 * @type {object}
 * @property {Cauldron[]} cauldrons
 * @property {Ingredient[]} ingredients
 * @property {Location[]} locations
 * @property {Potion[]} potions
 * @property {QualityTier[]} qualityTiers
 * @property {TierName[]} tierNames
 */

/** @type {Givens} */
export let Givens;

/** @type {Givens} */
export const givens = (() => {
	/** @type {Cauldron[]|undefined} */
	let cauldrons;
	/** @type {Ingredient[]|undefined} */
	let ingredients;
	/** @type {Location[]|undefined} */
	let locations;
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
		/** @returns {Ingredient[]} */
		get ingredients() {
			ingredients ??= Object.freeze(loadSpreadsheet("data/ingredients-list.tsv", ingredientFromIngredientsRow));
			return ingredients;
		},
		/** @returns {Location[]} */
		get locations() {
			locations ??= Object.freeze(loadSpreadsheet("data/locations.tsv", locationFromLocationsRow));
			return locations;
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
