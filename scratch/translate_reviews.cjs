const fs = require("fs");
let content = fs.readFileSync(
  "c:\\Users\\ADMIN\\busan-drama-trails\\src\\data\\mockReviews.ts",
  "utf-8",
);

// Add optional en fields
content = content.replace("location: string;", "location: string;\n  location_en?: string;");
content = content.replace("content: string;", "content: string;\n  content_en?: string;");

const translations = {
  "청사포 다릿돌전망대": "Cheongsapo Daritdol Observatory",
  흰여울문화마을: "Huinnyeoul Culture Village",
  자갈치시장: "Jagalchi Market",
  "영도 감지해변": "Yeongdo Gamji Beach",
  감천문화마을: "Gamcheon Culture Village",
  "해운대 해수욕장": "Haeundae Beach",
  "광안리 해수욕장": "Gwangalli Beach",
  "청사포 해변열차": "Cheongsapo Beach Train",
  "우영우에서 고래 상상하던 그 시원한 바다 구도가 그대로 느껴져서 가슴이 뻥 뚫렸어요! 투명 유리 바닥 아래로 파도치는 게 스릴 넘치네요. 날씨 좋은 날 낮에 가면 윤슬이 반짝여서 진짜 고래가 튀어나올 것 같은 분위기예요. 꿀팁은 청사포 해변열차 내리자마자 바로 전망대로 걸어오는 코스를 추천합니다!":
    "I could feel the refreshing ocean view where Woo Young-woo imagined whales, and it was so liberating! The waves crashing beneath the transparent glass floor were thrilling. On a sunny afternoon, the sparkling water makes it feel like a real whale might jump out. Pro tip: Walk straight to the observatory right after getting off the Cheongsapo Beach Train!",
  "영화 변호인에서 송강호 배우가 국밥집 아들 면회 가기 전에 진심을 다해 변호를 결심하던 그 골목길 감성이 그대로 살아있어요. 푸른 부산 바다를 보면서 흰 벽을 따라 걷는데 영화 속 명대사들이 계속 생각나더라구요. 골목이 좁고 계단이 많으니 편한 운동화는 필수! 석양 질 때쯤 가야 진짜 인생샷 나옵니다.":
    "The nostalgic alleyway from 'The Attorney', where Song Kang-ho made his heartfelt decision, is still perfectly preserved. Walking along the white walls overlooking the blue Busan sea, I kept remembering famous lines from the movie. The alleys are narrow with many stairs, so comfortable sneakers are a must! Go around sunset for the best life shot.",
  "명작 영화 '친구'의 주인공들이 거칠게 뛰어다니던 역동적인 주차장과 시장 골목의 배경을 직접 보니 신기했어요! 투박하지만 사람 냄새 물씬 나는 진짜 부산의 살아있는 에너지를 느낄 수 있는 곳입니다. 촬영지 구도로 사진 한 장 찍고, 근처에서 신선한 생선구이나 회 한 접시 먹으면 완벽한 성지순례 코스 완성이에요.":
    "It was amazing to see the dynamic parking lot and market alleys where the main characters of the masterpiece 'Friend' ran around wildly! You can feel the true, raw, and vibrant energy of Busan here. Take a picture from the filming angle, then grab a plate of fresh grilled fish or sashimi nearby—it's the perfect pilgrimage course.",
  "드라마 파친코에서 선자가 고향 부산을 떠나기 전 눈물 흘리며 거닐던 가슴 아픈 해변 장면이 자꾸 아른거렸어요. 모래가 아니라 몽돌로 되어 있어서 파도가 칠 때마다 자갈 구르는 소리가 나는데 그 소리가 너무 슬프고도 아름답습니다. 대형 관광지처럼 북적이지 않고 한적해서 드라마 여운을 조용히 느끼기에 최고였습니다.":
    "The heartbreaking beach scene from 'Pachinko', where Sunja wept before leaving her hometown of Busan, kept lingering in my mind. It's a pebble beach, so every time the waves crash, you hear the stones rolling—it sounds so sad yet beautiful. Unlike major tourist spots, it's quiet, making it the best place to silently savor the lingering emotions of the drama.",
  "런닝맨 멤버들이 알록달록한 집들 사이를 이리저리 뛰어나니며 미션을 해결하던 동화 같은 골목길 투어! 골목 구석구석 숨겨진 포토존 찾는 재미가 쏠쏠해요. 가장 유명한 어린왕자 동상 옆에서 사진 찍으려면 주말엔 줄을 좀 서야 하지만, 위에서 내려다보는 아기자기한 마을 전경을 보면 기다린 보람이 100% 있습니다.":
    "A fairytale-like alley tour where Running Man members ran around colorful houses to solve missions! Finding hidden photo zones in every corner is incredibly fun. You might have to line up on weekends to take a photo next to the famous Little Prince statue, but looking down at the charming village makes the wait 100% worth it.",
  "영화 해운대에서 거대한 쓰나미가 몰려오던 바로 그 넓은 백사장을 걸어보니 웅장하면서도 기분이 묘하네요! 지금은 고층 빌딩들과 어우러져서 엄청 이국적이고 세련된 해변이 되었어요. 낮에 걷는 것도 좋지만, 해 질 무렵에 붉은 노을이 빌딩 유리창에 반사될 때 사진 찍으면 진짜 대박입니다. 주변에 맛있는 국밥집이랑 밀면집이 많아서 성지순례 후에 식사 해결하기도 너무 편해요!":
    "Walking on the very same wide sandy beach where the giant tsunami hit in the movie 'Haeundae' felt both grand and surreal! Now, with high-rise buildings blending in, it has become a very exotic and sophisticated beach. Walking during the day is nice, but taking photos at sunset when the red glow reflects on the glass buildings is absolutely stunning. There are many delicious pork soup and milmyeon places nearby, making it super convenient to eat after your pilgrimage!",
  "광안대교 야경은 진짜 볼 때마다 감탄만 나와요! 블랙 팬서에서 찰나로 지나가던 화려한 추격전 질주 배경이 바로 이곳이라니, 마블 덕후로서 심장이 요동칩니다. 해변가에 분위기 좋은 오션뷰 카페들이 즐비해서 통창 너머로 반짝이는 광안대교를 바라보며 커피 한잔 마시면 천국이 따로 없어요. 매주 토요일 저녁에 열리는 드론쇼 시간 맞춰서 방문하시는 걸 초강력 추천합니다!":
    "The night view of Gwangandaegyo Bridge is truly breathtaking every time! As a Marvel fan, my heart raced knowing this was the backdrop for the spectacular chase scene in 'Black Panther'. There are so many nice ocean-view cafes along the beach, and drinking coffee while looking at the sparkling bridge through a glass window feels like heaven. I highly recommend visiting on a Saturday evening to catch the spectacular drone show!",
  "다음달 6월 25일에 부산에 도착해요. 여자 1인이에요. 함께 여행할 분~ 구해요. 같이 드라마 촬영지 방문 할분 구해요.":
    "I will arrive in Busan next month on June 25th. I'm a solo female traveler. Looking for someone to travel with~ Anyone want to visit K-drama filming spots together?",
  "청사포 까지 가는 바다열차와 블루 캡슐중 어느것을 추천하나요? 둘다 타고 싶은데 시간이 없어요.":
    "Between the Beach Train to Cheongsapo and the Blue Capsule, which one do you recommend? I want to ride both but don't have enough time.",
  "청사포 다릿돌 전망대 다녀왔어요. 사진보다 실제로 가서 보면 훨씬 더 예뻐요. 강추":
    "I visited the Cheongsapo Daritdol Observatory. It's so much prettier in person than in pictures. Highly recommended!",
};

for (const [ko, en] of Object.entries(translations)) {
  content = content.replace(
    new RegExp(`location: "${ko}"`, "g"),
    `location: "${ko}",\n    location_en: "${en}"`,
  );
  content = content.replace(
    new RegExp(`content: "${ko}"`, "g"),
    `content: "${ko}",\n    content_en: "${en}"`,
  );
}

fs.writeFileSync("c:\\Users\\ADMIN\\busan-drama-trails\\src\\data\\mockReviews.ts", content);
