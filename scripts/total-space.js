const fs = require("node:fs");
const childProcess = require("node:child_process");
const {exhaustiveTasks} = require("../src/exhaustive-tasks");
const {spreadsheetStream} = require("../src/spreadsheet-stream");
const {existsSync} = require("../src/exists-sync");
const {simpleColumn} = require("../src/spreadsheet-helpers");
const {givens} = require("../src/givens");
const {CAULDRON_SIZE_MAX} = require("../src/type/cauldron");
const {duration} = require("../src/duration");

// Very round number of 1M recipes per minute
const MS_PER_RECIPE = 60_000 / 1_000_000;

console.log("Getting counts ...");

/** @type {Record.<string, number>} */
const counts = Object.fromEntries(childProcess.execSync("wc -l db/*.tsv", {encoding: "utf8"})
	.split("\n")
	.map((line) => {
		const match = /^\s*(\d+)\s+db\/(\w+-c\d-x\d+)-recipes-perfect\.tsv$/.exec(line);
		if (match == null) {
			return undefined;
		}
		const [, recipeCount, key] = match;
		return [key, parseInt(recipeCount) - 1];
	})
	.filter((count) => count != null));

console.log("... done counting");

const outPath = "data/total-space.tsv";
if (existsSync(outPath)) {
	fs.rmSync(outPath);
}

const out = spreadsheetStream(outPath, [
	simpleColumn("Potion"),
	simpleColumn("Chapter"),
	simpleColumn("IngredientsPossible"),
	simpleColumn("IngredientsUsed"),
	simpleColumn("Combinations"),
	simpleColumn("Discovered"),
	simpleColumn("EstimatedDuration"),
]);

let totalCombinations = 0;
let totalDiscovered = 0;

exhaustiveTasks()
	.forEach((task) => {
		const potion = task.potionNames[0];
		// noinspection JSCheckFunctionSignatures
		const chapter = String(task.chapters[task.chapters.length - 1]);
		const {ingredientCount, itemCount, combinations} = task;
		totalCombinations += combinations;
		const actual = counts[`${potion}-c${chapter}-x${itemCount}`] ?? 0;
		totalDiscovered += actual;
		if (itemCount >= 4 || actual > 0) {
			const expectedMs = Math.round(MS_PER_RECIPE * combinations);
			const durationText = duration(expectedMs);
			// noinspection JSCheckFunctionSignatures
			out.write({
				Chapter: chapter,
				Combinations: String(combinations),
				Discovered: String(actual === 0 ? "" : actual),
				EstimatedDuration: durationText,
				IngredientsPossible: String(ingredientCount),
				IngredientsUsed: String(itemCount),
				Potion: potion,
			});
		}
	});

// noinspection JSCheckFunctionSignatures
out.write({
	Chapter: "[all]",
	Combinations: String(totalCombinations),
	Discovered: String(totalDiscovered),
	EstimatedDuration: duration(Math.round(MS_PER_RECIPE * totalCombinations)),
	IngredientsPossible: String(givens.ingredients.length),
	IngredientsUsed: String(CAULDRON_SIZE_MAX),
	Potion: "[Total]",
});

out.close();
