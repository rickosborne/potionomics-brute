const {assertIsFunction} = require("./is-function");

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
let OptionalMapper;

/**
 * @typedef Optional
 * @template T
 * @template U
 * @property {function(function(T):boolean):Optional<T>} filter
 * @property {function(T):void} ifPresent
 * @property {function(T):T} orElse
 * @property {function(OptionalMapper<T, U>):Optional<U>} map
 */

/**
 * @type {Optional}
 */
let Optional;

/**
 * @template T
 * @param {T|undefined} value
 * @returns {Optional<T>}
 */
const optional = (value) => ({
	filter(predicate) {
		if (value == null || predicate(value)) {
			return optional(value);
		}
		return optional(undefined);
	},
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

// noinspection JSUnusedAssignment
module.exports = {optional, Optional, OptionalMapper};
