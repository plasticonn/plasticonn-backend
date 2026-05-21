"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDownloadService = void 0;
const datasets_1 = require("../download/datasets");
const csv_1 = require("../download/exporters/csv");
const excel_1 = require("../download/exporters/excel");
const pdf_1 = require("../download/exporters/pdf");
const geojson_1 = require("../download/exporters/geojson");
class AdminDownloadService {
    static async generate(dataset, format, filters) {
        const data = await (0, datasets_1.fetchDataset)(dataset, filters);
        switch (format) {
            case "csv":
                return (0, csv_1.exportToCSV)(data, dataset);
            case "excel":
                return (0, excel_1.exportToExcel)(data, dataset);
            case "pdf":
                return (0, pdf_1.exportToPDF)(data, dataset);
            case "geojson":
                return (0, geojson_1.exportToGeoJSON)(data, dataset);
            default:
                throw new Error("Unsupported format");
        }
    }
}
exports.AdminDownloadService = AdminDownloadService;
