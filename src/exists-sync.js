import {Stats, statSync} from "node:fs";
import {isFunction} from "./is-function.js";

/**
 * @param {string} path
 * @param {?(function(Stats):boolean)} predicate
 * @returns {boolean}
 */
export const existsSync = (path, predicate) => {
    try {
        const stat = statSync(path);
        if (isFunction(predicate)) {
            return predicate(stat);
        }
        return true;
    } catch (e) {
        return false;
    }
};
