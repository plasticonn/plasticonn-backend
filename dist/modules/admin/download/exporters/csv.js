"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = void 0;
const json2csv_1 = require("json2csv");
const exportToCSV = (data, name) => {
    const parser = new json2csv_1.Parser();
    const csv = parser.parse(data);
    return {
        name: `${name}.csv`,
        contentType: "text/csv",
        buffer: Buffer.from(csv),
    };
};
exports.exportToCSV = exportToCSV;
