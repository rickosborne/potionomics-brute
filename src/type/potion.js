import {Color} from "./color.js";

/**
 * @typedef PotionName
 * @type {string}
 */

/**
 * @type {PotionName}
 */
export let PotionName;

/**
 * @typedef PotionCategory
 * @type {string}
 */

/**
 * @type {PotionCategory}
 */
export let PotionCategory;

/**
 * @typedef Potion
 * @type {object}
 * @property {PotionName} name
 * @property {PotionCategory} category
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 */

/**
 * @type {Potion}
 */
export let Potion;

/**
 * @typedef ExpandedPotion
 * @augments {Potion}
 * @property {number} wantSum
 * @property {{color: Color, wantRatio: number}[]} ratios
 */

/**
 * @type {ExpandedPotion}
 */
export let ExpandedPotion;
