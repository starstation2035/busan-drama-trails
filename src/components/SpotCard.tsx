import { Heart, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAppStore, type LangCode } from "@/stores/useAppStore";

export interface Spot {
  id: string;
  name: Record<LangCode, string>;
  drama: string[];
  thumbnail: string;
  region: string;
  status?: Record<LangCode, string>;
  scene_description?: Record<LangCode, string>;
}

export function SpotCard({ spot }: { spot: Spot }) {
  const { t } = useTranslation();
  const lang = (useAppStore((s) => s.lang) ?? "ko") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.some((f) => f.id === spot.id);
  const name = spot.name[lang] ?? spot.name.ko;
  const status = spot.status?.[lang] ?? spot.status?.ko;
  const sceneDesc = spot.scene_description?.[lang] ?? spot.scene_description?.ko;

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
      href={`/spots/${spot.id}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.98] hover:shadow-xl border border-border/40"
    >
      {/* 5:4 Aspect Ratio Image (Forced via style for precision) */}
      <div 
        className="relative overflow-hidden rounded-xl bg-muted"
        style={{ aspectRatio: '5/4' }}
      >
        <img
          src={spot.thumbnail}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Region Badge as Overlay */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 shadow-md backdrop-blur-md border border-white/10">
          <MapPin className="size-2.5 text-white" /> 
          <span className="text-[10px] font-bold text-white">{spot.region}</span>
        </div>

        <button
          onClick={handleFav}
          className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-md backdrop-blur-sm transition active:scale-90 border border-white/20"
          aria-label={isFav ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            className={`size-3.5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
          <span className="text-[11px] font-bold text-gray-700">{displayCount}</span>
        </button>
      </div>

      <div className="py-4 px-1.5 flex flex-col gap-2">
        {/* Title Area with fixed min-height for alignment */}
        <div className="min-h-[2.75rem]">
          {spot.drama[0] && (
            <span className="text-[10px] font-bold text-primary/80 mb-0.5 block">
              🎬 {spot.drama[0]}
            </span>
          )}
          <h3 className="text-[14px] font-bold text-foreground leading-tight">
            {name}
          </h3>
        </div>

        {/* Description Area with fixed min-height for alignment */}
        <div className="min-h-[2.25rem]">
          {sceneDesc ? (
            <p className="text-[11px] text-muted-foreground/80 italic leading-snug">
              "{sceneDesc}"
            </p>
          ) : (
            <div className="h-4" /> /* Spacer if no description */
          )}
        </div>

        {status && (
          <div className="flex items-center gap-1.5 pt-1 border-t border-muted/30">
            <span className="inline-block size-1.5 rounded-full bg-green-500/80" />
            <span className="text-[10px] font-medium text-muted-foreground">
              {status}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
