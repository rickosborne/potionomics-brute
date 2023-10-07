import {assertIsFunction} from "./is-function";

/**
 * @typedef OptionalMapper
 * @template T
 * @template U
 * @function
 * @param original {T}
 * @returns {U}
 */

/**
 * @type {OptionalMapper}
 */
export let OptionalMapper;

/**
 * @typedef Optional
 * @template T
 * @template U
 * @property {function(T):void} ifPresent
 * @property {function(T):T} orElse
 * @property {function(OptionalMapper<T, U>):Optional<U>} map
 */

/**
 * @type {Optional}
 */
export let Optional;

/**
 * @template T
 * @param {T|undefined} value
 * @returns {Optional<T>}
 */
export const optional = (value) => ({
    ifPresent(accept) {
        if (value != null) {
            accept(value);
        }
    },
    map(apply) {
        assertIsFunction(apply, "optional:map:mapper");
        return optional(value == null ? undefined : apply(value));
    },
    orElse(defaultValue) {
        return value ?? defaultValue;
    },
});
