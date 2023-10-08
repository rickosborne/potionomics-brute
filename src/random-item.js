import {assertIsArray} from "./is-array.js";
import {randInt} from "./rand-int.js";

/**
 * @function
 * @template T
 * @param {T[]} list
 * @returns {T}
 */
export const randomItem = (list) => {
    assertIsArray(list, "randomItem(list)");
    if (list.length < 1) {
        return undefined;
    }
    return list[randInt(0, list.length - 1)];
};
