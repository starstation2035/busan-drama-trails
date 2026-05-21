const fs = require('fs');

const txt = fs.readFileSync('src/app/spots/[id]/nearby/page.tsx', 'utf8');

// Extract all Korean names in the tr dict
const trNames = new Set();
const trRx = /"([^"]+)":\s*\{\s*"en"/g;
let m;
while ((m = trRx.exec(txt)) !== null) trNames.add(m[1]);

// Extract all ko names in item data
const koNames = new Set();
const nameRx = /name:\s*\{\s*ko:\s*"([^"]+)"/g;
while ((m = nameRx.exec(txt)) !== null) koNames.add(m[1]);
const sigRx = /signature:\s*\{\s*ko:\s*"([^"]+)"/g;
while ((m = sigRx.exec(txt)) !== null) koNames.add(m[1]);
const foodRx = /food:\s*\{\s*ko:\s*"([^"]+)"/g;
while ((m = foodRx.exec(txt)) !== null) koNames.add(m[1]);

// Find missing
const missing = [];
for (const n of koNames) {
  if (!trNames.has(n)) missing.push(n);
}

console.log('Missing from tr dict:');
missing.forEach(n => console.log(' -', n));
