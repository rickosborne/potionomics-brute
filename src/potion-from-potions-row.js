import {Potion, PotionsRow} from "./type/potion.js";

/**
 * @function
 * @param {PotionsRow} row
 * @returns {Potion}
 */
export const potionFromPotionsRow = (row) => ({
    A: parseInt(row.A, 10),
    B: parseInt(row.B, 10),
    C: parseInt(row.C, 10),
    category: row.Category,
    D: parseInt(row.D, 10),
    E: parseInt(row.E, 10),
    name: row.Name,
});
