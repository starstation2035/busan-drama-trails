export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: number;
  author: string;
  location: string;
  spotId: string;
  image: string;
  content: string;
  likes: number;
  category: "reviews" | "talk";
  avatar: string;
  isLiked?: boolean;
  comments?: Comment[];
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Mei-Ling",
    location: "Haeundae Beach",
    spotId: "spot_003",
    image: "/images/spots/haeundae.png",
    content: "The sunset here is absolutely magical. Just like in the dramas! Make sure to visit around 5 PM for the best lighting. 🌅",
    likes: 124,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mei",
  },
  {
    id: 2,
    author: "Seung-jin",
    location: "Gamcheon Culture Village",
    spotId: "spot_002",
    image: "/images/posters/gamcheon.jpg",
    content: "Don't miss the Little Prince statue! The view of the colorful houses is even better in person. Best photo spot in Busan! 📸",
    likes: 89,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seung",
  },
  {
    id: 3,
    author: "Yuki",
    location: "Gwangalli Beach",
    spotId: "spot_007",
    image: "/images/spots/gwangalli.png",
    content: "The night view of the bridge is stunning! A perfect place for a romantic walk after dinner. 🌃",
    likes: 210,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
  },
  {
    id: 108,
    author: "WooFan_LEO",
    location: "청사포 다릿돌전망대",
    spotId: "spot_001",
    image: "/images/spots/cheongsapo.png",
    content: "우영우에서 고래 상상하던 그 시원한 바다 구도가 그대로 느껴져서 가슴이 뻥 뚫렸어요! 투명 유리 바닥 아래로 파도치는 게 스릴 넘치네요. 날씨 좋은 날 낮에 가면 윤슬이 반짝여서 진짜 고래가 튀어나올 것 같은 분위기예요. 꿀팁은 청사포 해변열차 내리자마자 바로 전망대로 걸어오는 코스를 추천합니다!",
    likes: 312,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
  },
  {
    id: 102,
    author: "K_Drama_Tour",
    location: "흰여울문화마을",
    spotId: "spot_004",
    image: "/images/spots/huinnyeoul.png",
    content: "영화 변호인에서 송강호 배우가 국밥집 아들 면회 가기 전에 진심을 다해 변호를 결심하던 그 골목길 감성이 그대로 살아있어요. 푸른 부산 바다를 보면서 흰 벽을 따라 걷는데 영화 속 명대사들이 계속 생각나더라구요. 골목이 좁고 계단이 많으니 편한 운동화는 필수! 석양 질 때쯤 가야 진짜 인생샷 나옵니다.",
    likes: 425,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KDrama",
  },
  {
    id: 101,
    author: "MovieBuff_Busan",
    location: "자갈치시장",
    spotId: "spot_005",
    image: "/images/spots/jagalchi.png",
    content: "명작 영화 '친구'의 주인공들이 거칠게 뛰어다니던 역동적인 주차장과 시장 골목의 배경을 직접 보니 신기했어요! 투박하지만 사람 냄새 물씬 나는 진짜 부산의 살아있는 에너지를 느낄 수 있는 곳입니다. 촬영지 구도로 사진 한 장 찍고, 근처에서 신선한 생선구이나 회 한 접시 먹으면 완벽한 성지순례 코스 완성이에요.",
    likes: 289,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MovieBuff",
  },
  {
    id: 103,
    author: "Sunja_Heart",
    location: "영도 감지해변",
    spotId: "pachinko",
    image: "/images/spots/gamji.png",
    content: "드라마 파친코에서 선자가 고향 부산을 떠나기 전 눈물 흘리며 거닐던 가슴 아픈 해변 장면이 자꾸 아른거렸어요. 모래가 아니라 몽돌로 되어 있어서 파도가 칠 때마다 자갈 구르는 소리가 나는데 그 소리가 너무 슬프고도 아름답습니다. 대형 관광지처럼 북적이지 않고 한적해서 드라마 여운을 조용히 느끼기에 최고였습니다.",
    likes: 488,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunja",
  },
  {
    id: 104,
    author: "Running_Runner",
    location: "감천문화마을",
    spotId: "spot_002",
    image: "https://www.visitbusan.net/uploadImgs/files/cntnts/20191229142305192_oen",
    content: "런닝맨 멤버들이 알록달록한 집들 사이를 이리저리 뛰어나니며 미션을 해결하던 동화 같은 골목길 투어! 골목 구석구석 숨겨진 포토존 찾는 재미가 쏠쏠해요. 가장 유명한 어린왕자 동상 옆에서 사진 찍으려면 주말엔 줄을 좀 서야 하지만, 위에서 내려다보는 아기자기한 마을 전경을 보면 기다린 보람이 100% 있습니다.",
    likes: 395,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Running",
  },
  {
    id: 105,
    author: "Haeundae_Tsunami",
    location: "해운대 해수욕장",
    spotId: "spot_003",
    image: "/images/spots/haeundae.png",
    content: "영화 해운대에서 거대한 쓰나미가 몰려오던 바로 그 넓은 백사장을 걸어보니 웅장하면서도 기분이 묘하네요! 지금은 고층 빌딩들과 어우러져서 엄청 이국적이고 세련된 해변이 되었어요. 낮에 걷는 것도 좋지만, 해 질 무렵에 붉은 노을이 빌딩 유리창에 반사될 때 사진 찍으면 진짜 대박입니다. 주변에 맛있는 국밥집이랑 밀면집이 많아서 성지순례 후에 식사 해결하기도 너무 편해요!",
    likes: 356,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tsunami",
  },
  {
    id: 106,
    author: "Gwangalli_Star",
    location: "광안리 해수욕장",
    spotId: "spot_007",
    image: "/images/spots/gwangalli.png",
    content: "광안대교 야경은 진짜 볼 때마다 감탄만 나와요! 블랙 팬서에서 찰나로 지나가던 화려한 추격전 질주 배경이 바로 이곳이라니, 마블 덕후로서 심장이 요동칩니다. 해변가에 분위기 좋은 오션뷰 카페들이 즐비해서 통창 너머로 반짝이는 광안대교를 바라보며 커피 한잔 마시면 천국이 따로 없어요. 매주 토요일 저녁에 열리는 드론쇼 시간 맞춰서 방문하시는 걸 초강력 추천합니다!",
    likes: 412,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gwangstar",
  },
  {
    id: 201,
    author: "부산여행러_미니",
    location: "Busan, Korea",
    spotId: "custom",
    image: "",
    content: "다음달 6월 25일에 부산에 도착해요. 여자 1인이에요. 함께 여행할 분~ 구해요. 같이 드라마 촬영지 방문 할분 구해요.",
    likes: 5,
    category: "talk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mini",
    comments: [],
  },
  {
    id: 202,
    author: "열차매니아_철이",
    location: "청사포 해변열차",
    spotId: "spot_001",
    image: "",
    content: "청사포 까지 가는 바다열차와 블루 캡슐중 어느것을 추천하나요? 둘다 타고 싶은데 시간이 없어요.",
    likes: 12,
    category: "talk",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chul",
    comments: [
      {
        id: 301,
        author: "부산갈매기_민우",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minu",
        content: "시간이 부족하시다면 올라갈 때는 바다 풍경을 프라이빗하고 느긋하게 감상할 수 있는 블루캡슐을 타시고, 내려올 때는 시원하고 빠른 해변열차를 이용하시는 복합 코스를 추천해 드려요! 둘 다 경험하기에 최고의 방법입니다. 👍",
        createdAt: "2026년 5월 20일",
      },
    ],
  },
  {
    id: 109,
    author: "부산투어러_준호",
    location: "Busan, Korea",
    spotId: "spot_001",
    image: "/images/spots/cheongsapo.png",
    content: "청사포 다릿돌 전망대 다녀왔어요. 사진보다 실제로 가서 보면 훨씬 더 예뻐요. 강추",
    likes: 0,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Junho",
  },
];

