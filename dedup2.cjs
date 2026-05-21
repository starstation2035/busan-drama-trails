const fs = require('fs');

let content = fs.readFileSync('src/data/mockReviews.ts', 'utf8');

// Normalize line endings first
content = content.replace(/\r\n/g, '\n');

const fieldsToDedup = ['location_ja', 'location_zh_CN', 'content_ja', 'content_zh_CN', 'location_en'];

let changed = true;
while (changed) {
  changed = false;
  const lines = content.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i].trim();
    const next = lines[i + 1] ? lines[i + 1].trim() : '';
    
    let isDup = false;
    for (const field of fieldsToDedup) {
      if (curr.startsWith(`${field}:`) && next.startsWith(`${field}:`)) {
        isDup = true;
        break;
      }
    }
    
    if (isDup) {
      out.push(lines[i]);
      i++; // skip duplicate next line
      changed = true;
    } else {
      out.push(lines[i]);
    }
  }
  content = out.join('\n');
}

// Restore CRLF style for the file
fs.writeFileSync('src/data/mockReviews.ts', content);
console.log('Done. Verifying...');

// Verify
const lines = content.split('\n');
const fieldsToDedup2 = ['location_ja', 'location_zh_CN', 'content_ja', 'content_zh_CN'];
for (let i = 0; i < lines.length - 1; i++) {
  for (const field of fieldsToDedup2) {
    if (lines[i].trim().startsWith(`${field}:`) && lines[i+1].trim().startsWith(`${field}:`)) {
      console.log('STILL DUP at line', i+1, ':', lines[i].trim());
    }
  }
}
console.log('Verification complete');
