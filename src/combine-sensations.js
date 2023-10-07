import {NEUTRAL, RANDOM, Sensation} from "./type/sense.js";

/**
 * @function
 * @param {Sensation} a
 * @param {Sensation} b
 * @returns {Sensation}
 */
export const combineSensations = (a, b) => {
    if (a === b) {
        return a;
    }
    if (a === NEUTRAL) {
        return b;
    }
    if (b === NEUTRAL) {
        return a;
    }
    return RANDOM;
};
