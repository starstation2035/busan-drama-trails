const fs = require('fs');
const txt = fs.readFileSync('src/data/mockReviews.ts', 'utf8');
const regex = /id:\s*(\d+),\s*author:\s*"([^"]+)",\s*location:\s*"([^"]+)"[\s\S]*?content_zh_TW:.*?\",/g;
let m;
while ((m = regex.exec(txt)) !== null) {
  const id = m[1];
  const loc = m[3];
  const matchStr = m[0];
  const hasJa = matchStr.includes('content_ja');
  console.log('ID:', id, 'Location:', loc, 'HasJa:', hasJa);
}
