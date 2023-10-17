const {Color} = require("./color.js");

/**
 * @typedef PotionName
 * @type {string}
 */

/**
 * @type {PotionName}
 */
let PotionName;

/**
 * @typedef PotionCategory
 * @type {string}
 */

/**
 * @type {PotionCategory}
 */
let PotionCategory;

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
 * @property {number|undefined} [goalChapter]
 * @property {string} key
 */

/**
 * @type {Potion}
 */
let Potion;

/**
 * @typedef ExpandedPotion
 * @augments {Potion}
 * @property {number} wantSum
 * @property {{color: Color, wantRatio: number}[]} ratios
 */

/**
 * @type {ExpandedPotion}
 */
let ExpandedPotion;

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
 * @property {string} Key
 */

/**
 * @type {PotionsRow}
 */
let PotionsRow;

// noinspection JSUnusedAssignment
module.exports = {ExpandedPotion, Potion, PotionCategory, PotionName, PotionsRow};
