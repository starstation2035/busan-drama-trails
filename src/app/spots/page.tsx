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

const STYLE_PRESET: Record<StyleKey, { types: string[] }> = {
  healing: { types: ["바다", "카페", "산책"] },
  active: { types: ["시장", "맛집"] },
  insta: { types: ["포토스팟", "마을"] },
  kdrama: { types: [] },
};

const SORT_KEYS = ["popular", "newest", "nearest"] as const;

interface SpotData extends Spot {
  type: string[];
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
  const regions = searchParams.getAll("regions");
  const types = searchParams.getAll("types");
  const dramas = searchParams.getAll("dramas");
  const sort = searchParams.get("sort") ?? "popular";

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

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (searchInput !== q) {
        updateSearch({ q: searchInput });
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    if (style && types.length === 0) {
      if (STYLE_KEYS.includes(style as any)) {
        const preset = STYLE_PRESET[style as StyleKey].types;
        if (preset.length > 0) {
          updateSearch({ types: preset });
        }
      }
    }
  }, [style]);

  const allDramas = useMemo(() => uniq(ALL_SPOTS.flatMap((s) => s.drama || [])), []);
  const allRegions = useMemo(() => uniq(ALL_SPOTS.map((s) => s.region).filter(Boolean)), []);
  const allTypes = useMemo(() => uniq(ALL_SPOTS.flatMap((s) => s.type || [])), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = ALL_SPOTS.filter((s) => {
      if (regions.length && !regions.includes(s.region)) return false;
      if (types.length && !(s.type || []).some((t) => types.includes(t))) return false;
      if (dramas.length && !(s.drama || []).some((d) => dramas.includes(d))) return false;
      if (needle) {
        const hay = [
          ...Object.values(s.name),
          ...s.drama,
          s.region,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    if (sort === "popular") list = [...list].sort((a, b) => b.popularity - a.popularity);
    else if (sort === "newest") list = [...list].reverse();
    else if (sort === "nearest")
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    return list;
  }, [q, regions, types, dramas, sort]);

  const toggleIn = (key: "regions" | "types" | "dramas", value: string) => {
    const cur = searchParams.getAll(key);
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    updateSearch({ [key]: next });
  };

  const clearStyle = () => updateSearch({ style: null, types: [] });

  const resetAll = () => {
    setSearchInput("");
    router.push("/spots");
  };

  const styleColor = style && STYLE_KEYS.includes(style as any) ? STYLE_META[style as StyleKey].colorVar : null;
  const styleIcon = style && STYLE_KEYS.includes(style as any) ? STYLE_META[style as StyleKey].icon : null;

  const filmingSites = filtered.filter(s => s.category === "drama");
  const landmarks = filtered.filter(s => s.category === "landmark");

  return (
    <div className="space-y-4 pb-20 min-h-screen">
      {/* Upstream Header Integration */}
      <section className="-mx-4 px-6 pt-12 pb-8 bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-4xl font-black mb-3 tracking-tight">
          Explore Busan
        </h1>
        <p className="text-muted-foreground text-base max-w-md">
          영화 속 그 장면부터 부산의 숨은 명소까지, 당신의 특별한 여정을 시작하세요.
        </p>
      </section>

      {/* Sticky Search & Filter */}
      <div className="sticky top-14 z-30 -mx-4 bg-background/90 px-4 pb-3 pt-4 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("spots.searchPlaceholder")}
            className="h-11 rounded-2xl bg-muted pl-10 pr-10 text-sm"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"
            >
              <X className="size-3.5" />
            </button>
          )}
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

      {/* Filter Rows */}
      <div className="space-y-4">
        <FilterRow
          label={t("spots.filters.drama")}
          options={allDramas}
          selected={dramas}
          onToggle={(v) => toggleIn("dramas", v)}
        />
        <FilterRow
          label={t("spots.filters.region")}
          options={allRegions}
          selected={regions}
          onToggle={(v) => toggleIn("regions", v)}
        />
        <FilterRow
          label={t("spots.filters.type")}
          options={allTypes}
          selected={types}
          onToggle={(v) => toggleIn("types", v)}
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground font-medium">
          {t("spots.count", { count: filtered.length })}
        </p>
        <Select
          value={sort}
          onValueChange={(v) => updateSearch({ sort: v })}
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

      {filtered.length === 0 ? (
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🎬 영화 촬영지
                </h2>
                <p className="text-xs text-muted-foreground mt-1">드라마와 영화 속 감동을 직접 느껴보세요.</p>
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  🌊 부산 명소
                </h2>
                <p className="text-xs text-muted-foreground mt-1">부산에 왔다면 꼭 가봐야 할 필수 코스입니다.</p>
              </div>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {landmarks.map((spot) => (
                  <SpotCard key={spot.id} spot={spot} />
                ))}
              </div>
            </section>
          )}

          {/* If neither filming site nor landmark, show all remaining in filtered */}
          {filmingSites.length === 0 && landmarks.length === 0 && (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1.5 shrink-0 text-xs font-bold text-muted-foreground/60 w-12 text-right">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, idx) => {
          const active = selected.includes(opt);
          return (
            <button
              key={`${opt}-${idx}`}
              onClick={() => onToggle(opt)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
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
