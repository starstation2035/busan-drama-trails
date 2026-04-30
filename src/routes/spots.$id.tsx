import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useRouter, notFound, Outlet, useChildMatches } from "@tanstack/react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { useInView } from "@/hooks/useInView";
import spotsRaw from "@/data/spots.json";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import { triggerHeartFly } from "@/components/HeartEffect";
import { cn } from "@/lib/utils";

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
  status?: LocalizedString;
  scene_description?: LocalizedString;
}

const SPOTS = spotsRaw as SpotFull[];
const RESTAURANTS = restaurantsRaw as Restaurant[];
const CAFES = cafesRaw as Cafe[];

export const Route = createFileRoute("/spots/$id")({
  component: SpotDetail,
  loader: ({ params }) => {
    const spot = SPOTS.find((s) => s.id === params.id);
    if (!spot) throw notFound();
    return { spot };
  },
  head: ({ loaderData }) => {
    const spot = loaderData?.spot;
    if (!spot) return { meta: [{ title: "Spot — Busan Drama Spot & Style" }] };
    const name = spot.name.en ?? spot.name.ko ?? "Filming spot";
    const desc = spot.description.en ?? spot.description.ko ?? "";
    return {
      meta: [
        { title: `${name} — Busan Drama Spot & Style` },
        { name: "description", content: desc },
        { property: "og:title", content: name },
        { property: "og:description", content: desc },
        { property: "og:image", content: spot.thumbnail },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: spot.thumbnail },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <p className="text-6xl">🔍</p>
      <p className="mt-4 text-lg font-semibold">Spot not found</p>
      <Link to="/spots" className="mt-4 inline-block text-primary underline">
        Back to all spots
      </Link>
    </div>
  ),
});

function pickLang<T extends LocalizedString>(s: T | undefined, lang: LangCode): string {
  if (!s) return "";
  return s[lang] ?? s.ko ?? s.en ?? Object.values(s)[0] ?? "";
}

function SpotDetail() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const childMatches = useChildMatches();

  const { spot } = Route.useLoaderData() as { spot: SpotFull };

  const lang = (i18n.language as LangCode) || "ko";
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(spot.id);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [activeMap, setActiveMap] = useState<'google' | 'kakao'>('google');

  const name = pickLang(spot.name, lang);
  const description = pickLang(spot.description, lang);
  const address = pickLang(spot.address, lang);
  const admission = pickLang(spot.admission, lang);
  const visitTips = pickLang(spot.visit_tips, lang);
  const statusInfo = pickLang(spot.status, lang);
  const sceneDesc = pickLang(spot.scene_description, lang);

  const restaurants = useMemo(
    () =>
      (spot.nearby_restaurants ?? [])
        .map((id) => RESTAURANTS.find((r) => r.id === id))
        .filter((r): r is Restaurant => Boolean(r)),
    [spot.nearby_restaurants],
  );
  const cafes = useMemo(
    () =>
      (spot.nearby_cafes ?? [])
        .map((id) => CAFES.find((c) => c.id === id))
        .filter((c): c is Cafe => Boolean(c)),
    [spot.nearby_cafes],
  );

  // If we are on a sub-route (like /nearby), show the child content
  // THIS MUST BE AFTER ALL HOOKS
  if (childMatches.length > 0) {
    return <Outlet />;
  }

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else void router.navigate({ to: "/spots" });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `📍 ${name} · Busan Drama Spot`;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text, url });
        return;
      } catch {
        /* dismissed */
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success(t("detail.copied"));
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success(t("detail.copied"));
  };

  const handleFav = (e: React.MouseEvent) => {
    const wasFav = isFav;
    toggleFavorite(spot.id);
    if (!wasFav) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(t("spots.addedToCourse"), { duration: 1500 });
    }
  };

  return (
    <div className="pb-28">
      {/* 1. HERO (Airbnb Style 5:4 Forced) */}
      <section className="relative px-0 md:px-6 md:pt-6">
        <div 
          className="group relative w-full max-h-[75vh] overflow-hidden md:rounded-3xl bg-muted shadow-2xl"
          style={{ aspectRatio: '5/4' }}
        >
          <img
            src={spot.thumbnail}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating top controls */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
            <button
              onClick={goBack}
              aria-label={t("detail.back")}
              className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                aria-label={t("detail.share")}
                className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
              >
                <Share2 className="size-3.5" />
              </button>
              <button
                onClick={(e) => handleFav(e)}
                aria-label="favorite"
                className="grid size-9 place-items-center rounded-full bg-white/95 shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
              >
                <Heart
                  className={`size-3.5 ${isFav ? "fill-primary text-primary" : "text-foreground"}`}
                />
              </button>
            </div>
          </div>

          {/* Bottom Overlay Title (Optional, or keep it below) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:hidden">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-90">📍 {spot.region}</p>
            <h1 className="text-2xl font-bold leading-tight">{name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-4 pt-8">
        {/* Header Section (Desktop & Info) */}
        <div className="mb-8 hidden md:block border-b pb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-primary uppercase tracking-widest">📍 {spot.region}</p>
              <h1 className="text-4xl font-black tracking-tight text-foreground">{name}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {spot.drama.map((d) => (
                  <span
                    key={d}
                    className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                  >
                    🎬 {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {sceneDesc && (
            <div className="mt-6 rounded-2xl bg-muted/30 p-5 border-l-4 border-primary">
              <p className="text-lg font-medium text-foreground italic leading-relaxed">
                "{sceneDesc}"
              </p>
            </div>
          )}
        </div>

        {/* Mobile Title Section (below image) */}
        <div className="md:hidden mb-6">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {spot.drama.map((d) => (
              <span
                key={d}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"
              >
                🎬 {d}
              </span>
            ))}
          </div>
          {sceneDesc && (
            <div className="mb-6 border-l-2 border-primary pl-3">
              <p className="text-sm font-medium text-muted-foreground italic">
                "{sceneDesc}"
              </p>
            </div>
          )}
        </div>

        {/* 3 & 4. DESCRIPTION & INFO (Side-by-side on desktop) */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Side: Description */}
          <section className="flex-1 space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold text-primary tracking-wider uppercase">
              About The Spot
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
              {t("detail.description")}
            </h2>
            <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground/90 font-medium">
              {description}
            </p>
          </section>

          {/* Right Side: Quick Info Card */}
          <section className="w-full md:w-[320px] shrink-0 rounded-3xl border border-border bg-card p-8 shadow-lg space-y-8 sticky top-24">
            <div className="flex items-center gap-3 border-b border-border pb-4">
               <div className="size-2 rounded-full bg-primary animate-pulse" />
               <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">
                 Spot Information
               </h3>
            </div>
            <ul className="space-y-6 text-sm">
              {address && (
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{t("detail.info.address")}</p>
                    <p className="font-bold text-foreground leading-snug break-words">{address}</p>
                  </div>
                  <button
                    onClick={copyAddress}
                    className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-90"
                    aria-label={t("detail.copy")}
                  >
                    <Copy className="size-4" />
                  </button>
                </li>
              )}
              {spot.hours && (
                <li className="flex items-start gap-4">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{t("detail.info.hours")}</p>
                    <p className="font-bold text-foreground leading-snug">{spot.hours}</p>
                  </div>
                </li>
              )}
              {admission && (
                <li className="flex items-start gap-4">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Ticket className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{t("detail.info.admission")}</p>
                    <p className="font-bold text-foreground leading-snug">{admission}</p>
                  </div>
                </li>
              )}
              {statusInfo && (
                <li className="flex items-start gap-4">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">운영 정보</p>
                    <p className="font-bold text-foreground leading-snug">{statusInfo}</p>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Divider */}
        <div className="mt-8 mb-6 border-t border-border/60" />

        {/* 5. FULL WIDTH MAP */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{t("detail.map.title")}</h2>
            <div className="flex gap-3">
               <Button 
                 variant="ghost" 
                 size="sm" 
                 asChild
                 onClick={() => setActiveMap('google')}
                 className={cn(
                   "text-xs h-9 font-bold transition-all",
                   activeMap === 'google' 
                    ? "text-primary bg-primary/10 hover:bg-primary/20 shadow-sm" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                 )}
               >
                  <a href={`https://www.google.com/maps/search/?api=1&query=${spot.coords.lat},${spot.coords.lng}`} target="_blank" rel="noopener noreferrer">
                    Google Maps <ExternalLink className="ml-1.5 size-3" />
                  </a>
               </Button>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 asChild
                 onClick={() => setActiveMap('kakao')}
                 className={cn(
                   "text-xs h-9 font-bold transition-all duration-200",
                   activeMap === 'kakao' 
                    ? "text-[#3C1E1E] bg-[#FAE100]/20 hover:bg-[#FAE100]/30 shadow-sm" 
                    : "text-muted-foreground hover:bg-[#FAE100]/20 hover:text-[#3C1E1E]"
                 )}
               >
                  <a href={`https://map.kakao.com/link/map/${encodeURIComponent(name)},${spot.coords.lat},${spot.coords.lng}`} target="_blank" rel="noopener noreferrer">
                    Kakao Map <ExternalLink className="ml-1.5 size-3" />
                  </a>
               </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-md">
            <MapSection
              coords={spot.coords}
            />
          </div>
        </section>

        {/* Bottom Divider */}
        <div className="mt-12 mb-8 border-t border-border/60" />

        {/* 6. INTEGRATED NEARBY CTA */}
        <section className="pt-2">
          <Link
            to="/spots/$id/nearby"
            params={{ id: spot.id }}
            className="flex items-center justify-center w-full h-16 rounded-3xl text-lg font-bold bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 group no-underline"
          >
            ✨ {name} 근처 맛집 & 카페 탐방하기
            <ChevronRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="mt-6 flex items-center justify-center gap-8 text-base text-muted-foreground font-extrabold">
            <Link
              to="/spots/$id/nearby"
              params={{ id: spot.id }}
              search={{ type: 'restaurant' }}
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer no-underline"
            >
              🍽️ 주변 식당 {restaurants.length}곳
            </Link>
            <Link
              to="/spots/$id/nearby"
              params={{ id: spot.id }}
              search={{ type: 'cafe' }}
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer no-underline"
            >
              ☕ 추천 카페 {cafes.length}곳
            </Link>
          </div>
        </section>

        {/* 8. PHOTO TIPS */}
        {spot.photo_tips && spot.photo_tips.length > 0 && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">
              {t("detail.photoTips.title")}
            </h2>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {spot.photo_tips.map((tip, i) => (
                <figure
                  key={i}
                  className="w-[180px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-sm"
                >
                  <img
                    src={tip.image}
                    alt=""
                    className="aspect-[9/16] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-2.5 text-xs leading-snug text-foreground">
                    💡 {pickLang(tip.tip, lang)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 9. VISIT TIPS (collapsible) */}
        {visitTips && (
          <section className="rounded-2xl border border-accent/40 bg-accent/20 p-4">
            <button
              onClick={() => setTipsOpen((o) => !o)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={tipsOpen}
            >
              <span className="text-sm font-semibold text-foreground">
                {t("detail.visitTips.title")}
              </span>
              {tipsOpen ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </button>
            {tipsOpen && (
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {visitTips}
              </p>
            )}
          </section>
        )}
      </div>

    </div>
  );
}

/* ---------- Map (lazy iframe via IntersectionObserver) ---------- */
function MapSection({
  coords,
}: {
  coords: { lat: number; lng: number };
}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const embed = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=16&output=embed`;

  return (
    <section>
    <div
      ref={ref}
      className="w-full overflow-hidden"
      style={{ height: '350px' }}
    >
      {inView ? (
        <iframe
          src={embed}
          title="Map"
          loading="lazy"
          className="h-full w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="grid h-full place-items-center bg-muted/30 text-muted-foreground">
          <MapPin className="size-8 opacity-40 animate-pulse" />
        </div>
      )}
    </div>
    </section>
  );
}

/* ---------- Nearby horizontal list with expandable cards ---------- */
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
