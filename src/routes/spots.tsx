import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
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
import { STYLE_META, type StyleKey } from "@/data/quiz";
import spotsData from "@/data/spots.json";

const STYLE_KEYS = ["healing", "active", "insta", "kdrama"] as const;
const SORT_KEYS = ["popular", "newest", "nearest"] as const;

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  style: fallback(z.enum(STYLE_KEYS).optional(), undefined),
  regions: fallback(z.array(z.string()), []).default([]),
  types: fallback(z.array(z.string()), []).default([]),
  dramas: fallback(z.array(z.string()), []).default([]),
  sort: fallback(z.enum(SORT_KEYS), "popular").default("popular"),
});

type SpotsSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/spots")({
  component: Spots,
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Filming Locations — Busan Drama Spot & Style" },
      {
        name: "description",
        content:
          "Browse all K-drama and movie filming locations in Busan with smart filters by region, type, and drama.",
      },
    ],
  }),
});

// Map a quiz style → which type/region tags to pre-select
const STYLE_PRESET: Record<StyleKey, { types: string[] }> = {
  healing: { types: ["바다", "카페", "산책"] },
  active: { types: ["시장", "맛집"] },
  insta: { types: ["포토스팟", "마을"] },
  kdrama: { types: [] }, // all spots match the K-drama vibe
};

interface SpotData extends Spot {
  type: string[];
  popularity: number;
}

const ALL_SPOTS = spotsData as SpotData[];

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function Spots() {
  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/spots" });
  const search = Route.useSearch();
  const { q, style, regions, types, dramas, sort } = search;

  const [searchInput, setSearchInput] = useState(q);

  // Debounce search input → URL
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (searchInput !== q) {
        void navigate({
          search: (prev: SpotsSearch) => ({ ...prev, q: searchInput }),
        });
      }
    }, 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Apply style preset on first mount when style param is present and no type filters yet
  useEffect(() => {
    if (style && types.length === 0) {
      const preset = STYLE_PRESET[style as StyleKey].types;
      if (preset.length > 0) {
        void navigate({
          search: (prev: SpotsSearch) => ({ ...prev, types: preset }),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  const allDramas = useMemo(() => uniq(ALL_SPOTS.flatMap((s) => s.drama)), []);
  const allRegions = useMemo(() => uniq(ALL_SPOTS.map((s) => s.region)), []);
  const allTypes = useMemo(() => uniq(ALL_SPOTS.flatMap((s) => s.type)), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = ALL_SPOTS.filter((s) => {
      if (regions.length && !regions.includes(s.region)) return false;
      if (types.length && !s.type.some((t) => types.includes(t))) return false;
      if (dramas.length && !s.drama.some((d) => dramas.includes(d))) return false;
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
    void navigate({
      search: (prev: SpotsSearch) => {
        const cur = (prev[key] as string[] | undefined) ?? [];
        const next = cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value];
        return { ...prev, [key]: next };
      },
    });
  };

  const clearStyle = () =>
    void navigate({
      search: (prev: SpotsSearch) => ({ ...prev, style: undefined, types: [] }),
    });

  const resetAll = () => {
    setSearchInput("");
    void navigate({
      search: () => ({ q: "", regions: [], types: [], dramas: [], sort: "popular" }),
    });
  };

  const styleColor = style ? STYLE_META[style as StyleKey].colorVar : null;
  const styleIcon = style ? STYLE_META[style as StyleKey].icon : null;

  return (
    <div className="space-y-4 pb-6">
      {/* Sticky search bar */}
      <div className="sticky top-14 z-30 -mx-4 -mt-6 bg-background/90 px-4 pb-3 pt-4 backdrop-blur">
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

      {/* Style banner */}
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

      {/* Filter chip groups */}
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

      {/* Sort + count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("spots.count", { count: filtered.length })}
        </p>
        <Select
          value={sort}
          onValueChange={(v) =>
            void navigate({
              search: (prev: SpotsSearch) => ({
                ...prev,
                sort: v as (typeof SORT_KEYS)[number],
              }),
            })
          }
        >
          <SelectTrigger className="h-9 w-auto gap-2 rounded-full border-border bg-card text-xs">
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

      {/* Grid or empty state */}
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
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
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition active:scale-95 ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/40"
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
