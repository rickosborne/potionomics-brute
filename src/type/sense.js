/**
 * @typedef Sense
 * @type {"taste"|"touch"|"smell"|"sight"|"sound"}
 */

/**
 * @type {Sense}
 */
let Sense;

/**
 * @type {Sense[]}
 */
const SENSES = Object.freeze(["taste", "touch", "smell", "sight", "sound"]);

/**
 * @typedef Sensation
 * @type {"good"|"bad"|"neutral"|"random"}
 */

/**
 * @type {Sensation}
 */
let Sensation;

/**
 * @type {Sensation}
 */
const GOOD = "+";

/**
 * @type {Sensation}
 */
const BAD = "-";

/**
 * @type {Sensation}
 */
const NEUTRAL = "";

/**
 * @type {Sensation}
 */
const RANDOM = "~";

/**
 * @type {Sensation[]}
 */
const SENSATIONS = Object.freeze([GOOD, BAD, NEUTRAL, RANDOM]);

/**
 * @typedef HasSensations
 * @type {object}
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {Sensation} smell
 * @property {Sensation} sight
 * @property {Sensation} sound
 */

/** @type {HasSensations} */
let HasSensations;

// noinspection JSUnusedAssignment
module.exports = {BAD, GOOD, HasSensations, NEUTRAL, RANDOM, Sensation, SENSATIONS, Sense, SENSES};
