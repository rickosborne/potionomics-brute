/**
 * @template T
 * @param {*} value
 * @param {...(function(*): value is T)} guards
 * @returns {value is T}
 */
export const isAnyOf = (value, ...guards) => guards.some((guard) => guard(value));

/**
 * @template T
 * @param {*} value
 * @param {string} name
 * @param {...(function(*): value is T)} guards
 * @returns {T}
 */
export const assertIsAnyOf = (value, name, ...guards) => {
    if (!isAnyOf(value, ...guards)) {
        throw new Error(`Unknown type: ${name} (${typeof value})`);
    }
    return value;
};
