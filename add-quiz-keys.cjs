const fs = require('fs');

const quizExtra = {
  'ja': {
    quiz: {
      intro: {
        badge: '全10問・約2分'
      },
      questions: {
        q7: {
          title: '旅中に突然雨が降ったら？',
          a: 'いいじゃん！ドラマの主人公みたいにロマンスを楽しもう',
          b: '温かいお茶を飲みながら、海の見えるカフェに避難'
        },
        q8: {
          title: '宿泊先を選ぶ際に最も重要なことは？',
          a: '眺めと内装！インスタ映えするホテルが必須',
          b: '物語のあるレトロで居心地の良いゲストハウス'
        },
        q9: {
          title: '午後が自由時間になったら？',
          a: 'じっとしていられない！知らない路地を探検',
          b: '有名なドラマロケ地を巡る聖地巡礼へ'
        },
        q10: {
          title: 'この旅で一枚だけ写真を残すとしたら？',
          a: '人のいない静かな自然の風景',
          b: '夜景をバックにした最高の一枚'
        }
      },
      result: {
        startCourse: 'このコースで旅を始める ✨'
      }
    }
  },
  'zh-TW': {
    quiz: {
      intro: {
        badge: '共10題・約2分鐘'
      },
      questions: {
        q7: {
          title: '旅途中突然下雨了，你會怎麼做？',
          a: '太棒了！像韓劇主角一樣享受浪漫',
          b: '躲進可以看海的咖啡廳，喝杯熱茶'
        },
        q8: {
          title: '選擇住宿時最重要的是？',
          a: '景觀與室內設計！必須是IG打卡飯店',
          b: '有故事感的復古民宿，溫馨舒適'
        },
        q9: {
          title: '下午突然有空，你會做什麼？',
          a: '閒不住！去探索不知道的小巷弄',
          b: '去朝聖有名的韓劇拍攝地'
        },
        q10: {
          title: '這趟旅行只能留一張照片，你會留哪張？',
          a: '沒有人的寧靜自然風景',
          b: '搭配璀璨夜景的完美自拍'
        }
      },
      result: {
        startCourse: '就用這個行程開始旅行 ✨'
      }
    }
  },
  'zh-CN': {
    quiz: {
      intro: {
        badge: '共10题・约2分钟'
      },
      questions: {
        q7: {
          title: '旅途中突然下雨了，你会怎么做？',
          a: '太棒了！像韩剧主角一样享受浪漫',
          b: '躲进可以看海的咖啡厅，喝杯热茶'
        },
        q8: {
          title: '选择住宿时最重要的是？',
          a: '景观与室内设计！必须是IG打卡酒店',
          b: '有故事感的复古民宿，温馨舒适'
        },
        q9: {
          title: '下午突然有空，你会做什么？',
          a: '闲不住！去探索不知道的小巷',
          b: '去朝圣有名的韩剧拍摄地'
        },
        q10: {
          title: '这趟旅行只能留一张照片，你会留哪张？',
          a: '没有人的宁静自然风景',
          b: '搭配璀璨夜景的完美自拍'
        }
      },
      result: {
        startCourse: '就用这个行程开始旅行 ✨'
      }
    }
  },
  'en': {
    quiz: {
      intro: {
        badge: '10 Questions · ~2 min'
      },
      result: {
        startCourse: 'Start My Trip With This Course ✨'
      }
    }
  },
  'ko': {
    quiz: {
      intro: {
        badge: '10가지 질문 · 약 2분'
      },
      questions: {
        q7: {
          title: '여행 중 갑자기 비가 온다면?',
          a: '좋아! 드라마 주인공처럼 로맨스를 즐기자',
          b: '따뜻한 차 한 잔과 함께 오션뷰 카페로 피신'
        },
        q8: {
          title: '숙소 선택 시 가장 중요한 것은?',
          a: '뷰와 인테리어! 인스타 맛집 호텔 필수',
          b: '이야기 있는 레트로 게스트하우스'
        },
        q9: {
          title: '오후가 자유 시간이 되었다면?',
          a: '못 가만있어! 모르는 골목 탐험',
          b: '유명 드라마 촬영지 성지순례'
        },
        q10: {
          title: '이번 여행에서 딱 한 장만 남긴다면?',
          a: '사람 없는 고요한 자연 풍경',
          b: '화려한 야경과 함께한 완벽한 셀카'
        }
      },
      result: {
        startCourse: '이 코스 그대로 내 여행 시작하기 ✨'
      }
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

for (const [lang, updates] of Object.entries(quizExtra)) {
  const f = `src/locales/${lang}.json`;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  deepMerge(j, updates);
  fs.writeFileSync(f, JSON.stringify(j, null, 2));
  console.log(`Updated ${f}`);
}
