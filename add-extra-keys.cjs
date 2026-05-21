const fs = require('fs');

const extra = {
  'ja': {
    myCourse: {
      actions: {
        saveSuccess: 'コースが正常に保存されました！',
        saveFail: '保存に失敗しました',
        selectPlatform: 'シェアするプラットフォームを選んでください！ 📸'
      }
    },
    common: {
      shareError: '共有画面が見つかりません。',
      shareLoading: '共有画像を生成中...'
    }
  },
  'zh-TW': {
    myCourse: {
      actions: {
        saveSuccess: '路線已成功儲存！',
        saveFail: '儲存失敗',
        selectPlatform: '選擇要分享的平台！ 📸'
      }
    },
    common: {
      shareError: '找不到分享畫面。',
      shareLoading: '正在生成分享圖片...'
    }
  },
  'zh-CN': {
    myCourse: {
      actions: {
        saveSuccess: '路线已成功保存！',
        saveFail: '保存失败',
        selectPlatform: '选择要分享的平台！ 📸'
      }
    },
    common: {
      shareError: '找不到分享画面。',
      shareLoading: '正在生成分享图片...'
    }
  },
  'en': {
    myCourse: {
      actions: {
        saveSuccess: 'Course saved successfully!',
        saveFail: 'Save failed',
        selectPlatform: 'Select the platform to share your image! 📸'
      }
    },
    common: {
      shareError: 'Share screen not found.',
      shareLoading: 'Generating share image...'
    }
  },
  'ko': {
    myCourse: {
      actions: {
        saveSuccess: '코스가 성공적으로 저장되었습니다!',
        saveFail: '저장 실패',
        selectPlatform: '원하는 플랫폼의 이미지 공유 버튼을 선택하세요! 📸'
      }
    },
    common: {
      shareError: '공유 화면을 찾을 수 없습니다.',
      shareLoading: '공유 이미지를 생성하는 중...'
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

for (const [lang, updates] of Object.entries(extra)) {
  const f = `src/locales/${lang}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(j, updates);
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
  console.log(`Updated ${f}`);
}
