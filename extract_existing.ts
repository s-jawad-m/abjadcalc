import fs from "fs";

const content = fs.readFileSync("surah_baqarah_sm_text.txt", "utf8");
const lines = content.split("\n").filter((line) => line.trim().length > 0);

let output = "";

lines.forEach((line) => {
  // Regex matches text followed by "Number ۞ Value"
  const match = line.match(/(\d+)\s*۞\s*(\d+)/);
  if (match) {
    const ayatNum = match[1];
    const existingValue = match[2];
    output += `${ayatNum} : ${existingValue}\n`;
  }
});

fs.writeFileSync("baqarah_existing_values.txt", output);
console.log("Existing values extracted to baqarah_existing_values.txt");
