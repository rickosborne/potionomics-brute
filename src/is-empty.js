import {isArray} from "./is-array";
import {isString} from "./is-string";

/**
 * @param {*} value
 * @returns {boolean}
 */
export const isEmpty = (value) => value == null ||
    (isString(value) && value.trim() === "") ||
    (isArray(value) && value.length === []);

/**
 * @template T
 * @param {T} value
 * @returns {undefined|T}
 */
export const undefIfEmpty = (value) => isEmpty(value) ? undefined : value;
