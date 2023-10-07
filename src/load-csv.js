import ReadLines from "n-readlines";
import {assertIsAnyOf} from "./is-any-of";
import {assertIsArray} from "./is-array";
import {assertIsFunction} from "./is-function";
import {assertIsString, isString} from "./is-string";

/**
 * @function
 * @template T
 * @param {!string} filePath
 * @param {!(function({[key:string]:*}):T)} rowMapper
 * @param {{}} [config]
 * @param {string | RegExp} [config.delimiter]
 * @param {string[]} [config.headers]
 * @returns {T[]}
 */
export const loadSpreadsheet = (filePath, rowMapper, {delimiter, headers} = {}) => {
    assertIsString(filePath, "loadSpreadsheet:filePath");
    assertIsFunction(rowMapper, "loadSpreadsheet:rowMapper");
    const reader = new ReadLines(filePath);
    const delim = delimiter ?? (filePath.endsWith(".csv") ? "," : "\t");
    assertIsAnyOf(delim, "loadSpreadsheet:delimiter", isString, (d) => d instanceof RegExp);
    let headerNames = headers;
    let buffer;
    if (headerNames == null) {
        buffer = reader.next();
        // noinspection JSCheckFunctionSignatures
        headerNames = buffer.toString("utf8").trim().split(delim);
    }
    assertIsArray(headerNames, "loadSpreadsheet:headers");
    const records = [];
    while ((buffer = reader.next())) {
        // noinspection JSCheckFunctionSignatures
        const line = buffer.toString("utf8").trim();
        if (line === "") continue;
        const values = line.split(delim);
        const unmapped = Object.fromEntries(values.map((value, index) => [headerNames[index], value?.trim()]));
        const record = rowMapper(unmapped);
        if (record != null) {
            records.push(record);
        }
    }
    return records;
};
