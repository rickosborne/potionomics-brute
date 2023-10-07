import {BAD, GOOD, RANDOM, Sensation} from "./type/sense.js";

/**
 * @function
 * @param {...Sensation} sensations
 * @returns {number | undefined}
 */
export const scoreSensations = (...sensations) => {
    let mod = 0;
    for (const sensation of sensations) {
        if (sensation === RANDOM) {
            return undefined;
        }
        if (sensation === GOOD) {
            mod += 5;
        } else if (sensation === BAD) {
            mod -= 5;
        }
    }
    return mod;
};
