/**
 * @typedef CMCGConfig
 * @type {object}
 * @property {number} [from]
 * @property {number[]} [start]
 * @property {number} [sumLimit]
 */

/** @type {CMCGConfig} */
let CMCGConfig;

/**
 * @generator
 * @param {number} base
 * @param {CMCGConfig} [config]
 * @yields {number[]}
 */
function* countingMultiChooseGenerator(base, config = {}) {
	if (base < 2) {
		throw new Error(`countingGenerator:Illegal base`);
	}
	const from = config.from ?? 0;
	const start = config.start ?? [];
	const sumLimit = config.sumLimit ?? 0;
	const lastNum = from + base - 1;
	start.forEach((n, index) => {
		if (n < 0 || n > lastNum) {
			throw new Error(`countingGenerator: Illegal start (${n} at ${index} for base ${base})`);
		}
	});
	const acc = start.slice();
	let digits = acc.length;
	let sum = acc.reduce((p, c) => p + c, 0);
	let keepGoing = true;
	w: while (keepGoing) {
		for (let depth = digits - 1; depth >= 0; depth--) {
			const index = acc[depth];
			if (index < lastNum) {
				const nextIndex = index + 1;
				acc[depth] = nextIndex;
				sum++;
				for (let right = depth + 1; right < digits; right++) {
					const rightBefore = acc[right];
					acc[right] = nextIndex;
					sum += nextIndex - rightBefore;
				}
				if (sumLimit < 1 || sum <= sumLimit) {
					yield acc.slice();
				}
				continue w;
			}
			acc[depth] = from;
			sum += from - index;
		}
		acc.push(from);
		sum += from;
		digits++;
		if (sumLimit < 1 || sum <= sumLimit) {
			yield acc.slice();
		} else {
			keepGoing = false;
		}
	}
}

// noinspection JSUnusedAssignment
module.exports = {CMCGConfig, countingMultiChooseGenerator};
