import ReadLines from "n-readlines";
import {execSync} from "node:child_process";
import console from "node:console";
import {closeSync, openSync, renameSync, writeSync} from "node:fs";
import {parseArgs} from "node:util";
import {existsSync} from "../src/exists-sync.js";
import {givens} from "../src/givens.js";

const {
	values: {
		ingredient,
	},
} = parseArgs({
	options: {
		ingredient: {type: "string"},
	},
	strict: true,
});

if (ingredient == null || givens.ingredients.find((i) => i.name === ingredient) == null) {
	throw new Error(`Unknown --ingredient: ${JSON.stringify(ingredient)}`);
}

const fileList = execSync(`grep -l ${JSON.stringify(ingredient)} db/*.tsv`, {encoding: "utf8"});
fileList.split("\n")
	.map((line) => line.trim())
	.filter((line) => line.endsWith(".tsv") && existsSync(line, (d) => d.isFile()))
	.forEach((filePath) => {
		const fixup = `${filePath}.fixup`;
		console.log(`File: ${filePath} => ${fixup}`);
		const inStream = new ReadLines(filePath);
		const outFd = openSync(fixup, "w");
		let buffer;
		while ((buffer = inStream.next())) {
			// noinspection JSCheckFunctionSignatures
			const line = buffer.toString("utf8").trim();
			if (line === "" || line.includes(ingredient)) continue;
			writeSync(outFd, line.concat("\n"), null, "utf8");
		}
		closeSync(outFd);
		renameSync(filePath, `${filePath}.backup`);
		renameSync(fixup, filePath);
	});
