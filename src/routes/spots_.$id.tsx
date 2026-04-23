import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
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
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { useInView } from "@/hooks/useInView";
import spotsRaw from "@/data/spots.json";
import restaurantsRaw from "@/data/restaurants.json";
import cafesRaw from "@/data/cafes.json";
import { LargePlaceCard } from "@/components/LargePlaceCard";
import { PlaceDetailDrawer } from "@/components/PlaceDetailDrawer";

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

export const Route = createFileRoute("/spots_/$id")({
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
  const { spot } = Route.useLoaderData() as { spot: SpotFull };
  const lang = (i18n.language as LangCode) || "ko";
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(spot.id);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

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

  const handleFav = () => {
    const wasFav = isFav;
    toggleFavorite(spot.id);
    if (!wasFav) toast.success(t("spots.addedToCourse"), { duration: 1500 });
  };

  return (
    <div className="-mx-4 -mt-6 pb-28">
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
              onClick={handleFav}
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
        {/* 2. SCENE COMPARISON */}
        {spot.drama_scenes && spot.drama_scenes[0] && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-foreground">
              {t("detail.scene.title")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <figure>
                <img
                  src={spot.drama_scenes[0].scene_image}
                  alt={spot.drama_scenes[0].title}
                  className="aspect-video w-full rounded-2xl object-cover shadow-sm"
                  loading="lazy"
                />
                <figcaption className="mt-1.5 text-center text-[11px] text-muted-foreground">
                  🎬 {t("detail.scene.drama")} · ep.{spot.drama_scenes[0].episode}
                </figcaption>
              </figure>
              <figure>
                <img
                  src={spot.thumbnail}
                  alt={name}
                  className="aspect-video w-full rounded-2xl object-cover shadow-sm"
                  loading="lazy"
                />
                <figcaption className="mt-1.5 text-center text-[11px] text-muted-foreground">
                  📸 {t("detail.scene.real")}
                </figcaption>
              </figure>
            </div>
          </section>
        )}

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

        {/* 4. DESCRIPTION */}
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">
            {t("detail.description")}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </section>

        {/* 5. MAP (lazy) */}
        <MapSection
          coords={spot.coords}
          name={name}
          address={address}
          onCopyAddress={copyAddress}
        />

        {/* 6. RESTAURANTS */}
        {restaurants.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.restaurants.title")}
            </h2>
            <div className="flex flex-col gap-5">
              {restaurants.map((r) => (
                <LargePlaceCard key={r.id} place={r as any} onClick={setSelectedPlace} />
              ))}
            </div>
          </section>
        )}

        {/* 7. CAFES */}
        {cafes.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.cafes.title")}
            </h2>
            <div className="flex flex-col gap-5">
              {cafes.map((c) => (
                <LargePlaceCard key={c.id} place={c as any} onClick={setSelectedPlace} />
              ))}
            </div>
          </section>
        )}

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

      {/* 10. STICKY CTA */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:bottom-0"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      >
        <div className="mx-auto max-w-screen-md">
          {isFav ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-2xl text-base font-semibold"
            >
              <Link to="/my-course">{t("detail.cta.added")}</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleFav}
              className="h-12 w-full rounded-2xl text-base font-semibold shadow-lg active:scale-[0.99]"
            >
              <Heart className="size-4" />
              {t("detail.cta.add")}
            </Button>
          )}
        </div>
      </div>

      {/* Place Detail Bottom Sheet Overlay */}
      <PlaceDetailDrawer
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
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


