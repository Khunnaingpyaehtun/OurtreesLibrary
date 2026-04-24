import fs from "fs";

async function checkGid() {
  try {
    const url =
      "https://docs.google.com/spreadsheets/d/1c4GWXYbRBe_ko-9DjCy8Ep_X1A79Eu_mZy38TZBCb8Y/export?format=csv&gid=1652054123";
    console.log("Fetching:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    console.log("Successfully fetched CSV. First 500 chars:");
    console.log(data.substring(0, 500));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkGid();
