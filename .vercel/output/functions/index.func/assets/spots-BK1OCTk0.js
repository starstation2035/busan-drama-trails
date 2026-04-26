import { jsxs, jsx } from "react/jsx-runtime";
import { Link, useChildMatches, Outlet } from "@tanstack/react-router";
import { Heart, MapPin, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { u as useAppStore, s as spotsRaw } from "./router-JD4VdYii.js";
import "react";
import "zustand";
import "zustand/middleware";
import "i18next";
import "zod";
function SpotCard({ spot }) {
  const { t } = useTranslation();
  const lang = useAppStore((s) => s.lang) ?? "ko";
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(spot.id);
  const name = spot.name[lang] ?? spot.name.ko;
  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFav = isFav;
    toggleFavorite(spot.id);
    if (!wasFav) {
      toast.success(t("spots.addedToCourse"), { duration: 1500 });
    }
  };
  const baseCount = spot.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500 + 100;
  const displayCount = isFav ? baseCount + 1 : baseCount;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/spots/$id",
      params: { id: spot.id },
      className: "group block overflow-hidden rounded-2xl bg-card shadow-sm transition active:scale-[0.98] hover:shadow-xl border border-border/40",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-muted", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: spot.thumbnail,
              alt: name,
              className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleFav,
              className: "absolute right-3 top-3 flex flex-col items-center gap-0.5 rounded-full bg-background/80 px-2 py-1.5 shadow-lg backdrop-blur-md transition active:scale-90 border border-white/20",
              "aria-label": isFav ? "Remove favorite" : "Add favorite",
              children: [
                /* @__PURE__ */ jsx(
                  Heart,
                  {
                    className: `size-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-foreground/70"}`
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/80", children: displayCount })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-3 right-3", children: [
            spot.drama[0] && /* @__PURE__ */ jsxs("span", { className: "inline-block rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground backdrop-blur shadow-sm mb-2", children: [
              "🎬 ",
              spot.drama[0]
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "line-clamp-2 text-base font-bold leading-tight text-white drop-shadow-md", children: name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 bg-card flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "size-3" }),
            " ",
            spot.region
          ] }),
          /* @__PURE__ */ jsx("div", { className: "size-6 rounded-full bg-muted grid place-items-center", children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-3 text-muted-foreground" }) })
        ] })
      ]
    }
  );
}
function SpotsContainer() {
  const childMatches = useChildMatches();
  const {
    t
  } = useTranslation();
  useAppStore((s) => s.lang) ?? "ko";
  if (childMatches.length > 0) {
    return /* @__PURE__ */ jsx(Outlet, {});
  }
  const allSpots = spotsRaw;
  const filmingSites = allSpots.filter((s) => s.category === "drama");
  const landmarks = allSpots.filter((s) => s.category === "landmark");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-20", children: [
    /* @__PURE__ */ jsxs("section", { className: "px-6 pt-12 pb-8 bg-gradient-to-b from-primary/10 to-background", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black mb-3 tracking-tight", children: "Explore Busan" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-base max-w-md", children: "영화 속 그 장면부터 부산의 숨은 명소까지, 당신의 특별한 여정을 시작하세요." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "px-6 mt-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold flex items-center gap-2", children: "🎬 영화 촬영지" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "드라마와 영화 속 감동을 직접 느껴보세요." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4", children: filmingSites.map((spot) => /* @__PURE__ */ jsx(SpotCard, { spot }, spot.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "px-6 mt-16", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold flex items-center gap-2", children: "🌊 부산 명소" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "부산에 왔다면 꼭 가봐야 할 필수 코스입니다." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4", children: landmarks.map((spot) => /* @__PURE__ */ jsx(SpotCard, { spot }, spot.id)) })
    ] })
  ] });
}
export {
  SpotsContainer as component
};
