import {undefIfEmpty} from "./is-empty.js";
import {optional} from "./optional.js";
import {Recipe} from "./type/recipe.js";

/**
 * @typedef RecipeRow
 * @type {object}
 * @property {string} key
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 * @property {string} ingredientCount
 * @property {string} magimins
 * @property {string} price
 * @property {string} priceMod
 * @property {string} anyBad
 * @property {string} taste
 * @property {string} touch
 * @property {string} smell
 * @property {string} sight
 * @property {string} sound
 * @property {string} potionName
 * @property {string} tier
 * @property {string} stars
 * @property {string} stability
 */

/**
 * @type {RecipeRow}
 */
export let RecipeRow;

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
export const recipeFromRow = (row) => ({
    A: parseInt(row.A, 10),
    anyBad: optional(undefIfEmpty(row.anyBad)).map((t) => t === "true").orElse(undefined),
    B: parseInt(row.B, 10),
    C: parseInt(row.C, 10),
    D: parseInt(row.D, 10),
    E: parseInt(row.E, 10),
    ingredientCount: intFromText(row.ingredientCount),
    ingredientNames: row.key.split("+"),
    key: undefIfEmpty(row.key),
    magimins: intFromText(row.ingredientCount),
    potionName: undefIfEmpty(row.potionName),
    price: intFromText(row.price),
    priceMod: intFromText(row.priceMod),
    sight: undefIfEmpty(row.sight),
    smell: undefIfEmpty(row.smell),
    sound: undefIfEmpty(row.sound),
    stability: optional(intFromText(row.ingredientCount)).map((n) => n / 1_000).orElse(undefined),
    stars: intFromText(row.stars),
    taste: undefIfEmpty(row.taste),
    tier: intFromText(row.tier),
    touch: undefIfEmpty(row.touch),
});
