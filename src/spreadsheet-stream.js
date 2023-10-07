import {createWriteStream} from "node:fs";
import {existsSync} from "./exists-sync.js";

/**
 * @param {string} filePath
 * @param {{name: string, toString: (function(*,string):string)}[]} headers
 * @returns {{close:(function():void), write:(function(*):void)}}
 */
export const spreadsheetStream = (filePath, headers) => {
    const didExist = existsSync(filePath, (s) => s.isFile());
    // if (didExist) {
    //     copyFileSync(filePath, `${filePath}.${Date.now()}.backup`);
    // }
    const outStream = createWriteStream(filePath, {encoding: 'utf8', flags: 'as'});
    if (!didExist) {
        const headerLine = headers.map(({name}) => name).join("\t").concat("\n");
        outStream.write(headerLine);
    }
    return {
        close() {
            outStream.close();
        },
        write(obj) {
            const line = headers.map(({name, toString}) => toString(obj[name], name)).join("\t").concat("\n");
            outStream.write(line);
        },
    };
};
