const fs = require('fs');

function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const data = {};
    lines.forEach(line => {
        // Expected format: "Ayat 1: 71" or similar
        const match = line.match(/Ayat\s+(\d+):\s*(\d+)/i);
        if (match) {
            data[parseInt(match[1], 10)] = parseInt(match[2], 10);
        }
    });
    return data;
}

const abjadData = parseFile('abjad_results_baqarah.txt');
const smData = parseFile('sm_results_baqarah.txt');

const differences = [];
const allAyats = new Set([...Object.keys(abjadData), ...Object.keys(smData)]);

allAyats.forEach(ayat => {
    const abjadVal = abjadData[ayat];
    const smVal = smData[ayat];
    if (abjadVal !== smVal) {
        differences.push({
            ayat,
            abjadVal: abjadVal || 'N/A',
            smVal: smVal || 'N/A'
        });
    }
});

differences.sort((a, b) => a.ayat - b.ayat);

if (differences.length === 0) {
    console.log("No differences found!");
} else {
    console.log(`Found ${differences.length} differences:\n`);
    console.log("Ayat | Code Result | PDF Result");
    console.log("-----|-------------|-----------");
    differences.forEach(diff => {
        console.log(`${diff.ayat.toString().padEnd(4)} | ${diff.abjadVal.toString().padEnd(11)} | ${diff.smVal}`);
    });
}
