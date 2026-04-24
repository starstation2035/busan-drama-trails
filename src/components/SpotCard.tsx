import { Heart } from "lucide-react";
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

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.99] hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={spot.thumbnail}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={handleFav}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 shadow backdrop-blur transition active:scale-90"
          aria-label={isFav ? "Remove favorite" : "Add favorite"}
        >
          <Heart
            className={`size-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>
        {spot.drama[0] && (
          <span className="absolute bottom-2 left-2 max-w-[85%] truncate rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            🎬 {spot.drama[0]}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">📍 {spot.region}</p>
      </div>
    </Link>
  );
}
