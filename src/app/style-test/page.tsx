"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, RefreshCw, Share2, Link2, Sparkles, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppStore } from "@/stores/useAppStore";
import { QUIZ_QUESTIONS, STYLE_META, computeResult, type StyleKey } from "@/data/quiz";
import spotsData from "@/data/spots.json";
import restaurantsData from "@/data/restaurants.json";
import cafesData from "@/data/cafes.json";

type Phase = "intro" | "quiz" | "result";

interface Spot {
  id: string;
  name: Record<string, string>;
  drama: string[];
  thumbnail: string;
}

export default function StyleTest() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const setUserStyle = useAppStore((s) => s.setUserStyle);

  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StyleKey[]>([]);
  const [copied, setCopied] = useState(false);

  // Swap state
  const [swapIndex, setSwapIndex] = useState<number | null>(null);
  const [courseOverrides, setCourseOverrides] = useState<Record<number, string>>({});

  const total = QUIZ_QUESTIONS.length;
  const result = useMemo<StyleKey | null>(
    () => (phase === "result" ? computeResult(answers) : null),
    [phase, answers],
  );

  const lang = i18n.language;
  const localizedName = (spot: Spot) =>
    spot.name[lang] ?? spot.name["ko"] ?? Object.values(spot.name)[0];

  const handleAnswer = (style: StyleKey) => {
    const next = [...answers.slice(0, step), style];
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setUserStyle(style);
      const final = computeResult(next);
      setUserStyle(final);
      setPhase("result");
    }
  };

  const handleBack = () => {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep(step - 1);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
    setCourseOverrides({});
    setPhase("intro");
  };

  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center py-8 text-center animate-fade-up">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-foreground">
          <Sparkles className="size-3.5" />
          {t("quiz.intro.badge")}
        </div>
        <div className="mb-6 text-7xl">✨🌊🎬📸</div>
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          {t("quiz.intro.title")}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{t("quiz.intro.subtitle")}</p>
        <Button
          size="lg"
          className="mt-8 h-14 w-full rounded-2xl text-base font-semibold shadow-lg active:scale-[0.98]"
          onClick={() => {
            setPhase("quiz");
            setStep(0);
            setAnswers([]);
          }}
        >
          {t("quiz.intro.start")}
        </Button>
      </div>
    );
  }

  if (phase === "result" && result) {
    const meta = STYLE_META[result];
    const typeName = t(`quiz.types.${result}.name`);
    const typeTagline = t(`quiz.types.${result}.tagline`);

    // Build default course items
    const defaultCourseItems: { type: "spot" | "restaurant" | "cafe"; id: string }[] = [];
    if (meta.recommendedSpots[0]) defaultCourseItems.push({ type: "spot", id: meta.recommendedSpots[0] });
    if (meta.recommendedRestaurants[0]) defaultCourseItems.push({ type: "restaurant", id: meta.recommendedRestaurants[0] });
    if (meta.recommendedCafes[0]) defaultCourseItems.push({ type: "cafe", id: meta.recommendedCafes[0] });
    if (meta.recommendedSpots[1]) defaultCourseItems.push({ type: "spot", id: meta.recommendedSpots[1] });

    // Apply overrides
    const courseItems = defaultCourseItems.map((item, idx) => {
      const overrideId = courseOverrides[idx];
      const actualId = overrideId || item.id;
      const dataSource = item.type === "spot" ? spotsData : item.type === "restaurant" ? restaurantsData : cafesData;
      return {
        type: item.type,
        id: actualId,
        data: dataSource.find((s: any) => s.id === actualId),
      };
    });

    // Get all candidates for a given type (exclude already selected)
    const getCandidates = (type: "spot" | "restaurant" | "cafe") => {
      const source = type === "spot" ? spotsData : type === "restaurant" ? restaurantsData : cafesData;
      const usedIds = courseItems.map((c) => c.id);
      return source.filter((s: any) => !usedIds.includes(s.id));
    };

    const handleSwap = (newId: string) => {
      if (swapIndex === null) return;
      setCourseOverrides((prev) => ({ ...prev, [swapIndex]: newId }));
      setSwapIndex(null);
    };

    const handleStartCourse = (e: React.MouseEvent) => {
      e.preventDefault();
      const allIds = courseItems.map((item) => item.id);
      useAppStore.getState().setFavorites(allIds);
      router.push("/my-course");
    };

    const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareText = t("quiz.result.shareText", { type: typeName, icon: meta.icon });

    const shareToLine = () => {
      const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        shareUrl,
      )}&text=${encodeURIComponent(shareText)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareToIG = async () => {
      const text = `${shareText} ${shareUrl}`;
      if (navigator.share) {
        try {
          await navigator.share({ text, url: shareUrl });
          return;
        } catch {}
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    const copyLink = async () => {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    // Current swap item info
    const swapType = swapIndex !== null ? defaultCourseItems[swapIndex]?.type : null;
    const swapCandidates = swapType ? getCandidates(swapType) : [];

    return (
      <div className="py-6 animate-fade-up">
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${meta.colorVar}, color-mix(in oklab, ${meta.colorVar} 60%, white))`,
          }}
        >
          <p className="text-sm font-medium text-foreground/80">{t("quiz.result.yourStyle")}</p>
          <div className="mt-3 text-7xl animate-fade-up">{meta.icon}</div>
          <h2 className="mt-3 text-3xl font-bold text-foreground">{typeName}</h2>
          <p className="mt-2 text-sm text-foreground/80">{typeTagline}</p>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {t("quiz.result.recommendedTitle")}
            </h3>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Repeat2 className="size-3.5" /> {t("quiz.result.clickToChange", "클릭하여 변경")}
            </span>
          </div>
          <div className="relative space-y-3 py-2 before:absolute before:inset-y-0 before:left-8 before:w-0.5 before:bg-border/50">
            {courseItems.map((item, i) => {
              if (!item.data) return null;
              const typeIcon =
                item.type === "spot" ? "📸" : item.type === "restaurant" ? "🍜" : "☕";
              const isOverridden = !!courseOverrides[i];
              return (
                <div
                  key={`${item.id}-${i}`}
                  onClick={() => setSwapIndex(i)}
                  className={`relative ml-4 flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-sm transition cursor-pointer active:scale-[0.99] animate-slide-in group ${isOverridden ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute -left-[21px] top-1/2 z-10 -translate-y-1/2 rounded-full border-2 border-primary bg-primary/20 p-1 ring-4 ring-background" />
                  <img
                    src={item.data.thumbnail}
                    alt={localizedName(item.data as Spot)}
                    className="size-16 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      <span className="mr-1">{typeIcon}</span>
                      {localizedName(item.data as Spot)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.type === "spot"
                        ? `🎬 ${((item.data as any).drama || []).map((d: any) => d[lang] || d.ko).join(", ")}`
                        : (item.data as any).signature?.[lang] ||
                          (item.data as any).signature?.["ko"] ||
                          ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors">
                    <Repeat2 className="size-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Swap Sheet */}
        <Sheet open={swapIndex !== null} onOpenChange={(open) => !open && setSwapIndex(null)}>
          <SheetContent side="bottom" className="h-[70vh] w-full max-w-md mx-auto rounded-t-[32px] p-0 flex flex-col bg-background">
            <SheetHeader className="p-6 pb-4 border-b shrink-0">
              <SheetTitle className="text-lg font-black">
                {swapType === "spot" ? "📸 촬영지" : swapType === "restaurant" ? "🍜 맛집" : "☕ 카페"} 변경하기
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
              {swapCandidates.map((candidate: any) => (
                <button
                  key={candidate.id}
                  onClick={() => handleSwap(candidate.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
                >
                  <img
                    src={candidate.thumbnail}
                    alt={localizedName(candidate as Spot)}
                    className="size-14 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">
                      {localizedName(candidate as Spot)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {swapType === "spot"
                        ? `🎬 ${(candidate.drama || []).map((d: any) => d[lang] || d.ko).join(", ")}`
                        : candidate.signature?.[lang] || candidate.signature?.["ko"] || ""}
                    </p>
                  </div>
                </button>
              ))}
              {swapCandidates.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  변경할 수 있는 항목이 없습니다.
                </p>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="mt-8 flex flex-row gap-2 w-full">
          <button
            className="flex flex-1 h-14 items-center justify-center rounded-2xl border-2 border-primary bg-background text-[11px] sm:text-sm font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-lg active:scale-[0.98] px-1"
            onClick={handleStartCourse}
          >
            {t("quiz.result.startTrip", "여행 시작하기 ✨")}
          </button>

          <a
            href={`/spots?style=${result}`}
            className="flex flex-1 h-14 items-center justify-center rounded-2xl border-2 border-indigo-500 bg-background text-[11px] sm:text-sm font-bold text-indigo-500 transition-all hover:bg-indigo-500 hover:text-white hover:shadow-lg active:scale-[0.98] px-1"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/spots?style=${result}`);
            }}
          >
            {t("quiz.result.viewAllSpots", "모두 보기 →")}
          </a>

          <button
            onClick={reset}
            className="flex flex-1 h-14 items-center justify-center gap-1 rounded-2xl border-2 border-slate-400 bg-background text-[11px] sm:text-sm font-bold text-slate-500 transition-all hover:bg-slate-500 hover:text-white hover:shadow-lg active:scale-[0.98] px-1"
          >
            <RefreshCw className="size-3 sm:size-4" />
            {t("common.retake")}
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / total) * 100;

  return (
    <div className="py-4">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleBack}
          aria-label={t("common.back")}
          className="-ml-2 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <Progress value={progress} className="h-1.5" />
        </div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {t("quiz.progress", { current: step + 1, total })}
        </span>
      </div>

      <div key={q.id} className="animate-slide-in">
        <h2 className="mb-8 text-balance text-2xl font-bold leading-snug text-foreground">
          {t(`quiz.questions.${q.id}.title`)}
        </h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const label = t(`quiz.questions.${q.id}.${i === 0 ? "a" : "b"}`);
            return (
              <button
                key={opt.key}
                onClick={() => handleAnswer(opt.style)}
                className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left shadow-sm transition hover:border-primary hover:bg-primary/5 active:scale-[0.99]"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-muted text-3xl transition group-hover:bg-primary/10">
                  {opt.icon}
                </span>
                <span className="text-base font-medium text-foreground">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
