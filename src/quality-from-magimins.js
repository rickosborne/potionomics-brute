import {Quality} from "./type/quality.js";

/**
 * @type {number[][]}
 */
const QUALITY_CHART = [
    [0, 10, 20, 30, 40, 50],
    [60, 75, 90, 105, 115, 130],
    [150, 170, 195, 215, 235, 260],
    [290, 315, 345, 370, 400, 430],
    [470, 505, 545, 580, 620, 660],
    [720, 800, 875, 960, 1040, 1125],
];

const TIER_COUNT = QUALITY_CHART.length;
const LAST_TIER = TIER_COUNT - 1;
const MAX_STARS = QUALITY_CHART[0].length;
const LAST_STARS = MAX_STARS - 1;

/**
 * @type {Map<number, Quality>}
 */
const seen = new Map();

/**
 * @param {number} magimins
 * @returns {Quality}
 */
export const qualityFromMagimins = (magimins) => {
    const found = seen.get(magimins);
    if (found != null) {
        return found;
    }
    for (let tier = LAST_TIER; tier >= 0; tier--) {
        const row = QUALITY_CHART[tier];
        if (magimins < row[0]) continue;
        for (let stars = LAST_STARS; stars >= 0; stars--) {
            if (magimins >= row[stars]) {
                /**
                 * @type {Quality}
                 */
                const quality = {stars, tier};
                seen.set(magimins, quality);
                return quality;
            }
        }
    }
    throw new Error(`qualityFromMagimins(${JSON.stringify(magimins)}) failed`);
};
