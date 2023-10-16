const {countingMultiChooseGenerator} = require("../counting-generator");
const {expect} = require("chai");

describe("countingMultiChooseGenerator", () => {
	it("counts as expected", () => {
		/** @type {number[][]} */
		const expected = [
			[0],
			[1],
			[2],
			[0, 0],
			[0, 1],
			[0, 2],
			[1, 1],
			[1, 2],
			[2, 2],
			[0, 0, 0],
		];
		const counter = countingMultiChooseGenerator(3);
		const actual = expected.map(() => counter.next().value);
		expect(actual).deep.equals(expected);
	});
	it("can start at 1", () => {
		/** @type {number[][]} */
		const expected = [
			[1],
			[2],
			[3],
			[1, 1],
			[1, 2],
			[1, 3],
			[2, 2],
			[2, 3],
			[3, 3],
			[1, 1, 1],
		];
		const counter = countingMultiChooseGenerator(3, {from: 1});
		const actual = expected.map(() => counter.next().value);
		expect(actual).deep.equals(expected);
	});

	it("can start with an offset", () => {
		/** @type {number[][]} */
		const expected = [
			[0, 0, 0],
			[0, 0, 1],
			[0, 1, 1],
			[1, 1, 1],
			[0, 0, 0, 0],
		];
		const counter = countingMultiChooseGenerator(2, {start: [1, 1]});
		const actual = expected.map(() => counter.next().value);
		expect(actual).deep.equals(expected);
	});
	it("can track a sum limit", () => {
		/** @type {number[][]} */
		const expected = [
			[0, 0, 0],
			[0, 0, 1],
			[0, 0, 2],
			[0, 1, 1],
			[0, 1, 2],
			[1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 0, 2],
			[0, 0, 1, 1],
			[0, 0, 1, 2],
			[0, 1, 1, 1],
			[0, 0, 0, 0, 0],
		];
		const counter = countingMultiChooseGenerator(3, {start: [2, 2], sumLimit: 3});
		const actual = expected.map(() => counter.next().value);
		expect(actual).deep.equals(expected);
	});
	it("can track a sum limit, starting from 1", () => {
		/** @type {number[][]} */
		const expected = [
			[1, 1, 1],
			[1, 1, 2],
			[1, 1, 3],
			[1, 2, 2],
			[1, 1, 1, 1],
			[1, 1, 1, 2],
			[1, 1, 1, 1, 1],
			undefined,
		];
		const counter = countingMultiChooseGenerator(3, {from: 1, start: [3, 3], sumLimit: 5});
		const actual = expected.map(() => counter.next().value);
		expect(actual).deep.equals(expected);
	});
});
