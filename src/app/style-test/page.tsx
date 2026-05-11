"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, RefreshCw, Share2, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/stores/useAppStore";
import {
  QUIZ_QUESTIONS,
  STYLE_META,
  computeResult,
  type StyleKey,
} from "@/data/quiz";
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

    const courseItems: any[] = [];
    if (meta.recommendedSpots[0]) {
      courseItems.push({ type: 'spot', id: meta.recommendedSpots[0], data: spotsData.find(s => s.id === meta.recommendedSpots[0]) });
    }
    if (meta.recommendedRestaurants[0]) {
      courseItems.push({ type: 'restaurant', id: meta.recommendedRestaurants[0], data: restaurantsData.find(s => s.id === meta.recommendedRestaurants[0]) });
    }
    if (meta.recommendedCafes[0]) {
      courseItems.push({ type: 'cafe', id: meta.recommendedCafes[0], data: cafesData.find(s => s.id === meta.recommendedCafes[0]) });
    }
    if (meta.recommendedSpots[1]) {
      courseItems.push({ type: 'spot', id: meta.recommendedSpots[1], data: spotsData.find(s => s.id === meta.recommendedSpots[1]) });
    }

    const handleStartCourse = (e: React.MouseEvent) => {
      e.preventDefault();
      const allIds = courseItems.map(item => item.id);
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
        } catch {
        }
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

    return (
      <div className="py-6 animate-fade-up">
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${meta.colorVar}, color-mix(in oklab, ${meta.colorVar} 60%, white))`,
          }}
        >
          <p className="text-sm font-medium text-foreground/80">
            {t("quiz.result.yourStyle")}
          </p>
          <div className="mt-3 text-7xl animate-fade-up">{meta.icon}</div>
          <h2 className="mt-3 text-3xl font-bold text-foreground">{typeName}</h2>
          <p className="mt-2 text-sm text-foreground/80">{typeTagline}</p>
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-lg font-semibold text-foreground">
            {t("quiz.result.recommendedTitle")}
          </h3>
          <div className="relative space-y-3 py-2 before:absolute before:inset-y-0 before:left-8 before:w-0.5 before:bg-border/50">
            {courseItems.map((item, i) => {
              if (!item.data) return null;
              const typeIcon = item.type === 'spot' ? '📸' : item.type === 'restaurant' ? '🍜' : '☕';
              return (
                <div
                  key={item.id}
                  className="relative ml-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm transition active:scale-[0.99] animate-slide-in"
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
                      {item.type === 'spot'
                        ? `🎬 ${((item.data as any).drama || []).map((d: any) => d[lang] || d.ko).join(", ")}`
                        : (item.data as any).signature?.[lang] || (item.data as any).signature?.['ko'] || ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.98]"
          onClick={handleStartCourse}
        >
          이 코스 그대로 내 여행 시작하기 ✨
        </button>

        <a
          href={`/spots?style=${result}`}
          className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl bg-secondary text-base font-semibold text-secondary-foreground transition active:scale-[0.98]"
          onClick={(e) => {
            e.preventDefault();
            router.push(`/spots?style=${result}`);
          }}
        >
          {t("quiz.result.seeAll")} →
        </a>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline" className="h-12 rounded-xl" onClick={shareToLine}>
            <Share2 className="size-4" />
            <span className="sr-only sm:not-sr-only sm:text-xs">LINE</span>
          </Button>
          <Button variant="outline" className="h-12 rounded-xl" onClick={shareToIG}>
            <Share2 className="size-4" />
            <span className="sr-only sm:not-sr-only sm:text-xs">IG</span>
          </Button>
          <Button variant="outline" className="h-12 rounded-xl" onClick={copyLink}>
            <Link2 className="size-4" />
            <span className="sr-only sm:not-sr-only sm:text-xs">URL</span>
          </Button>
        </div>
        {copied && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("common.copied")}
          </p>
        )}

        <button
          onClick={reset}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="size-4" />
          {t("common.retake")}
        </button>
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
