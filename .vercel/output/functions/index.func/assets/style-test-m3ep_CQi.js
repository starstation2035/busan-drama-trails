import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Sparkles, Share2, Link2, RefreshCw, ArrowLeft } from "lucide-react";
import { c as cn, B as Button } from "./button-Cz8PAkJh.js";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { u as useAppStore, s as spotsRaw } from "./router-JD4VdYii.js";
import { c as computeResult, S as STYLE_META, Q as QUIZ_QUESTIONS } from "./quiz-DHfDudtW.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "i18next";
import "sonner";
import "zod";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
function StyleTest() {
  const {
    t,
    i18n
  } = useTranslation();
  const navigate = useNavigate();
  const setUserStyle = useAppStore((s) => s.setUserStyle);
  const [phase, setPhase] = useState("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [copied, setCopied] = useState(false);
  const total = QUIZ_QUESTIONS.length;
  const result = useMemo(() => phase === "result" ? computeResult(answers) : null, [phase, answers]);
  const lang = i18n.language;
  const localizedName = (spot) => spot.name[lang] ?? spot.name["ko"] ?? Object.values(spot.name)[0];
  const handleAnswer = (style) => {
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
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-md flex-col items-center py-8 text-center animate-fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent/40 px-3 py-1 text-xs font-medium text-foreground", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5" }),
        t("quiz.intro.badge")
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 text-7xl", children: "✨🌊🎬📸" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold leading-tight text-foreground", children: t("quiz.intro.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-muted-foreground", children: t("quiz.intro.subtitle") }),
      /* @__PURE__ */ jsx(Button, { size: "lg", className: "mt-8 h-14 w-full rounded-2xl text-base font-semibold shadow-lg active:scale-[0.98]", onClick: () => {
        setPhase("quiz");
        setStep(0);
        setAnswers([]);
      }, children: t("quiz.intro.start") })
    ] });
  }
  if (phase === "result" && result) {
    const meta = STYLE_META[result];
    const typeName = t(`quiz.types.${result}.name`);
    const typeTagline = t(`quiz.types.${result}.tagline`);
    const recSpots = meta.recommendedSpotIds.map((id) => spotsRaw.find((s) => s.id === id)).filter((s) => Boolean(s));
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
    const shareText = t("quiz.result.shareText", {
      type: typeName,
      icon: meta.icon
    });
    const shareToLine = () => {
      const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    };
    const shareToIG = async () => {
      const text = `${shareText} ${shareUrl}`;
      if (navigator.share) {
        try {
          await navigator.share({
            text,
            url: shareUrl
          });
          return;
        } catch {
        }
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    };
    const copyLink = async () => {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    };
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md py-6 animate-fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl p-8 text-center shadow-xl", style: {
        background: `linear-gradient(135deg, ${meta.colorVar}, color-mix(in oklab, ${meta.colorVar} 60%, white))`
      }, children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground/80", children: t("quiz.result.yourStyle") }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 text-7xl animate-fade-up", children: meta.icon }),
        /* @__PURE__ */ jsx("h2", { className: "mt-3 text-3xl font-bold text-foreground", children: typeName }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-foreground/80", children: typeTagline })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold text-foreground", children: t("quiz.result.recommendedTitle") }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recSpots.map((spot, i) => /* @__PURE__ */ jsxs("a", { href: `/spots/${spot.id}`, className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition active:scale-[0.99] animate-slide-in", style: {
          animationDelay: `${i * 80}ms`
        }, children: [
          /* @__PURE__ */ jsx("img", { src: spot.thumbnail, alt: localizedName(spot), className: "size-16 shrink-0 rounded-xl object-cover", loading: "lazy" }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate font-semibold text-foreground", children: localizedName(spot) }),
            /* @__PURE__ */ jsxs("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: [
              "🎬 ",
              spot.drama.join(", ")
            ] })
          ] })
        ] }, spot.id)) })
      ] }),
      /* @__PURE__ */ jsxs("a", { href: `/spots?style=${result}`, className: "mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg transition active:scale-[0.98]", onClick: (e) => {
        e.preventDefault();
        void navigate({
          to: "/spots",
          search: {
            style: result
          }
        });
      }, children: [
        t("quiz.result.seeAll"),
        " →"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "h-12 rounded-xl", onClick: shareToLine, children: [
          /* @__PURE__ */ jsx(Share2, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:text-xs", children: "LINE" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "h-12 rounded-xl", onClick: shareToIG, children: [
          /* @__PURE__ */ jsx(Share2, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:text-xs", children: "IG" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "h-12 rounded-xl", onClick: copyLink, children: [
          /* @__PURE__ */ jsx(Link2, { className: "size-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only sm:text-xs", children: "URL" })
        ] })
      ] }),
      copied && /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: t("common.copied") }),
      /* @__PURE__ */ jsxs("button", { onClick: reset, className: "mt-6 flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
        t("common.retake")
      ] })
    ] });
  }
  const q = QUIZ_QUESTIONS[step];
  const progress = (step + 1) / total * 100;
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-md py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("button", { onClick: handleBack, "aria-label": t("common.back"), className: "-ml-2 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-5" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(Progress, { value: progress, className: "h-1.5" }) }),
      /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs font-medium tabular-nums text-muted-foreground", children: t("quiz.progress", {
        current: step + 1,
        total
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "animate-slide-in", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-8 text-balance text-2xl font-bold leading-snug text-foreground", children: t(`quiz.questions.${q.id}.title`) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: q.options.map((opt, i) => {
        const label = t(`quiz.questions.${q.id}.${i === 0 ? "a" : "b"}`);
        return /* @__PURE__ */ jsxs("button", { onClick: () => handleAnswer(opt.style), className: "group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-left shadow-sm transition hover:border-primary hover:bg-primary/5 active:scale-[0.99]", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-14 shrink-0 place-items-center rounded-xl bg-muted text-3xl transition group-hover:bg-primary/10", children: opt.icon }),
          /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-foreground", children: label })
        ] }, opt.key);
      }) })
    ] }, q.id)
  ] });
}
export {
  StyleTest as component
};
