const {Chapter} = require("./chapter.js");

/**
 * @typedef LocationName
 * @type {string}
 */

/**
 * @type {LocationName}
 */
let LocationName;

/**
 * @typedef Location
 * @type {object}
 * @property {LocationName} name
 * @property {Chapter} chapter
 */

/** @type {Location} */
let Location;

/**
 * @typedef LocationsRow
 * @type {object}
 * @property {string} Name
 * @property {string} Chapter
 */

/** @type {LocationsRow} */
let LocationsRow;

// noinspection JSUnusedAssignment
module.exports = {Location, LocationName, LocationsRow};
