import fs from "fs";

const data = fs.readFileSync("all_pdf_links.csv", "utf8");
const lines = data.split("\n");
const validPdfs = lines.filter((line) => {
  const [name] = line.split(",");
  return name && !name.startsWith("._") && name.toLowerCase().endsWith(".pdf");
});

// Read existing booksData.ts
let booksDataStr = fs.readFileSync("booksData.ts", "utf8");
// Extract the JSON part
const jsonStart = booksDataStr.indexOf("[\n  {");
const jsonEnd = booksDataStr.lastIndexOf("]") + 1;
const booksJsonStr = booksDataStr.substring(jsonStart, jsonEnd);
const books = JSON.parse(booksJsonStr);

let matchedCount = 0;
let addedCount = 0;

validPdfs.forEach((line) => {
  const firstComma = line.indexOf(",");
  const name = line.substring(0, firstComma).trim();
  const url = line.substring(firstComma + 1).trim();

  const parts = name.replace(".pdf", "").split("_");
  let titleFromFilename = parts.slice(3).join("_") || name.replace(".pdf", "");
  let authorFromFilename = parts[2] || "Unknown";
  let categoryFromFilename = parts[1] || "000";

  const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();
  const normalizedFilenameTitle = normalize(titleFromFilename);

  const match = books.find((b) => {
    const normalizedBookTitle = normalize(b.title);
    return (
      normalizedBookTitle === normalizedFilenameTitle ||
      normalizedFilenameTitle.includes(normalizedBookTitle) ||
      normalizedBookTitle.includes(normalizedFilenameTitle)
    );
  });

  if (match) {
    match.pdfUrl = url;
    matchedCount++;
  } else {
    // Add new book
    const newId = Math.max(...books.map((b) => b.id)) + 1;
    books.push({
      id: newId,
      title: titleFromFilename.replace(/([A-Z])/g, " $1").trim(), // Basic spacing for CamelCase
      author: authorFromFilename.replace(/([A-Z])/g, " $1").trim(),
      ddc: categoryFromFilename.substring(0, 3), // Ensure 3 digits
      isFeatured: false,
      views: 0,
      year: "Unknown",
      coverUrl: `https://picsum.photos/seed/${newId}/400/600`,
      pdfUrl: url,
    });
    addedCount++;
  }
});

console.log(
  `Matched ${matchedCount} existing. Added ${addedCount} new out of ${validPdfs.length} PDFs.`,
);

const newBooksDataStr = `import { Book } from './types';\n\nexport const GENERATED_BOOKS: Book[] = ${JSON.stringify(books, null, 2)};\n`;
fs.writeFileSync("booksData.ts", newBooksDataStr);
console.log("Updated booksData.ts");
