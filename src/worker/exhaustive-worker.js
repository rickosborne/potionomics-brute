import console from "node:console";
import {isMainThread, workerData} from "node:worker_threads";
import {bruteRecipes} from "../brute-recipes.js";

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
export let ExhaustiveWorkerConfig;

/** @type {ExhaustiveWorkerConfig} */
const config = workerData;

if (!isMainThread) {
	console.log(`Worker starting: ${config.prefix}`);
	bruteRecipes({
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
