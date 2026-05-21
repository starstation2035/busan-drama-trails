const fs = require('fs');
let txt = fs.readFileSync('src/app/my-course/page.tsx', 'utf8');
// Remove Korean fallback from addSpot t() calls
txt = txt.replace(/t\("myCourse\.actions\.addSpot",\s*"[^"]+"\)/g, 't("myCourse.actions.addSpot")');
fs.writeFileSync('src/app/my-course/page.tsx', txt);
console.log('done');
