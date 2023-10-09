/**
 * @typedef Predicate
 * @template T
 * @type {function(T, number, T[]):boolean}
 */

/** @type {Predicate} */
export let Predicate;

/**
 * @typedef FilterPipeline
 * @template T
 * @type {object}
 * @property {function():T[]} apply
 * @property {{[key: string]: number}} counts
 * @property {Predicate.<T>} predicate
 * @property {function(string, Predicate.<T>):FilterPipeline.<T>} step
 * @property {function(boolean, string, Predicate.<T>):FilterPipeline.<T>} stepIf
 * @property {function(string=):string} summary
 */

/** @type {FilterPipeline} */
export let FilterPipeline;

/**
 * @function
 * @template T
 * @param {T[]} list
 * @param {string=} name
 * @returns {FilterPipeline.<T>}
 */
export const filterPipeline = (list, name = "initial size") => {
    /** @type {{name: string, predicate:Predicate}[]} */
    const predicates = [];
    const initialCount = list.length;
    /** @type {{[key: string]: number}} */
    const counts = {};
    /** @type {FilterPipeline} */
    const pipeline = {
        apply() {
            return list.filter(pipeline.predicate);
        },
        get counts() {
            return {...counts};
        },
        get predicate() {
            return (item, index, all) => {
                for (const {name, predicate} of predicates) {
                    const outcome = predicate(item, index, all);
                    if (!outcome) return false;
                    counts[name]++;
                }
                return true;
            };
        },
        step(name, predicate) {
            predicates.push({name, predicate});
            counts[name] = 0;
            return pipeline;
        },
        stepIf(condition, name, predicate) {
            if (condition) {
                pipeline.step(name, predicate);
            }
            return pipeline;
        },
        summary(delimiter = "; ") {
            return [
                `${name}=${initialCount.toLocaleString()}`,
                ...predicates.map(({name}) => `${name}=${counts[name].toLocaleString()}`),
            ].join(delimiter);
        },
    };
    return pipeline;
};
