import {Color, COLORS} from "./type/color.js";
import {ExpandedPotion, Potion} from "./type/potion.js";

/**
 * @function
 * @param {Potion} potion
 * @returns {ExpandedPotion}
 */
export const expandPotion = (potion) => {
    const wantSum = potion.A + potion.B + potion.C + potion.D + potion.E;
    return ({
        ...potion,
        ratios: COLORS.map((color) => ({
            /** @type {Color} */
            color,
            /** @type {number} */
            wantRatio: potion[color] / wantSum,
        })),
        wantSum,
    });
};
