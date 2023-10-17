const console = require("node:console");
const path = require("node:path");
const workerpool = require("workerpool");
const {comparatorBuilder} = require("../src/comparator.js");
const {existsSync} = require("../src/exists-sync.js");
const {givens} = require("../src/givens.js");
const {range} = require("../src/range.js");
const {Potion} = require("../src/type/potion.js");
const {calculateSpace} = require("../src/calculate-space");

const exhaustive = async () => {
	const workerScript = path.resolve("src", "worker", "exhaustive-worker.js");
	if (!existsSync(workerScript)) {
		throw new Error(`Not found: ${workerScript}`);
	}
	/** @type {Map.<string, string>} */
	const seenKeys = new Map();
	let taskDatas = range(1, 5)
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
					const {key, combinations} = calculateSpace({chapter, itemCount, potions: [potion]});
					return {
						chapters: range(1, chapter),
						combinations,
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
		.filter((taskData) => {
			const key = taskData.key;
			const other = seenKeys.get(key);
			seenKeys.set(key, taskData.prefix);
			return other == null;
		});
	console.log(`Tasks: ${taskDatas.length}`);
	const pool = workerpool.pool(workerScript);
	setInterval(() => {
		const stats = pool.stats();
		console.log(`Pool: ${stats.activeTasks} active, ${stats.pendingTasks} queued`);
	}, 30_000);
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
