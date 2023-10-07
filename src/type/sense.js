/**
 * @typedef Sense
 * @type {"taste"|"touch"|"smell"|"sight"|"sound"}
 */

/**
 * @type {Sense}
 */
export let Sense;

/**
 * @type {Sense[]}
 */
export const SENSES = Object.freeze(["taste", "touch", "smell", "sight", "sound"]);

/**
 * @typedef Sensation
 * @type {"good"|"bad"|"neutral"|"random"}
 */

/**
 * @type {Sensation}
 */
export let Sensation;

/**
 * @type {Sensation}
 */
export const GOOD = "good";

/**
 * @type {Sensation}
 */
export const BAD = "bad";

/**
 * @type {Sensation}
 */
export const NEUTRAL = "neutral";

/**
 * @type {Sensation}
 */
export const RANDOM = "random";

/**
 * @type {Sensation[]}
 */
export const SENSATIONS = Object.freeze([GOOD, BAD, NEUTRAL, RANDOM]);
