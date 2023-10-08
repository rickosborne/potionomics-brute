import {intFrom} from "./spreadsheet-helpers.js";
import {Location, LocationsRow} from "./type/location.js";

/**
 * @function
 * @param {LocationsRow} row
 * @returns {Location}
 */
export const locationFromLocationsRow = (row) => ({
    chapter: intFrom(row.Chapter),
    name: row.Name,
});
