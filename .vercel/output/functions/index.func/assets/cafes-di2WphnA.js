const restaurantsRaw = [
  {
    id: "r1",
    name: {
      ko: "청사포 회센터",
      "zh-TW": "青沙浦海鮮中心",
      en: "Cheongsapo Fish Center",
      ja: "青沙浦魚センター",
      "zh-CN": "青沙浦海鲜中心"
    },
    food: {
      ko: "활어회",
      "zh-TW": "生魚片",
      en: "Sashimi",
      ja: "刺身",
      "zh-CN": "生鱼片"
    },
    thumbnail: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    distance: 120,
    rating: 4.6,
    price: "$$",
    signature: {
      ko: "광어회",
      "zh-TW": "比目魚生魚片",
      en: "Flounder sashimi",
      ja: "ヒラメ刺身",
      "zh-CN": "比目鱼生鱼片"
    }
  },
  {
    id: "r2",
    name: {
      ko: "감천 보리밥집",
      "zh-TW": "甘川大麥飯",
      en: "Gamcheon Barley Rice",
      ja: "甘川麦ご飯",
      "zh-CN": "甘川大麦饭"
    },
    food: {
      ko: "한정식",
      "zh-TW": "韓式定食",
      en: "Korean set",
      ja: "韓定食",
      "zh-CN": "韩式定食"
    },
    thumbnail: "https://images.unsplash.com/photo-1583224994076-ae7f1c1c6e3a?w=600",
    distance: 80,
    rating: 4.4,
    price: "$",
    signature: {
      ko: "보리비빔밥",
      "zh-TW": "大麥拌飯",
      en: "Barley bibimbap",
      ja: "麦ビビンバ",
      "zh-CN": "大麦拌饭"
    }
  },
  {
    id: "r3",
    name: {
      ko: "해운대 밀면",
      "zh-TW": "海雲台小麥麵",
      en: "Haeundae Milmyeon",
      ja: "海雲台ミルミョン",
      "zh-CN": "海云台小麦面"
    },
    food: {
      ko: "밀면",
      "zh-TW": "小麥冷麵",
      en: "Cold noodles",
      ja: "冷麺",
      "zh-CN": "小麦冷面"
    },
    thumbnail: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    distance: 250,
    rating: 4.7,
    price: "$",
    signature: {
      ko: "물밀면",
      "zh-TW": "湯小麥麵",
      en: "Soup milmyeon",
      ja: "スープ冷麺",
      "zh-CN": "汤小麦面"
    }
  },
  {
    id: "r4",
    name: {
      ko: "흰여울 멸치쌈밥",
      "zh-TW": "白險灘鯷魚包飯",
      en: "Anchovy Wraps",
      ja: "イワシ包みご飯",
      "zh-CN": "白险滩鳀鱼包饭"
    },
    food: {
      ko: "쌈밥",
      "zh-TW": "包飯",
      en: "Korean wraps",
      ja: "包みご飯",
      "zh-CN": "包饭"
    },
    thumbnail: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600",
    distance: 150,
    rating: 4.5,
    price: "$$",
    signature: {
      ko: "멸치쌈정식",
      "zh-TW": "鯷魚包飯定食",
      en: "Anchovy wrap set",
      ja: "イワシ包み定食",
      "zh-CN": "鳀鱼包饭定食"
    }
  },
  {
    id: "r5",
    name: {
      ko: "자갈치 곰장어",
      "zh-TW": "札嘎其烤盲鰻",
      en: "Jagalchi Hagfish",
      ja: "チャガルチ穴子",
      "zh-CN": "札嘎其烤盲鳗"
    },
    food: {
      ko: "곰장어구이",
      "zh-TW": "烤盲鰻",
      en: "Grilled hagfish",
      ja: "穴子焼き",
      "zh-CN": "烤盲鳗"
    },
    thumbnail: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600",
    distance: 50,
    rating: 4.8,
    price: "$$",
    signature: {
      ko: "양념곰장어",
      "zh-TW": "辣醬盲鰻",
      en: "Spicy hagfish",
      ja: "ヤンニョム穴子",
      "zh-CN": "辣酱盲鳗"
    }
  },
  {
    id: "r6",
    name: {
      ko: "광안리 조개찜",
      "zh-TW": "廣安里蒸蛤蜊",
      en: "Gwangalli Clams",
      ja: "広安里蒸し貝",
      "zh-CN": "广安里蒸蛤蜊"
    },
    food: {
      ko: "조개찜",
      "zh-TW": "蒸貝類",
      en: "Steamed clams",
      ja: "貝の蒸し物",
      "zh-CN": "蒸贝类"
    },
    thumbnail: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=600",
    distance: 300,
    rating: 4.5,
    price: "$$",
    signature: {
      ko: "모듬조개찜",
      "zh-TW": "綜合蒸貝",
      en: "Mixed clam pot",
      ja: "貝盛り合わせ",
      "zh-CN": "综合蒸贝"
    }
  },
  {
    id: "r7",
    name: {
      ko: "기장 곰장어",
      "zh-TW": "機張盲鰻",
      en: "Gijang Hagfish",
      ja: "機張穴子",
      "zh-CN": "机张盲鳗"
    },
    food: {
      ko: "해산물",
      "zh-TW": "海鮮",
      en: "Seafood",
      ja: "海鮮",
      "zh-CN": "海鲜"
    },
    thumbnail: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600",
    distance: 400,
    rating: 4.6,
    price: "$$",
    signature: {
      ko: "소금구이",
      "zh-TW": "鹽烤",
      en: "Salt grilled",
      ja: "塩焼き",
      "zh-CN": "盐烤"
    }
  },
  {
    id: "r8",
    name: {
      ko: "남포동 떡볶이",
      "zh-TW": "南浦洞辣炒年糕",
      en: "Nampo Tteokbokki",
      ja: "南浦洞トッポギ",
      "zh-CN": "南浦洞辣炒年糕"
    },
    food: {
      ko: "분식",
      "zh-TW": "小吃",
      en: "Street food",
      ja: "屋台",
      "zh-CN": "小吃"
    },
    thumbnail: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=600",
    distance: 200,
    rating: 4.3,
    price: "$",
    signature: {
      ko: "매운떡볶이",
      "zh-TW": "辣炒年糕",
      en: "Spicy tteokbokki",
      ja: "激辛トッポギ",
      "zh-CN": "辣炒年糕"
    }
  },
  {
    id: "r9",
    name: {
      ko: "서면 돼지국밥",
      "zh-TW": "西面豬肉湯飯",
      en: "Seomyeon Dwaeji",
      ja: "西面テジクッパ",
      "zh-CN": "西面猪肉汤饭"
    },
    food: {
      ko: "국밥",
      "zh-TW": "湯飯",
      en: "Pork rice soup",
      ja: "クッパ",
      "zh-CN": "汤饭"
    },
    thumbnail: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    distance: 350,
    rating: 4.7,
    price: "$",
    signature: {
      ko: "돼지국밥",
      "zh-TW": "豬肉湯飯",
      en: "Pork rice soup",
      ja: "テジクッパ",
      "zh-CN": "猪肉汤饭"
    }
  },
  {
    id: "r10",
    name: {
      ko: "해운대 씨앗호떡",
      "zh-TW": "海雲台種子糖餅",
      en: "Seed Hotteok",
      ja: "種ホットク",
      "zh-CN": "海云台种子糖饼"
    },
    food: {
      ko: "길거리 디저트",
      "zh-TW": "街頭甜點",
      en: "Street dessert",
      ja: "屋台スイーツ",
      "zh-CN": "街头甜点"
    },
    thumbnail: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600",
    distance: 180,
    rating: 4.6,
    price: "$",
    signature: {
      ko: "씨앗호떡",
      "zh-TW": "種子糖餅",
      en: "Seed hotteok",
      ja: "種ホットク",
      "zh-CN": "种子糖饼"
    }
  },
  {
    id: "r11",
    name: {
      ko: "감천 비빔당면",
      "zh-TW": "甘川拌冬粉",
      en: "Bibim Glass Noodles",
      ja: "ビビム春雨",
      "zh-CN": "甘川拌粉丝"
    },
    food: {
      ko: "분식",
      "zh-TW": "小吃",
      en: "Street food",
      ja: "屋台",
      "zh-CN": "小吃"
    },
    thumbnail: "https://images.unsplash.com/photo-1572020165864-43afa4ccdce4?w=600",
    distance: 90,
    rating: 4.4,
    price: "$",
    signature: {
      ko: "비빔당면",
      "zh-TW": "拌冬粉",
      en: "Bibim noodles",
      ja: "ビビム春雨",
      "zh-CN": "拌粉丝"
    }
  },
  {
    id: "r12",
    name: {
      ko: "청사포 조개구이",
      "zh-TW": "青沙浦烤貝",
      en: "Cheongsapo Grill",
      ja: "青沙浦貝焼き",
      "zh-CN": "青沙浦烤贝"
    },
    food: {
      ko: "조개구이",
      "zh-TW": "烤貝",
      en: "Grilled clams",
      ja: "貝焼き",
      "zh-CN": "烤贝"
    },
    thumbnail: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
    distance: 160,
    rating: 4.5,
    price: "$$",
    signature: {
      ko: "모듬조개",
      "zh-TW": "綜合烤貝",
      en: "Mixed clam grill",
      ja: "貝盛り合わせ",
      "zh-CN": "综合烤贝"
    }
  }
];
const cafesRaw = [
  {
    id: "c1",
    name: {
      ko: "웨이브온 커피",
      "zh-TW": "Wave On Coffee",
      en: "Wave On Coffee",
      ja: "ウェーブオンカフェ",
      "zh-CN": "Wave On Coffee"
    },
    vibe: {
      ko: "오션뷰",
      "zh-TW": "無敵海景",
      en: "Ocean view",
      ja: "オーシャンビュー",
      "zh-CN": "无敌海景"
    },
    thumbnail: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600",
    distance: 400,
    rating: 4.8,
    signature: {
      ko: "바다라떼",
      "zh-TW": "海洋拿鐵",
      en: "Ocean latte",
      ja: "海ラテ",
      "zh-CN": "海洋拿铁"
    }
  },
  {
    id: "c2",
    name: {
      ko: "감천 마을카페",
      "zh-TW": "甘川村咖啡",
      en: "Gamcheon Cafe",
      ja: "甘川カフェ",
      "zh-CN": "甘川村咖啡"
    },
    vibe: {
      ko: "마을 전망",
      "zh-TW": "村落全景",
      en: "Village view",
      ja: "村ビュー",
      "zh-CN": "村落全景"
    },
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600",
    distance: 50,
    rating: 4.5,
    signature: {
      ko: "흑임자라떼",
      "zh-TW": "黑芝麻拿鐵",
      en: "Black sesame latte",
      ja: "黒ごまラテ",
      "zh-CN": "黑芝麻拿铁"
    }
  },
  {
    id: "c3",
    name: {
      ko: "해운대 블루보틀",
      "zh-TW": "海雲台 Blue Bottle",
      en: "Blue Bottle Haeundae",
      ja: "ブルーボトル海雲台",
      "zh-CN": "海云台 Blue Bottle"
    },
    vibe: {
      ko: "미니멀",
      "zh-TW": "極簡風",
      en: "Minimal",
      ja: "ミニマル",
      "zh-CN": "极简风"
    },
    thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600",
    distance: 600,
    rating: 4.7,
    signature: {
      ko: "뉴올리언스",
      "zh-TW": "紐奧良冰咖啡",
      en: "New Orleans",
      ja: "ニューオーリンズ",
      "zh-CN": "新奥尔良冰咖啡"
    }
  },
  {
    id: "c4",
    name: {
      ko: "흰여울 절벽카페",
      "zh-TW": "白險灘懸崖咖啡",
      en: "Cliff Cafe",
      ja: "絶壁カフェ",
      "zh-CN": "白险滩悬崖咖啡"
    },
    vibe: {
      ko: "절벽 위",
      "zh-TW": "懸崖之上",
      en: "Cliffside",
      ja: "絶壁の上",
      "zh-CN": "悬崖之上"
    },
    thumbnail: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600",
    distance: 100,
    rating: 4.9,
    signature: {
      ko: "바닐라라떼",
      "zh-TW": "香草拿鐵",
      en: "Vanilla latte",
      ja: "バニララテ",
      "zh-CN": "香草拿铁"
    }
  },
  {
    id: "c5",
    name: {
      ko: "광안리 루프탑",
      "zh-TW": "廣安里頂樓",
      en: "Gwangalli Rooftop",
      ja: "広安里ルーフトップ",
      "zh-CN": "广安里顶楼"
    },
    vibe: {
      ko: "브릿지뷰",
      "zh-TW": "看廣安大橋",
      en: "Bridge view",
      ja: "ブリッジビュー",
      "zh-CN": "看广安大桥"
    },
    thumbnail: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600",
    distance: 350,
    rating: 4.6,
    signature: {
      ko: "애플시나몬",
      "zh-TW": "蘋果肉桂",
      en: "Apple cinnamon",
      ja: "アップルシナモン",
      "zh-CN": "苹果肉桂"
    }
  },
  {
    id: "c6",
    name: {
      ko: "전포 카페거리",
      "zh-TW": "田浦咖啡街",
      en: "Jeonpo Cafe St.",
      ja: "田浦カフェ通り",
      "zh-CN": "田浦咖啡街"
    },
    vibe: {
      ko: "감성",
      "zh-TW": "文青感",
      en: "Indie vibe",
      ja: "おしゃれ",
      "zh-CN": "文青感"
    },
    thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    distance: 500,
    rating: 4.5,
    signature: {
      ko: "플랫화이트",
      "zh-TW": "馥列白",
      en: "Flat white",
      ja: "フラットホワイト",
      "zh-CN": "馥列白"
    }
  },
  {
    id: "c7",
    name: {
      ko: "청사포 커피하우스",
      "zh-TW": "青沙浦咖啡屋",
      en: "Cheongsapo Cafe",
      ja: "青沙浦カフェ",
      "zh-CN": "青沙浦咖啡屋"
    },
    vibe: {
      ko: "통유리 바다뷰",
      "zh-TW": "落地窗海景",
      en: "Glass ocean",
      ja: "ガラス越しの海",
      "zh-CN": "落地窗海景"
    },
    thumbnail: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600",
    distance: 80,
    rating: 4.7,
    signature: {
      ko: "솔티드라떼",
      "zh-TW": "鹽味拿鐵",
      en: "Salted latte",
      ja: "塩ラテ",
      "zh-CN": "盐味拿铁"
    }
  },
  {
    id: "c8",
    name: {
      ko: "기장 오션카페",
      "zh-TW": "機張海洋咖啡",
      en: "Gijang Ocean",
      ja: "機張オーシャン",
      "zh-CN": "机张海洋咖啡"
    },
    vibe: {
      ko: "파도소리",
      "zh-TW": "聽得到海浪",
      en: "Waves sound",
      ja: "波音",
      "zh-CN": "听得到海浪"
    },
    thumbnail: "https://images.unsplash.com/photo-1442975631115-c4f7b05b8a2c?w=600",
    distance: 700,
    rating: 4.8,
    signature: {
      ko: "콜드브루",
      "zh-TW": "冰滴咖啡",
      en: "Cold brew",
      ja: "コールドブリュー",
      "zh-CN": "冰滴咖啡"
    }
  },
  {
    id: "c9",
    name: {
      ko: "남포동 옥상카페",
      "zh-TW": "南浦洞天台",
      en: "Nampo Rooftop",
      ja: "南浦洞屋上",
      "zh-CN": "南浦洞天台"
    },
    vibe: {
      ko: "부산항뷰",
      "zh-TW": "釜山港夜景",
      en: "Port view",
      ja: "港ビュー",
      "zh-CN": "釜山港夜景"
    },
    thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600",
    distance: 250,
    rating: 4.4,
    signature: {
      ko: "피스타치오",
      "zh-TW": "開心果拿鐵",
      en: "Pistachio latte",
      ja: "ピスタチオラテ",
      "zh-CN": "开心果拿铁"
    }
  },
  {
    id: "c10",
    name: {
      ko: "감천 베이커리",
      "zh-TW": "甘川烘焙坊",
      en: "Gamcheon Bakery",
      ja: "甘川ベーカリー",
      "zh-CN": "甘川烘焙坊"
    },
    vibe: {
      ko: "파스텔톤",
      "zh-TW": "粉嫩配色",
      en: "Pastel",
      ja: "パステル",
      "zh-CN": "粉嫩配色"
    },
    thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    distance: 110,
    rating: 4.6,
    signature: {
      ko: "딸기케이크",
      "zh-TW": "草莓蛋糕",
      en: "Strawberry cake",
      ja: "イチゴケーキ",
      "zh-CN": "草莓蛋糕"
    }
  },
  {
    id: "c11",
    name: {
      ko: "해운대 디저트룸",
      "zh-TW": "海雲台甜點屋",
      en: "Dessert Room",
      ja: "デザートルーム",
      "zh-CN": "海云台甜点屋"
    },
    vibe: {
      ko: "디저트 천국",
      "zh-TW": "甜點控天堂",
      en: "Dessert heaven",
      ja: "デザート天国",
      "zh-CN": "甜点控天堂"
    },
    thumbnail: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600",
    distance: 220,
    rating: 4.7,
    signature: {
      ko: "티라미수",
      "zh-TW": "提拉米蘇",
      en: "Tiramisu",
      ja: "ティラミス",
      "zh-CN": "提拉米苏"
    }
  },
  {
    id: "c12",
    name: {
      ko: "흰여울 빈티지카페",
      "zh-TW": "白險灘復古咖啡",
      en: "Vintage Cafe",
      ja: "ヴィンテージカフェ",
      "zh-CN": "白险滩复古咖啡"
    },
    vibe: {
      ko: "빈티지 LP",
      "zh-TW": "復古黑膠",
      en: "Vintage LP",
      ja: "レトロLP",
      "zh-CN": "复古黑胶"
    },
    thumbnail: "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=600",
    distance: 140,
    rating: 4.5,
    signature: {
      ko: "아인슈페너",
      "zh-TW": "維也納咖啡",
      en: "Einspänner",
      ja: "アインシュペナー",
      "zh-CN": "维也纳咖啡"
    }
  }
];
export {
  cafesRaw as c,
  restaurantsRaw as r
};
