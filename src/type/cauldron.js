import {IngredientName} from "./ingredient.js";
import {TierName} from "./tier.js";

/**
 * @typedef CauldronName
 * @type {string}
 */

/** @type {CauldronName} */
export let CauldronName;

/**
 * @typedef CauldronsRow
 * @type {object}
 * @property {string} Name
 * @property {string} Price
 * @property {string} IngredientCost
 * @property {string} MaxIngredients
 * @property {string} MaxMagimins
 * @property {string} UnlockDay
 * @property {string} Description
 * @property {string} BestTier
 * @property {string} BestStars
 */

/** @type {CauldronsRow} */
export let CauldronsRow;

/**
 * @typedef Cauldron
 * @type {object}
 * @property {CauldronName} name
 * @property {number} [price]
 * @property {IngredientName} [ingredientCost]
 * @property {number} maxIngredients
 * @property {number} maxMagimins
 * @property {number} unlockDay
 * @property {TierName} bestTier
 * @property {number} bestStars
 * @property {string} description
 */
/** @type {Cauldron} */
export let Cauldron;
