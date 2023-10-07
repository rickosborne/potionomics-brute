import {LocationName} from "./location.js";
import {Magical} from "./magical.js";
import {RarityName} from "./rarity.js";
import {Sensation} from "./sense.js";

/**
 * @typedef IngredientName
 * @type {string}
 */

/**
 * @type {IngredientName}
 */
export let IngredientName;

/**
 * @typedef IngredientType
 * @type {string}
 */

/**
 * @type {IngredientType}
 */
export let IngredientType;

/**
 * @typedef Ingredient
 * @type {object}
 * @augments Magical
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 * @property {IngredientName} name
 * @property {number} magimins
 * @property {?(number|undefined)} price
 * @property {boolean} anyBad
 * @property {number} priceMod
 * @property {?(IngredientType|undefined)} type
 * @property {?(RarityName|undefined)} rarity
 * @property {?(LocationName|undefined)} location
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {Sensation} smell
 * @property {Sensation} sight
 * @property {Sensation} sound
 */

/**
 * @type {Ingredient}
 */
export let Ingredient;
