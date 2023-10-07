import {zeroPad} from "./zero-pad.js";

const DURATION_PARTS = [
    [1000, "", 3, "ms"],
    [60, ".", 2, "s"],
    [60, ":", 2, "m"],
    [24, ":", 2, "h"],
    [7, "d ", 1, "d"],
    [52, "w ", 2, "w"],
    [-1, "y ", -1, "y"],
];

/**
 * @param {number} ms
 * @returns {string}
 */
export const duration = (ms) => {
    const parts = [];
    let acc = Math.round(ms);
    for (let def of DURATION_PARTS) {
        if (acc === 0) break;
        const [divisor, delim, digits] = def;
        const value = divisor > 0 ? (acc % divisor) : acc;
        acc = divisor > 0 ? Math.floor(acc / divisor) : 0;
        parts.unshift(delim);
        const s = zeroPad(value, digits);
        parts.unshift(s);
    }
    return parts.join("");
};
