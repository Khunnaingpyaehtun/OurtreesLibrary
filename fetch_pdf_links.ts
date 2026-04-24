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

    if (workbook.SheetNames.includes("PDF_Links")) {
      const sheet = workbook.Sheets["PDF_Links"];
      const data = xlsx.utils.sheet_to_json(sheet);
      console.log("Found PDF_Links sheet. Total rows:", data.length);
      console.log("First 5 rows:", data.slice(0, 5));
      fs.writeFileSync("pdf_links.json", JSON.stringify(data, null, 2));
    } else {
      console.log("PDF_Links sheet not found.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchAndParseXlsx();
