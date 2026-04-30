import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Star, Utensils, Coffee, Heart, ExternalLink, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPOT_CONFIGS, getDistance } from "./spots.$id.nearby";
import { useMemo, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";
import { triggerHeartFly } from "@/components/HeartEffect";

export const Route = createFileRoute("/spots/$id/nearby/$itemId")({
  component: NearbyDetail,
});

function NearbyDetail() {
  const { id, itemId } = Route.useParams();
  const { t } = useTranslation();
  const router = useRouter();

  const myCourseItems = useAppStore((s) => s.myCourseItems);
  const toggleMyCourseItem = useAppStore((s) => s.toggleMyCourseItem);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const item = useMemo(() => {
    const config = SPOT_CONFIGS[id as string];
    if (!config) return null;
    const all = [...config.restaurants, ...config.cafes];
    const found = all.find((i: any) => i.id === itemId);
    if (!found) return null;
    const dist = getDistance(config.baseLat, config.baseLng, found.latitude, found.longitude);
    return { ...found, calculatedDistance: dist };
  }, [id, itemId]);

  if (!item) return <div className="p-10 text-center">정보를 찾을 수 없습니다.</div>;

  const isFav = myCourseItems.some(x => x.id === item.id);
  const type = item.id.startsWith("r") ? "restaurant" : "cafe";

  const handleToggle = (e: React.MouseEvent) => {
    const wasFav = isFav;
    const payload = {
      id: item.id,
      name: item.name.ko,
      latitude: item.latitude,
      longitude: item.longitude,
      category: type
    };
    if (!wasFav) {
      console.log("마이코스에 추가된 데이터:", payload);
      triggerHeartFly(e.clientX, e.clientY);
      toast("마이코스에 추가되었습니다!");
    } else {
      toast("마이코스에서 삭제되었습니다.");
    }
    toggleMyCourseItem(payload);
    toggleFavorite(item.id);
  };

  const goBack = () => router.history.back();

  const [showNearbyList, setShowNearbyList] = useState(false);

  const nearbyList = useMemo(() => {
    const config = SPOT_CONFIGS[id as string];
    if (!config) return [];
    const processed = config.restaurants.map((r: any) => {
      const dist = getDistance(config.baseLat, config.baseLng, r.latitude, r.longitude);
      return { ...r, calculatedDistance: dist };
    });
    return processed.filter((r: any) => r.id !== item.id && r.calculatedDistance <= config.radius).sort((a: any, b: any) => a.calculatedDistance - b.calculatedDistance).slice(0, 5);
  }, [id, item.id]);

  const toggleNearbyList = () => setShowNearbyList(!showNearbyList);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src={item.id === "r4" ? "/myeolchi.png" : item.id === "r11" ? "/bibim.png" : item.id === "c4" ? "/thrill.png" : item.thumbnail}
          alt={item.name.ko}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition-all active:scale-90"
        >
          <ArrowLeft className="size-6" />
        </button>

        {/* Favorite Button */}
        <button
          onClick={(e) => handleToggle(e)}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
            isFav 
              ? "bg-rose-500 text-white border-rose-400 shadow-lg" 
              : "bg-white/20 text-white border-white/30"
          }`}
        >
          <Heart className={`size-6 ${isFav ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {type === "restaurant" ? (
              <Utensils className="size-4 text-orange-400" />
            ) : (
              <Coffee className="size-4 text-amber-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider opacity-90">
              {type === "restaurant" ? "Restaurant" : "Cafe"}
            </span>
          </div>
          <h1 className="text-3xl font-black">{item.name.ko}</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/50 p-4 rounded-3xl text-center">
            <Star className="size-5 text-yellow-500 mx-auto mb-1 fill-yellow-500" />
            <span className="text-lg font-bold">{item.rating || 4.5}</span>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Rating</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-3xl text-center">
            <Navigation className="size-5 text-primary mx-auto mb-1" />
            <span className="text-lg font-bold">{item.calculatedDistance}m</span>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Distance</p>
          </div>
          <div className="bg-muted/50 p-4 rounded-3xl text-center">
            <Clock className="size-5 text-green-500 mx-auto mb-1" />
            <span className="text-lg font-bold">10:00</span>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Open</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            상세 정보
          </h2>
          <div className="space-y-4 bg-card border border-border/50 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <MapPin className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">주소</p>
                <p className="text-sm font-medium">부산광역시 {item.region || "해운대구"} ...</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">연락처</p>
                <p className="text-sm font-medium">051-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">시그니처 메뉴</p>
                <p className="text-sm font-medium">{item.signature?.ko || "추천 메뉴"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={toggleNearbyList}
          className="w-full h-16 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          {showNearbyList ? <Navigation className="mr-2 size-5" /> : <Utensils className="mr-2 size-5" />}
          {showNearbyList ? "주변 식당 숨기기" : "우리 서비스에서 주변 식당 보기"}
        </Button>

        {showNearbyList && (
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-xl">🍽️</span> 추천 식당
            </h3>
            {nearbyList.map((r) => {
              const isListFav = myCourseItems.some(x => x.id === r.id);
              return (
                <Link
                  key={r.id}
                  to="/spots/$id/nearby/$itemId"
                  params={{ id, itemId: r.id }}
                  className="flex items-center gap-4 bg-card p-3 rounded-3xl border border-border/50 shadow-sm transition-all hover:shadow-md"
                >
                  <img
                    src={r.thumbnail}
                    alt={r.name.ko}
                    className="size-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{r.name.ko}</h4>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{(r as any).food?.ko || (r as any).signature?.ko}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-600">
                      <Star className="size-3 fill-current" />
                      {r.rating || 4.5}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const wasFav = isListFav;
                      const payload = {
                        id: r.id,
                        name: r.name.ko,
                        latitude: r.latitude,
                        longitude: r.longitude,
                        category: r.id.startsWith("r") ? "restaurant" : "cafe"
                      };
                      if (!wasFav) {
                        console.log("마이코스에 추가된 데이터:", payload);
                        triggerHeartFly(e.clientX, e.clientY);
                        toast("마이코스에 추가되었습니다!");
                      } else {
                        toast("마이코스에서 삭제되었습니다.");
                      }
                      toggleMyCourseItem(payload);
                      toggleFavorite(r.id);
                    }}
                    className={`p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 border ${
                      isListFav
                        ? "bg-rose-50 text-rose-500 border-rose-200"
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    }`}
                  >
                    <Heart className={`size-5 ${isListFav ? "fill-current" : ""}`} />
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
