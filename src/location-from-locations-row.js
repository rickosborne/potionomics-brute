const {intFrom} = require("./spreadsheet-helpers.js");
const {Location, LocationsRow} = require("./type/location.js");

/**
 * @function
 * @param {LocationsRow} row
 * @returns {Location}
 */
const locationFromLocationsRow = (row) => ({
	chapter: intFrom(row.Chapter),
	name: row.Name,
});

module.exports = {locationFromLocationsRow};
