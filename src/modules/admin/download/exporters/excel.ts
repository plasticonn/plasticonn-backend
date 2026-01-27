import ExcelJS from "exceljs";

export const exportToExcel = async (data: any[], name: string) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Data");

  sheet.columns = Object.keys(data[0] || {}).map((key) => ({
    header: key,
    key,
  }));

  data.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    name: `${name}.xlsx`,
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    buffer,
  };
};
