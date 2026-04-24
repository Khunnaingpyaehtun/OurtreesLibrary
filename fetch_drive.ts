import fs from "fs";

async function fetchDriveData() {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyuqqOSR5q2N68wZLkeb7eCdLxkx5upzTQgsN4QGsjzMBY3s-s1g-QcQvtmEIlhnXLbnw/exec",
    );
    const data = await response.text();
    fs.writeFileSync("drive_files.json", data);
    console.log("Successfully fetched data. First 500 chars:");
    console.log(data.substring(0, 500));
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

fetchDriveData();
