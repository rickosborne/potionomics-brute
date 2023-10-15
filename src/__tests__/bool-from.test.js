const {boolFrom} = require("../bool-from");
const {expect} = require("chai");

describe(boolFrom.name, () => {
	// eslint-disable-next-line mocha/no-setup-in-describe
	[
		[true, false, true],
		[false, true, false],
		[null, true, true],
		[undefined, false, false],
		[1, false, true],
		[0, true, false],
		[NaN, true, true],
		["y", false, true],
		["Y", false, true],
		["yes", false, true],
		["YES", false, true],
		["t", false, true],
		["T", false, true],
		["true", false, true],
		["TRUE", false, true],
		["n", true, false],
		["N", true, false],
		["no", true, false],
		["NO", true, false],
		["f", true, false],
		["F", true, false],
		["false", true, false],
		["FALSE", true, false],
		["", false, false],
		[{}, false, false],
		["", true, true],
		[{}, true, true],
	].forEach(([input, defaultValue, output]) => {
		it(`${input}/${defaultValue} => ${output}`, () => {
			expect(boolFrom(input, defaultValue)).eq(output);
		});
	});
});
