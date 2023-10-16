const fs = require("node:fs");
const console = require("node:console");
const {countingMultiChooseGenerator} = require("../src/counting-generator");
const {range} = require("../src/range");

for (let n = 8; n <= 14; n++) {
	const generator = countingMultiChooseGenerator(n, {from: 1, sumLimit: n});
	const out = fs.openSync(`data/sums-to-${n}.tsv`, "w");
	const header = "ABCDEFGHIJKLMN".substring(0, n).split("").join("\t").concat("\n");
	fs.writeSync(out, header, null, "utf8");

	let count = 0;
	/** @type {{done:true}|{value:number[]}} */
	let result;
	/** @type {number[]} */
	const maxNums = range(0, n).map(() => 0);
	while (!(result = generator.next()).done) {
		/** @type {number[]} */
		const numbers = result.value;
		const sum = numbers.reduce((p, c) => p + c, 0);
		if (sum !== n) {
			continue;
		}
		maxNums[numbers[numbers.length - 1]]++;
		const tabs = "\t".repeat(n - numbers.length);
		const line = numbers.join("\t").concat(tabs).concat("\n");
		fs.writeSync(out, line, null, "utf8");
		count++;
	}

	fs.closeSync(out);
	console.log(`Wrote ${count} lines for ${n}`);
	let cumulative = 0;
	maxNums.forEach((plus, index) => {
		cumulative += plus;
		const percent = Math.round(100 * (cumulative / count));
		console.log(`x${index}/${n} => ${percent}%`);
	});
}
