const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'all_quran_surahs_114');

try {
  // Read the directory and get only .txt files
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));

  console.log("Here is your extracted array. Copy and paste this into the main script:\n");
  console.log("const quranFiles = [");
  
  files.forEach((file, index) => {
    // We leave the standard name blank for you to quickly verify, 
    // but the file names will match exactly what is on your hard drive.
    console.log(`  { num: ${index + 1}, file: "${file}" },`);
  });
  
  console.log("];");

} catch (err) {
  console.error("Could not read the folder. Make sure the folder path is correct.", err);
}