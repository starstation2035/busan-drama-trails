const fs = require('fs');

const updates = {
  'ja': {
    line1: 'ドラマのあのシーンを訪ね、',
    line2: 'すぐそばの美味しいお店まで続く釜山コースをご案内します。'
  },
  'en': {
    line1: 'Visit the scenes from drama filming locations,',
    line2: 'and we will guide you to a Busan course that continues to the delicious restaurant right next to it.'
  },
  'zh-TW': {
    line1: '尋找韓劇拍攝地的那一幕，',
    line2: '為您介紹緊鄰美食店的釜山路線。'
  },
  'zh-CN': {
    line1: '寻找韩剧拍摄地的那一幕，',
    line2: '为您介绍紧邻美食店的釜山路线。'
  }
};

['ja', 'en', 'zh-TW', 'zh-CN'].forEach(l => {
  const f = 'src/locales/' + l + '.json';
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!j.spots) j.spots = {};
  if (!j.spots.hero) j.spots.hero = {};
  
  j.spots.hero.subtitleLine1 = updates[l].line1;
  j.spots.hero.subtitleLine2 = updates[l].line2;
  
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
});
