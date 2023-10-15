const {readFileSync} = require("node:fs");

/**
 * @function
 * @template T
 * @param {string} filePath
 * @returns {T}
 */
const readJsonSync = (filePath) => {
	const text = readFileSync(filePath, {encoding: "utf8"});
	return JSON.parse(text);
};

module.exports = {readJsonSync};
