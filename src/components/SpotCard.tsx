import { Heart, MapPin, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAppStore, type LangCode } from "@/stores/useAppStore";

export interface Spot {
  id: string;
  name: Record<LangCode, string>;
  drama: string[];
  thumbnail: string;
  region: string;
}

export function SpotCard({ spot }: { spot: Spot }) {
  const { t } = useTranslation();
  const lang = (useAppStore((s) => s.lang) ?? "ko") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(spot.id);
  const name = spot.name[lang] ?? spot.name.ko;

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFav = isFav;
    toggleFavorite(spot.id);
    if (!wasFav) {
      toast.success(t("spots.addedToCourse"), { duration: 1500 });
    }
  };

  // Mock heart count
  const baseCount = spot.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500 + 100;
  const displayCount = isFav ? baseCount + 1 : baseCount;

  return (
    <Link
      to="/spots/$id"
      params={{ id: spot.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.98] hover:shadow-xl border border-border/40"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={spot.thumbnail}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        
        <button
          onClick={handleFav}
          className="absolute right-3 top-3 flex flex-col items-center gap-0.5 rounded-full bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md transition active:scale-90 border border-white/20"
          aria-label={isFav ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            className={`size-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-foreground/70"}`}
          />
          <span className="text-[10px] font-bold text-foreground/80">{displayCount}</span>
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          {spot.drama[0] && (
            <span className="inline-block rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur shadow-sm mb-2">
              🎬 {spot.drama[0]}
            </span>
          )}
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md">
            {name}
          </h3>
        </div>
      </div>
      <div className="p-3 bg-card flex items-center justify-between">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3" /> {spot.region}
        </p>
        <div className="size-6 rounded-full bg-muted grid place-items-center">
          <ChevronRight className="size-3 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
