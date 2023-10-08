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
 * @property {number} price
 * @property {boolean} anyBad
 * @property {number} priceMod
 * @property {IngredientType} type
 * @property {RarityName} rarity
 * @property {LocationName} location
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

/**
 * @typedef IngredientsRow
 * @type {object}
 * @property {string} Name
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 * @property {string} Price
 * @property {string} Taste
 * @property {string} Touch
 * @property {string} Smell
 * @property {string} Sight
 * @property {string} Sound
 * @property {string} PriceMod
 * @property {string} Type
 * @property {string} Rarity
 * @property {string} Location
 */

/**
 * @type {IngredientsRow}
 */
export let IngredientsRow;
