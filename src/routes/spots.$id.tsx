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

  const name = pickLang(spot.name, lang);
  const description = pickLang(spot.description, lang);
  const address = pickLang(spot.address, lang);
  const admission = pickLang(spot.admission, lang);
  const visitTips = pickLang(spot.visit_tips, lang);

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
      {/* 1. HERO */}
      <section className="relative h-[55vh] min-h-[360px] w-full overflow-hidden">
        <img
          src={spot.thumbnail}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

        {/* Floating top controls */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button
            onClick={goBack}
            aria-label={t("detail.back")}
            className="grid size-10 place-items-center rounded-full bg-white/95 text-foreground shadow-lg backdrop-blur transition active:scale-90"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              aria-label={t("detail.share")}
              className="grid size-10 place-items-center rounded-full bg-white/95 text-foreground shadow-lg backdrop-blur transition active:scale-90"
            >
              <Share2 className="size-4" />
            </button>
            <button
              onClick={(e) => handleFav(e)}
              aria-label="favorite"
              className="grid size-10 place-items-center rounded-full bg-white/95 shadow-lg backdrop-blur transition active:scale-90"
            >
              <Heart
                className={`size-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`}
              />
            </button>
          </div>
        </div>

        {/* Title + drama tags */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="mb-1 text-xs font-medium opacity-90">📍 {spot.region}</p>
          <h1 className="text-3xl font-bold leading-tight drop-shadow-md">{name}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spot.drama.map((d) => (
              <span
                key={d}
                className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur"
              >
                🎬 {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-md space-y-8 px-4 pt-6">

        {/* 3. QUICK INFO CARD */}
        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <ul className="space-y-3 text-sm">
            {address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t("detail.info.address")}</p>
                  <p className="font-medium text-foreground">{address}</p>
                </div>
                <button
                  onClick={copyAddress}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label={t("detail.copy")}
                >
                  <Copy className="size-4" />
                </button>
              </li>
            )}
            {spot.hours && (
              <li className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t("detail.info.hours")}</p>
                  <p className="font-medium text-foreground">{spot.hours}</p>
                </div>
              </li>
            )}
            {admission && (
              <li className="flex items-center gap-3">
                <Ticket className="size-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{t("detail.info.admission")}</p>
                  <p className="font-medium text-foreground">{admission}</p>
                </div>
              </li>
            )}
            {spot.best_time && (
              <li className="flex items-center gap-3">
                <Sun className="size-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    {t("detail.info.bestTime")}
                  </p>
                  <p className="font-medium text-foreground">
                    {t(`detail.bestTime.${spot.best_time}`)}
                  </p>
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* 4. DESCRIPTION & MAP (Side-by-side on larger screens) */}
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <section className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              ABOUT THE SPOT
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {t("detail.description")}
            </h2>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground/90">
              {description}
            </p>
          </section>

          {/* 5. MAP (lazy) */}
          <div className="rounded-3xl bg-muted/30 p-2 border border-border/40">
            <MapSection
              coords={spot.coords}
              name={name}
              address={address}
              onCopyAddress={copyAddress}
            />
          </div>
        </div>

        {/* 6. INTEGRATED NEARBY CTA */}
        <section className="pt-4">
          <Link
            to="/spots/$id/nearby"
            params={{ id: spot.id }}
            className="flex items-center justify-center w-full h-16 rounded-3xl text-lg font-bold bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 group no-underline"
          >
            ✨ {name} 근처 맛집 & 카페 탐방하기
            <ChevronRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/spots/$id/nearby"
            params={{ id: spot.id }}
            className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">🍽️ 주변 식당 {restaurants.length}곳</span>
            <span className="flex items-center gap-1">☕ 추천 카페 {cafes.length}곳</span>
          </Link>
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
