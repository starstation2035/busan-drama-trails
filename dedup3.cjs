const fs = require('fs');

let content = fs.readFileSync('src/data/mockReviews.ts', 'utf8');
content = content.replace(/\r\n/g, '\n');

const fieldsToDedup = ['location_ja', 'location_zh_CN', 'content_ja', 'content_zh_CN', 'location_en'];

// Strategy: within each object literal { ... }, keep only the FIRST occurrence of each field
// We'll split by object boundaries and process each

// Simple regex-based approach: remove any duplicate field within proximity
for (const field of fieldsToDedup) {
  // Find all occurrences of `    field: "..."` or `    field:\n      "..."`
  // and deduplicate within each object block (between { and })
  
  // Simpler: just replace any second occurrence of the same key-value pair if it appears within ~5 lines
  const lines = content.split('\n');
  const out = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith(`${field}:`)) {
      // Check if this exact field appeared recently (within last 8 lines)
      const recent = out.slice(-8).some(prevLine => prevLine.trim().startsWith(`${field}:`));
      if (recent) {
        // Skip this duplicate
        continue;
      }
    }
    out.push(line);
  }
  
  content = out.join('\n');
}

fs.writeFileSync('src/data/mockReviews.ts', content);
console.log('Done');

// Verify with TypeScript-style check: look for same field within same object
const lines = content.split('\n');
const fieldsToCheck = ['location_ja', 'location_zh_CN', 'content_ja', 'content_zh_CN'];
let dupFound = false;
for (let i = 0; i < lines.length; i++) {
  for (const field of fieldsToCheck) {
    if (lines[i].trim().startsWith(`${field}:`)) {
      // Check within next 10 lines for another occurrence
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        // Stop at end of object
        if (lines[j].trim() === '},') break;
        if (lines[j].trim().startsWith(`${field}:`)) {
          console.log(`STILL DUP at line ${i+1} & ${j+1}: ${field}`);
          console.log(`  L${i+1}: ${lines[i].trim()}`);
          console.log(`  L${j+1}: ${lines[j].trim()}`);
          dupFound = true;
        }
      }
    }
  }
}
if (!dupFound) console.log('No duplicates found!');
