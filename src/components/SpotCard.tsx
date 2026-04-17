import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAppStore, type LangCode } from "@/stores/useAppStore";

export interface Spot {
  id: string;
  name: Record<LangCode, string>;
  drama: string[];
  thumbnail: string;
  region: string;
}

export function SpotCard({ spot }: { spot: Spot }) {
  const lang = (useAppStore((s) => s.lang) ?? "ko") as LangCode;
  const { favorites, toggleFavorite } = useAppStore();
  const isFav = favorites.includes(spot.id);

  return (
    <Link
      to="/spots/$id"
      params={{ id: spot.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={spot.thumbnail}
          alt={spot.name[lang]}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(spot.id);
          }}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 shadow backdrop-blur"
          aria-label="favorite"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-foreground line-clamp-1">{spot.name[lang]}</h3>
        {spot.drama[0] && (
          <span className="mt-1 inline-block rounded-full bg-accent/40 px-2 py-0.5 text-xs font-medium text-accent-foreground">
            🎬 {spot.drama[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
