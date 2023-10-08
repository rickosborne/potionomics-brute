import {Chapter} from "./chapter.js";
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
 * @property {number} price
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {Sensation} smell
 * @property {Sensation} sight
 * @property {Sensation} sound
 * @property {Chapter} earliestChapter
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
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    earliestChapter: 1,
    ingredientCount: 0,
    ingredientNames: [],
    magimins: 0,
    price: 0,
    sight: NEUTRAL,
    smell: NEUTRAL,
    sound: NEUTRAL,
    taste: NEUTRAL,
    touch: NEUTRAL,
});
