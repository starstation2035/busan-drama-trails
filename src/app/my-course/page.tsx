"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  ChevronUp,
  ChevronDown,
  Bus,
  Menu,
  FolderOpen,
  Utensils,
  Coffee,
  Timer,
  Pencil,
} from "lucide-react";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

  const [editableCourse, setEditableCourse] = useState<EditableTimelineEntry[]>([]);
  const skipRegenRef = useRef(false);

  useEffect(() => {
    if (skipRegenRef.current) {
      skipRegenRef.current = false;
      return;
    }
    if (favorites.length > 0) {
      const generated = generateCourse(favorites) as EditableTimelineEntry[];
      setEditableCourse(generated);
    } else {
      setEditableCourse([]);
    }
  }, [favorites, seed]);

  const totalKm = useMemo(() => totalRouteKm(editableCourse), [editableCourse]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="mb-6 text-7xl drop-shadow-xl animate-bounce-slow">🗺️</div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">{t("myCourse.title")}</h1>
        <p className="mt-3 max-w-xs text-sm font-medium text-muted-foreground/80 leading-relaxed">
          {t("myCourse.empty.message")}
        </p>
        <Button asChild className="mt-8 h-12 rounded-full px-8 font-bold shadow-lg hover:shadow-xl transition-all">
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

  const onUpdateMemo = (idx: number, val: string) => {
    skipRegenRef.current = true;
    setEditableCourse(cur => courseService.updateMemo(cur, idx, val));
  };

  const onUpdateTravelTime = (idx: number, val: number) => {
    skipRegenRef.current = true;
    setEditableCourse(cur => courseService.updateTravelTime(cur, idx, val));
  };

  const onUpdateTravelMode = (idx: number, mode: "walk" | "taxi" | "subway" | "bus") => {
    skipRegenRef.current = true;
    setEditableCourse(cur => courseService.updateTravelMode(cur, idx, mode));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tight">{t("myCourse.title")}</h1>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Live Preview
          </div>
        </div>
      </header>

      {/* Stats Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-5 shadow-sm animate-fade-up">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <MapPinIcon className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("myCourse.groups.spots")}</p>
            <p className="text-lg font-black">{spots.length}</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Utensils className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("myCourse.groups.restaurants")}</p>
            <p className="text-lg font-black">{restaurants.length}</p>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Coffee className="size-5" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("myCourse.groups.cafes")}</p>
            <p className="text-lg font-black">{cafes.length}</p>
          </div>
        </div>
      </div>

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
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => setTab("course")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "course" ? "bg-background text-foreground shadow-md scale-[1.02]" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shuffle className="size-3.5" />
          {t("myCourse.tabs.course")}
        </button>
        <button
          type="button"
          onClick={() => setTab("list")}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "list" ? "bg-background text-foreground shadow-md scale-[1.02]" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderOpen className="size-3.5" />
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
              <p className="text-white/80 text-xs leading-relaxed max-w-[80%] font-medium">
                동선을 고려하여 가장 효율적인 방문 순서를 계산했습니다. {totalKm.toFixed(1)}km의 여정을 지금 확인해보세요!
              </p>
            </div>
          </div>

          <CourseView
            course={editableCourse}
            totalKm={totalKm}
            lang={lang}
            onUpdateMemo={onUpdateMemo}
            onUpdateTravelTime={onUpdateTravelTime}
            onUpdateTravelMode={onUpdateTravelMode}
          />
        </div>
      )}

      {/* Bottom action bar */}
      <div className="sticky bottom-20 z-10 flex gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl md:bottom-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="default" className="flex-1 h-12 gap-2 rounded-xl font-bold shadow-md active:scale-95 transition-transform">
              <Share2 className="h-4 w-4" /> {t("myCourse.actions.share")}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[32px] p-0 overflow-hidden">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-center font-black tracking-tight">{t("myCourse.actions.share")}</SheetTitle>
            </SheetHeader>
            <div className="h-full overflow-y-auto p-6 pb-20">
              <div className="mx-auto max-w-sm space-y-6">
                <ShareLayout course={editableCourse} lang={lang} />
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleShare} variant="outline" className="h-12 gap-2 rounded-xl border-border/60 font-bold">
                    <MessageCircle className="size-4" /> LINE
                  </Button>
                  <Button onClick={handleCopy} variant="outline" className="h-12 gap-2 rounded-xl border-border/60 font-bold">
                    <Instagram className="size-4" /> Instagram
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Button variant="outline" onClick={() => setSeed((s) => s + 1)} className="h-12 w-12 rounded-xl border-border/60 shadow-sm active:rotate-180 transition-all duration-500">
          <Shuffle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info(t("myCourse.actions.exportSoon"))}
          className="h-12 w-12 rounded-xl border-border/60 shadow-sm"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <button onClick={handleCopy} className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-4 decoration-primary/30">
          {t("myCourse.actions.copyLink")}
        </button>
      </div>
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
    { key: "spots", label: t("myCourse.groups.spots"), items: spots, icon: MapPinIcon, color: "text-primary bg-primary/10" },
    { key: "restaurants", label: t("myCourse.groups.restaurants"), items: restaurants, icon: Utensils, color: "text-amber-500 bg-amber-500/10" },
    { key: "cafes", label: t("myCourse.groups.cafes"), items: cafes, icon: Coffee, color: "text-emerald-500 bg-emerald-500/10" },
  ] as const;

  return (
    <Accordion type="multiple" defaultValue={["spots"]} className="space-y-4">
      {groups.map((g) =>
        g.items.length ? (
          <AccordionItem key={g.key} value={g.key} className="border-none">
            <AccordionTrigger className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className={`grid size-8 place-items-center rounded-xl ${g.color}`}>
                  <g.icon className="size-4" />
                </div>
                <span className="text-sm font-black tracking-tight">{g.label}</span>
                <span className="text-[10px] font-bold text-muted-foreground/60">({g.items.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <ul className="space-y-3">
                {g.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-2 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(it.id, it.kind)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <img
                        src={it.thumbnail}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover shadow-sm"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-bold tracking-tight text-foreground">
                          {it.name[lang] ?? it.name["en"]}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground">{it.region}</span>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(it.id)}
                      className="size-10 rounded-xl text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
                      aria-label="remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ) : null,
      )}
    </Accordion>
  );
}

function CourseView({
  course,
  totalKm,
  lang,
  onUpdateMemo,
  onUpdateTravelTime,
  onUpdateTravelMode,
}: {
  course: EditableTimelineEntry[];
  totalKm: number;
  lang: LangCode;
  onUpdateMemo: (idx: number, val: string) => void;
  onUpdateTravelTime: (idx: number, val: number) => void;
  onUpdateTravelMode: (idx: number, mode: "walk" | "taxi" | "subway" | "bus") => void;
}) {
  const { t } = useTranslation();

  if (course.length === 0) return null;

  if (course.length === 1) {
    const e = course[0];
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm animate-fade-up">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t("myCourse.single.label")}</p>
        <h3 className="mt-2 text-xl font-black text-foreground tracking-tight">
          {e.item.name[lang] ?? e.item.name["en"]}
        </h3>
        <p className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground/80">{t("myCourse.single.hint")}</p>
      </div>
    );
  }

  const tooFar = totalKm > 30;

  return (
    <div className="space-y-4">
      {tooFar && (
        <div className="flex items-start gap-3 rounded-2xl border border-yellow-300/40 bg-yellow-50/50 p-4 text-xs font-medium text-yellow-800 animate-in slide-in-from-top-4 duration-500">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
          <span className="leading-relaxed">{t("myCourse.warnings.tooFar", { km: totalKm.toFixed(1) })}</span>
        </div>
      )}

      <ol className="relative ml-2">
        <div className="absolute left-[3.2rem] top-3 bottom-10 w-0.5 bg-gradient-to-b from-primary via-muted to-muted opacity-20" />
        
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
            <li key={`${item.kind}-${item.id}-${i}`} className="relative pb-10 pl-16">
              <div className="absolute left-0 top-1 w-12 text-right">
                <span className="text-xs font-black text-foreground tabular-nums tracking-tight">{entry.time}</span>
              </div>
              
              <div 
                className="absolute left-[2.9rem] top-1.5 z-10 grid size-3 place-items-center rounded-full border-2 border-background ring-2 shadow-sm"
                style={{ backgroundColor: dotColor(item.kind), ringColor: `${dotColor(item.kind)}20` as any }}
              />

              <div className="relative group">
                <ItemLink
                  {...linkProps}
                  className="block rounded-3xl border border-border/40 bg-card p-4 shadow-sm transition-all hover:shadow-lg active:scale-[0.99] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-16 w-16 rounded-2xl object-cover shadow-sm ring-1 ring-border/10"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                          {kindLabel(item.kind, t)}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
                          <Clock className="h-2.5 w-2.5" />
                          {entry.durationMin}m
                        </div>
                      </div>
                      <h4 className="line-clamp-1 text-base font-black tracking-tight text-foreground">
                        {name}
                      </h4>
                    </div>
                  </div>

                  {/* Travel Memo Input */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 px-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <Pencil className="h-2.5 w-2.5" />
                      {t("myCourse.memo.label")}
                    </div>
                    <Textarea
                      placeholder={t("myCourse.memo.placeholder")}
                      value={entry.memo || ""}
                      onChange={(e) => onUpdateMemo(i, e.target.value)}
                      className="min-h-[44px] rounded-xl border-none bg-muted/40 text-[11px] font-medium placeholder:text-muted-foreground/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                  </div>
                </ItemLink>
              </div>

              {/* Travel mode & time */}
              {entry.travelToNext && !isLast && (
                <div className="mt-4 ml-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {(["walk", "taxi", "bus", "subway"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => onUpdateTravelMode(i, m)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition-all ${
                          entry.travelToNext?.mode === m
                            ? "bg-primary text-white shadow-md ring-2 ring-primary/20 scale-105"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <ModeIcon mode={m} />
                        <span className="uppercase">{t(`myCourse.travel.${m}`)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full bg-muted/40 px-3 py-1 text-[10px] font-bold text-muted-foreground/80">
                      <span>
                        {entry.travelToNext.minutes} {t("myCourse.customTravel.unit")}
                      </span>
                      <span className="opacity-30">•</span>
                      <span>{entry.travelToNext.km.toFixed(1)} km</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-20 hover:opacity-100 transition-opacity">
                      <Input
                        type="number"
                        min="1"
                        max="300"
                        value={entry.travelToNext.minutes}
                        onChange={(e) => onUpdateTravelTime(i, parseInt(e.target.value) || 1)}
                        className="h-6 w-14 rounded-lg border-border/40 bg-background px-1.5 text-center text-[10px] font-black focus-visible:ring-primary/30"
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

      <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
        <span className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
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
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003d99] via-[#0077cc] to-[#33ccff] p-8 text-white shadow-2xl">
      {/* Decorative Blur Spheres */}
      <div className="absolute -top-10 -right-10 h-60 w-60 rounded-full bg-white/10 blur-[80px]" />
      <div className="absolute top-1/2 -left-20 h-80 w-80 rounded-full bg-blue-400/20 blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 space-y-3 pt-4 text-center">
        <div className="mx-auto w-fit rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10">
          Personal Trip
        </div>
        <h2 className="text-4xl font-black tracking-tighter drop-shadow-2xl">
          {t("myCourse.share.layoutTitle")}
        </h2>
        <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-60">
          <span>{new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US")}</span>
          <span className="size-1 rounded-full bg-white/40" />
          <span>{course.length} Spots</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 mt-12 h-[60%] overflow-hidden">
        <div className="absolute left-[2.25rem] top-6 bottom-6 w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
        
        <div className="space-y-8">
          {course.slice(0, 5).map((entry, idx) => (
            <div key={idx} className="flex gap-5 animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="relative flex-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/15 text-[11px] font-black backdrop-blur-xl border border-white/20 shadow-xl tabular-nums">
                  {entry.time}
                </div>
              </div>
              
              <div className="flex-1 space-y-1.5 pt-1">
                <h3 className="line-clamp-1 text-base font-black tracking-tight leading-none">
                  {entry.item.name[lang] ?? entry.item.name["en"]}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-bold opacity-60 uppercase tracking-wider">
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px]">
                    {t(`myCourse.kinds.${entry.item.kind}`)}
                  </span>
                  {entry.memo && (
                    <span className="line-clamp-1 italic">— {entry.memo}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {course.length > 5 && (
            <div className="pl-[4.25rem] text-[10px] font-black uppercase tracking-[0.2em] opacity-40 animate-pulse">
              + {course.length - 5} more places
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 left-0 w-full px-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-px w-16 bg-white/20" />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">
            {t("common.appName")}
          </p>
          <div className="flex gap-6 opacity-40">
            <Instagram className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100 backdrop-blur-sm cursor-pointer">
        <p className="rounded-2xl bg-white px-6 py-3 text-xs font-black text-black shadow-2xl uppercase tracking-widest scale-90 hover:scale-100 transition-transform">
          📸 Screenshot to share!
        </p>
      </div>
    </div>
  );
}

function dotColor(kind: "spot" | "restaurant" | "cafe"): string {
  if (kind === "spot") return "hsl(var(--primary))";
  if (kind === "restaurant") return "#f59e0b"; // amber-500
  return "#10b981"; // emerald-500
}

function kindLabel(kind: "spot" | "restaurant" | "cafe", t: (k: string) => string): string {
  return t(`myCourse.kinds.${kind}`);
}

function ModeIcon({ mode }: { mode: "walk" | "taxi" | "subway" | "bus" }) {
  if (mode === "walk") return <Footprints className="h-3.5 w-3.5" />;
  if (mode === "taxi") return <Car className="h-3.5 w-3.5" />;
  if (mode === "bus") return <Bus className="h-3.5 w-3.5" />;
  return <TrainFront className="h-3.5 w-3.5" />;
}
