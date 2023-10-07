import {ingredientFromIngredientsRow} from "./ingredient-from-ingredients-row.js";
import {loadSpreadsheet} from "./load-csv.js";
import {potionFromPotionsRow} from "./potion-from-potions-row.js";
import {readJsonSync} from "./read-json-sync.js";
import {ChapterLocations} from "./type/chapter-locations.js";
import {Potion} from "./type/potion.js";
import {QualityTier, TierName} from "./type/tier.js";
import {Ingredient} from "./type/ingredient.js";

/**
 * @typedef Givens
 * @type {object}
 * @property {ChapterLocations} chapterLocations
 * @property {Ingredient[]} ingredients
 * @property {Potion[]} potions
 * @property {QualityTier[]} qualityTiers
 * @property {TierName[]} tierNames
 */

/** @type {Givens} */
export let Givens;

/** @type {Givens} */
export const givens = (() => {
    /** @type {ChapterLocations|undefined} */
    let chapterLocations;
    /** @type {Ingredient[]|undefined} */
    let ingredients;
    /** @type {Potion[]|undefined} */
    let potions;
    /** @type {QualityTier[]|undefined} */
    let qualityTiers;
    /** @type {TierName[]|undefined} */
    let tierNames;
    const _givens = Object.freeze({
        /** @returns {ChapterLocations} */
        get chapterLocations() {
            chapterLocations ??= Object.freeze(readJsonSync("data/chapter-locations.json"));
            return chapterLocations;
        },
        get ingredients() {
            ingredients ??= Object.freeze(loadSpreadsheet("data/ingredients-list.tsv", ingredientFromIngredientsRow));
            return ingredients;
        },
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
