const {createWriteStream} = require("node:fs");
const {existsSync} = require("./exists-sync.js");
const {SpreadsheetHeader} = require("./type/spreadsheet.js");

/**
 * @typedef SpreadsheetStream
 * @template T
 * @type {object}
 * @property {function():void} close
 * @property {function(T):void} write
 */

/** @type {SpreadsheetStream} */
let SpreadsheetStream;


/**
 * @function
 * @template T
 * @param {SpreadsheetHeader.<T>[]} headers
 * @returns {function(T): string}
 */
const spreadsheetSerializer = (headers) => (obj) => headers
	.map(({name, toString}) => toString(obj[name], name, obj))
	.join("\t")
	.concat("\n");

/**
 * @template T
 * @param {string} filePath
 * @param {{name: string, toString: (function(*,string,T):string)}[]} headers
 * @returns {SpreadsheetStream.<T>}
 */
const spreadsheetStream = (filePath, headers) => {
	const didExist = existsSync(filePath, (s) => s.isFile());
	// if (didExist) {
	//     copyFileSync(filePath, `${filePath}.${Date.now()}.backup`);
	// }
	const outStream = createWriteStream(filePath, {encoding: 'utf8', flags: 'as'});
	if (!didExist) {
		const headerLine = headers.map(({name}) => name).join("\t").concat("\n");
		outStream.write(headerLine);
	}
	const serializer = spreadsheetSerializer(headers);
	return {
		close() {
			outStream.close();
		},
		write(obj) {
			const line = serializer(obj);
			outStream.write(line);
		},
	};
};

// noinspection JSUnusedAssignment
module.exports = {spreadsheetSerializer, spreadsheetStream, SpreadsheetStream};
