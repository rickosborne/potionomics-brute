/**
 * @function
 * @param {*} v
 * @returns {string}
 */
export const simpleToString = (v) => v == null ? "" : v.toString();
/**
 * @function
 * @param {string} name
 * @returns {{name: string, toString: (function(*): string)}}
 */
export const simpleColumn = (name) => ({name, toString: simpleToString});
