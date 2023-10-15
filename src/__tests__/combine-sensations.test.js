const {expect} = require("chai");
const {combineSensations} = require("../combine-sensations.js");
const {BAD, GOOD, NEUTRAL, RANDOM, Sensation} = require("../type/sense.js");

describe(combineSensations.name, () => {
	/**
	 * @type {[Sensation, Sensation, Sensation][]}
	 */
	const expectations = [
		[NEUTRAL, NEUTRAL, NEUTRAL],
		[NEUTRAL, GOOD, GOOD],
		[NEUTRAL, BAD, BAD],
		[NEUTRAL, RANDOM, RANDOM],
		[GOOD, NEUTRAL, GOOD],
		[GOOD, GOOD, GOOD],
		[GOOD, BAD, RANDOM],
		[GOOD, RANDOM, RANDOM],
		[BAD, NEUTRAL, BAD],
		[BAD, GOOD, RANDOM],
		[BAD, BAD, BAD],
		[BAD, RANDOM, RANDOM],
		[RANDOM, NEUTRAL, RANDOM],
		[RANDOM, GOOD, RANDOM],
		[RANDOM, BAD, RANDOM],
		[RANDOM, RANDOM, RANDOM],
	];
	// eslint-disable-next-line mocha/no-setup-in-describe
	expectations.forEach(([a, b, out]) => {
		it(`${a} + ${b} = ${out}`, () => {
			expect(combineSensations(a, b)).eq(out);
		});
	});
});
