import { jsx, jsxs } from "react/jsx-runtime";
import { useRouter, useChildMatches, Outlet, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Heart, Utensils, Coffee, Star } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { r as restaurantsRaw, c as cafesRaw } from "./cafes-di2WphnA.js";
import { a as Route, u as useAppStore, s as spotsRaw, t as triggerHeartFly } from "./router-JD4VdYii.js";
import { useMemo } from "react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "i18next";
import "zod";
function NearbyDiscovery() {
  const {
    id
  } = Route.useParams();
  const {
    t
  } = useTranslation();
  const router = useRouter();
  const childMatches = useChildMatches();
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const spot = useMemo(() => spotsRaw.find((s) => s.id === id), [id]);
  const nearbyItems = useMemo(() => {
    if (!spot) return [];
    const rIds = spot.nearby_restaurants || [];
    const cIds = spot.nearby_cafes || [];
    const matchedRestaurants = restaurantsRaw.filter((r) => rIds.includes(r.id));
    const matchedCafes = cafesRaw.filter((c) => cIds.includes(c.id));
    return [...matchedRestaurants, ...matchedCafes];
  }, [spot]);
  if (childMatches.length > 0) {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  if (!spot) return /* @__PURE__ */ jsx("div", { children: "Spot not found" });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-10", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => router.history.back(), className: "p-2 rounded-full hover:bg-muted transition-colors", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-lg font-bold", children: [
          spot.name.ko,
          " 주변 탐방"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "size-3" }),
          " 반경 1km 이내 추천"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-8 space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: nearbyItems.map((item, idx) => {
        const isFav = favorites.includes(item.id);
        return /* @__PURE__ */ jsxs(Link, { to: "/spots/$id/nearby/$itemId", params: {
          id: spot.id,
          itemId: item.id
        }, className: "group relative block overflow-hidden rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-xl hover:border-primary/20 no-underline", children: [
          /* @__PURE__ */ jsxs("div", { className: "aspect-[16/9] overflow-hidden relative", children: [
            /* @__PURE__ */ jsx("img", { src: item.thumbnail, alt: item.name.ko, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" }),
            /* @__PURE__ */ jsx("button", { onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              const wasFav = isFav;
              toggleFavorite(item.id);
              if (!wasFav) {
                triggerHeartFly(e.clientX, e.clientY);
                toast.success(`${item.name.ko} ${t("spots.addedToCourse")}`);
              }
            }, className: `absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-90 ${isFav ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "bg-black/20 text-white hover:bg-black/40"}`, children: /* @__PURE__ */ jsx(Heart, { className: `size-5 ${isFav ? "fill-current" : ""}` }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2 text-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                item.id.startsWith("r") ? /* @__PURE__ */ jsx(Utensils, { className: "size-4 text-orange-500" }) : /* @__PURE__ */ jsx(Coffee, { className: "size-4 text-amber-600" }),
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: item.name.ko })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold", children: [
                /* @__PURE__ */ jsx(Star, { className: "size-3 fill-yellow-700" }),
                item.rating || (4.5 + Math.random() * 0.5).toFixed(1)
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 mb-4", children: item.food?.ko || item.vibe?.ko || "부산의 정취가 느껴지는 매력적인 장소입니다." }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border/50", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md", children: [
                "📍 도보 ",
                Math.floor(Math.random() * 10) + 2,
                "분"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors", children: "상세보기 →" })
            ] })
          ] })
        ] }, item.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-primary/5 rounded-3xl p-6 text-center border border-primary/10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "찾으시는 장소가 없나요?" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", className: "rounded-full px-8 border-primary/20 text-primary", children: "더 많은 결과 보기" })
      ] })
    ] })
  ] });
}
export {
  NearbyDiscovery as component
};
