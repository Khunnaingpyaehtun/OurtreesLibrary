import fs from "fs";
import * as xlsx from "xlsx";

async function fetchAndParseXlsx() {
  try {
    const url =
      "https://docs.google.com/spreadsheets/d/1c4GWXYbRBe_ko-9DjCy8Ep_X1A79Eu_mZy38TZBCb8Y/export?format=xlsx";
    console.log("Fetching:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    console.log("Sheet Names:", workbook.SheetNames);

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);
      console.log(`Saving sheet ${sheetName}. Total rows: ${data.length}`);
      fs.writeFileSync(
        `sheet_${sheetName}.json`,
        JSON.stringify(data, null, 2),
      );
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchAndParseXlsx();
