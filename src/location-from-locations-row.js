import {Location, LocationsRow} from "./type/location.js";

/**
 * @function
 * @param {LocationsRow} row
 * @returns {Location}
 */
export const locationFromLocationsRow = (row) => ({
	chapter: parseInt(row.Chapter, 10),
	name: row.Name,
});
