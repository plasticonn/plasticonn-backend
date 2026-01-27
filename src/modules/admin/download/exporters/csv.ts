import { Parser } from "json2csv";

export const exportToCSV = (data: any[], name: string) => {
  const parser = new Parser();
  const csv = parser.parse(data);

  return {
    name: `${name}.csv`,
    contentType: "text/csv",
    buffer: Buffer.from(csv),
  };
};
