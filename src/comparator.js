/**
 * @typedef Comparator
 * @template T
 * @type {function(T, T):number}
 */

/** @type {Comparator} */
export let Comparator;

/**
 * @typedef ComparatorBuilder
 * @type {object}
 * @template T
 * @property {function(function(T):number):ComparatorBuilder.<T>} numbers
 * @property {function():(ComparatorBuilder.<T>)} reversed
 * @property {function(function(T):string):ComparatorBuilder.<T>} strings
 * @property {function():(Comparator.<T>)} build
 */

/** @type {ComparatorBuilder} */
export let ComparatorBuilder;

/**
 * @function
 * @template T
 * @returns {ComparatorBuilder.<T>}
 */
export const comparatorBuilder = () => {
    /**
     * @template T
     * @type {Comparator.<T>[]}
     */
    const list = [];
    /**
     * @template T
     * @type {ComparatorBuilder.<T>}
     */
    const cmp = {
        build() {
            return (a, b) => {
                for (const comparator of list) {
                    const result = comparator(a, b);
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            };
        },
        numbers(accessor) {
            list.push((a, b) => accessor(a) - accessor(b));
            return cmp;
        },
        reversed() {
            if (list.length < 1) {
                throw new Error("Cannot reverse an empty comparator");
            }
            const comparator = list[list.length - 1];
            list[list.length - 1] = (a, b) => -1 * comparator(a, b);
            return cmp;
        },
        strings(accessor) {
            list.push((a, b) => accessor(a).localeCompare(accessor(b)));
            return cmp;
        },
    };
    return cmp;
};
