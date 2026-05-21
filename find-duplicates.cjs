const fs = require('fs');
const txt = fs.readFileSync('src/app/spots/[id]/nearby/page.tsx', 'utf8');
const lines = txt.split('\n');
const keys = {};
lines.forEach((line, i) => {
  const m = line.match(/^\s*"([^"]+)":\s*\{/);
  if (m) {
    const key = m[1];
    if (keys[key]) {
      console.log('Duplicate:', key, 'at lines', keys[key], i + 1);
    } else {
      keys[key] = i + 1;
    }
  }
});
