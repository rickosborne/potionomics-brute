import {isArray} from "./is-array.js";
import {isString} from "./is-string.js";

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
 * @param {T[]|string|undefined} [listOrName]
 * @param {string=} [initialName]
 * @returns {FilterPipeline.<T>}
 */
export const filterPipeline = (listOrName, initialName) => {
    /** @type {string} */
    let name = initialName ?? "initial";
    /** @type {number|undefined} */
    let initialCount = undefined;
    /** @type {[]|undefined} */
    let list = undefined;
    /** @type {{[key: string]: number}} */
    const counts = {};
    if (isArray(listOrName)) {
        list = listOrName;
        initialCount = list.length;
        counts[name] = initialCount;
    } else if (isString(listOrName)) {
        name = listOrName;
    }
    /** @type {{name: string, predicate:Predicate}[]} */
    const predicates = [];
    /** @type {FilterPipeline} */
    const pipeline = {
        apply() {
            return list?.filter(pipeline.predicate);
        },
        get counts() {
            return {...counts};
        },
        get predicate() {
            return (item, index, all) => {
                initialCount ??= all?.length;
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
                ...(initialCount == null ? [] : [`${name}=${initialCount.toLocaleString()}`]),
                ...predicates.map(({name}) => `${name}=${counts[name].toLocaleString()}`),
            ].join(delimiter);
        },
    };
    return pipeline;
};
