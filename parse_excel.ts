import * as xlsx from "xlsx";
import * as fs from "fs";

async function main() {
  try {
    const res = await fetch(
      "https://docs.google.com/spreadsheets/d/1y_L6lPDsDHzAPKnACvMTl1xJAtDstLAs/export?format=xlsx",
    );
    const buffer = await res.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });

    console.log("Sheet names:", workbook.SheetNames);

    for (const sheetName of workbook.SheetNames) {
      console.log(`\n--- Sheet: ${sheetName} ---`);
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      console.log(JSON.stringify(data.slice(0, 5), null, 2));
      if (data.length > 5) {
        console.log(`... and ${data.length - 5} more rows`);
      }

      // If this is the main sheet, let's save it to a file so we can read it
      if (data.length > 0) {
        fs.writeFileSync(
          `sheet_${sheetName}.json`,
          JSON.stringify(data, null, 2),
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}

main();
