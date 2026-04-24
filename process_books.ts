import fs from "fs";

const data = fs.readFileSync("all_pdf_links.csv", "utf8");
const lines = data.split("\n");
const validPdfs = lines.filter((line) => {
  const [name] = line.split(",");
  return name && !name.startsWith("._") && name.toLowerCase().endsWith(".pdf");
});

const books = validPdfs.map((line) => {
  const firstComma = line.indexOf(",");
  const name = line.substring(0, firstComma).trim();
  const url = line.substring(firstComma + 1).trim();

  const parts = name.replace(".pdf", "").split("_");
  let id = parts[0] || "";
  let category = parts[1] || "";
  let author = parts[2] || "Unknown Author";
  let title = parts.slice(3).join("_") || name.replace(".pdf", "");

  if (parts.length < 4) {
    title = name.replace(".pdf", "");
    author = "Unknown Author";
  }

  return {
    id,
    category,
    author,
    title,
    fileName: name,
    url,
  };
});

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/books.json", JSON.stringify(books, null, 2));
console.log("Created src/data/books.json with", books.length, "books");
