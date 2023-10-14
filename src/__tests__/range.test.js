import {expect} from "chai";
import {range} from "../range.js";

describe(range.name, () => {
	it("handles single digits", () => {
		expect(range(1, 1)).deep.equals([1]);
	});
	it("handles two", () => {
		expect(range(3, 4)).deep.equals([3, 4]);
	});
	it("handles more", () => {
		expect(range(0, 5)).deep.equals([0, 1, 2, 3, 4, 5]);
	});
	it("can cross zero", () => {
		expect(range(-2, 2)).deep.equals([-2, -1, 0, 1, 2]);
	});
	it("can go backward", () => {
		expect(range(3, 0)).deep.equals([3, 2, 1, 0]);
	});
	it("can cross zero backward", () => {
		expect(range(2, -2)).deep.equals([2, 1, 0, -1, -2]);
	});
});
