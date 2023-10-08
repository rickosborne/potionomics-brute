import {intFrom, maybeIntFrom} from "./spreadsheet-helpers.js";
import {Potion, PotionsRow} from "./type/potion.js";

/**
 * @function
 * @param {PotionsRow} row
 * @returns {Potion}
 */
export const potionFromPotionsRow = (row) => ({
    A: intFrom(row.A),
    B: intFrom(row.B),
    C: intFrom(row.C),
    category: row.Category,
    D: intFrom(row.D),
    E: intFrom(row.E),
    earliestChapter: intFrom(row.EarliestChapter),
    goalChapter: maybeIntFrom(row.GoalChapter),
    name: row.Name,
});
