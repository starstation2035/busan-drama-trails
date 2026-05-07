const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const mappings = {
  common: ['common', 'nav', 'language', 'pages'],
  landing: ['landing'],
  community: ['community', 'chat'],
  quiz: ['quiz'],
  spots: ['spots', 'detail'],
  myCourse: ['myCourse']
};

files.forEach(file => {
  const lang = path.basename(file, '.json');
  const langDir = path.join(localesDir, lang);
  
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const rawData = fs.readFileSync(path.join(localesDir, file), 'utf8');
  const data = JSON.parse(rawData);

  for (const [fileName, keys] of Object.entries(mappings)) {
    const splitData = {};
    keys.forEach(key => {
      if (data[key]) {
        splitData[key] = data[key];
      }
    });

    const targetPath = path.join(langDir, `${fileName}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(splitData, null, 2) + '\n', 'utf8');
    console.log(`Created ${lang}/${fileName}.json`);
  }
});

console.log('Successfully split all locale files.');
