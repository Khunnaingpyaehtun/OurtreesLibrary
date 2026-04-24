import fs from "fs";

async function fetchNewDriveData() {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbywpSGE2kHEywwB7JRQRzZJWb65ipSvUSLmU-_Qd9kyGUu41-OPGVO36CJInEWmqEopvA/exec",
    );
    const data = await response.text();
    fs.writeFileSync("new_drive_files.html", data);
    console.log("Successfully fetched data. First 500 chars:");
    console.log(data.substring(0, 500));
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchNewDriveData();
