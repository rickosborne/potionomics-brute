import {IngredientName} from "./ingredient.js";
import {PotionName} from "./potion.js";
import {Stars, Tier} from "./quality.js";
import {NEUTRAL, Sensation} from "./sense.js";

/**
 * @typedef Recipe
 * @type {object}
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 * @property {number} ingredientCount
 * @property {IngredientName[]} ingredientNames
 * @property {number} magimins
 * @property {number|undefined} price
 * @property {number|undefined} priceMod
 * @property {boolean} anyBad
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {Sensation} smell
 * @property {Sensation} sight
 * @property {Sensation} sound
 * @property {string} [key]
 * @property {PotionName} [potionName]
 * @property {Tier} [tier]
 * @property {Stars} [stars]
 * @property {number} [stability]
 */

/**
 * @type {Recipe}
 */
export let Recipe;

/**
 * @type {Recipe}
 */
export const EMPTY_RECIPE = Object.freeze({
    A: 0,
    anyBad: false,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    ingredientCount: 0,
    ingredientNames: [],
    magimins: 0,
    price: 0,
    priceMod: 0,
    sight: NEUTRAL,
    smell: NEUTRAL,
    sound: NEUTRAL,
    taste: NEUTRAL,
    touch: NEUTRAL,
});
