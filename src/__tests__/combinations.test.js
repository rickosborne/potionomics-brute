import {expect} from "chai";
import {multiChooseCount} from "../combinations.js";

describe(multiChooseCount.name, () => {
	const cases = [
		[3, 2, 6],
		[3, 3, 10],
		[206, 14, 4.3804867995489775e+21],
	];
	// eslint-disable-next-line mocha/no-setup-in-describe
	cases.forEach(([range, count, expected]) => {
		it(`${range} multichoose ${count} => ${expected}`, () => {
			expect(multiChooseCount(range, count, false)).equals(expected);
		});
	});
});
