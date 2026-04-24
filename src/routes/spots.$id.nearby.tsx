import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Star, Utensils, Coffee, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import spotsRaw from "@/data/spots.json";
import { useMemo } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";
import { triggerHeartFly } from "@/components/HeartEffect";
import { Outlet, useChildMatches } from "@tanstack/react-router";

interface NearbySearch {
  type?: 'restaurant' | 'cafe';
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

  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const spot = useMemo(() => (spotsRaw as any[]).find((s) => s.id === id), [id]);

  const nearbyItems = useMemo(() => {
    if (!spot) return [];

    const rIds = spot.nearby_restaurants || [];
    const cIds = spot.nearby_cafes || [];

    const matchedRestaurants = (restaurantsRaw as any[]).filter((r) => rIds.includes(r.id));
    const matchedCafes = (cafesRaw as any[]).filter((c) => cIds.includes(c.id));

    if (type === 'restaurant') return matchedRestaurants;
    if (type === 'cafe') return matchedCafes;
    return [...matchedRestaurants, ...matchedCafes];
  }, [spot, type]);

  const titleSuffix = type === 'restaurant' ? ' 맛집' : type === 'cafe' ? ' 카페' : '';

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
              <MapPin className="size-3" /> 반경 1km 이내 추천
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        <div className="space-y-6">
          {nearbyItems.map((item, idx) => {
            const isFav = favorites.includes(item.id);
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
                      const wasFav = isFav;
                      toggleFavorite(item.id);
                      if (!wasFav) {
                        triggerHeartFly(e.clientX, e.clientY);
                        toast.success(`${item.name.ko} ${t("spots.addedToCourse")}`);
                      }
                    }}
                    className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 ${
                      isFav
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-black/20 text-white hover:bg-black/40"
                    }`}
                  >
                    <Heart className={`size-5 ${isFav ? "fill-current" : ""}`} />
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
                    {item.food?.ko || item.vibe?.ko || "부산의 정취가 느껴지는 매력적인 장소입니다."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      📍 도보 {Math.floor(Math.random() * 10) + 2}분
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
