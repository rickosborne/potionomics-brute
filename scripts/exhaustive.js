const console = require("node:console");
const path = require("node:path");
const workerpool = require("workerpool");
const {comparatorBuilder} = require("../src/comparator.js");
const {existsSync} = require("../src/exists-sync.js");
const {givens} = require("../src/givens.js");
const {range} = require("../src/range.js");
const {Potion} = require("../src/type/potion.js");

const exhaustive = async () => {
	const workerScript = path.resolve("src", "worker", "exhaustive-worker.js");
	if (!existsSync(workerScript)) {
		throw new Error(`Not found: ${workerScript}`);
	}
	const taskDatas = range(1, 5)
		.flatMap((chapter) => {
			const firstDay = ((chapter - 1) * 10) + 1;
			const lastDay = firstDay + 8;
			/** @type {Potion[]} */
			const potions = givens.potions.filter((p) => p.earliestChapter <= chapter);
			// console.log(`Chapter ${chapter}, Potions: ${potions.map((p) => p.name).join(", ")}`);
			const cauldrons = givens.cauldrons
				.filter((/**Cauldron*/c) => c.unlockDay >= firstDay && c.unlockDay <= lastDay);
			const maxMagimins = cauldrons.map((c) => c.maxMagimins).reduce((p, c) => Math.max(p, c));
			let minItems = cauldrons.map((c) => c.maxIngredients).reduce((p, c) => Math.min(p, c));
			if ((minItems % 2) === 1) {
				minItems--;
			}
			const maxItems = cauldrons.map((c) => c.maxIngredients).reduce((p, c) => Math.max(p, c));
			return range(minItems, maxItems).flatMap((itemCount) => {
				return potions.flatMap((potion) => {
					const prefix = `${potion.name}-c${chapter}-x${itemCount}-`;
					return {
						chapters: range(1, chapter),
						itemCount,
						maxMagimins,
						potionNames: [potion.name],
						prefix,
					};
				});
			});
		})
		.sort(comparatorBuilder()
			.numbers((c) => c.chapters.length)
			.numbers((c) => c.itemCount)
			.strings((c) => c.potionNames[0])
			.numbers((c) => c.maxMagimins)
			.build);
	console.log(`Tasks: ${taskDatas.length}`);
	const pool = workerpool.pool(workerScript);
	return Promise.all(taskDatas.map((taskData) => {
		return pool.exec('exhaustiveWorker', [taskData]);
	}));
};

exhaustive()
	.then(() => {
		console.log("Complete.");
	})
	.catch((error) => {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
	});
