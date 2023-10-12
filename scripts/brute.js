import console from "node:console";
import {parseArgs} from "node:util";
import {bruteRecipes} from "../src/brute-recipes.js";
import {intFrom, maybeFloatFrom, maybeIntFrom} from "../src/spreadsheet-helpers.js";

const {
	values: {
		chapter,
		goal,
		inventory,
		location,
		minItems,
		maxItems,
		potion,
		prefix,
		stable,
	},
} = parseArgs({
	options: {
		chapter: {
			default: [],
			multiple: true,
			type: "string",
		},
		goal: {
			default: false,
			multiple: false,
			type: "boolean",
		},
		inventory: {
			default: "",
			type: "string",
		},
		location: {
			default: [],
			multiple: true,
			type: "string",
		},
		maxItems: {
			default: "",
			type: "string",
		},
		minItems: {
			default: "",
			type: "string",
		},
		potion: {
			default: [],
			multiple: true,
			type: "string",
		},
		prefix: {
			default: "*",
			type: "string",
		},
		stable: {
			default: "",
			type: "string",
		},
	},
	strict: true,
});

bruteRecipes({
	chapters: chapter.map((c) => intFrom(c)),
	goal,
	inventoryPath: inventory,
	locations: location,
	maxItems: maybeIntFrom(maxItems),
	minItems: maybeIntFrom(minItems),
	potionNames: potion,
	prefix,
	stable: maybeIntFrom(stable) ?? maybeFloatFrom(stable),
}).then(() => {
	console.log("Finished gracefully");
}).catch((error) => {
	if (error instanceof Error) {
		console.error(error.message);
	} else {
		console.error(error);
	}
});
