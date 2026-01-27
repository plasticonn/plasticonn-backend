import PDFDocument from "pdfkit";

export const exportToPDF = async (data: any[], name: string) => {
  return new Promise<{
    name: string;
    contentType: string;
    buffer: Buffer;
  }>((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve({
        name: `${name}.pdf`,
        contentType: "application/pdf",
        buffer: Buffer.concat(buffers),
      });
    });

    doc
      .fontSize(16)
      .text(`${name.toUpperCase()} REPORT`, { align: "center" })
      .moveDown(2);

    if (!data.length) {
      doc.fontSize(12).text("No data available");
      doc.end();
      return;
    }

    const headers = Object.keys(data[0]);

    doc.fontSize(10).font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, 40 + i * 100, doc.y, {
        width: 90,
        continued: i !== headers.length - 1,
      });
    });

    doc.moveDown(0.5);
    doc.font("Helvetica");

    data.forEach((row) => {
      headers.forEach((header, i) => {
        const value =
          row[header] === null || row[header] === undefined
            ? ""
            : String(row[header]);

        doc.text(value, 40 + i * 100, doc.y, {
          width: 90,
          continued: i !== headers.length - 1,
        });
      });
      doc.moveDown(0.5);
    });

    doc.end();
  });
};
