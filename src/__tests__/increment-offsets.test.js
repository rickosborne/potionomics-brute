const {expect} = require("chai");
const {incrementOffsets} = require("../increment-offsets.js");

describe(incrementOffsets.name, () => {
	it('starts out fine', () => {
		expect(incrementOffsets([], 5)).deep.eq([0]);
	});
	it('adds a digit when rolling over', () => {
		expect(incrementOffsets([5], 5)).deep.eq([0, 0]);
		expect(incrementOffsets([5, 5], 5)).deep.eq([0, 0, 0]);
		expect(incrementOffsets([5, 5, 5], 5)).deep.eq([0, 0, 0, 0]);
	});
	it('skips past seen combos when rolling over', () => {
		expect(incrementOffsets([1, 5], 5)).deep.eq([2, 2]);
		expect(incrementOffsets([2, 5, 5], 5)).deep.eq([3, 3, 3]);
		expect(incrementOffsets([3, 5, 5, 5], 5)).deep.eq([4, 4, 4, 4]);
	});
});
