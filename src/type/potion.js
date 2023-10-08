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
 * @property {number} earliestChapter
 * @property {number} [goalChapter]
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

/**
 * @typedef PotionsRow
 * @type {object}
 * @property {string} Name
 * @property {string} Category
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 * @property {string} EarliestChapter
 * @property {string} [GoalChapter]
 */

/**
 * @type {PotionsRow}
 */
export let PotionsRow;
