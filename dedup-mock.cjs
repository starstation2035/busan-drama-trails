const fs = require('fs');

let content = fs.readFileSync('src/data/mockReviews.ts', 'utf8');

// Remove duplicate consecutive occurrences of the same field
// Pattern: we look for same key appearing twice in a row within a review block
const fieldsToDedup = ['location_ja', 'location_zh_CN', 'content_ja', 'content_zh_CN'];

for (const field of fieldsToDedup) {
  // Match: field: "value"\n    field: "value" (duplicate)
  // We do this by finding consecutive duplicate lines
  const lines = content.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i];
    const next = lines[i + 1];
    // Check if current line has the field and next line is identical
    if (
      curr.trim().startsWith(`${field}:`) &&
      next &&
      next.trim().startsWith(`${field}:`)
    ) {
      // Skip the duplicate (next line)
      out.push(curr);
      i++; // skip next
    } else {
      out.push(curr);
    }
  }
  content = out.join('\n');
}

fs.writeFileSync('src/data/mockReviews.ts', content);
console.log('Deduplication complete');

// Verify
const verify = fs.readFileSync('src/data/mockReviews.ts', 'utf8');
const vlines = verify.split('\n');
let dupFound = false;
for (let i = 0; i < vlines.length - 1; i++) {
  for (const field of fieldsToDedup) {
    if (vlines[i].trim().startsWith(`${field}:`) && vlines[i+1].trim().startsWith(`${field}:`)) {
      console.log('STILL DUPLICATE at line', i+1, ':', vlines[i].trim());
      dupFound = true;
    }
  }
}
if (!dupFound) console.log('No duplicates remain!');
