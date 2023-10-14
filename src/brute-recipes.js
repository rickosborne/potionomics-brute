import console from "node:console";
import process from "node:process";
import {maybeBoolFrom} from "./bool-from.js";
import {chapterFromDay} from "./chapter-from-day.js";
import {multiChooseCount} from "./combinations.js";
import {countdownTimer} from "./countdown-timer.js";
import {duration, DURATION_PARTS} from "./duration.js";
import {filterPipeline, FilterPipeline} from "./filter-pipeline.js";
import {givens} from "./givens.js";
import {undefIfEmpty} from "./is-empty.js";
import {lastSeenRecipe} from "./last-seen-recipe.js";
import {Ledger} from "./ledger.js";
import {loadInventory} from "./load-inventory.js";
import {optional} from "./optional.js";
import {maybeIntFrom} from "./spreadsheet-helpers.js";
import {TryEverything} from "./try-everything.js";
import {CAULDRON_SIZE_MAX} from "./type/cauldron.js";
import {Chapter} from "./type/chapter.js";
import {COLORS} from "./type/color.js";
import {Ingredient} from "./type/ingredient.js";
import {Inventory} from "./type/inventory.js";
import {LocationName} from "./type/location.js";
import {Potion, PotionName} from "./type/potion.js";
import {Recipe} from "./type/recipe.js";

/**
 * @typedef BruteRecipesConfig
 * @type {object}
 * @property {number|undefined} [maxItems]
 * @property {number|undefined} [minItems]
 * @property {number|undefined} [maxMagimins]
 * @property {number|undefined} [minMagimins]
 * @property {Chapter[]|undefined} [chapters]
 * @property {PotionName[]|undefined} [potionNames]
 * @property {boolean|undefined} [goal]
 * @property {number|undefined} stable
 * @property {string|undefined} inventoryPath
 * @property {LocationName[]|undefined} [locations]
 * @property {string|undefined} prefix
 * @property {(function(Recipe):void)|undefined} [onRecipe]
 */

/** @type {BruteRecipesConfig} */
export let BruteRecipesConfig;

/**
 * @param {BruteRecipesConfig} config
 * @returns {Promise<boolean>}
 */
