export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  content_en?: string;
  content_zh_TW?: string;
  createdAt: string;
  createdAt_en?: string;
  createdAt_zh_TW?: string;
  createdAt_zh_CN?: string;
  createdAt_ja?: string;
  author_en?: string;
  author_zh_TW?: string;
  author_zh_CN?: string;
  author_ja?: string;
}

export interface Review {
  id: number;
  author: string;
  location: string;
  location_en?: string;
  location_zh_TW?: string;
  spotId: string;
  image: string;
  content: string;
  content_en?: string;
  content_zh_TW?: string;
  likes: number;
  category: "reviews" | "talk";
  avatar: string;
  isLiked?: boolean;
  comments?: Comment[];
  author_en?: string;
  author_zh_TW?: string;
  author_zh_CN?: string;
  author_ja?: string;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Mei-Ling",
    location: "Haeundae Beach",
    location_en: "Haeundae Beach",
    location_zh_TW: "海雲台海水浴場",
    spotId: "spot_003",
    image: "/images/spots/haeundae.png",
    content:
      "The sunset here is absolutely magical. Just like in the dramas! Make sure to visit around 5 PM for the best lighting. 🌅",
    content_en:
      "The sunset here is absolutely magical. Just like in the dramas! Make sure to visit around 5 PM for the best lighting. 🌅",
    content_zh_TW:
      "這裡的日落絕對充滿魔力。就像韓劇裡一樣！一定要在下午5點左右來，才能拍到最美的光線。 🌅",
    likes: 124,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mei",
  },
  {
    id: 2,
    author: "Seung-jin",
    location: "Gamcheon Culture Village",
    location_en: "Gamcheon Culture Village",
    location_zh_TW: "甘川文化村",
    spotId: "spot_002",
    image: "/images/posters/gamcheon.jpg",
    content:
      "Don't miss the Little Prince statue! The view of the colorful houses is even better in person. Best photo spot in Busan! 📸",
    content_en:
      "Don't miss the Little Prince statue! The view of the colorful houses is even better in person. Best photo spot in Busan! 📸",
    content_zh_TW:
      "千萬別錯過小王子雕像！色彩繽紛的房屋親眼看更美。釜山最棒的拍照景點！ 📸",
    likes: 89,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seung",
  },
  {
    id: 3,
    author: "Yuki",
    location: "Gwangalli Beach",
    location_en: "Gwangalli Beach",
    location_zh_TW: "廣安里海水浴場",
    spotId: "spot_007",
    image: "/images/spots/gwangalli.png",
    content:
      "The night view of the bridge is stunning! A perfect place for a romantic walk after dinner. 🌃",
    content_en:
      "The night view of the bridge is stunning! A perfect place for a romantic walk after dinner. 🌃",
    content_zh_TW:
      "廣安大橋的夜景美得令人驚嘆！晚餐後浪漫散步的完美去處。 🌃",
    likes: 210,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
  },
  {
    id: 108,
    author: "WooFan_LEO",
    location: "청사포 다릿돌전망대",
    location_en: "Cheongsapo Daritdol Observatory",
    location_zh_TW: "青沙浦踏石觀景臺",
    spotId: "spot_001",
    image: "/images/spots/cheongsapo.png",
    content:
      "우영우에서 고래 상상하던 그 시원한 바다 구도가 그대로 느껴져서 가슴이 뻥 뚫렸어요! 투명 유리 바닥 아래로 파도치는 게 스릴 넘치네요. 날씨 좋은 날 낮에 가면 윤슬이 반짝여서 진짜 고래가 튀어나올 것 같은 분위기예요. 꿀팁은 청사포 해변열차 내리자마자 바로 전망대로 걸어오는 코스를 추천합니다!",
    content_en: "I could feel the refreshing ocean view where Woo Young-woo imagined whales, and it was so liberating! The waves crashing beneath the transparent glass floor were thrilling. On a sunny afternoon, the sparkling water makes it feel like a real whale might jump out. Pro tip: Walk straight to the observatory right after getting off the Cheongsapo Beach Train!",
    content_zh_TW: "在這裡能感受到禹英禑想像中鯨魚出現的那片清爽海景，讓人心胸開闊！在透明的玻璃地板下看著海浪拍打，真的非常刺激。在陽光明媚的下午，波光粼粼的海面讓人覺得真的會有鯨魚跳出來。小提示：強烈建議下海濱列車後直接走來觀景臺！",
    likes: 312,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  },
  {
    id: 102,
    author: "K_Drama_Tour",
    location: "흰여울문화마을",
    location_en: "Huinnyeoul Culture Village",
    location_zh_TW: "白淺灘文化村",
    spotId: "spot_004",
    image: "/images/spots/huinnyeoul.png",
    content:
      "영화 변호인에서 송강호 배우가 국밥집 아들 면회 가기 전에 진심을 다해 변호를 결심하던 그 골목길 감성이 그대로 살아있어요. 푸른 부산 바다를 보면서 흰 벽을 따라 걷는데 영화 속 명대사들이 계속 생각나더라구요. 골목이 좁고 계단이 많으니 편한 운동화는 필수! 석양 질 때쯤 가야 진짜 인생샷 나옵니다.",
    content_en: "The nostalgic alleyway from 'The Attorney', where Song Kang-ho made his heartfelt decision, is still perfectly preserved. Walking along the white walls overlooking the blue Busan sea, I kept remembering famous lines from the movie. The alleys are narrow with many stairs, so comfortable sneakers are a must! Go around sunset for the best life shot.",
    content_zh_TW: "電影《辯護人》中，宋康昊在探望湯飯館阿姨的兒子前，下定決心全力辯護的那個小巷依然完好保留著。望著蔚藍的釜山海，沿著白牆漫步，腦海中不斷浮現電影裡的經典台詞。巷子很窄而且有很多階梯，一定要穿舒服的運動鞋！傍晚夕陽西下時去，絕對能拍出人生美照。",
    likes: 425,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KDrama",
  },
  {
    id: 101,
    author: "MovieBuff_Busan",
    location: "자갈치시장",
    location_en: "Jagalchi Market",
    location_zh_TW: "札嘎其市場",
    spotId: "spot_005",
    image: "/images/spots/jagalchi.png",
    content:
      "명작 영화 '친구'의 주인공들이 거칠게 뛰어다니던 역동적인 주차장과 시장 골목의 배경을 직접 보니 신기했어요! 투박하지만 사람 냄새 물씬 나는 진짜 부산의 살아있는 에너지를 느낄 수 있는 곳입니다. 촬영지 구도로 사진 한 장 찍고, 근처에서 신선한 생선구이나 회 한 접시 먹으면 완벽한 성지순례 코스 완성이에요.",
    content_en: "It was amazing to see the dynamic parking lot and market alleys where the main characters of the masterpiece 'Friend' ran around wildly! You can feel the true, raw, and vibrant energy of Busan here. Take a picture from the filming angle, then grab a plate of fresh grilled fish or sashimi nearby—it's the perfect pilgrimage course.",
    content_zh_TW: "親眼看到經典電影《朋友》裡主角們瘋狂奔跑的停車場和市場小巷，真的覺得很神奇！雖然有點粗獷，但這裡能感受到充滿人情味、最真實生動的釜山能量。在拍攝角度拍張照，然後在附近吃盤新鮮的烤魚或生魚片，就是最完美的朝聖路線了。",
    likes: 289,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff",
  },
  {
    id: 103,
    author: "Sunja_Heart",
    location: "영도 감지해변",
    location_en: "Yeongdo Gamji Beach",
    location_zh_TW: "影島甘池海灘",
    spotId: "pachinko",
    image: "/images/spots/gamji.png",
    content:
      "드라마 파친코에서 선자가 고향 부산을 떠나기 전 눈물 흘리며 거닐던 가슴 아픈 해변 장면이 자꾸 아른거렸어요. 모래가 아니라 몽돌로 되어 있어서 파도가 칠 때마다 자갈 구르는 소리가 나는데 그 소리가 너무 슬프고도 아름답습니다. 대형 관광지처럼 북적이지 않고 한적해서 드라마 여운을 조용히 느끼기에 최고였습니다.",
    content_en: "The heartbreaking beach scene from 'Pachinko', where Sunja wept before leaving her hometown of Busan, kept lingering in my mind. It's a pebble beach, so every time the waves crash, you hear the stones rolling—it sounds so sad yet beautiful. Unlike major tourist spots, it's quiet, making it the best place to silently savor the lingering emotions of the drama.",
    content_zh_TW: "韓劇《柏青哥》中，善慈離開故鄉釜山前流淚漫步的那片令人心碎的海灘，一直在我的腦海中揮之不去。這裡不是沙灘而是鵝卵石海灘，所以每當海浪拍打時，都能聽到石頭滾動的聲音，那聲音聽起來既悲傷又美麗。和那些熱門觀光景點不同，這裡非常寧靜，是最適合靜靜回味劇情餘韻的地方。",
    likes: 488,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunja",
  },
  {
    id: 104,
    author: "Running_Runner",
    location: "감천문화마을",
    location_en: "Gamcheon Culture Village",
    location_zh_TW: "甘川文化村",
    spotId: "spot_002",
    image: "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229142305192_oen",
    content:
      "런닝맨 멤버들이 알록달록한 집들 사이를 이리저리 뛰어나니며 미션을 해결하던 동화 같은 골목길 투어! 골목 구석구석 숨겨진 포토존 찾는 재미가 쏠쏠해요. 가장 유명한 어린왕자 동상 옆에서 사진 찍으려면 주말엔 줄을 좀 서야 하지만, 위에서 내려다보는 아기자기한 마을 전경을 보면 기다린 보람이 100% 있습니다.",
    content_en: "A fairytale-like alley tour where Running Man members ran around colorful houses to solve missions! Finding hidden photo zones in every corner is incredibly fun. You might have to line up on weekends to take a photo next to the famous Little Prince statue, but looking down at the charming village makes the wait 100% worth it.",
    content_zh_TW: "就像童話般的小巷之旅，Running Man成員們就是在這些色彩繽紛的房子之間穿梭解任務的！在每個角落尋找隱藏的拍照區真的超級有趣。週末想在著名的小王子雕像旁拍照可能需要排隊，但從上面俯瞰這座可愛村莊的全景，絕對值得這100%的等待。",
    likes: 395,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Running",
  },
  {
    id: 105,
    author: "Haeundae_Tsunami",
    location: "해운대 해수욕장",
    location_en: "Haeundae Beach",
    location_zh_TW: "海雲台海水浴場",
    spotId: "spot_003",
    image: "/images/spots/haeundae.png",
    content:
      "영화 해운대에서 거대한 쓰나미가 몰려오던 바로 그 넓은 백사장을 걸어보니 웅장하면서도 기분이 묘하네요! 지금은 고층 빌딩들과 어우러져서 엄청 이국적이고 세련된 해변이 되었어요. 낮에 걷는 것도 좋지만, 해 질 무렵에 붉은 노을이 빌딩 유리창에 반사될 때 사진 찍으면 진짜 대박입니다. 주변에 맛있는 국밥집이랑 밀면집이 많아서 성지순례 후에 식사 해결하기도 너무 편해요!",
    content_en: "Walking on the very same wide sandy beach where the giant tsunami hit in the movie 'Haeundae' felt both grand and surreal! Now, with high-rise buildings blending in, it has become a very exotic and sophisticated beach. Walking during the day is nice, but taking photos at sunset when the red glow reflects on the glass buildings is absolutely stunning. There are many delicious pork soup and milmyeon places nearby, making it super convenient to eat after your pilgrimage!",
    content_zh_TW: "走在電影《大浩劫》中巨大海嘯襲來的同一片寬闊沙灘上，感覺既壯觀又不可思議！現在，這裡已經與高樓大廈融為一體，變成了一個充滿異國風情又時尚的海灘。白天散步很不錯，但在夕陽西下時，紅霞倒映在玻璃大樓上拍照真的美呆了。附近有很多好吃的豬肉湯飯和麥麵店，朝聖完去吃頓飯超級方便！",
    likes: 356,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tsunami",
  },
  {
    id: 106,
    author: "Gwangalli_Star",
    location: "광안리 해수욕장",
    location_en: "Gwangalli Beach",
    location_zh_TW: "廣安里海水浴場",
    spotId: "spot_007",
    image: "/images/spots/gwangalli.png",
    content:
      "광안대교 야경은 진짜 볼 때마다 감탄만 나와요! 블랙 팬서에서 찰나로 지나가던 화려한 추격전 질주 배경이 바로 이곳이라니, 마블 덕후로서 심장이 요동칩니다. 해변가에 분위기 좋은 오션뷰 카페들이 즐비해서 통창 너머로 반짝이는 광안대교를 바라보며 커피 한잔 마시면 천국이 따로 없어요. 매주 토요일 저녁에 열리는 드론쇼 시간 맞춰서 방문하시는 걸 초강력 추천합니다!",
    content_en: "The night view of Gwangandaegyo Bridge is truly breathtaking every time! As a Marvel fan, my heart raced knowing this was the backdrop for the spectacular chase scene in 'Black Panther'. There are so many nice ocean-view cafes along the beach, and drinking coffee while looking at the sparkling bridge through a glass window feels like heaven. I highly recommend visiting on a Saturday evening to catch the spectacular drone show!",
    content_zh_TW: "每次看到廣安大橋的夜景都忍不住驚嘆！身為漫威迷，知道這裡就是《黑豹》裡那場華麗追逐戰的背景，心臟都跟著狂跳。海灘邊有很多氣氛很好的海景咖啡廳，透過玻璃窗看著閃爍的廣安大橋喝杯咖啡，簡直就像在天堂一樣。強烈建議在每週六晚上來，剛好可以看精彩的無人機表演！",
    likes: 412,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gwangstar",
  },
  {
    id: 201,
    author: "부산여행러_미니",
    location: "Busan, Korea",
    location_en: "Busan, Korea",
    location_zh_TW: "韓國 釜山",
    spotId: "custom",
    image: "",
    content:
      "다음달 6월 25일에 부산에 도착해요. 여자 1인이에요. 함께 여행할 분~ 구해요. 같이 드라마 촬영지 방문 할분 구해요.",
    content_en: "I will arrive in Busan next month on June 25th. I'm a solo female traveler. Looking for someone to travel with~ Anyone want to visit K-drama filming spots together?",
    content_zh_TW: "我下個月6月25日會到釜山。我是女生，一個人旅行。尋找旅伴～有人想一起去韓劇拍攝地朝聖嗎？",
    likes: 5,
    category: "talk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mini",
    author_en: "BusanTraveler_Mini",
    author_zh_TW: "釜山旅行者_Mini",
    author_zh_CN: "釜山旅行者_Mini",
    author_ja: "釜山トラベラー_ミニ",
    comments: [],
  },
  {
    id: 202,
    author: "열차매니아_철이",
    location: "청사포 해변열차",
    location_en: "Cheongsapo Beach Train",
    location_zh_TW: "青沙浦海濱列車",
    spotId: "spot_001",
    image: "",
    content:
      "청사포 까지 가는 바다열차와 블루 캡슐중 어느것을 추천하나요? 둘다 타고 싶은데 시간이 없어요.",
    content_en: "Between the Beach Train to Cheongsapo and the Blue Capsule, which one do you recommend? I want to ride both but don't have enough time.",
    content_zh_TW: "去青沙浦的海濱列車和膠囊列車，大家比較推薦哪一個呢？兩個都想搭，但是時間不夠。",
    likes: 12,
    category: "talk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chul",
    author_en: "TrainManiac_Chul",
    author_zh_TW: "火車迷_哲伊",
    author_zh_CN: "火车迷_哲伊",
    author_ja: "列車マニア_チョル",
    comments: [
      {
        id: 301,
        author: "부산갈매기_민우",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minu",
        content:
          "시간이 부족하시다면 올라갈 때는 바다 풍경을 프라이빗하고 느긋하게 감상할 수 있는 블루캡슐을 타시고, 내려올 때는 시원하고 빠른 해변열차를 이용하시는 복합 코스를 추천해 드려요! 둘 다 경험하기에 최고의 방법입니다. 👍",
        content_en: "If you don't have enough time, I recommend a combined course: take the Blue Capsule on the way up to enjoy the ocean view privately and leisurely, and take the cool and fast Beach Train on the way down! It's the best way to experience both. 👍",
        content_zh_TW: "如果時間不夠的話，我推薦混合路線：上去的時候搭乘可以私密又悠閒欣賞海景的膠囊列車，下來的時候搭乘涼爽又快速的海濱列車！這是能同時體驗兩者的最佳方法。 👍",
        createdAt: "2026년 5월 20일",
        createdAt_en: "May 20, 2026",
        createdAt_zh_TW: "2026年 5月 20日",
        createdAt_zh_CN: "2026年 5月 20日",
        createdAt_ja: "2026年 5月 20日",
        author_en: "BusanSeagull_Minu",
        author_zh_TW: "釜山海鷗_敏宇",
        author_zh_CN: "釜山海鸥_敏宇",
        author_ja: "釜山カモメ_ミヌ",
      },
    ],
  },
  {
    id: 109,
    author: "부산투어러_준호",
    location: "청사포 다릿돌전망대",
    location_en: "Cheongsapo Daritdol Observatory",
    location_zh_TW: "青沙浦踏石觀景臺",
    spotId: "spot_001",
    image: "/images/spots/junho_review.png",
    content: "청사포 다릿돌 전망대 다녀왔어요. 사진보다 실제로 가서 보면 훨씬 더 예뻐요. 강추",
    content_en:
      "I visited the Cheongsapo Daritdol Observatory. It's so much prettier in person than in pictures. Highly recommended!",
    content_zh_TW: "我去了青沙浦踏石觀景臺。親眼看比照片還要漂亮很多。強烈推薦！",
    likes: 0,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junho",
    author_en: "BusanTourer_Junho",
    author_zh_TW: "釜山旅客_俊昊",
    author_zh_CN: "釜山旅客_俊昊",
    author_ja: "釜山ツアラー_ジュノ",
  },
];
