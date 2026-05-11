"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpotCard, type Spot } from "@/components/SpotCard";
import spotsData from "@/data/spots.json";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { STYLE_META, type StyleKey, STYLE_KEYS } from "@/data/quiz";

const SORT_KEYS = ["popular", "newest", "nearest"] as const;

interface SpotData extends Omit<Spot, 'drama'> {
  drama: Record<LangCode, string>[];
  popularity: number;
  category?: "drama" | "landmark";
}

const ALL_SPOTS = spotsData as unknown as SpotData[];

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function SpotsContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const style = searchParams.get("style");
  const dramaSort = searchParams.get("dramaSort") ?? "popular";
  const landmarkSort = searchParams.get("landmarkSort") ?? "popular";

  const [searchInput, setSearchInput] = useState(q);

  const updateSearch = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    router.push(`/spots?${params.toString()}`);
  };





  const baseFiltered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ALL_SPOTS.filter((s) => {
      if (needle) {
        const hay = [
          ...Object.values(s.name),
          ...s.drama.flatMap(d => Object.values(d)),
          ...Object.values(s.region),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q]);

  const sortList = (list: SpotData[], sortKey: string) => {
    let sorted = [...list];
    if (sortKey === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    else if (sortKey === "newest") sorted.reverse();
    else if (sortKey === "nearest")
      sorted.sort((a, b) => a.id.localeCompare(b.id));
    return sorted;
  };

  const filmingSites = useMemo(() =>
    sortList(baseFiltered.filter(s => s.category === "drama"), dramaSort),
    [baseFiltered, dramaSort]);

  const landmarks = useMemo(() =>
    sortList(baseFiltered.filter(s => s.category === "landmark"), landmarkSort),
    [baseFiltered, landmarkSort]);


  const clearStyle = () => updateSearch({ style: null });

  const resetAll = () => {
    setSearchInput("");
    router.push("/spots");
  };

  const handleSearchSubmit = () => {
    const term = searchInput.trim().toLowerCase();

    // 1. Update the search query in URL to filter the list below
    updateSearch({ q: term || null });

    if (!term) return;

    // 2. If exact match found, navigate to detail page
    const match = ALL_SPOTS.find(
      (s) =>
        Object.values(s.name).some((v) => v.toLowerCase() === term) ||
        s.drama.some((d) => Object.values(d).some(v => v.toLowerCase() === term))
    );

    if (match) {
      router.push(`/spots/${match.id}`);
    }
  };

  const styleColor = style && STYLE_KEYS.includes(style as any) ? STYLE_META[style as StyleKey].colorVar : null;
  const styleIcon = style && STYLE_KEYS.includes(style as any) ? STYLE_META[style as StyleKey].icon : null;

  return (
    <div className="space-y-4 pb-20 min-h-screen">
      {/* Upstream Header Integration */}
      <section className="-mx-4 px-6 pt-12 pb-2 bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-3xl font-bold mb-3 tracking-tighter text-[#FF385C]">
          {t("spots.hero.title")}
        </h1>
        <p className="text-sm max-w-md whitespace-pre-line leading-relaxed text-[#222222]">
          <span className="font-bold">
            {t("spots.hero.subtitleLine1")}
          </span>
          {"\n"}
          <span>
            {t("spots.hero.subtitleLine2")}
          </span>
        </p>
      </section>

      {/* Sticky Search & Filter */}
      <div className="sticky top-14 z-30 -mx-4 bg-background/90 px-4 pb-6 pt-4 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              onClick={() => {
                if (searchInput.trim()) {
                  handleSearchSubmit();
                }
              }}
              placeholder={t("spots.searchPlaceholder")}
              className="h-11 rounded-2xl bg-white border-border pl-4 pr-20 text-sm shadow-sm cursor-pointer"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search"
                  className="grid size-6 place-items-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <button
                onClick={handleSearchSubmit}
                className="flex size-8 items-center justify-center rounded-full hover:bg-black/5 transition-all"
                title="Search"
              >
                <Search className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* HOT Ticker */}
          <div className="hidden sm:flex flex-1 items-center gap-2 overflow-hidden h-11 px-0 rounded-2xl max-w-[200px]">
            <span className="flex items-center gap-1 text-[10px] font-black border border-[#FF385C] text-[#FF385C] px-1.5 py-0.5 rounded-sm italic tracking-tighter shrink-0">
              HOT
            </span>
            <div className="relative h-6 flex-1 overflow-hidden">
               <RollingTicker onSelect={(spot) => {
                 const lang = useAppStore.getState().lang as LangCode;
                 setSearchInput(spot.name[lang] ?? spot.name.ko);
               }} />
            </div>
          </div>
        </div>
      </div>

      {style && styleColor && (
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium animate-fade-up"
          style={{
            background: `color-mix(in oklab, ${styleColor} 25%, transparent)`,
            borderLeft: `4px solid ${styleColor}`,
          }}
        >
          <span className="flex items-center gap-2 text-foreground">
            <span className="text-lg">{styleIcon}</span>
            {t("spots.styleBanner", { style: t(`quiz.types.${style}.name`) })}
          </span>
          <button
            onClick={clearStyle}
            className="shrink-0 text-xs font-semibold text-foreground/80 underline-offset-2 hover:underline"
          >
            {t("spots.clearStyle")}
          </button>
        </div>
      )}




      {baseFiltered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="text-6xl">🔍</div>
          <p className="text-base font-semibold text-foreground">
            {t("spots.empty.title")}
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t("spots.empty.subtitle")}
          </p>
          <Button onClick={resetAll} className="mt-2 rounded-full">
            {t("spots.empty.reset")}
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {filmingSites.length > 0 && (
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {t("spots.sections.drama")}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">{t("spots.sections.dramaDesc")}</p>
                </div>
                <Select
                  value={dramaSort}
                  onValueChange={(v) => updateSearch({ dramaSort: v })}
                >
                  <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-card text-xs px-4">
                    <SlidersHorizontal className="size-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {SORT_KEYS.map((k) => (
                      <SelectItem key={k} value={k} className="text-sm">
                        {t(`spots.sort.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {filmingSites.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </section>
          )}

          {landmarks.length > 0 && (
            <section>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {t("spots.sections.landmark")}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">{t("spots.sections.landmarkDesc")}</p>
                </div>
                <Select
                  value={landmarkSort}
                  onValueChange={(v) => updateSearch({ landmarkSort: v })}
                >
                  <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-card text-xs px-4">
                    <SlidersHorizontal className="size-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {SORT_KEYS.map((k) => (
                      <SelectItem key={k} value={k} className="text-sm">
                        {t(`spots.sort.${k}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {landmarks.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </section>
          )}

          {/* If neither filming site nor landmark, show all remaining in baseFiltered */}
          {filmingSites.length === 0 && landmarks.length === 0 && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {baseFiltered.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


const HOT_SPOTS = [
  { id: "pachinko", name: "영도 감지해변" },
  { id: "spot_001", name: "청사포 다릿돌전망대" },
  { id: "spot_004", name: "흰여울문화마을" },
  { id: "spot_005", name: "자갈치시장" },
  { id: "spot_003", name: "해운대 해수욕장" },
  { id: "spot_007", name: "광안리 해수욕장" },
  { id: "spot_008", name: "송도 해수욕장" },
  { id: "spot_taejongdae", name: "태종대 유원지" },
];

function RollingTicker({ onSelect }: { onSelect: (spot: SpotData) => void }) {
  const [index, setIndex] = useState(0);
  const lang = (useAppStore((s) => s.lang) ?? "ko") as LangCode;

  // Use real data from spots.json instead of hardcoded strings
  const tickerSpots = useMemo(() => {
    return HOT_SPOTS.map(hot => ALL_SPOTS.find(s => s.id === hot.id)).filter(Boolean) as SpotData[];
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % tickerSpots.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [tickerSpots.length]);

  return (
    <div
      className="absolute w-full transition-transform duration-700 ease-in-out flex flex-col"
      style={{ transform: `translateY(-${index * 24}px)` }}
    >
      {tickerSpots.map((spot, i) => (
        <button
          key={spot.id}
          onClick={() => onSelect(spot)}
          className="h-6 flex items-center text-sm font-medium text-[#555555] hover:underline transition-all truncate text-left"
        >
          {spot.name[lang] ?? spot.name.ko}
        </button>
      ))}
    </div>
  );
}

export default function Spots() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading spots...</div>}>
      <SpotsContent />
    </Suspense>
  );
}
