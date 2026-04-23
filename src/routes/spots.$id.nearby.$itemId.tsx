import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Star, Utensils, Coffee, Heart, ExternalLink, Navigation, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";
import { triggerHeartFly } from "@/components/HeartEffect";

export const Route = createFileRoute("/spots/$id/nearby/$itemId")({
  component: NearbyDetail,
});

function NearbyDetail() {
  const { itemId } = Route.useParams();
  const { t } = useTranslation();
  const router = useRouter();

  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const item = useMemo(() => {
    const all = [...(restaurantsRaw as any[]), ...(cafesRaw as any[])];
    return all.find((i) => i.id === itemId);
  }, [itemId]);

  if (!item) return <div className="p-10 text-center">정보를 찾을 수 없습니다.</div>;

  const isFav = favorites.includes(item.id);
  const type = item.id.startsWith("r") ? "restaurant" : "cafe";

  const handleToggle = (e: React.MouseEvent) => {
    const wasFav = isFav;
    toggleFavorite(item.id);
    if (!wasFav) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(`${item.name.ko} ${t("spots.addedToCourse")}`);
    }
  };

  const goBack = () => router.history.back();

  const openMap = () => {
    const query = encodeURIComponent(`${item.name.ko} 부산`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <img
          src={item.thumbnail}
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
            <span className="text-lg font-bold">{item.distance || 150}m</span>
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
          onClick={openMap}
          className="w-full h-16 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <ExternalLink className="mr-2 size-5" />
          길찾기 및 리뷰 보기
        </Button>
      </div>

    </div>
  );
}
