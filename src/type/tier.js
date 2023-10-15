/**
 * @typedef TierName
 * @type {string}
 */

/** @type {TierName} */
let TierName;

/**
 * @typedef QualityTier
 * @type {object}
 * @property {TierName} name
 * @property {number[]} levels
 */

/** @type {QualityTier} */
let QualityTier;

/**
 * @typedef Tier
 * @type {0|1|2|3|4|5}
 */

/**
 * @type {Tier}
 */
let Tier;

// noinspection JSUnusedAssignment
module.exports = {QualityTier, Tier, TierName};
