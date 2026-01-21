const fs = require('fs');
const path = require('path');

// 1. Get all HTML files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let htmlKeys = new Set();
let filesWithKeys = {};

// 2. Extract keys from HTML
const regexHtml = /data-i18n="([^"]+)"/g;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = regexHtml.exec(content)) !== null) {
        htmlKeys.add(match[1]);
        if (!filesWithKeys[match[1]]) filesWithKeys[match[1]] = [];
        filesWithKeys[match[1]].push(file);
    }
});

console.log(`Found ${htmlKeys.size} unique keys in ${files.length} HTML files.`);

// 3. Extract keys from main.js
// We'll look for the structure "key": "value" inside the lang objects
const mainJs = fs.readFileSync('main.js', 'utf8');

// Simple parser to find keys in main.js. 
// We know they look like: "nav.home": "..."
const regexJs = /"([\w\._]+)":\s*"/g;
let jsKeys = new Set();
let match;
while ((match = regexJs.exec(mainJs)) !== null) {
    jsKeys.add(match[1]);
}

// 4. Compare
let missingInJs = [];
htmlKeys.forEach(key => {
    if (!jsKeys.has(key)) {
        missingInJs.push(key);
    }
});

if (missingInJs.length > 0) {
    console.log("\n❌ MISSING KEYS IN main.js (Defined in HTML but no translation found):");
    missingInJs.forEach(k => console.log(` - ${k} (in ${filesWithKeys[k].join(', ')})`));
} else {
    console.log("\n✅ All HTML keys are present in main.js.");
}

// 5. Check for potentially untranslated text (Hardcoded English)
// This is a heuristic: look for text inside tags that don't have data-i18n, excluding scripts/styles
console.log("\n⚠️  POTENTIAL HARDCODED TEXT (Heuristic Check):");
// This is hard to do perfectly, but let's check for specific known "old" phrases if requested,
// or just look for tags with text content but no data-i18n attribute.
