export interface CafeLocation {
  id: string;
  name: string;
  category: string;
  vibe: string;
  rating: number;
  distance: number;
  thumbnail: string;
  images: { url: string; description: string }[];
  reviewSummary: string;
  signatureMenu: string;
  latitude: number;
  longitude: number;
}

export const JAGALCHI_NEARBY_CAFES: CafeLocation[] = [
  {
    id: "j-cafe-01",
    name: "바우노바 백산",
    category: "Hand Drip",
    vibe: "Classic",
    rating: 4.8,
    distance: 345,
    thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600", description: "직접 로스팅한 핸드드립 커피" },
      { url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600", description: "고소한 풍미의 수제 디저트" },
      { url: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=600", description: "엔틱하고 차분한 인테리어" },
      { url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600", description: "창밖으로 보이는 조용한 거리 뷰" }
    ],
    reviewSummary: "☕️ 정통 핸드드립의 진수, 조용히 바다 향을 즐기기 좋은 곳",
    signatureMenu: "바우노바 시그니처 블렌드",
    latitude: 35.0990,
    longitude: 129.0330,
  },
  {
    id: "j-cafe-02",
    name: "쿠오리노",
    category: "Dessert/Interior",
    vibe: "Trendy",
    rating: 4.7,
    distance: 520,
    thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=400&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=600", description: "시그니처 팬케이크와 라떼" },
      { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600", description: "모던하고 감각적인 가구 배치" },
      { url: "https://images.unsplash.com/photo-1493856678794-592e2043f545?q=80&w=600", description: "따뜻한 햇살이 들어오는 통창" },
      { url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600", description: "인스타 감성의 포토존" }
    ],
    reviewSummary: "🥞 부산의 힙한 분위기, 비주얼만큼 훌륭한 디저트 맛집",
    signatureMenu: "쿠오리노 수제 팬케이크",
    latitude: 35.1010,
    longitude: 129.0315,
  },
  {
    id: "j-cafe-03",
    name: "노티스",
    category: "Vintage/Large",
    vibe: "Industrial",
    rating: 4.6,
    distance: 890,
    thumbnail: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=400&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600", description: "창고를 개조한 웅장한 공간" },
      { url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600", description: "빈티지한 소품과 가구" },
      { url: "https://images.unsplash.com/photo-1510551310160-589462daf284?q=80&w=600", description: "넓은 창으로 보이는 부산항" },
      { url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=600", description: "밤이면 더 매력적인 야경" }
    ],
    reviewSummary: "🏗️ 항구의 정취를 담은 거대한 공간, 역사가 느껴지는 카페",
    signatureMenu: "노티스 콜드브루 라떼",
    latitude: 35.0935,
    longitude: 129.0355,
  },
  {
    id: "j-cafe-04",
    name: "연경재",
    category: "Traditional/Modern",
    vibe: "Zen",
    rating: 4.9,
    distance: 410,
    thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=400&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600", description: "전통 한옥의 미를 살린 정갈한 배치" },
      { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600", description: "정성스럽게 우려낸 프리미엄 티" },
      { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600", description: "마음이 편안해지는 차분한 조명" },
      { url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600", description: "모던함과 전통의 완벽한 조화" }
    ],
    reviewSummary: "🌿 일상의 소음을 잊게 해주는 고요하고 품격 있는 공간",
    signatureMenu: "연경재 하이엔드 우차(Tea)",
    latitude: 35.1000,
    longitude: 129.0325,
  },
  {
    id: "j-cafe-05",
    name: "굿올데즈",
    category: "Rooftop/Local",
    vibe: "Clean",
    rating: 4.5,
    distance: 600,
    thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop",
    images: [
      { url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600", description: "루프탑에서 즐기는 부산 원도심 뷰" },
      { url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600", description: "매일 아침 구워내는 신선한 베이커리" },
      { url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600", description: "화이트 톤의 깔끔하고 화사한 실내" },
      { url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600", description: "로컬의 정취를 담은 엽서 코너" }
    ],
    reviewSummary: "🏙️ 여행의 여운을 정리하기 좋은, 따뜻한 로컬의 아지트",
    signatureMenu: "굿올데즈 원도심 블렌딩",
    latitude: 35.0975,
    longitude: 129.0340,
  },
];

