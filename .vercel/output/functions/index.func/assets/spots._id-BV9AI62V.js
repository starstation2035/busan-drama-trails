import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useRouter, useChildMatches, Outlet, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Share2, Heart, MapPin, Copy, Clock, Ticket, Sun, ChevronRight, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { R as Route, u as useAppStore, t as triggerHeartFly } from "./router-JD4VdYii.js";
import { u as useInView } from "./useInView-Dss4a0Ei.js";
import { r as restaurantsRaw, c as cafesRaw } from "./cafes-di2WphnA.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "i18next";
import "zod";
const RESTAURANTS = restaurantsRaw;
const CAFES = cafesRaw;
function pickLang(s, lang) {
  if (!s) return "";
  return s[lang] ?? s.ko ?? s.en ?? Object.values(s)[0] ?? "";
}
function SpotDetail() {
  const {
    t,
    i18n
  } = useTranslation();
  const router = useRouter();
  const childMatches = useChildMatches();
  const {
    spot
  } = Route.useLoaderData();
  const lang = i18n.language || "ko";
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(spot.id);
  const [tipsOpen, setTipsOpen] = useState(false);
  const name = pickLang(spot.name, lang);
  const description = pickLang(spot.description, lang);
  const address = pickLang(spot.address, lang);
  const admission = pickLang(spot.admission, lang);
  const visitTips = pickLang(spot.visit_tips, lang);
  const restaurants = useMemo(() => (spot.nearby_restaurants ?? []).map((id) => RESTAURANTS.find((r) => r.id === id)).filter((r) => Boolean(r)), [spot.nearby_restaurants]);
  const cafes = useMemo(() => (spot.nearby_cafes ?? []).map((id) => CAFES.find((c) => c.id === id)).filter((c) => Boolean(c)), [spot.nearby_cafes]);
  if (childMatches.length > 0) {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else void router.navigate({
      to: "/spots"
    });
  };
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `📍 ${name} · Busan Drama Spot`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text,
          url
        });
        return;
      } catch {
      }
    }
    await navigator.clipboard.writeText(`${text}
${url}`);
    toast.success(t("detail.copied"));
  };
  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success(t("detail.copied"));
  };
  const handleFav = (e) => {
    const wasFav = isFav;
    toggleFavorite(spot.id);
    if (!wasFav) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(t("spots.addedToCourse"), {
        duration: 1500
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "pb-28", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative h-[55vh] min-h-[360px] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx("img", { src: spot.thumbnail, alt: name, className: "absolute inset-0 h-full w-full object-cover", fetchPriority: "high" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-0 top-0 flex items-center justify-between p-4", children: [
        /* @__PURE__ */ jsx("button", { onClick: goBack, "aria-label": t("detail.back"), className: "grid size-10 place-items-center rounded-full bg-white/95 text-foreground shadow-lg backdrop-blur transition active:scale-90", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: handleShare, "aria-label": t("detail.share"), className: "grid size-10 place-items-center rounded-full bg-white/95 text-foreground shadow-lg backdrop-blur transition active:scale-90", children: /* @__PURE__ */ jsx(Share2, { className: "size-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: (e) => handleFav(e), "aria-label": "favorite", className: "grid size-10 place-items-center rounded-full bg-white/95 shadow-lg backdrop-blur transition active:scale-90", children: /* @__PURE__ */ jsx(Heart, { className: `size-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}` }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-5 text-white", children: [
        /* @__PURE__ */ jsxs("p", { className: "mb-1 text-xs font-medium opacity-90", children: [
          "📍 ",
          spot.region
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold leading-tight drop-shadow-md", children: name }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: spot.drama.map((d) => /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur", children: [
          "🎬 ",
          d
        ] }, d)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-screen-md space-y-8 px-4 pt-6", children: [
      /* @__PURE__ */ jsx("section", { className: "rounded-3xl border border-border bg-card p-5 shadow-sm", children: /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm", children: [
        address && /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 size-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("detail.info.address") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: address })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: copyAddress, className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted", "aria-label": t("detail.copy"), children: /* @__PURE__ */ jsx(Copy, { className: "size-4" }) })
        ] }),
        spot.hours && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Clock, { className: "size-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("detail.info.hours") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: spot.hours })
          ] })
        ] }),
        admission && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Ticket, { className: "size-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("detail.info.admission") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: admission })
          ] })
        ] }),
        spot.best_time && /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Sun, { className: "size-4 shrink-0 text-primary" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("detail.info.bestTime") }),
            /* @__PURE__ */ jsx("p", { className: "font-medium text-foreground", children: t(`detail.bestTime.${spot.best_time}`) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-10 md:grid-cols-2 md:items-start", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("div", { className: "inline-block rounded-lg bg-primary/5 px-3 py-1 text-xs font-bold text-primary", children: "ABOUT THE SPOT" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black tracking-tight text-foreground", children: t("detail.description") }),
          /* @__PURE__ */ jsx("p", { className: "whitespace-pre-line text-base leading-relaxed text-muted-foreground/90", children: description })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-3xl bg-muted/30 p-2 border border-border/40", children: /* @__PURE__ */ jsx(MapSection, { coords: spot.coords, name, address, onCopyAddress: copyAddress }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "pt-4", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/spots/$id/nearby", params: {
          id: spot.id
        }, className: "flex items-center justify-center w-full h-16 rounded-3xl text-lg font-bold bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 group no-underline", children: [
          "✨ ",
          name,
          " 근처 맛집 & 카페 탐방하기",
          /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 size-5 transition-transform group-hover:translate-x-1" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/spots/$id/nearby", params: {
          id: spot.id
        }, className: "mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground font-medium hover:text-primary transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            "🍽️ 주변 식당 ",
            restaurants.length,
            "곳"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            "☕ 추천 카페 ",
            cafes.length,
            "곳"
          ] })
        ] })
      ] }),
      spot.photo_tips && spot.photo_tips.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold text-foreground", children: t("detail.photoTips.title") }),
        /* @__PURE__ */ jsx("div", { className: "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: spot.photo_tips.map((tip, i) => /* @__PURE__ */ jsxs("figure", { className: "w-[180px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-sm", children: [
          /* @__PURE__ */ jsx("img", { src: tip.image, alt: "", className: "aspect-[9/16] w-full object-cover", loading: "lazy" }),
          /* @__PURE__ */ jsxs("figcaption", { className: "p-2.5 text-xs leading-snug text-foreground", children: [
            "💡 ",
            pickLang(tip.tip, lang)
          ] })
        ] }, i)) })
      ] }),
      visitTips && /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-accent/40 bg-accent/20 p-4", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setTipsOpen((o) => !o), className: "flex w-full items-center justify-between text-left", "aria-expanded": tipsOpen, children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-foreground", children: t("detail.visitTips.title") }),
          tipsOpen ? /* @__PURE__ */ jsx(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 text-muted-foreground" })
        ] }),
        tipsOpen && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-foreground/80", children: visitTips })
      ] })
    ] })
  ] });
}
function MapSection({
  coords,
  name,
  address,
  onCopyAddress
}) {
  const {
    t
  } = useTranslation();
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.05
  });
  const embed = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=16&output=embed`;
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  const kakao = `https://map.kakao.com/link/map/${encodeURIComponent(name)},${coords.lat},${coords.lng}`;
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold text-foreground", children: t("detail.map.title") }),
    /* @__PURE__ */ jsx("div", { ref, className: "aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-sm", children: inView ? /* @__PURE__ */ jsx("iframe", { src: embed, title: "Map", loading: "lazy", className: "h-full w-full", referrerPolicy: "no-referrer-when-downgrade" }) : /* @__PURE__ */ jsx("div", { className: "grid h-full place-items-center text-muted-foreground", children: /* @__PURE__ */ jsx(MapPin, { className: "size-8 opacity-40" }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, className: "h-11 rounded-xl text-xs", children: /* @__PURE__ */ jsxs("a", { href: gmaps, target: "_blank", rel: "noopener noreferrer", children: [
        /* @__PURE__ */ jsx(ExternalLink, { className: "size-3.5" }),
        t("detail.map.google")
      ] }) }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: onCopyAddress, disabled: !address, className: "h-11 rounded-xl text-xs", children: [
        /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
        t("detail.map.copyAddr")
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, className: "h-11 rounded-xl text-xs", children: /* @__PURE__ */ jsxs("a", { href: kakao, target: "_blank", rel: "noopener noreferrer", children: [
        /* @__PURE__ */ jsx(ExternalLink, { className: "size-3.5" }),
        t("detail.map.kakao")
      ] }) })
    ] })
  ] });
}
export {
  SpotDetail as component
};
