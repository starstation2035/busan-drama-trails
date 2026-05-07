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
  drama: LocalizedString[];
  region: Record<string, string>;
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
  drama_info?: LocalizedString;
}

const SPOTS = spotsRaw as unknown as SpotFull[];
const RESTAURANTS = restaurantsRaw as unknown as Restaurant[];
const CAFES = cafesRaw as unknown as Cafe[];

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
  const isFavorite = favorites.includes(id);

  const [expandedTips, setExpandedTips] = useState(false);
  const [activeMap, setActiveMap] = useState<'google' | 'kakao'>('google');

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
  const statusInfo = pickLang(spot.status, lang);
  const sceneDesc = pickLang(spot.scene_description, lang);
  const dramaInfo = pickLang(spot.drama_info, lang);
  const regionName = pickLang(spot.region as any, lang);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `📍 ${name} · Busan Drama Spot`;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success(t("detail.copied"));
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    const wasFav = isFavorite;
    toggleFavorite(spot.id);
    if (!wasFav) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(t("spots.addedToCourse"), { duration: 1500 });
    }
  };

  return (
    <div className="relative min-h-screen bg-background pb-28">
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
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floating top controls */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
              >
                <Share2 className="size-3.5" />
              </button>
              <button
                onClick={handleToggleFavorite}
                className="grid size-9 place-items-center rounded-full bg-white/95 shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
              >
                <Heart
                  className={`size-3.5 ${isFavorite ? "fill-primary text-primary" : "text-foreground"}`}
                />
              </button>
            </div>
          </div>

          {/* Bottom Overlay Title (Mobile) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:hidden">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider opacity-90">📍 {regionName}</p>
            <h1 className="text-2xl font-bold leading-tight">{name}</h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-4 pt-8">
        {/* Header Section (Desktop & Info) */}
        <div className="mb-8 hidden md:block border-b pb-8">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <p className="mb-2 text-sm font-bold text-primary uppercase tracking-widest">📍 {regionName}</p>
              <h1 className="text-3xl font-black tracking-tight text-[#222222]">{name}</h1>
              
              <div className="mt-4 space-y-4">
                {spot.drama.map((d, idx) => (
                  <div key={idx} className="space-y-2">
                    <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      🎬 {pickLang(d, lang)}
                    </span>
                    {dramaInfo && (
                      <p className="text-base text-[#555555] leading-relaxed w-full bg-muted/10 p-6 rounded-2xl border border-border/50 shadow-sm">
                        {dramaInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* No direct sceneDesc here anymore, moved below */}
        </div>

        {/* Mobile Title Section (below image) */}
        <div className="md:hidden mb-6">
          <div className="space-y-4 mb-4">
            {spot.drama.map((d, idx) => (
              <div key={idx} className="space-y-2">
                <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  🎬 {pickLang(d, lang)}
                </span>
                {dramaInfo && (
                  <p className="text-[15px] text-[#555555] leading-relaxed w-full bg-muted/10 p-4 rounded-xl border border-border/50">
                    {dramaInfo}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* No direct sceneDesc here anymore, moved below */}
        </div>

        {/* Info Grid & Description */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <section className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold text-primary tracking-wider uppercase">
                About The Spot
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#222222] leading-tight">
                {t("detail.description")}
              </h2>
              {sceneDesc && (
                <p className="text-base font-medium text-[#333333] italic leading-relaxed">
                  "{sceneDesc}"
                </p>
              )}
              <p className="whitespace-pre-line text-base leading-relaxed text-[#555555] font-medium">
                {desc}
              </p>
            </div>
          </section>

          <section className="w-full md:w-[320px] shrink-0 rounded-3xl border border-border bg-card py-5 px-6 shadow-lg space-y-4 md:mt-24">
            <div className="flex items-center gap-3 border-b border-border pb-3">
               <div className="size-2 rounded-full bg-primary animate-pulse" />
               <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">
                 Spot Information
               </h3>
            </div>
            <ul className="space-y-3 text-sm">
              {addr && (
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{t("detail.info.address")}</p>
                    <p className="font-bold text-foreground leading-snug break-words">{addr}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(addr);
                      toast.success(t("detail.copied"));
                    }}
                    className="mt-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-90"
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
              {statusInfo && (
                <li className="flex items-start gap-4">
                  <div className="mt-1 size-8 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mb-0.5">{t("detail.info.status")}</p>
                    <p className="font-bold text-foreground leading-snug">{statusInfo}</p>
                  </div>
                </li>
              )}
            </ul>
          </section>
        </div>

        <div className="mt-8 mb-6 border-t border-border/60" />

        {/* Map Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{t("detail.map.title")}</h2>
            <div className="flex gap-3">
               <Button 
                 variant="ghost" 
                 size="sm" 
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

        <div className="mt-12 mb-8 border-t border-border/60" />

        <section className="pt-2">
          <Link
            href={`/spots/${spot.id}/nearby`}
            className="flex items-center justify-center w-full h-16 rounded-3xl text-lg font-bold bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 group no-underline"
          >
            {t("detail.nearbyCta", { name })}
            <ChevronRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Photo Tips */}
        {spot.photo_tips && spot.photo_tips.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              {t("detail.photoTips.title")}
            </h2>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {spot.photo_tips.map((tip, i) => (
                <figure
                  key={i}
                  className="w-[200px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-md border border-border/40"
                >
                  <img
                    src={tip.image}
                    alt=""
                    className="aspect-[9/16] w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-3 text-xs font-medium leading-snug text-foreground">
                    💡 {pickLang(tip.tip, lang)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Visit Tips Accordion */}
        {spot.visit_tips && (
          <section className="mt-8">
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
}: {
  coords: { lat: number; lng: number };
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.05 });
  const embed = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=16&output=embed`;

  return (
    <div
      ref={ref}
      className="w-full"
      style={{ height: '400px' }}
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
  );
}
