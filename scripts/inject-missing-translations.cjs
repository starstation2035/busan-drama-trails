const fs = require('fs');
const langs = ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'];

const spotsSectionsAndCategories = {
  'en': {
    sections: {
      drama: '🎬 Filming Sites',
      dramaDesc: 'Experience the emotions of K-dramas and movies.',
      landmark: '🌊 Busan Landmarks',
      landmarkDesc: 'Must-visit spots when you are in Busan.'
    },
    categories: {
      drama: 'Drama Filming Spots',
      landmark: 'Busan Landmarks',
      dramaDesc: 'Experience the emotions of K-dramas and movies.',
      landmarkDesc: 'Must-visit spots when you are in Busan.'
    }
  },
  'ko': {
    sections: {
      drama: '🎬 드라마 촬영지',
      dramaDesc: '스크린 속 감동을 부산에서 직접 느껴보세요.',
      landmark: '🌊 부산 필수 명소',
      landmarkDesc: '부산 여행 시 빼놓을 수 없는 핵심 스팟들입니다.'
    },
    categories: {
      drama: '드라마 촬영지',
      landmark: '부산 명소',
      dramaDesc: '스크린 속 감동을 직접 느껴보세요.',
      landmarkDesc: '부산 여행 시 빼놓을 수 없는 핵심 스팟들입니다.'
    }
  },
  'ja': {
    sections: {
      drama: '🎬 ドラマロケ地',
      dramaDesc: 'スクリーンの中の感動を直接感じてみてください。',
      landmark: '🌊 釜山必須名所',
      landmarkDesc: '釜山旅行で外せない重要スポットです。'
    },
    categories: {
      drama: 'ドラマロケ地',
      landmark: '釜山名所',
      dramaDesc: 'スクリーンの中の感動を直接感じてみてください。',
      landmarkDesc: '釜山旅行で外せない重要スポットです。'
    }
  },
  'zh-CN': {
    sections: {
      drama: '🎬 韩剧拍摄地',
      dramaDesc: '亲自感受屏幕中的感动吧。',
      landmark: '🌊 釜山必去名胜',
      landmarkDesc: '来釜山旅游绝对不能错过的核心景点。'
    },
    categories: {
      drama: '韩剧拍摄地',
      landmark: '釜山名胜',
      dramaDesc: '亲自感受屏幕中的感动吧。',
      landmarkDesc: '来釜山旅游绝对不能错过的核心景点。'
    }
  },
  'zh-TW': {
    sections: {
      drama: '🎬 韓劇拍攝地',
      dramaDesc: '親自感受螢幕中的感動吧。',
      landmark: '🌊 釜山必去名勝',
      landmarkDesc: '來釜山旅遊絕對不能錯過的核心景點。'
    },
    categories: {
      drama: '韓劇拍攝地',
      landmark: '釜山名勝',
      dramaDesc: '親自感受螢幕中的感動吧。',
      landmarkDesc: '來釜山旅遊絕對不能錯過的核心景點。'
    }
  }
};

const communityModalCategoryTitle = {
  'en': 'Category Settings',
  'ko': '어떤 글을 작성하시겠어요?',
  'ja': 'どんな記事を作成しますか？',
  'zh-CN': '您想撰写什么文章呢？',
  'zh-TW': '您想撰寫什麼文章呢？'
};

for (const lang of langs) {
  const path = `src/locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(path, 'utf8'));

  // Inject spots.sections and spots.categories
  data.spots = data.spots || {};
  data.spots.sections = Object.assign(data.spots.sections || {}, spotsSectionsAndCategories[lang].sections);
  data.spots.categories = Object.assign(data.spots.categories || {}, spotsSectionsAndCategories[lang].categories);

  // Inject community.modal.categoryTitle
  data.community = data.community || {};
  data.community.modal = data.community.modal || {};
  data.community.modal.categoryTitle = communityModalCategoryTitle[lang];

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

console.log('Injected spots sections/categories and community category title into all locales');
