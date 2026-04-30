"use client";

import { useMemo, useRef, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ArrowLeft,
  Heart,
  Share2,
  Copy,
  MapPin,
  Clock,
  Ticket,
  Sun,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Star,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { useInView } from "@/hooks/useInView";
import spotsRaw from "@/data/spots.json";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import { triggerHeartFly } from "@/components/HeartEffect";

type LocalizedString = Partial<Record<LangCode, string>>;

interface Restaurant {
  id: string;
  name: LocalizedString;
  food: LocalizedString;
  thumbnail: string;
  distance: number;
  rating: number;
  price: string;
  signature: LocalizedString;
}
interface Cafe {
  id: string;
  name: LocalizedString;
  vibe: LocalizedString;
  thumbnail: string;
  distance: number;
  rating: number;
  signature: LocalizedString;
}
interface DramaScene {
  title: string;
  episode: number;
  scene_image: string;
}
interface PhotoTip {
  image: string;
  tip: LocalizedString;
}
interface SpotFull {
  id: string;
  name: LocalizedString;
  drama: string[];
  region: string;
  type: string[];
  thumbnail: string;
  coords: { lat: number; lng: number };
  popularity: number;
  description: LocalizedString;
  address?: LocalizedString;
  hours?: string;
  admission?: LocalizedString;
  best_time?: "morning" | "sunset" | "night" | "anytime";
  drama_scenes?: DramaScene[];
  nearby_restaurants?: string[];
  nearby_cafes?: string[];
  photo_tips?: PhotoTip[];
  visit_tips?: LocalizedString;
}

const SPOTS = spotsRaw as SpotFull[];
const RESTAURANTS = restaurantsRaw as Restaurant[];
const CAFES = cafesRaw as Cafe[];

function pickLang<T extends LocalizedString>(s: T | undefined, lang: LangCode): string {
  if (!s) return "";
  return s[lang] ?? s.ko ?? s.en ?? Object.values(s)[0] ?? "";
}

export default function SpotDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const spot = SPOTS.find((s) => s.id === id);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "zh-TW") as LangCode;

  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFavorite = favorites.some((f) => f.id === id);

  const [expandedTips, setExpandedTips] = useState(false);

  const nearbyRestaurants = useMemo(() => {
    if (!spot?.nearby_restaurants) return [];
    return RESTAURANTS.filter((r) => spot.nearby_restaurants?.includes(r.id));
  }, [spot]);

  const nearbyCafes = useMemo(() => {
    if (!spot?.nearby_cafes) return [];
    return CAFES.filter((c) => spot.nearby_cafes?.includes(c.id));
  }, [spot]);

  if (!spot) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Spot not found</h1>
        <Button asChild className="mt-4">
          <Link href="/spots">Back to list</Link>
        </Button>
      </div>
    );
  }

  const name = pickLang(spot.name, lang);
  const desc = pickLang(spot.description, lang);
  const addr = pickLang(spot.address, lang);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: desc,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("common.copied"));
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    toggleFavorite(spot.id);
    if (!isFavorite) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(t("detail.addedToCourse"));
    } else {
      toast(t("detail.removedFromCourse"));
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`rounded-full transition-colors ${
              isFavorite ? "text-primary fill-primary" : "text-muted-foreground"
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={spot.thumbnail}
          alt={name}
          className="h-full w-full object-cover animate-fade-in"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
          <div className="flex flex-wrap gap-2 mb-2">
            {spot.type.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-black tracking-tight drop-shadow-md">{name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm font-medium opacity-90">
            <MapPin className="h-3 w-3" /> {spot.region}
          </p>
        </div>
      </div>

      <div className="space-y-10 px-4 pt-8">
        {/* Description */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Overview</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Clock className="mb-2 h-5 w-5 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("detail.info.hours")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {spot.hours || "09:00 - 18:00"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Ticket className="mb-2 h-5 w-5 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("detail.info.admission")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {pickLang(spot.admission, lang) || "Free"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Sun className="mb-2 h-5 w-5 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("detail.info.bestTime")}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground capitalize">
              {spot.best_time || "Anytime"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Star className="mb-2 h-5 w-5 text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Popularity
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {spot.popularity.toLocaleString()} visits
            </p>
          </div>
        </section>

        {/* Drama Scenes */}
        {spot.drama_scenes && spot.drama_scenes.length > 0 && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                🎬 {t("detail.drama.title")}
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {spot.drama_scenes.map((scene, i) => (
                <div key={i} className="w-[260px] shrink-0 space-y-2">
                  <div className="overflow-hidden rounded-2xl bg-muted shadow-md transition-transform active:scale-95">
                    <img
                      src={scene.scene_image}
                      alt={scene.title}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">
                      {scene.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">EP.{scene.episode}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Photo Tips */}
        {spot.photo_tips && spot.photo_tips.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              📸 {t("detail.photoTips.title")}
            </h2>
            <div className="space-y-4">
              {spot.photo_tips.map((tip, i) => (
                <div key={i} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={tip.image}
                      alt="Photo Tip"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium leading-relaxed text-foreground/80">
                      {pickLang(tip.tip, lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Map Section */}
        <MapSection
          coords={spot.coords}
          name={name}
          address={addr}
          onCopyAddress={() => {
            navigator.clipboard.writeText(addr);
            toast.success(t("common.copied"));
          }}
        />

        {/* Nearby Restaurants */}
        {nearbyRestaurants.length > 0 && (
          <NearbyList
            title={`🍴 ${t("detail.restaurants.title")}`}
            items={nearbyRestaurants.map((r) => ({
              id: r.id,
              name: pickLang(r.name, lang),
              subtitle: pickLang(r.food, lang),
              thumbnail: r.thumbnail,
              distance: r.distance,
              rating: r.rating,
              meta: r.price,
              expandedLabel: pickLang(r.signature, lang),
            }))}
          />
        )}

        {/* Nearby Cafes */}
        {nearbyCafes.length > 0 && (
          <NearbyList
            title={`☕ ${t("detail.cafes.title")}`}
            items={nearbyCafes.map((c) => ({
              id: c.id,
              name: pickLang(c.name, lang),
              subtitle: pickLang(c.vibe, lang),
              thumbnail: c.thumbnail,
              distance: c.distance,
              rating: c.rating,
              expandedLabel: pickLang(c.signature, lang),
            }))}
          />
        )}

        {/* Visit Tips Accordion */}
        {spot.visit_tips && (
          <section>
            <button
              onClick={() => setExpandedTips(!expandedTips)}
              className="flex w-full items-center justify-between rounded-2xl bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
            >
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-primary">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    💡 {t("detail.visitTips.title")}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Expert advice for your trip</p>
                </div>
              </div>
              {expandedTips ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {expandedTips && (
              <div className="mt-2 rounded-2xl border border-primary/10 bg-primary/5 p-4 animate-fade-down">
                <p className="text-xs leading-relaxed text-foreground/80">
                  {pickLang(spot.visit_tips, lang)}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function MapSection({
  coords,
  name,
  address,
  onCopyAddress,
}: {
  coords: { lat: number; lng: number };
  name: string;
  address: string;
  onCopyAddress: () => void;
}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const embed = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=16&output=embed`;
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const kakao = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${coords.lat},${coords.lng}`;

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-foreground">{t("detail.map.title")}</h2>
      <div
        ref={ref}
        className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
      >
        {inView ? (
          <iframe
            src={embed}
            title="Map"
            loading="lazy"
            className="h-full w-full"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-foreground">
            <MapPin className="size-8 opacity-40" />
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          asChild
          className="h-11 rounded-xl text-xs"
        >
          <a href={gmaps} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            {t("detail.map.google")}
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={onCopyAddress}
          disabled={!address}
          className="h-11 rounded-xl text-xs"
        >
          <Copy className="size-3.5" />
          {t("detail.map.copyAddr")}
        </Button>
        <Button variant="outline" asChild className="h-11 rounded-xl text-xs">
          <a href={kakao} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-3.5" />
            {t("detail.map.kakao")}
          </a>
        </Button>
      </div>
    </section>
  );
}

interface NearbyItem {
  id: string;
  name: string;
  subtitle: string;
  thumbnail: string;
  distance: number;
  rating: number;
  meta?: string;
  expandedLabel?: string;
}

function NearbyList({ title, items }: { title: string; items: NearbyItem[] }) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      <div
        ref={scrollRef}
        className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const expanded = expandedId === it.id;
          return (
            <div
              key={it.id}
              onClick={() => setExpandedId(expanded ? null : it.id)}
              className={`shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-card shadow-sm transition-all active:scale-[0.99] ${
                expanded ? "w-[280px]" : "w-[180px]"
              }`}
            >
              <img
                src={it.thumbnail}
                alt={it.name}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="space-y-1 p-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                  {it.name}
                </h3>
                <p className="text-xs text-muted-foreground">{it.subtitle}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5 text-accent-foreground">
                    <Star className="size-3 fill-accent-foreground" />
                    <span className="font-semibold">{it.rating.toFixed(1)}</span>
                  </span>
                  <span>·</span>
                  <span>{t("detail.restaurants.distance", { m: it.distance })}</span>
                  {it.meta && (
                    <>
                      <span>·</span>
                      <span>{it.meta}</span>
                    </>
                  )}
                </div>
                {expanded && it.expandedLabel && (
                  <div className="mt-2 border-t border-border pt-2">
                    <p className="text-xs font-medium text-foreground">
                      ⭐ {t("detail.restaurants.signature")}: {it.expandedLabel}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
