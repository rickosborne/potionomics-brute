import {fisherYatesShuffle} from "./fisher-yates-shuffle.js";

export const BASE32_LIBRARY = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const BASE32_CHARS = BASE32_LIBRARY.split("");

/**
 * @typedef IdGenerator
 * @generator
 * @yields {number}
 */

/** @type {IdGenerator} */
export let IdGenerator;


/**
 * @param {number} maxNeeded
 * @returns {IdGenerator}
 */
export const idGenerator = (maxNeeded) => {
    const places = Math.ceil(Math.log(maxNeeded) / Math.log(BASE32_CHARS.length));
    let all = BASE32_CHARS.slice();
    for (let i = 1; i < places; i++) {
        all = all.flatMap((id) => BASE32_CHARS.map((c) => `${c}${id}`));
    }
    fisherYatesShuffle(all);
    return function* () {
        while (all.length > 0) {
            yield all.shift();
        }
    };
};
