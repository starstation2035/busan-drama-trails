"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Trash2,
  Share2,
  Shuffle,
  Download,
  MapPin,
  Footprints,
  Car,
  TrainFront,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  classifyFavorites,
  generateCourse,
  totalRouteKm,
  type TimelineEntry,
} from "@/lib/course";

export default function MyCoursePage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "zh-TW") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const router = useRouter();

  const { spots, restaurants, cafes } = useMemo(
    () => classifyFavorites(favorites),
    [favorites],
  );

  const [tab, setTab] = useState<"list" | "course">("course");
  const [seed, setSeed] = useState(0);

  const course = useMemo<TimelineEntry[]>(
    () => (favorites.length ? generateCourse(favorites) : []),
    [favorites, seed],
  );
  const totalKm = useMemo(() => totalRouteKm(course), [course]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 text-7xl">🗺️</div>
        <h1 className="text-2xl font-bold text-foreground">{t("myCourse.title")}</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          {t("myCourse.empty.message")}
        </p>
        <Button asChild className="mt-6">
          <Link href="/spots">{t("myCourse.empty.cta")}</Link>
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    const lines = course
      .map((e, i) => `${i + 1}. ${e.time} ${e.item.name[lang] ?? e.item.name["en"]}`)
      .join("\n");
    const text = `${t("myCourse.share.header")}\n${lines}\n${window.location.origin}/my-course`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
      }
    }
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(lineUrl, "_blank");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t("common.copied"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">{t("myCourse.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("myCourse.subtitle", {
            spots: spots.length,
            restaurants: restaurants.length,
            cafes: cafes.length,
          })}
        </p>
      </header>

      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setTab("course")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            tab === "course" ? "bg-background text-foreground shadow" : "text-muted-foreground"
          }`}
        >
          {t("myCourse.tabs.course")}
        </button>
        <button
          type="button"
          onClick={() => setTab("list")}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            tab === "list" ? "bg-background text-foreground shadow" : "text-muted-foreground"
          }`}
        >
          {t("myCourse.tabs.list")}
        </button>
      </div>

      {tab === "list" ? (
        <ListView
          spots={spots}
          restaurants={restaurants}
          cafes={cafes}
          lang={lang}
          onRemove={(id) => {
            toggleFavorite(id);
            toast(t("myCourse.removed"));
          }}
          onOpen={(id, kind) => {
            if (kind === "spot") router.push(`/spots/${id}`);
          }}
        />
      ) : (
        <CourseView course={course} totalKm={totalKm} lang={lang} />
      )}

      {/* Bottom action bar */}
      {tab === "course" && (
        <div className="sticky bottom-20 z-10 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur md:bottom-4">
          <Button variant="default" onClick={handleShare} className="gap-1">
            <Share2 className="h-4 w-4" /> {t("myCourse.actions.share")}
          </Button>
          <Button variant="outline" onClick={() => setSeed((s) => s + 1)} className="gap-1">
            <Shuffle className="h-4 w-4" /> {t("myCourse.actions.regen")}
          </Button>
          <Button
            variant="outline"
            onClick={() => toast(t("myCourse.actions.exportSoon"))}
            className="gap-1"
          >
            <Download className="h-4 w-4" /> {t("myCourse.actions.export")}
          </Button>
        </div>
      )}

      {tab === "course" && (
        <div className="text-center text-xs text-muted-foreground">
          <button onClick={handleCopy} className="underline">
            {t("myCourse.actions.copyLink")}
          </button>
        </div>
      )}
    </div>
  );
}

