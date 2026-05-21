"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const exportToExcel = async (data, name) => {
    const workbook = new exceljs_1.default.Workbook();
    const sheet = workbook.addWorksheet("Data");
    sheet.columns = Object.keys(data[0] || {}).map((key) => ({
        header: key,
        key,
    }));
    data.forEach((row) => sheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    return {
        name: `${name}.xlsx`,
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        buffer,
    };
};
exports.exportToExcel = exportToExcel;
