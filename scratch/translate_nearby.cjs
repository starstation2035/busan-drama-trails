const fs = require("fs");

let content = fs.readFileSync(
  "c:\\Users\\ADMIN\\busan-drama-trails\\src\\app\\spots\\[id]\\nearby\\page.tsx",
  "utf-8",
);

const translations = {
  흰여울점빵: "Huinnam-yeoul Bakery",
  "라면/토스트": "Ramen/Toast",
  거인통닭: "Giant Fried Chicken",
  가마솥통닭: "Cauldron Fried Chicken",
  달뜨네: "Dalteune",
  "회밥/시나몬맥주": "Sashimi Rice/Cinnamon Beer",
  영도해녀촌: "Yeongdo Haenyeo Village",
  "성게알/김밥": "Sea Urchin/Gimbap",
  도날드: "Donald",
  즉석떡볶이: "Instant Tteokbokki",
  왔다식당: "Watta Restaurant",
  한우스지전골: "Hanwoo Beef Tendon Hot Pot",
  재기돼지국밥: "Jaegi Pork Rice Soup",
  남항시장: "Namhang Market",
  와글와글: "Wagle Wagle",
  라밥: "Rabab",
  청학동구이: "Cheonghakdong Grill",
  고기: "Meat",
  "삼진어묵 본점": "Samjin Amook Main Store",
  어묵: "Fish Cake",
  신기숲: "Singisup",
  대나무뷰: "Bamboo View",
  손목서가: "Sonmok Seoga",
  "오션뷰 서점": "Ocean View Bookstore",
  에테르: "Aether",
  "흰여울길 루프탑": "Huinnam-yeoul Rooftop",
  "카페 마렌": "Cafe Maren",
  "해안가 카페": "Coastal Cafe",
  "카페 드 220볼트": "Cafe de 220 Volt",
  "야경/드립커피": "Night View/Drip Coffee",
  "모모스 로스터리&커피바": "Momos Roastery & Coffee Bar",
  "스페셜티/영도대교뷰": "Specialty/Yeongdo Bridge View",
  "카린 영도 플레이스": "Karin Yeongdo Place",
  "북유럽감성/루프탑": "Nordic Vibe/Rooftop",
  무명일기: "Unknown Diary",
  "창고형/감성카페": "Warehouse/Aesthetic Cafe",
  "피아크 카페&베이커리": "P.ark Cafe & Bakery",
  "초대형 복합문화공간": "Mega Cultural Complex",
  비토닉: "B.tonic",
  "항구뷰/디저트": "Harbor View/Dessert",
};

for (const [ko, en] of Object.entries(translations)) {
  content = content.replace(new RegExp(`ko: "${ko}"`, "g"), `ko: "${ko}", en: "${en}"`);
}

fs.writeFileSync(
  "c:\\Users\\ADMIN\\busan-drama-trails\\src\\app\\spots\\[id]\\nearby\\page.tsx",
  content,
);