function ListView({
  spots,
  restaurants,
  cafes,
  lang,
  onRemove,
  onOpen,
}: {
  spots: ReturnType<typeof classifyFavorites>["spots"];
  restaurants: ReturnType<typeof classifyFavorites>["restaurants"];
  cafes: ReturnType<typeof classifyFavorites>["cafes"];
  lang: LangCode;
  onRemove: (id: string) => void;
  onOpen: (id: string, kind: "spot" | "restaurant" | "cafe") => void;
}) {
  const { t } = useTranslation();
  const groups = [
    { key: "spots", label: t("myCourse.groups.spots"), items: spots },
    { key: "restaurants", label: t("myCourse.groups.restaurants"), items: restaurants },
    { key: "cafes", label: t("myCourse.groups.cafes"), items: cafes },
  ] as const;

  return (
    <div className="space-y-6">
      {groups.map((g) =>
        g.items.length ? (
          <section key={g.key} className="space-y-2">
            <h2 className="text-sm font-semibold text-muted-foreground">{g.label}</h2>
            <ul className="space-y-2">
              {g.items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-2 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => onOpen(it.id, it.kind)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <img
                      src={it.thumbnail}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <span className="line-clamp-2 text-sm font-medium text-foreground">
                      {it.name[lang] ?? it.name["en"]}
                    </span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(it.id)}
                    aria-label="remove"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </div>
  );
}

function CourseView({
  course,
  totalKm,
  lang,
}: {
  course: TimelineEntry[];
  totalKm: number;
  lang: LangCode;
}) {
  const { t } = useTranslation();

  if (course.length === 1) {
    const e = course[0];
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">{t("myCourse.single.label")}</p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">
          {e.item.name[lang] ?? e.item.name["en"]}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">{t("myCourse.single.hint")}</p>
      </div>
    );
  }

  const tooFar = totalKm > 30;

  return (
    <div className="space-y-4">
      {tooFar && (
        <div className="flex items-start gap-2 rounded-xl border border-yellow-300/60 bg-yellow-50 p-3 text-sm text-yellow-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{t("myCourse.warnings.tooFar", { km: totalKm.toFixed(1) })}</span>
        </div>
      )}

      <ol className="relative ml-1">
        {course.map((entry, i) => {
          const item = entry.item;
          const name = item.name[lang] ?? item.name["en"];
          const isLast = i === course.length - 1;
          const ItemLink = item.kind === "spot" ? Link : "div";
          const linkProps =
            item.kind === "spot"
              ? { href: `/spots/${item.id}` }
              : ({} as Record<string, never>);
          return (
            <li key={`${item.kind}-${item.id}-${i}`} className="relative pb-6 pl-16">
              <div className="absolute left-0 top-0 w-12 text-right">
                <span className="text-xs font-semibold text-foreground">{entry.time}</span>
              </div>
              <span
                className="absolute left-[3.25rem] top-1.5 h-3 w-3 rounded-full border-2 border-background"
                style={{ backgroundColor: dotColor(item.kind) }}
              />
              {!isLast && (
                <span className="absolute left-[3.65rem] top-5 bottom-0 w-px bg-border" />
              )}
              {/* @ts-expect-error dynamic element */}
              <ItemLink
                {...linkProps}
                className="block rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {kindLabel(item.kind, t)}
                    </p>
                    <h4 className="line-clamp-1 text-sm font-semibold text-foreground">
                      {name}
                    </h4>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {entry.durationMin} min
                    </p>
                  </div>
                </div>
              </ItemLink>
              {entry.travelToNext && !isLast && (
                <div className="ml-1 mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <ModeIcon mode={entry.travelToNext.mode} />
                  <span>
                    {entry.travelToNext.minutes} min{" "}
                    {t(`myCourse.travel.${entry.travelToNext.mode}`)}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {t("myCourse.totals.distance", { km: totalKm.toFixed(1) })}
        </span>
        <span>{t("myCourse.totals.stops", { count: course.length })}</span>
      </div>
    </div>
  );
}

function dotColor(kind: "spot" | "restaurant" | "cafe"): string {
  if (kind === "spot") return "hsl(var(--primary, 0 84% 71%))";
  if (kind === "restaurant") return "#FFD93D";
  return "#4ECDC4";
}

function kindLabel(kind: "spot" | "restaurant" | "cafe", t: (k: string) => string): string {
  return t(`myCourse.kinds.${kind}`);
}

function ModeIcon({ mode }: { mode: "walk" | "taxi" | "subway" }) {
  if (mode === "walk") return <Footprints className="h-3 w-3" />;
  if (mode === "taxi") return <Car className="h-3 w-3" />;
  return <TrainFront className="h-3 w-3" />;
}
