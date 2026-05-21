const fs = require('fs');

const newKeys = {
  'ja': {
    myCourse: {
      memo: {
        label: 'メモ',
        placeholder: 'この場所のメモを追加...'
      },
      customTravel: {
        unit: '分'
      },
      actions: {
        addSpot: 'スポットを追加',
        save: '保存',
        regen: '再構成',
        editDone: '編集完了',
        editCourse: 'コースを再構成'
      },
      aiBanner: {
        title: 'AI推奨最適ルート',
        subtitle: '動線を考慮して最も効率的な訪問順を計算しました。{{km}}kmの旅をご確認ください！'
      }
    },
    common: {
      search: 'スポットを検索...',
      noResults: '結果が見つかりません',
      updated: '更新しました',
      added: 'コースに追加しました'
    }
  },
  'zh-TW': {
    myCourse: {
      memo: {
        label: '備忘錄',
        placeholder: '為此地點添加備忘錄...'
      },
      customTravel: {
        unit: '分'
      },
      actions: {
        addSpot: '新增景點',
        save: '儲存',
        regen: '重新規劃',
        editDone: '完成編輯',
        editCourse: '重新規劃路線'
      },
      aiBanner: {
        title: 'AI推薦最佳路線',
        subtitle: '已考量動線，計算出最高效的訪問順序。立即確認{{km}}km的行程！'
      }
    },
    common: {
      search: '搜尋景點...',
      noResults: '找不到結果',
      updated: '已更新',
      added: '已加入路線'
    }
  },
  'zh-CN': {
    myCourse: {
      memo: {
        label: '备忘录',
        placeholder: '为此地点添加备忘录...'
      },
      customTravel: {
        unit: '分钟'
      },
      actions: {
        addSpot: '添加景点',
        save: '保存',
        regen: '重新规划',
        editDone: '完成编辑',
        editCourse: '重新规划路线'
      },
      aiBanner: {
        title: 'AI推荐最优路线',
        subtitle: '已考量动线，计算出最高效的访问顺序。立即确认{{km}}km的行程！'
      }
    },
    common: {
      search: '搜索景点...',
      noResults: '未找到结果',
      updated: '已更新',
      added: '已加入路线'
    }
  },
  'en': {
    myCourse: {
      memo: {
        label: 'MEMO',
        placeholder: 'Add a note for this place...'
      },
      customTravel: {
        unit: 'min'
      },
      actions: {
        addSpot: 'Add Spot',
        save: 'Save',
        regen: 'Reorganize',
        editDone: 'Done Editing',
        editCourse: 'Reorganize Course'
      },
      aiBanner: {
        title: 'AI-Recommended Optimal Route',
        subtitle: 'Calculated the most efficient visit order considering travel routes. Check your {{km}}km journey now!'
      }
    },
    common: {
      search: 'Search spots...',
      noResults: 'No results found',
      updated: 'Updated',
      added: 'Added to course'
    }
  },
  'ko': {
    myCourse: {
      memo: {
        label: '메모',
        placeholder: '이 장소에 대한 메모를 남겨보세요...'
      },
      customTravel: {
        unit: '분'
      },
      actions: {
        addSpot: '스팟 추가하기',
        save: '코스 저장',
        regen: '코스 다시 짜기',
        editDone: '편집 완료',
        editCourse: '코스 다시 짜기'
      },
      aiBanner: {
        title: 'AI 추천 최적 경로',
        subtitle: '동선을 고려하여 가장 효율적인 방문 순서를 계산했습니다. {{km}}km의 여정을 지금 확인해보세요!'
      }
    },
    common: {
      search: '스팟 검색...',
      noResults: '결과가 없습니다',
      updated: '업데이트되었습니다',
      added: '코스에 추가되었습니다'
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

for (const [lang, updates] of Object.entries(newKeys)) {
  const f = `src/locales/${lang}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(j, updates);
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
  console.log(`Updated ${f}`);
}