export const bruteRecipes = (config) => {
	/** @type {function(boolean):void} */
	let stopComplete;
	/** @type {function(*):void} */
	let stopIncomplete;
	const donePromise = new Promise((resolve, reject) => {
		stopComplete = resolve;
		stopIncomplete = reject;
	});
	let maxItems = config.maxItems;
	let minItems = config.minItems ?? 2;
	const chapters = config.chapters ?? [];
	const potionNames = config.potionNames ?? [];
	const goal = maybeBoolFrom(config.goal) ?? false;
	const locations = config.locations ?? [];
	const onRecipe = config.onRecipe ?? (() => {
	});
	if (chapters.length > 0) {
		maxItems ??= givens.cauldrons
			.filter((cauldron) => chapters.includes(chapterFromDay(cauldron.unlockDay)))
			.map((cauldron) => cauldron.maxIngredients)
			.reduce((p, c) => Math.max(p, c));
		console.log(`MaxItems: ${maxItems}`);
	}
	maxItems ??= CAULDRON_SIZE_MAX;
	/** @type {FilterPipeline.<Potion>} */
	const potionsFilter = filterPipeline(givens.potions, "loaded")
		.stepIf(potionNames.length > 0, `specified(${potionNames.length})`, (/**Potion*/p) => potionNames.includes(p.name))
		.stepIf(potionNames.length === 0 && chapters.length > 0, `chapters(${chapters.join(",")})`, (/**Potion*/p) => chapters.includes(p.earliestChapter))
		.stepIf(goal && chapters.length === 0, "all goals", (/**Potion*/p) => p.goalChapter != null)
		.stepIf(goal && chapters.length > 0, "goals", (/**Potion*/p) => chapters.includes(p.goalChapter));
	/** @type {Potion[]} */
	const potions = potionsFilter.apply();
	console.log(`Potion${potions.length === 1 ? "" : "s"}: ${potionsFilter.summary(" → ")}${potions.length === 1 ? ` → ${potions[0].name}` : ""}`);
	if (potions.length === 0) {
		throw new Error("No potions found which match the given criteria.");
	}
	const needColors = {
		A: false,
		B: false,
		C: false,
		D: false,
		E: false,
	};
	potions.forEach((potion) => {
		COLORS.forEach((color) => {
			if (potion[color] > 0) {
				needColors[color] = true;
			}
		});
	});
	const colorsWanted = COLORS.filter((color) => needColors[color]);
	const colorsUnwanted = COLORS.filter((color) => needColors[color] === false);
	console.log(`Loaded ${potions.length} potions`);
	/** @type {Inventory|undefined} */
	const inventory = optional(undefIfEmpty(config.inventoryPath))
		.map((inventoryPath) => loadInventory(inventoryPath))
		.orElse(undefined);
	let stableCutoff = maybeIntFrom(config.stable) ?? 100;
	if (stableCutoff != null) {
		if (stableCutoff > 1) {
			stableCutoff /= 100;
		}
		console.log(`Stable cutoff: ${stableCutoff.toPrecision(4)}`);
	}
	/** @type {FilterPipeline.<Ingredient>} */
	const ingredientsPipeline = filterPipeline(givens.ingredients, "loaded")
		.stepIf(locations.length > 0, `locations(${locations.length})`, (/**Ingredient*/i) => locations.includes(i.location))
		.stepIf(chapters.length > 0, `chapters(${chapters.join(",")})`, (/**Ingredient*/i) => chapters.includes(i.earliestChapter))
		.stepIf(colorsWanted.length < COLORS.length, `colors(${colorsWanted.join("")})`, (/**Ingredient*/i) => colorsWanted.some((color) => i[color] > 0))
		.stepIf(stableCutoff === 1, `colors(!${colorsUnwanted.join("")})`, (/**Ingredient*/i) => colorsUnwanted.every((color) => i[color] === 0))
		.stepIf(inventory != null, `inventory(${inventory == null ? "" : Object.keys(inventory).length})`, (/**Ingredient*/i) => i.name in inventory);
	/** @type {Ingredient[]} */
	const ingredients = ingredientsPipeline.apply();
	console.log(`Ingredients: ${ingredientsPipeline.summary(" → ")}`);
	let prefix = config.prefix;
	if (ingredients.length === 0) {
		console.error({chapters, colorsWanted, locations, needColors, potions, prefix});
		throw new Error(`Loaded no ingredients!`);
	}
	if (prefix === "*") {
		const prefixParts = [];
		if (potions.length <= 5) {
			prefixParts.push(...potions.map((p) => p.name.toLowerCase()));
		}
		if (chapters.length > 0) {
			prefixParts.push(`c${chapters.reduce((p, c) => Math.max(p, c))}`);
		}
		prefixParts.push(`x${maxItems}`);
		prefixParts.push("");
		prefix = prefixParts.join("-");
		console.log(`Prefix: ${prefix}`);
	}
	const ledger = new Ledger({onRecipe, prefix, stableCutoff});
	const tryEverything = new TryEverything({
		ingredients,
		ledger,
		maxItems,
		minItems,
		onRecipe,
		potions,
	});
	let itemCount = 0;
	let countdown = countdownTimer(ingredients.length);
	const lastRecipe = lastSeenRecipe(prefix);
	if (lastRecipe != null) {
		const offsets = lastRecipe.ingredientNames.map((name) => {
			const index = ingredients.findIndex((i) => i.name === name);
			if (index < 0) {
				throw new Error(`Ingredient not found: ${name}`);
			}
			return index;
		});
		console.log(`Last recipe: ${lastRecipe.ingredientNames.join(" + ")}`);
		tryEverything.offsets = offsets;
		itemCount = offsets.length;
		countdown = countdownTimer(multiChooseCount(ingredients.length, itemCount));
	}
	let shouldContinue = true;
	let timeUntilNextLog = 1000;
	let timer;
	const startMs = Date.now();
	const keepGoing = () => {
		if (!shouldContinue) {
			return;
		}
		if (timeUntilNextLog === 0) {
			timeUntilNextLog = 1000;
			const elapsedMs = Date.now() - startMs;
			console.log(`${duration(elapsedMs)}: ${countdown.toString()} @ ${itemCount}/${ingredients.length} items: ${ledger.perfectCount.toLocaleString()} / ${ledger.stableCount.toLocaleString()} / ${ledger.totalCount.toLocaleString()} for ${prefix}`);
		}
		timeUntilNextLog -= 1;
		// eslint-disable-next-line no-undef
		timer = setTimeout(() => {
			let okay = true;
			for (let i = 0; okay && i < 1000; i++) {
				okay = tryEverything.go();
				countdown.tick();
				if (tryEverything.offsets.length > itemCount) {
					itemCount = tryEverything.offsets.length;
					countdown = countdownTimer(multiChooseCount(ingredients.length, itemCount));
				}
			}
			if (!okay) {
				shutdown(true);
			} else {
				keepGoing();
			}
		}, 1);
	};

	const shutdown = (graceful) => {
		if (timer != null) {
			console.log("Shutting down");
			// eslint-disable-next-line no-undef
			clearTimeout(timer);
			timer = undefined;
			shouldContinue = false;
			tryEverything.stop();
			const {totalCount} = ledger;
			if (totalCount > 0) {
				const totalMs = Date.now() - startMs;
				console.log(`Total: ${totalCount.toLocaleString()} in ${duration(totalMs)}`);
				let units = totalMs;
				DURATION_PARTS.forEach(([divisor, , , unitName]) => {
					if (units === 0) {
						return;
					}
					const attemptsPer = totalCount / units;
					if (attemptsPer > 1) {
						console.log(`Recipes/${unitName}: ${Math.round(attemptsPer).toLocaleString()}`);
					} else {
						console.log(`${unitName}/recipe: ${Math.round(1 / attemptsPer).toLocaleString()}`);
					}
					units = Math.floor(units / divisor);
				});
			}
			if (graceful) {
				stopComplete(true);
			} else {
				stopIncomplete(new Error("Interrupted"));
			}
		}
	};

	process.on("exit", () => shutdown(false));
	process.on("SIGINT", () => shutdown(false));

	keepGoing();
	return donePromise;
};
