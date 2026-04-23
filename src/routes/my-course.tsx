import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  Pencil,
  Timer,
  X,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  classifyFavorites,
  generateCourse,
  totalRouteKm,
} from "@/lib/course";
import { type EditableTimelineEntry } from "@/domain/course";
import { courseService } from "@/application/courseService";
import { STYLE_META, type StyleKey } from "@/data/quiz";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/my-course")({
  head: () => ({
    meta: [
      { title: "My Busan Course — Drama Spot & Style" },
      {
        name: "description",
        content:
          "Build your personal Busan filming-location itinerary with smart route planning.",
      },
      { property: "og:title", content: "My Busan Course" },
      { property: "og:description", content: "Your saved spots as a smart day-trip plan." },
    ],
  }),
  component: MyCoursePage,
});

function MyCoursePage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "zh-TW") as LangCode;
  const favorites = useAppStore((s) => s.favorites);
  const userStyle = useAppStore((s) => s.userStyle) as StyleKey | null;
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const navigate = useNavigate();

  const { spots, restaurants, cafes } = useMemo(
    () => classifyFavorites(favorites),
    [favorites],
  );

  const [tab, setTab] = useState<"list" | "course">("course");
  const [seed, setSeed] = useState(0);

  // Editable local state
  const [editableCourse, setEditableCourse] = useState<EditableTimelineEntry[]>([]);

  // Sync with auto-generated course if favorites change or seed changes
  useEffect(() => {
    if (favorites.length > 0) {
      const generated = generateCourse(favorites) as EditableTimelineEntry[];
      setEditableCourse(generated);
    } else {
      setEditableCourse([]);
    }
  }, [favorites, seed]);

  const totalKm = useMemo(() => totalRouteKm(editableCourse), [editableCourse]);

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 text-7xl">🗺️</div>
        <h1 className="text-2xl font-bold text-foreground">{t("myCourse.title")}</h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          {t("myCourse.empty.message")}
        </p>
        <Button asChild className="mt-6">
          <Link to="/spots">{t("myCourse.empty.cta")}</Link>
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    const lines = editableCourse
      .map((e, i) => `${i + 1}. ${e.time} ${e.item.name[lang] ?? e.item.name["en"]}`)
      .join("\n");
    const text = `${t("myCourse.share.header")}\n${lines}\n${window.location.origin}/my-course`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* fallthrough */
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
              to="/style-test"
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
            if (kind === "spot") navigate({ to: "/spots/$id", params: { id } });
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-1">
                <Share2 className="h-4 w-4" /> {t("myCourse.actions.share")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px] overflow-hidden p-0 sm:rounded-3xl">
              <ShareLayout course={editableCourse} lang={lang} />
            </DialogContent>
          </Dialog>
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

/* ---------- List view ---------- */
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

/* ---------- Course view ---------- */
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
  onUpdateMemo: (index: number, val: string) => void;
  onUpdateTravelTime: (index: number, val: number) => void;
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
              ? { to: "/spots/$id", params: { id: item.id } }
              : ({} as Record<string, never>);
          return (
            <li key={`${item.kind}-${item.id}-${i}`} className="relative pb-6 pl-16">
              {/* time column */}
              <div className="absolute left-0 top-0 w-12 text-right">
                <span className="text-xs font-semibold text-foreground">{entry.time}</span>
              </div>
              {/* dot + line */}
              <span
                className="absolute left-[3.25rem] top-1.5 h-3 w-3 rounded-full border-2 border-background"
                style={{ backgroundColor: dotColor(item.kind) }}
              />
              {!isLast && (
                <span className="absolute left-[3.65rem] top-5 bottom-0 w-px bg-border" />
              )}
              {/* card */}
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

                {/* Travel Memo Input */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 px-1 text-[10px] font-medium text-muted-foreground/80">
                    <Pencil className="h-2.5 w-2.5" />
                    {t("myCourse.memo.label")}
                  </div>
                  <Textarea
                    placeholder={t("myCourse.memo.placeholder")}
                    value={entry.memo || ""}
                    onChange={(e) => onUpdateMemo(i, e.target.value)}
                    className="min-h-[40px] resize-none border-none bg-muted/30 text-xs placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                </div>
              </ItemLink>

              {/* travel */}
              {entry.travelToNext && !isLast && (
                <div className="group mt-2">
                  <div className="ml-1 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground transition-colors group-hover:bg-muted">
                      <ModeIcon mode={entry.travelToNext.mode} />
                      <span className="font-medium">
                        {entry.travelToNext.minutes} {t("myCourse.customTravel.unit")}{" "}
                        {t(`myCourse.travel.${entry.travelToNext.mode}`)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Input
                        type="number"
                        min="1"
                        max="300"
                        value={entry.travelToNext.minutes}
                        onChange={(e) => onUpdateTravelTime(i, parseInt(e.target.value) || 1)}
                        className="h-6 w-14 rounded-md border-border/40 bg-background px-1.5 py-0 text-[10px] focus-visible:ring-primary/30"
                      />
                      <Timer className="h-3 w-3 text-muted-foreground/60" />
                    </div>
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

/* ---------- Social Share View (Instagram/Line Style) ---------- */
function ShareLayout({ course, lang }: { course: EditableTimelineEntry[]; lang: LangCode }) {
  const { t } = useTranslation();
  
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-br from-[#003d99] via-[#0077cc] to-[#33ccff] p-6 text-white shadow-2xl">
      {/* Decorative Blur Spheres */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 space-y-2 pt-8 text-center">
        <div className="mx-auto w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
          Personal Trip
        </div>
        <h2 className="text-3xl font-black tracking-tight drop-shadow-lg">
          {t("myCourse.share.layoutTitle")}
        </h2>
        <div className="flex items-center justify-center gap-2 text-[10px] font-medium opacity-80">
          <span>{new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US")}</span>
          <span>•</span>
          <span>{course.length} Spots</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 mt-10 h-[65%] overflow-hidden">
        <div className="absolute left-[2.25rem] top-4 bottom-4 w-px bg-white/30" />
        
        <div className="space-y-6">
          {course.slice(0, 5).map((entry, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="relative flex-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[10px] font-bold backdrop-blur-md border border-white/20">
                  {entry.time}
                </div>
              </div>
              
              <div className="flex-1 space-y-1 pt-1">
                <h3 className="line-clamp-1 text-sm font-bold tracking-tight">
                  {entry.item.name[lang] ?? entry.item.name["en"]}
                </h3>
                <div className="flex items-center gap-1 text-[9px] font-medium opacity-70">
                  <span className="rounded-sm bg-white/20 px-1 py-0.5">
                    {t(`myCourse.kinds.${entry.item.kind}`)}
                  </span>
                  {entry.memo && (
                    <span className="line-clamp-1 italic italic-medium">— {entry.memo}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {course.length > 5 && (
            <div className="pl-16 text-[10px] font-medium opacity-60">
              + {course.length - 5} more places...
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 w-full px-6">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-px w-20 bg-white/30" />
          <p className="text-[10px] font-bold leading-none tracking-widest opacity-80">
            {t("common.appName")}
          </p>
          <div className="flex gap-4 opacity-50">
            <Instagram className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
        <p className="rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-black shadow-lg">
          📸 Screenshot to share!
        </p>
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
