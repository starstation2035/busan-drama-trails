const fs = require('fs');

const fixes = {
  'ja': {
    'common.copied': 'リンクをコピーしました！',
    'spots.addedToCourse': 'マイコースに追加しました ❤',
    'spots.clearStyle': 'フィルターをリセット',
    'detail.info.admission': '入場料',
    'detail.map.copyAddr': '住所をコピー',
    'detail.cta.add': 'マイコースに追加',
    'detail.cta.added': 'マイコースを見る →',
    'detail.cta.carTour': 'コミュニティカーツアー予約',
    'myCourse.removed': '削除しました',
    'myCourse.subtitle': 'スポット{{spots}}・グルメ{{restaurants}}・カフェ{{cafes}}',
    'myCourse.single.hint': 'あと数か所追加すると自動コースが作成されます！',
    'myCourse.actions.regen': 'もう一度組み直す',
    'myCourse.actions.export': 'エクスポート',
    'myCourse.actions.copyLink': 'リンクをコピー',
    'quiz.result.copyLink': 'リンクをコピー',
  },
  'zh-TW': {
    'common.copied': '已複製連結！',
    'spots.addedToCourse': '已加入我的路線 ❤',
    'spots.clearStyle': '重置篩選',
    'detail.info.admission': '入場費',
    'detail.map.copyAddr': '複製地址',
    'detail.cta.add': '加入我的路線',
    'detail.cta.added': '查看我的路線 →',
    'detail.cta.carTour': '預約社群包車行程',
    'myCourse.removed': '已刪除',
    'myCourse.subtitle': '景點{{spots}}・餐廳{{restaurants}}・咖啡廳{{cafes}}',
    'myCourse.single.hint': '再多加幾個景點，系統就會自動幫您規劃路線！',
    'myCourse.actions.regen': '重新規劃',
    'myCourse.actions.export': '匯出',
    'myCourse.actions.copyLink': '複製連結',
    'quiz.result.copyLink': '複製連結',
  },
  'zh-CN': {
    'common.copied': '已复制链接！',
    'spots.addedToCourse': '已加入我的路线 ❤',
    'spots.clearStyle': '重置筛选',
    'detail.info.admission': '入场费',
    'detail.map.copyAddr': '复制地址',
    'detail.cta.add': '加入我的路线',
    'detail.cta.added': '查看我的路线 →',
    'detail.cta.carTour': '预约社群包车行程',
    'myCourse.removed': '已删除',
    'myCourse.subtitle': '景点{{spots}}・餐厅{{restaurants}}・咖啡厅{{cafes}}',
    'myCourse.single.hint': '再多加几个景点，系统就会自动帮您规划路线！',
    'myCourse.actions.regen': '重新规划',
    'myCourse.actions.export': '导出',
    'myCourse.actions.copyLink': '复制链接',
    'quiz.result.copyLink': '复制链接',
  },
  'en': {
    'spots.addedToCourse': 'Added to My Course ❤',
    'spots.clearStyle': 'Reset Filter',
    'detail.info.admission': 'Admission',
    'detail.map.copyAddr': 'Copy Address',
    'detail.cta.add': 'Add to My Course',
    'detail.cta.added': 'View My Course →',
    'detail.cta.carTour': 'Book Community Car Tour',
    'myCourse.removed': 'Removed',
    'myCourse.subtitle': 'Spots {{spots}} · Restaurants {{restaurants}} · Cafes {{cafes}}',
    'myCourse.single.hint': 'Add a few more spots to generate your auto course!',
    'myCourse.actions.regen': 'Regenerate',
    'myCourse.actions.export': 'Export',
    'myCourse.actions.copyLink': 'Copy Link',
    'quiz.result.copyLink': 'Copy Link',
  }
};

function setDeep(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!curr[keys[i]]) curr[keys[i]] = {};
    curr = curr[keys[i]];
  }
  curr[keys[keys.length - 1]] = value;
}

for (const [lang, kvs] of Object.entries(fixes)) {
  const f = `src/locales/${lang}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [key, val] of Object.entries(kvs)) {
    setDeep(j, key, val);
  }
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
  console.log(`Updated ${f}`);
}
