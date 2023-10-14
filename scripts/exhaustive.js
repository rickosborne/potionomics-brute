import console from "node:console";
import path from "node:path";
import {Worker} from "node:worker_threads";
import {existsSync} from "../src/exists-sync.js";
import {givens} from "../src/givens.js";
import {Potion} from "../src/type/potion.js";

const exhaustive = async () => {
	const workerScript = path.resolve("src", "worker", "exhaustive-worker.js");
	if (!existsSync(workerScript)) {
		throw new Error(`Not found: ${workerScript}`);
	}
	/** @type {number[]} */
	let chapters = [];
	for (let chapter = 1; chapter <= 5; chapter++) {
		chapters.push(chapter);
		const firstDay = ((chapter - 1) * 10) + 1;
		const lastDay = firstDay + 8;
		/** @type {Potion[]} */
		const potions = givens.potions.filter((p) => p.earliestChapter <= chapter);
		console.log(`Chapter ${chapter}, Potions: ${potions.map((p) => p.name).join(", ")}`);
		const cauldrons = givens.cauldrons
			.filter((/**Cauldron*/c) => c.unlockDay >= firstDay && c.unlockDay <= lastDay);
		const maxMagimins = cauldrons.map((c) => c.maxMagimins).reduce((p, c) => Math.max(p, c));
		let minItems = cauldrons.map((c) => c.maxIngredients).reduce((p, c) => Math.min(p, c));
		if ((minItems % 2) === 1) {
			minItems--;
		}
		const maxItems = cauldrons.map((c) => c.maxIngredients).reduce((p, c) => Math.max(p, c));
		for (let itemCount = minItems; itemCount <= maxItems; itemCount++) {
			await Promise.all(potions.map((potion) => {
				console.log(`Chapter ${chapter}, ${potion.name} ${potion.category}`);
				const prefix = `${potion.name}-c${chapter}-x${itemCount}-`;
				/** @type {Promise.<number>} */
				return new Promise((resolve, reject) => {
					const worker = new Worker(workerScript, {
						workerData: {
							chapters,
							itemCount,
							maxMagimins,
							potionNames: [potion.name],
							prefix,
						},
					});
					worker.on("error", reject);
					worker.on("exit", resolve);
				});
			}));
		}
	}
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
