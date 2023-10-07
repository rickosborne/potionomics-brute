/**
 * @param {*} value
 * @returns {value is []}
 */
export const isArray = (value) => Array.isArray(value);

/**
 * @param {*} value
 * @param {string} name
 * @returns {[]}
 */
export const assertIsArray = (value, name) => {
    if (!isArray(value)) {
        throw new Error(`Expected array: ${name} (${typeof value})`);
    }
    return value;
};
