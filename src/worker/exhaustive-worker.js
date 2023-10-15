const console = require("node:console");
const workerpool = require("workerpool");
const {bruteRecipes} = require("../brute-recipes.js");

/**
 * @typedef ExhaustiveWorkerConfig
 * @type {object}
 * @property {number[]} chapters
 * @property {number} itemCount
 * @property {number} maxMagimins
 * @property {string[]} potionNames
 * @property {string} prefix
 */

/** @type {ExhaustiveWorkerConfig} */
let ExhaustiveWorkerConfig;

/**
 * @param {ExhaustiveWorkerConfig} config
 * @returns {Promise<void>}
 */
async function exhaustiveWorker(config) {
	console.log(`Worker starting: ${config.prefix}`);
	return bruteRecipes({
		chapters: config.chapters,
		maxItems: config.itemCount,
		maxMagimins: config.maxMagimins,
		minItems: config.itemCount,
		potionNames: config.potionNames,
		prefix: config.prefix,
		stable: 100,
	}).then(() => {
		console.log(`Worker done: ${config.prefix}`);
	});
}

workerpool.worker({
	exhaustiveWorker,
});

// noinspection JSUnusedAssignment
module.exports = {exhaustiveWorker, ExhaustiveWorkerConfig};
