/**
 * @param {*} value
 * @returns {value is !string}
 */
export const isString = (value) => typeof value === "string";

/**
 * @param {*} value
 * @param {string} name
 * @returns {!string}
 */
export const assertIsString = (value, name) => {
    if (!isString(value)) {
        throw new Error(`Expected a string: ${name} (${typeof value})`);
    }
    return value;
};
