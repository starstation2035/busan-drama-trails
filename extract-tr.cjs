const fs = require('fs');
const txt = fs.readFileSync('src/app/spots/[id]/nearby/page.tsx', 'utf8');

const rx = /(?:name|signature):\s*\{\s*ko:\s*"([^"]+)"/g;
let m;
const set = new Set();
while ((m = rx.exec(txt)) !== null) {
  set.add(m[1]);
}

const cafes = fs.readFileSync('src/data/nearby_cafes.ts', 'utf8');
const rx2 = /name:\s*"([^"]+)"/g;
const rx3 = /signature:\s*\{\s*ko:\s*"([^"]+)"/g;
while ((m = rx2.exec(cafes)) !== null) {
  set.add(m[1]);
}
while ((m = rx3.exec(cafes)) !== null) {
  set.add(m[1]);
}

console.log(Array.from(set));
