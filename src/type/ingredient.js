import {Chapter} from "./chapter.js";
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
 * @property {IngredientType} type
 * @property {RarityName} rarity
 * @property {LocationName} location
 * @property {Chapter} earliestChapter
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
 * @property {string} name
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 * @property {string} price
 * @property {string} taste
 * @property {string} touch
 * @property {string} smell
 * @property {string} sight
 * @property {string} sound
 * @property {string} type
 * @property {string} rarity
 * @property {string} location
 * @property {string} earliestChapter
 */

/**
 * @type {IngredientsRow}
 */
export let IngredientsRow;
