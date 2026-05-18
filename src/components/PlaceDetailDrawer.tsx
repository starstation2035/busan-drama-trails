import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, X, Utensils, Coffee, Star, Clock, Info } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

interface Place {
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  food?: Record<string, string>;
  vibe?: Record<string, string>;
  distance: number;
  rating: number;
  price?: string;
  signature?: Record<string, string>;
  hours?: string;
  images?: string[];
  menu?: { item: Record<string, string>; price: string }[];
}

interface PlaceDetailDrawerProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlaceDetailDrawer({ place, isOpen, onClose }: PlaceDetailDrawerProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as any) || "ko";
  const { favorites, toggleFavorite } = useAppStore();
  const [emblaRef] = useEmblaCarousel({ dragFree: true, align: "start" });

  if (!place) return null;

  const isFavorite = favorites.includes(place.id);
  const placeName = place.name[lang] || place.name["ko"];
  const isRestaurant = !!place.food;
  const typeText = place.food
    ? place.food[lang] || place.food["ko"]
    : place.vibe
      ? place.vibe[lang] || place.vibe["ko"]
      : "";
  const signatureText = place.signature ? place.signature[lang] || place.signature["ko"] : "";

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[92vh] rounded-t-[32px] border-none bg-background shadow-2xl">
        {/* Top Handle visual anchor */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/20" />

        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
          {/* Header Image Section */}
          <div className="relative w-full h-[280px] sm:h-[340px]">
            <img
              src={place.thumbnail}
              alt={placeName}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/10 to-transparent" />

            <DrawerClose className="absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50 active:scale-95">
              <X className="h-5 w-5" />
            </DrawerClose>

            <button
              onClick={() => toggleFavorite(place.id)}
              className="absolute bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-all active:scale-90 hover:shadow-2xl"
            >
              <Heart
                className={cn(
                  "h-7 w-7 transition-all duration-300",
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-400",
                )}
              />
            </button>

            <div className="absolute bottom-6 left-6 z-10">
              <div className="flex items-center space-x-2 text-white/90 text-sm font-medium mb-1 backdrop-blur-sm bg-black/20 px-2.5 py-1 rounded-full w-fit">
                {isRestaurant ? (
                  <Utensils className="h-3.5 w-3.5" />
                ) : (
                  <Coffee className="h-3.5 w-3.5" />
                )}
                <span>{typeText}</span>
              </div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{placeName}</h2>
            </div>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* 1. Quick Meta Info */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex flex-col items-center flex-1 border-r border-border/50">
                <div className="flex items-center text-amber-500 mb-1">
                  <Star className="h-4 w-4 fill-amber-500 mr-1" />
                  <span className="font-bold text-lg">{place.rating}</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Rating
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 border-r border-border/50">
                <div className="flex items-center text-primary mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="font-bold text-lg">{place.distance}m</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Distance
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center text-foreground mb-1">
                  <span className="font-bold text-lg">{place.price || "$$"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                  Price Range
                </span>
              </div>
            </div>

            {/* 2. Photo Gallery (Dynamic) */}
            {place.images && place.images.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <span className="mr-2">📸</span> Food Gallery
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {place.images.length} photos
                  </span>
                </div>
                <div className="overflow-hidden -mx-6 px-6" ref={emblaRef}>
                  <div className="flex gap-3">
                    {place.images.map((img, i) => (
                      <div
                        key={i}
                        className="flex-[0_0_200px] sm:flex-[0_0_240px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-1 ring-border/50"
                      >
                        <img
                          src={img}
                          alt={`Food ${i + 1}`}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 3. Signature & Info */}
            {signatureText && (
              <section className="bg-gradient-to-br from-primary/10 to-primary/5 p-5 rounded-2xl border border-primary/20">
                <div className="flex items-center space-x-2 text-primary mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Expert's Choice
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-1">Must Try Signature</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">{signatureText}</p>
              </section>
            )}

            {/* 4. Full Menu Card */}
            {place.menu && place.menu.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h3 className="text-lg font-bold mb-4 flex items-center px-1">
                  <Utensils className="h-5 w-5 mr-2 text-primary" /> Full Menu
                </h3>
                <div className="bg-muted/20 border border-border/50 rounded-3xl overflow-hidden">
                  {place.menu.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between p-4 transition-colors hover:bg-muted/40",
                        i !== place.menu!.length - 1 && "border-b border-border/30",
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-foreground">
                          {m.item[lang] || m.item["ko"]}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase font-medium">
                          {m.item["en"]}
                        </span>
                      </div>
                      <span className="font-bold text-primary tabular-nums">₩{m.price}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Business Hours */}
            <div className="flex items-center space-x-3 text-muted-foreground px-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Open daily 09:00 - 21:00</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
