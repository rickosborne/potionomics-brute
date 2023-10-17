const {range} = require("./range");
const {givens} = require("./givens");
const {calculateSpace} = require("./calculate-space");
const {comparatorBuilder} = require("./comparator");
const {Potion} = require("./type/potion");

/**
 * @typedef ExhaustiveTask
 * @type {object}
 * @property {number[]} chapters
 * @property {number} combinations
 * @property {number} itemCount
 * @property {number} ingredientCount
 * @property {string} key
 * @property {number} maxMagimins
 * @property {string[]} potionNames
 * @property {string} prefix
 */

/** @type {ExhaustiveTask} */
let ExhaustiveTask;

/**
 * @returns {ExhaustiveTask[]}
 */
const exhaustiveTasks = () => {
	/** @type {Map.<string, string>} */
	const seenKeys = new Map();
	return range(1, 5)
		.flatMap((chapter) => {
			const firstDay = ((chapter - 1) * 10) + 1;
			const lastDay = firstDay + 8;
			/** @type {Potion[]} */
			const potions = givens.potions.filter((p) => p.earliestChapter <= chapter);
			// console.log(`Chapter ${chapter}, Potions: ${potions.map((p) => p.name).join(", ")}`);
			const cauldrons = givens.cauldrons
				.filter((/**Cauldron*/c) => c.unlockDay >= firstDay && c.unlockDay <= lastDay);
			const maxMagimins = cauldrons.map((c) => c.maxMagimins).reduce((p, c) => Math.max(p, c));
			const minItems = 1;
			const maxItems = cauldrons.map((c) => c.maxIngredients).reduce((p, c) => Math.max(p, c));
			return range(minItems, maxItems).flatMap((itemCount) => {
				return potions.flatMap((potion) => {
					const prefix = `${potion.name}-c${chapter}-x${itemCount}-`;
					const {key, combinations, ingredientCount} = calculateSpace({chapter, itemCount, potions: [potion]});
					return {
						chapters: range(1, chapter),
						combinations,
						ingredientCount,
						itemCount,
						key,
						maxMagimins,
						potionNames: [potion.name],
						prefix,
					};
				});
			});
		})
		.sort(comparatorBuilder()
			.numbers((c) => c.combinations)
			.numbers((c) => c.itemCount)
			.numbers((c) => c.chapters.length)
			.strings((c) => c.potionNames[0])
			.numbers((c) => c.maxMagimins)
			.build())
		.filter((taskData, index, all) => {
			const key = taskData.key;
			const otherKey = seenKeys.get(key);
			if (otherKey != null) {
				const otherTask = all.find((t) => t.key === key);
				if (otherTask == null) {
					throw new Error(`Expected to find other task`);
				}
				otherTask.maxMagimins = Math.max(taskData.maxMagimins, otherTask.maxMagimins);
				return false;
			}
			seenKeys.set(key, taskData.prefix);
			return true;
		});
};

// noinspection JSUnusedAssignment
module.exports = {ExhaustiveTask, exhaustiveTasks};
