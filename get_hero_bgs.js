const fs = require('fs');
const css = fs.readFileSync('d:/meroskhiva/Meros/Meros/style.css', 'utf8');

const regex = /\.([a-zA-Z0-9_-]+-hero)[\s\S]*?background.*?url\(['"]?([^'")]+)['"]?\)/g;
let match;
while ((match = regex.exec(css)) !== null) {
    console.log(match[1] + " -> " + match[2]);
}
