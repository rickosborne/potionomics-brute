import {readFileSync} from "node:fs";

/**
 * @function
 * @template T
 * @param {string} filePath
 * @returns {T}
 */
export const readJsonSync = (filePath) => {
    const text = readFileSync(filePath, {encoding: "utf8"});
    return JSON.parse(text);
};
