const fs = require('fs');
const langs = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'];

const dicts = {
  'en': {
    movies: {
      woo: { title: 'Extraordinary Attorney Woo', genre: 'Drama / Law' },
      runningman: { title: 'Running Man', genre: 'Variety Show' },
      pachinko: { title: 'Pachinko', genre: 'Historical / Drama' },
      attorney: { title: 'The Attorney', genre: 'Drama / Law' },
      haeundae: { title: 'Haeundae', genre: 'Disaster / Action' },
      market: { title: 'Ode to My Father', genre: 'Drama / Family' }
    }
  },
  'ko': {
    movies: {
      woo: { title: '이상한 변호사 우영우', genre: '드라마 / 법정' },
      runningman: { title: '런닝맨', genre: '예능' },
      pachinko: { title: '파친코', genre: '역사 / 드라마' },
      attorney: { title: '변호인', genre: '드라마 / 법정' },
      haeundae: { title: '해운대', genre: '재난 / 액션' },
      market: { title: '국제시장', genre: '드라마 / 가족' }
    }
  },
  'ja': {
    movies: {
      woo: { title: 'ウ・ヨンウ弁護士は天才肌', genre: 'ドラマ / 法律' },
      runningman: { title: 'ランニングマン', genre: 'バラエティ' },
      pachinko: { title: 'パチンコ', genre: '歴史 / ドラマ' },
      attorney: { title: '弁護人', genre: 'ドラマ / 法律' },
      haeundae: { title: 'TSUNAMI -ツナミ-', genre: 'パニック / アクション' },
      market: { title: '国際市場で逢いましょう', genre: 'ドラマ / 家族' }
    }
  },
  'zh-CN': {
    movies: {
      woo: { title: '非常律师禹英禑', genre: '剧情 / 法律' },
      runningman: { title: 'Running Man', genre: '综艺' },
      pachinko: { title: '柏青哥', genre: '历史 / 剧情' },
      attorney: { title: '辩护人', genre: '剧情 / 法律' },
      haeundae: { title: '海云台', genre: '灾难 / 动作' },
      market: { title: '国际市场', genre: '剧情 / 家庭' }
    }
  },
  'zh-TW': {
    movies: {
      woo: { title: '非常律師禹英禑', genre: '劇情 / 法律' },
      runningman: { title: 'Running Man', genre: '綜藝' },
      pachinko: { title: '柏青哥', genre: '歷史 / 劇情' },
      attorney: { title: '辯護人', genre: '劇情 / 法律' },
      haeundae: { title: '海雲台', genre: '災難 / 動作' },
      market: { title: '國際市場', genre: '劇情 / 家庭' }
    }
  }
};

for (const lang of langs) {
  const path = `src/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));
  data.common = data.common || {};
  data.common.movies = dicts[lang].movies;
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
console.log('Injected movies dict into all locales');
