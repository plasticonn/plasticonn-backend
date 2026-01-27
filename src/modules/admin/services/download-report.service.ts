import { fetchDataset } from "../download/datasets";
import { exportToCSV } from "../download/exporters/csv";
import { exportToExcel } from "../download/exporters/excel";
import { exportToPDF } from "../download/exporters/pdf";
import { exportToGeoJSON } from "../download/exporters/geojson";

export class AdminDownloadService {
  static async generate(dataset: string, format: string, filters: any) {
    const data = await fetchDataset(dataset, filters);

    switch (format) {
      case "csv":
        return exportToCSV(data, dataset);
      case "excel":
        return exportToExcel(data, dataset);
      case "pdf":
        return exportToPDF(data, dataset);
      case "geojson":
        return exportToGeoJSON(data, dataset);
      default:
        throw new Error("Unsupported format");
    }
  }
}
