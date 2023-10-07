/**
 * @param {*} value
 * @returns {value is object}
 */
export const isDefined = (value) => value != null;

/**
 * @param {*} value
 * @param {string} name
 * @returns {object}
 */
export const assertIsDefined = (value, name) => {
    if (!isDefined(value)) {
        throw new Error(`Expected a value: ${name}`);
    }
    return value;
};
