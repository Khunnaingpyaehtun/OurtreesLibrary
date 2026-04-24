import fs from "fs";

const data = fs.readFileSync("all_pdf_links.csv", "utf8");
const lines = data.split("\n");
const validPdfs = lines.filter((line) => {
  const [name] = line.split(",");
  return name && !name.startsWith("._") && name.toLowerCase().endsWith(".pdf");
});

console.log(validPdfs.join("\n"));
