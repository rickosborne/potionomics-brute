/**
 * @typedef Tier
 * @type {0|1|2|3|4|5}
 */

/**
 * @type {Tier}
 */
export let Tier;

/**
 * @type {string[]}
 */
export const TIER_NAMES = [
    "Minor",
    "Common",
    "Greater",
    "Grand",
    "Superior",
    "Masterwork",
];

/**
 * @typedef Stars
 * @type {0|1|2|3|4|5}
 */

/**
 * @type {Stars}
 */
export let Stars;

/**
 * @typedef Quality
 * @type {object}
 * @property {Tier} tier
 * @property {Stars} stars
 */

/**
 * @type {Quality}
 */
export let Quality;

