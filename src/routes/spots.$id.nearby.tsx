import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Star, Utensils, Coffee, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import spotsRaw from "@/data/spots.json";
import { useMemo, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";
import { triggerHeartFly } from "@/components/HeartEffect";
import { Outlet, useChildMatches } from "@tanstack/react-router";

const BASE_LAT = 35.0787;
const BASE_LNG = 129.0441;

export const HARDCODED_RESTAURANTS = [
  { id: "hr1", name: { ko: "흰여울점빵" }, food: { ko: "라면/토스트" }, latitude: 35.0795, longitude: 129.0432, thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400", rating: 4.6 },
  { id: "hr2", name: { ko: "거청식당" }, food: { ko: "생선구이" }, latitude: 35.0815, longitude: 129.0460, thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400", rating: 4.4 },
  { id: "hr3", name: { ko: "달뜨네" }, food: { ko: "회밥/시나몬맥주" }, latitude: 35.0801, longitude: 129.0445, thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", rating: 4.7 },
  { id: "hr4", name: { ko: "영도해녀촌" }, food: { ko: "성게알/김밥" }, latitude: 35.0715, longitude: 129.0685, thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400", rating: 4.8 },
  { id: "hr5", name: { ko: "도날드" }, food: { ko: "즉석떡볶이" }, latitude: 35.0768, longitude: 129.0558, thumbnail: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400", rating: 4.5 },
  { id: "hr6", name: { ko: "왔다식당" }, food: { ko: "한우스지전골" }, latitude: 35.0895, longitude: 129.0542, thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", rating: 4.6 },
  { id: "hr7", name: { ko: "재기돼지국밥" }, food: { ko: "남항시장" }, latitude: 35.0921, longitude: 129.0375, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.4 },
  { id: "hr8", name: { ko: "와글와글" }, food: { ko: "라밥" }, latitude: 35.0812, longitude: 129.0571, thumbnail: "/wagle.jpg", rating: 4.3 },
  { id: "hr9", name: { ko: "청학동구이" }, food: { ko: "고기" }, latitude: 35.0955, longitude: 129.0621, thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400", rating: 4.2 },
  { id: "hr10", name: { ko: "삼진어묵 본점" }, food: { ko: "어묵" }, latitude: 35.0915, longitude: 129.0415, thumbnail: "/samjin.jpg", rating: 4.9 },
];

export const HARDCODED_CAFES = [
  { id: "hc1", name: { ko: "신기숲" }, signature: { ko: "대나무뷰" }, latitude: 35.0861, longitude: 129.0531, thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400", rating: 4.7 },
  { id: "hc2", name: { ko: "손목서가" }, signature: { ko: "오션뷰 서점" }, latitude: 35.0792, longitude: 129.0435, thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", rating: 4.8 },
  { id: "hc3", name: { ko: "에테르" }, signature: { ko: "루프탑" }, latitude: 35.0778, longitude: 129.0445, thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400", rating: 4.6 },
  { id: "hc4", name: { ko: "구름에" }, signature: { ko: "디저트" }, latitude: 35.0798, longitude: 129.0438, thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", rating: 4.5 },
  { id: "hc5", name: { ko: "피아크 (P.ARK)" }, signature: { ko: "초대형" }, latitude: 35.0885, longitude: 129.0765, thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", rating: 4.9 },
  { id: "hc6", name: { ko: "모모스커피 영도" }, signature: { ko: "스페셜티" }, latitude: 35.0935, longitude: 129.0355, thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", rating: 4.8 },
  { id: "hc7", name: { ko: "무명일기" }, signature: { ko: "창고형" }, latitude: 35.0945, longitude: 129.0365, thumbnail: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400", rating: 4.6 },
  { id: "hc8", name: { ko: "쓰릴미" }, signature: { ko: "오션뷰" }, latitude: 35.0782, longitude: 129.0448, thumbnail: "https://images.unsplash.com/photo-1510551310160-589462daf284?w=400", rating: 4.5 },
  { id: "hc9", name: { ko: "카페 변호인" }, signature: { ko: "촬영지" }, latitude: 35.0791, longitude: 129.0431, thumbnail: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400", rating: 4.7 },
  { id: "hc10", name: { ko: "카린 영도 플레이스" }, signature: { ko: "스칸디나비안 뷰" }, latitude: 35.0905, longitude: 129.0565, thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400", rating: 4.8 },
];

export const SPOT_CONFIGS: Record<string, any> = {
  "spot_001": { // 청사포
    baseLat: 35.1589, baseLng: 129.1992, radius: 1000,
    restaurants: [
      { id: "r1_1", name: { ko: "수민이네" }, food: { ko: "조개구이/장어구이" }, latitude: 35.1601, longitude: 129.1985, thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400", rating: 4.6 },
      { id: "r1_2", name: { ko: "하진이네" }, food: { ko: "조개구이" }, latitude: 35.1595, longitude: 129.1990, thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400", rating: 4.5 },
      { id: "r1_3", name: { ko: "청사포 다희네" }, food: { ko: "장어구이" }, latitude: 35.1605, longitude: 129.1980, thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400", rating: 4.4 }
    ],
    cafes: [
      { id: "c1_1", name: { ko: "앨리스 도넛" }, signature: { ko: "청사포 도넛" }, latitude: 35.1610, longitude: 129.1975, thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", rating: 4.7 },
      { id: "c1_2", name: { ko: "카페 루프탑" }, signature: { ko: "오션뷰" }, latitude: 35.1585, longitude: 129.1995, thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400", rating: 4.8 }
    ]
  },
  "spot_002": { // 감천문화마을
    baseLat: 35.0975, baseLng: 129.0107, radius: 1000,
    restaurants: [
      { id: "r2_1", name: { ko: "감내어울터 분식" }, food: { ko: "분식" }, latitude: 35.0970, longitude: 129.0115, thumbnail: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400", rating: 4.3 },
      { id: "r2_2", name: { ko: "더플레이트" }, food: { ko: "양식/브런치" }, latitude: 35.0980, longitude: 129.0100, thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", rating: 4.5 }
    ],
    cafes: [
      { id: "c2_1", name: { ko: "아방가르드 카페" }, signature: { ko: "마을 전경 뷰" }, latitude: 35.0965, longitude: 129.0110, thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400", rating: 4.8 },
      { id: "c2_2", name: { ko: "계단위 푸른집" }, signature: { ko: "구름라떼" }, latitude: 35.0972, longitude: 129.0105, thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", rating: 4.7 }
    ]
  },
  "spot_003": { // 해운대
    baseLat: 35.1587, baseLng: 129.1604, radius: 1000,
    restaurants: [
      { id: "r3_1", name: { ko: "해운대 암소갈비집" }, food: { ko: "한우갈비" }, latitude: 35.1630, longitude: 129.1650, thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400", rating: 4.7 },
      { id: "r3_2", name: { ko: "밀양순대돼지국밥" }, food: { ko: "돼지국밥" }, latitude: 35.1610, longitude: 129.1600, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.5 },
      { id: "r3_3", name: { ko: "상국이네" }, food: { ko: "떡볶이" }, latitude: 35.1615, longitude: 129.1615, thumbnail: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400", rating: 4.4 }
    ],
    cafes: [
      { id: "c3_1", name: { ko: "랑데자뷰 해운대" }, signature: { ko: "제주 감성" }, latitude: 35.1595, longitude: 129.1620, thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400", rating: 4.6 },
      { id: "c3_2", name: { ko: "호랑이젤라떡" }, signature: { ko: "젤라또" }, latitude: 35.1580, longitude: 129.1650, thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", rating: 4.8 }
    ]
  },
  "spot_004": { // 흰여울문화마을
    baseLat: 35.0787,
    baseLng: 129.0441,
    radius: 1500,
    restaurants: HARDCODED_RESTAURANTS,
    cafes: HARDCODED_CAFES
  },
  "spot_005": { // 자갈치시장
    baseLat: 35.0966, baseLng: 129.0306, radius: 1000,
    restaurants: [
      { id: "r5_1", name: { ko: "백화양곱창" }, food: { ko: "양곱창" }, latitude: 35.0960, longitude: 129.0310, thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400", rating: 4.6 },
      { id: "r5_2", name: { ko: "제일꼼장어" }, food: { ko: "꼼장어" }, latitude: 35.0955, longitude: 129.0300, thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400", rating: 4.5 },
      { id: "r5_3", name: { ko: "남포동 생선구이 골목" }, food: { ko: "생선구이백반" }, latitude: 35.0970, longitude: 129.0305, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.4 }
    ],
    cafes: [
      { id: "c5_1", name: { ko: "바우노바 백산" }, signature: { ko: "드립커피" }, latitude: 35.0990, longitude: 129.0330, thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", rating: 4.8 }
    ]
  },
  "pachinko": { // 감지해변
    baseLat: 35.0617,
    baseLng: 129.0767,
    radius: 1000,
    restaurants: [
      { id: "gr1", name: { ko: "태종대 짬뽕" }, food: { ko: "해물짬뽕" }, latitude: 35.0534, longitude: 129.0807, thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", rating: 4.5 },
      { id: "gr2", name: { ko: "충북식당" }, food: { ko: "한식" }, latitude: 35.0541, longitude: 129.0801, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.3 },
      { id: "gr3", name: { ko: "태종대 자갈마당 해녀촌" }, food: { ko: "조개구이/해산물" }, latitude: 35.0601, longitude: 129.0770, thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400", rating: 4.6 }
    ],
    cafes: [
      { id: "gc1", name: { ko: "엔제리너스 태종대점" }, signature: { ko: "프랜차이즈 카페" }, latitude: 35.0532, longitude: 129.0811, thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", rating: 4.0 }
    ]
  },
  "spot_007": { // 광안리
    baseLat: 35.1531, baseLng: 129.1189, radius: 1000,
    restaurants: [
      { id: "r7_1", name: { ko: "톤쇼우 광안점" }, food: { ko: "돈카츠" }, latitude: 35.1540, longitude: 129.1220, thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", rating: 4.9 },
      { id: "r7_2", name: { ko: "수변최고돼지국밥" }, food: { ko: "돼지국밥" }, latitude: 35.1550, longitude: 129.1240, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.6 }
    ],
    cafes: [
      { id: "c7_1", name: { ko: "광안리 뚜벅스" }, signature: { ko: "오션뷰" }, latitude: 35.1530, longitude: 129.1180, thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400", rating: 4.7 },
      { id: "c7_2", name: { ko: "밀락더마켓" }, signature: { ko: "복합문화공간" }, latitude: 35.1545, longitude: 129.1235, thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", rating: 4.8 }
    ]
  },
  "spot_008": { // 송도
    baseLat: 35.0761, baseLng: 129.0173, radius: 1000,
    restaurants: [
      { id: "r8_1", name: { ko: "송도 1913" }, food: { ko: "조개구이" }, latitude: 35.0750, longitude: 129.0180, thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400", rating: 4.4 },
      { id: "r8_2", name: { ko: "사천해물탕" }, food: { ko: "해물탕" }, latitude: 35.0770, longitude: 129.0165, thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400", rating: 4.5 }
    ],
    cafes: [
      { id: "c8_1", name: { ko: "TCC 송도" }, signature: { ko: "루프탑 뷰" }, latitude: 35.0755, longitude: 129.0175, thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400", rating: 4.6 },
      { id: "c8_2", name: { ko: "이디야커피 부산송도해상케이블카점" }, signature: { ko: "케이블카 뷰" }, latitude: 35.0780, longitude: 129.0200, thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", rating: 4.3 }
    ]
  }
};

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const Route = createFileRoute("/spots/$id/nearby")({
  validateSearch: (search: Record<string, unknown>): NearbySearch => {
    return {
      type: (search.type as any) || undefined,
    };
  },
  component: NearbyDiscovery,
});

function NearbyDiscovery() {
  const { id } = Route.useParams();
  const { type } = Route.useSearch();
  const { t } = useTranslation();
  const router = useRouter();
  const childMatches = useChildMatches();

  const myCourseItems = useAppStore((s) => s.myCourseItems);
  const toggleMyCourseItem = useAppStore((s) => s.toggleMyCourseItem);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const spot = useMemo(() => (spotsRaw as any[]).find((s) => s.id === id), [id]);

  const [activeTab, setActiveTab] = useState<"restaurant" | "cafe">("restaurant");

  const nearbyItems = useMemo(() => {
    const config = SPOT_CONFIGS[id as string];
    if (!config) return [];

    const rawData = activeTab === "restaurant" ? config.restaurants : config.cafes;
    
    const processed = rawData.map((item: any) => {
      const dist = getDistance(config.baseLat, config.baseLng, item.latitude, item.longitude);
      return { ...item, calculatedDistance: dist };
    });

    return processed.filter((item: any) => item.calculatedDistance <= config.radius).sort((a: any, b: any) => a.calculatedDistance - b.calculatedDistance);
  }, [activeTab, id]);

  if (childMatches.length > 0) {
    return <Outlet />;
  }

  if (!spot) return <div>Spot not found</div>;

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.history.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">{spot.name.ko} 주변{titleSuffix} 탐방</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3" /> 반경 {SPOT_CONFIGS[id as string]?.radius / 1000 || 1}km 이내 인기 장소
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        
        {/* Category Tabs */}
        <div className="flex bg-muted p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("restaurant")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === "restaurant" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🍽️ 맛집
          </button>
          <button
            onClick={() => setActiveTab("cafe")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === "cafe" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ☕ 카페
          </button>
        </div>

        <div className="space-y-6">
          {nearbyItems.map((item, idx) => {
            const isFav = myCourseItems.some(x => x.id === item.id);
            return (
              <Link
                key={item.id}
                to="/spots/$id/nearby/$itemId"
                params={{ id: spot.id, itemId: item.id }}
                className="group relative block overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-xl hover:border-primary/20 no-underline"
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={item.thumbnail}
                    alt={item.name.ko}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Heart Toggle */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      const isCurrentlyFav = isFav;
                      const payload = {
                        id: item.id,
                        name: item.name.ko,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        category: activeTab
                      };
                      
                      if (!isCurrentlyFav) {
                        toast("마이코스에 담겼습니다!");
                        triggerHeartFly(e.clientX, e.clientY);
                      } else {
                        toast("마이코스에서 삭제되었습니다.");
                      }
                      
                      toggleMyCourseItem(payload);
                      toggleFavorite(item.id);
                      
                      // setTimeout을 이용해 상태 업데이트 후의 목록을 로깅 (근사치)
                      setTimeout(() => {
                        console.log("현재 마이코스 목록:", useAppStore.getState().myCourseItems);
                      }, 100);
                    }}
                    className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 ${isFav
                        ? "bg-[#FF0000] text-white shadow-lg shadow-red-500/30"
                        : "bg-black/20 text-white hover:bg-black/40"
                      }`}
                  >
                    <Heart className={`size-5 ${isFav ? "fill-current text-[#FF0000]" : "text-white"}`} />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-foreground">
                    <div className="flex items-center gap-2">
                      {item.id.startsWith("r") ? (
                        <Utensils className="size-4 text-orange-500" />
                      ) : (
                        <Coffee className="size-4 text-amber-600" />
                      )}
                      <h3 className="text-xl font-bold">{item.name.ko}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                      <Star className="size-3 fill-yellow-700" />
                      {item.rating || (4.5 + Math.random() * 0.5).toFixed(1)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.food?.ko || (item as any).signature?.ko || "부산의 정취가 느껴지는 매력적인 장소입니다."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      📍 거리 {item.calculatedDistance}m
                    </span>
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      상세보기 &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-primary/5 rounded-3xl p-6 text-center border border-primary/10">
          <p className="text-sm text-muted-foreground mb-4">찾으시는 장소가 없나요?</p>
          <Button variant="outline" className="rounded-full px-8 border-primary/20 text-primary">
            더 많은 결과 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
