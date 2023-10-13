import console from "node:console";
import {bruteRecipes} from "../src/brute-recipes.js";
import {givens} from "../src/givens.js";
import {Potion} from "../src/type/potion.js";

const exhaustive = async () => {
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
			for (let potion of potions) {
				console.log(`Chapter ${chapter}, ${potion.name} ${potion.category}`);
				const prefix = `${potion.name}-c${chapter}-x${itemCount}-`;
				/** @type {string[]} */
				const potionNames = [potion.name];
				await bruteRecipes({
					chapters,
					maxItems: itemCount,
					maxMagimins,
					minItems: itemCount,
					potionNames,
					prefix,
					stable: 100,
				});
			}
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
