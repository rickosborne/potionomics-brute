import {loadSpreadsheet} from "./load-csv.js";
import {Potion} from "./type/potion.js";

/**
 * @typedef PotionsRow
 * @type {object}
 * @property {string} Name
 * @property {string} Category
 * @property {string} A
 * @property {string} B
 * @property {string} C
 * @property {string} D
 * @property {string} E
 */

/**
 * @returns {Potion[]}
 */
export const loadPotions = () => {
    return loadSpreadsheet(
        "data/potions.tsv",
        /**
         * @param {PotionsRow} row
         * @returns {Potion}
         */
        (row) => ({
            A: parseInt(row.A, 10),
            B: parseInt(row.B, 10),
            C: parseInt(row.C, 10),
            category: row.Category,
            D: parseInt(row.D, 10),
            E: parseInt(row.E, 10),
            name: row.Name,
        }),
    );
};
