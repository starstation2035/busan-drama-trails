import { jsx, jsxs } from "react/jsx-runtime";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Heart, Utensils, Coffee, Star, Navigation, Clock, MapPin, Phone, ExternalLink } from "lucide-react";
import { B as Button } from "./button-Cz8PAkJh.js";
import { r as restaurantsRaw, c as cafesRaw } from "./cafes-di2WphnA.js";
import { useMemo } from "react";
import { b as Route, u as useAppStore, t as triggerHeartFly } from "./router-JD4VdYii.js";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "zustand";
import "zustand/middleware";
import "i18next";
import "zod";
function NearbyDetail() {
  const {
    itemId
  } = Route.useParams();
  const {
    t
  } = useTranslation();
  const router = useRouter();
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const item = useMemo(() => {
    const all = [...restaurantsRaw, ...cafesRaw];
    return all.find((i) => i.id === itemId);
  }, [itemId]);
  if (!item) return /* @__PURE__ */ jsx("div", { className: "p-10 text-center", children: "정보를 찾을 수 없습니다." });
  const isFav = favorites.includes(item.id);
  const type = item.id.startsWith("r") ? "restaurant" : "cafe";
  const handleToggle = (e) => {
    const wasFav = isFav;
    toggleFavorite(item.id);
    if (!wasFav) {
      triggerHeartFly(e.clientX, e.clientY);
      toast.success(`${item.name.ko} ${t("spots.addedToCourse")}`);
    }
  };
  const goBack = () => router.history.back();
  const openMap = () => {
    const query = encodeURIComponent(`${item.name.ko} 부산`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-24", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-[40vh] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx("img", { src: item.thumbnail, alt: item.name.ko, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
      /* @__PURE__ */ jsx("button", { onClick: goBack, className: "absolute top-4 left-4 p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition-all active:scale-90", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-6" }) }),
      /* @__PURE__ */ jsx("button", { onClick: (e) => handleToggle(e), className: `absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all active:scale-90 ${isFav ? "bg-rose-500 text-white border-rose-400 shadow-lg" : "bg-white/20 text-white border-white/30"}`, children: /* @__PURE__ */ jsx(Heart, { className: `size-6 ${isFav ? "fill-current" : ""}` }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 left-6 right-6 text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          type === "restaurant" ? /* @__PURE__ */ jsx(Utensils, { className: "size-4 text-orange-400" }) : /* @__PURE__ */ jsx(Coffee, { className: "size-4 text-amber-400" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider opacity-90", children: type === "restaurant" ? "Restaurant" : "Cafe" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black", children: item.name.ko })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 p-4 rounded-3xl text-center", children: [
          /* @__PURE__ */ jsx(Star, { className: "size-5 text-yellow-500 mx-auto mb-1 fill-yellow-500" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: item.rating || 4.5 }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Rating" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 p-4 rounded-3xl text-center", children: [
          /* @__PURE__ */ jsx(Navigation, { className: "size-5 text-primary mx-auto mb-1" }),
          /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold", children: [
            item.distance || 150,
            "m"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Distance" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-muted/50 p-4 rounded-3xl text-center", children: [
          /* @__PURE__ */ jsx(Clock, { className: "size-5 text-green-500 mx-auto mb-1" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold", children: "10:00" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold", children: "Open" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-6 bg-primary rounded-full" }),
          "상세 정보"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 bg-card border border-border/50 rounded-3xl p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "size-5 text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "주소" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
                "부산광역시 ",
                item.region || "해운대구",
                " ..."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(Phone, { className: "size-5 text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "연락처" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: "051-XXX-XXXX" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx(Star, { className: "size-5 text-primary shrink-0" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "시그니처 메뉴" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: item.signature?.ko || "추천 메뉴" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openMap, className: "w-full h-16 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95", children: [
        /* @__PURE__ */ jsx(ExternalLink, { className: "mr-2 size-5" }),
        "길찾기 및 리뷰 보기"
      ] })
    ] })
  ] });
}
export {
  NearbyDetail as component
};
