const {chapterFromDay} = require("../chapter-from-day");
const {expect} = require("chai");

describe(chapterFromDay.name, () => {
	// eslint-disable-next-line mocha/no-setup-in-describe
	[
		[1, 1],
		[9, 1],
		[10, 1],
		[11, 2],
		[19, 2],
		[20, 2],
		[21, 3],
		[29, 3],
		[30, 3],
		[31, 4],
		[39, 4],
		[40, 4],
		[41, 5],
		[49, 5],
		[50, 5],
	].forEach(([day, chapter]) => {
		it(`${day} => ${chapter}`, () => {
			expect(chapterFromDay(day)).eq(chapter);
		});
	});
});
