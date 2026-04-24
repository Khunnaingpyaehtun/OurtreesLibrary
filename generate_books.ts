import * as fs from "fs";

const data = JSON.parse(
  fs.readFileSync("sheet_ACCESSION REGISTER.json", "utf-8"),
);

const books = [];
let idCounter = 1;

for (let i = 2; i < data.length; i++) {
  const row = data[i];

  const classNumber = row["__EMPTY"] || "";
  const title = row["__EMPTY_1"] || "Unknown Title";
  const author = row["__EMPTY_2"] || "Unknown Author";
  const publisher = row["__EMPTY_3"] || "";
  const year = row["__EMPTY_4"] || "Unknown";

  if (!classNumber && !title) continue;

  let ddc = "000";
  if (typeof classNumber === "string" && classNumber.length >= 3) {
    ddc = classNumber.substring(0, 3);
  } else if (typeof classNumber === "number") {
    ddc = String(classNumber).padStart(3, "0").substring(0, 3);
  }

  // Fallback to 000 if ddc is not a valid category
  const validDDCs = [
    "000",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];
  let finalDdc = ddc;
  if (!validDDCs.includes(ddc)) {
    // try to find closest or default to 000
    const firstDigit = ddc.charAt(0);
    if (firstDigit >= "0" && firstDigit <= "9") {
      finalDdc = firstDigit + "00";
    } else {
      finalDdc = "000";
    }
  }

  // We don't have real cover/pdf URLs in the spreadsheet, so we use placeholders
  // For cover, we can use a placeholder image service
  const coverUrl = `https://picsum.photos/seed/${idCounter}/400/600`;
  // For PDF, we can leave it empty or use a dummy. Since the app expects pdfUrl to view, let's use a dummy pdf or empty.
  // Actually, if pdfUrl is empty, the BookDetail component handles it gracefully (shows "No PDF available" or similar, wait, let's check BookDetail).
  // In BookDetail: `if (!book.pdfUrl) { setPdfLoading(false); return; }`
  // Let's provide an empty string for pdfUrl so it doesn't try to load a fake PDF and fail.
  const pdfUrl = "";

  books.push({
    id: idCounter++,
    title: String(title).trim(),
    author: String(author).trim(),
    ddc: finalDdc,
    isFeatured: idCounter <= 10, // make first 10 featured
    views: Math.floor(Math.random() * 500),
    year: String(year).trim(),
    coverUrl: coverUrl,
    pdfUrl: pdfUrl,
  });
}

const fileContent = `import { Book } from './types';\n\nexport const GENERATED_BOOKS: Book[] = ${JSON.stringify(books, null, 2)};\n`;

fs.writeFileSync("booksData.ts", fileContent);
console.log(`Generated ${books.length} books.`);
