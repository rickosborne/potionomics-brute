import console from "node:console";

/**
 * @param {number} range
 * @param {number} count
 * @param {boolean} log
 * @returns {number}
 */
export const multiChooseCount = (range, count, log = true) => {
    // (n + k - 1)! / (k! * (n - 1)!)
    // n=10,k=3: (10 + 3 - 1)!/(3! * (10 - 1)!) => 12!/(3!*9!)
    // => (12*11*10)/3!
    let num = 1;
    let den = 1;
    for (let i = 0; i < count; i++) {
        num *= range + i;
        den *= 1 + i;
    }
    const total = num / den;
    if (log) {
        console.log(`${range} multichoose ${count} => ${total.toLocaleString()}`);
    }
    return total;
};
