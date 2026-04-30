"use client";

import { useMemo, useState, useEffect } from "react";
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
  RefreshCw,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import {
  classifyFavorites,
  generateCourse,
  totalRouteKm,
  type TimelineEntry,
} from "@/lib/course";
import { type EditableTimelineEntry } from "@/domain/course";
import { courseService } from "@/application/courseService";
import { STYLE_META, type StyleKey } from "@/data/quiz";

export default function MyCoursePage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "zh-TW") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const userStyle = useAppStore((s) => s.userStyle) as StyleKey | null;
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const router = useRouter();

  const { spots, restaurants, cafes } = useMemo(
    () => classifyFavorites(favorites),
    [favorites],
  );

  const [tab, setTab] = useState<"list" | "course">("course");
  const [seed, setSeed] = useState(0);

  // Use a state for editable course to support the new editing features from upstream
  const [editableCourse, setEditableCourse] = useState<EditableTimelineEntry[]>([]);

  const course = useMemo<TimelineEntry[]>(
    () => (favorites.length ? generateCourse(favorites) : []),
    [favorites, seed],
  );

  useEffect(() => {
    // Sync editable course when favorites or seed change
    if (course.length > 0) {
      setEditableCourse(course as EditableTimelineEntry[]);
    }
  }, [course]);

  const totalKm = useMemo(() => totalRouteKm(editableCourse), [editableCourse]);

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
    const lines = editableCourse
      .map((e, i) => `${i + 1}. ${e.time} ${e.item.name[lang] ?? e.item.name["en"]}`)
      .join("\n");
    const text = `${t("myCourse.share.header")}\n${lines}\n${typeof window !== 'undefined' ? window.location.origin : ''}/my-course`;
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
    await navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
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

      {/* User Style Result */}
      {userStyle && (
        <div
          className="relative overflow-hidden rounded-3xl p-6 text-center shadow-lg animate-fade-up"
          style={{
            background: `linear-gradient(135deg, ${STYLE_META[userStyle].colorVar}, color-mix(in oklab, ${STYLE_META[userStyle].colorVar} 60%, white))`,
          }}
        >
          <div className="absolute top-3 right-4">
            <Link
              href="/style-test"
              className="flex items-center gap-1 text-[10px] font-bold text-foreground/60 hover:text-foreground transition-colors"
            >
              <RefreshCw className="size-3" />
              {t("common.retake")}
            </Link>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
            {t("quiz.result.yourStyle")}
          </p>
          <div className="mt-2 text-5xl animate-bounce-slow">{STYLE_META[userStyle].icon}</div>
          <h2 className="mt-2 text-2xl font-black text-foreground">
            {t(`quiz.types.${userStyle}.name`)}
          </h2>
          <p className="mt-1 text-xs font-medium text-foreground/70">
            {t(`quiz.types.${userStyle}.tagline`)}
          </p>
        </div>
      )}

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
        <div className="space-y-8">
          {/* AI Optimization Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shuffle className="size-24" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 mb-3">
                <span className="size-2 rounded-full bg-green-400 animate-pulse" />
                AI Optimized Path
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">AI 추천 최적 경로</h2>
              <p className="text-white/80 text-xs leading-relaxed max-w-[80%]">
                동선을 고려하여 가장 효율적인 방문 순서를 계산했습니다. {totalKm.toFixed(1)}km의 여정을 지금 확인해보세요!
              </p>
            </div>
          </div>

          <CourseView
            course={editableCourse}
            totalKm={totalKm}
            lang={lang}
            onUpdateMemo={(idx, val) =>
              setEditableCourse((cur) => courseService.updateMemo(cur, idx, val))
            }
            onUpdateTravelTime={(idx, val) =>
              setEditableCourse((cur) => courseService.updateTravelTime(cur, idx, val))
            }
          />
        </div>
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
  onUpdateMemo,
  onUpdateTravelTime,
}: {
  course: EditableTimelineEntry[];
  totalKm: number;
  lang: LangCode;
  onUpdateMemo: (idx: number, val: string) => void;
  onUpdateTravelTime: (idx: number, val: number) => void;
}) {
  const { t } = useTranslation();

  if (course.length === 0) return null;

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
              : ({} as Record<string, any>);
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
                    <div className="mt-1">
                      <input
                        type="text"
                        value={entry.memo || ""}
                        onChange={(e) => onUpdateMemo(i, e.target.value)}
                        placeholder="메모를 입력하세요..."
                        className="w-full bg-transparent text-[10px] text-muted-foreground outline-none border-b border-transparent focus:border-primary/30 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </ItemLink>
              {entry.travelToNext && !isLast && (
                <div className="ml-1 mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <ModeIcon mode={entry.travelToNext.mode} />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={entry.travelToNext.minutes}
                      onChange={(e) => onUpdateTravelTime(i, parseInt(e.target.value) || 0)}
                      className="w-8 bg-muted rounded px-1 py-0.5 text-center text-[10px] font-bold"
                    />
                    <span>min {t(`myCourse.travel.${entry.travelToNext.mode}`)}</span>
                  </div>
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
