const {IngredientName} = require("./ingredient.js");
const {TierName} = require("./tier.js");

/**
 * @typedef CauldronName
 * @type {string}
 */

/** @type {CauldronName} */
let CauldronName;

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
let CauldronsRow;

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
let Cauldron;

const CAULDRON_SIZE_MAX = 14;

// noinspection JSUnusedAssignment
module.exports = {Cauldron, CAULDRON_SIZE_MAX, CauldronName, CauldronsRow};
