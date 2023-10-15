const {expect} = require("chai");
const {optional} = require("../optional.js");

describe(optional.name, () => {
	it("won't map an undefined", () => {
		let callCount = 0;
		expect(optional(undefined).map((str) => {
			throw new Error(`Expected to never be called, got: ${JSON.stringify(str)}`);
		}).orElse(2)).equals(2);
		expect(optional(undefined).orElse(2)).equals(2);
		expect(callCount).eq(0);
	});

	it("maps when defined", () => {
		let callCount = 0;
		expect(optional("foo").map((str) => {
			expect(str).equals("foo");
			callCount += 1;
			return callCount;
		}).orElse(-1)).equals(1);
		expect(callCount).eq(1);
	});
});
