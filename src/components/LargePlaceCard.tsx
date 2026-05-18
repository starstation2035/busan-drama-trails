import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

interface Place {
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  food?: Record<string, string>; // for restaurants
  vibe?: Record<string, string>; // for cafes
  distance: number;
  rating: number;
  price?: string;
  signature?: Record<string, string>;
}

interface LargePlaceCardProps {
  place: Place;
  onClick: (place: Place) => void;
}

export function LargePlaceCard({ place, onClick }: LargePlaceCardProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as any) || "ko";

  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(place.id);

  const placeName = place.name[lang] || place.name["ko"];
  const typeText = place.food
    ? place.food[lang] || place.food["ko"]
    : place.vibe
      ? place.vibe[lang] || place.vibe["ko"]
      : "";

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-card shadow-md transition-transform active:scale-[0.98] cursor-pointer group"
      onClick={() => onClick(place)}
    >
      <div className="relative h-48 w-full">
        <img
          src={place.thumbnail}
          alt={placeName}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Heart Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(place.id);
          }}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-white",
            )}
          />
        </button>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center space-x-2 text-sm text-gray-200">
            <span className="font-medium">{typeText}</span>
            <span>•</span>
            <span className="flex items-center">⭐ {place.rating}</span>
          </div>
          <h3 className="mt-1 text-xl font-bold leading-tight">{placeName}</h3>
        </div>
      </div>

      {/* Detail Ribbon below the photo */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-2">🚶 {place.distance}m</span>
          {place.price && <span>• {place.price}</span>}
        </div>
        <div className="text-sm font-semibold text-primary">
          {place.signature ? place.signature[lang] || place.signature["ko"] : ""}
        </div>
      </div>
    </div>
  );
}
