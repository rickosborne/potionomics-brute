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
export const GOOD = "+";

/**
 * @type {Sensation}
 */
export const BAD = "-";

/**
 * @type {Sensation}
 */
export const NEUTRAL = "";

/**
 * @type {Sensation}
 */
export const RANDOM = "~";

/**
 * @type {Sensation[]}
 */
export const SENSATIONS = Object.freeze([GOOD, BAD, NEUTRAL, RANDOM]);
