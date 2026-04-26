import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { X, RefreshCw, Shuffle, Share2, Download, Trash2, AlertTriangle, Clock, Pencil, Timer, MapPin, Instagram, MessageCircle, Footprints, Car, TrainFront } from "lucide-react";
import { s as spotsRaw, u as useAppStore } from "./router-JD4VdYii.js";
import { c as cn, B as Button } from "./button-Cz8PAkJh.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { r as restaurantsRaw, c as cafesRaw } from "./cafes-di2WphnA.js";
import { S as STYLE_META } from "./quiz-DHfDudtW.js";
import "zustand";
import "zustand/middleware";
import "i18next";
import "zod";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const spots = spotsRaw;
const restaurants = restaurantsRaw;
const cafes = cafesRaw;
function classifyFavorites(favIds) {
  const sp = [];
  const rs = [];
  const cf = [];
  for (const id of favIds) {
    const s = spots.find((x) => x.id === id);
    if (s) {
      sp.push({ kind: "spot", id: s.id, name: s.name, thumbnail: s.thumbnail, coords: s.coords });
      continue;
    }
    const r = restaurants.find((x) => x.id === id);
    if (r) {
      rs.push({ kind: "restaurant", id: r.id, name: r.name, thumbnail: r.thumbnail, food: r.food });
      continue;
    }
    const c = cafes.find((x) => x.id === id);
    if (c) {
      cf.push({ kind: "cafe", id: c.id, name: c.name, thumbnail: c.thumbnail, vibe: c.vibe });
    }
  }
  return { spots: sp, restaurants: rs, cafes: cf };
}
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}
function travelEstimate(km) {
  if (km < 1) return { minutes: Math.max(3, Math.round(km * 12)), mode: "walk", km };
  if (km <= 5) return { minutes: Math.max(5, Math.round(km * 3)), mode: "taxi", km };
  return { minutes: Math.round(km * 4) + 10, mode: "subway", km };
}
function nearestNeighborOrder(spotsIn) {
  if (spotsIn.length <= 1) return spotsIn.slice();
  const remaining = spotsIn.slice();
  remaining.sort((a, b) => b.coords.lat - a.coords.lat);
  const ordered = [remaining.shift()];
  while (remaining.length) {
    const last = ordered[ordered.length - 1];
    let bestIdx = 0;
    let bestKm = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const km = haversineKm(last.coords, remaining[i].coords);
      if (km < bestKm) {
        bestKm = km;
        bestIdx = i;
      }
    }
    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }
  return ordered;
}
function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
const SPOT_DURATION = 60;
const MEAL_DURATION = 60;
const CAFE_DURATION = 45;
function generateCourse(favIds) {
  const { spots: sp, restaurants: rs, cafes: cf } = classifyFavorites(favIds);
  const ordered = nearestNeighborOrder(sp);
  const entries = [];
  let cursor = "09:00";
  for (let i = 0; i < ordered.length; i++) {
    const item = ordered[i];
    entries.push({ time: cursor, durationMin: SPOT_DURATION, item });
    cursor = addMinutes(cursor, SPOT_DURATION);
    if (i < ordered.length - 1) {
      const km = haversineKm(item.coords, ordered[i + 1].coords);
      const travel = travelEstimate(km);
      entries[entries.length - 1].travelToNext = travel;
      cursor = addMinutes(cursor, travel.minutes);
    }
  }
  const insertAt = (target, item, duration) => {
    const targetMin = timeToMinutes(target);
    let insertIdx = entries.length;
    for (let i = 0; i < entries.length; i++) {
      if (timeToMinutes(entries[i].time) >= targetMin) {
        insertIdx = i;
        break;
      }
    }
    const newEntry = { time: target, durationMin: duration, item };
    entries.splice(insertIdx, 0, newEntry);
    let c = addMinutes(target, duration);
    for (let i = insertIdx + 1; i < entries.length; i++) {
      c = addMinutes(c, 10);
      entries[i].time = c;
      c = addMinutes(c, entries[i].durationMin);
    }
  };
  if (rs[0]) insertAt("12:00", { ...rs[0] }, MEAL_DURATION);
  if (cf[0]) insertAt("15:00", { ...cf[0] }, CAFE_DURATION);
  const dinner = rs[1] ?? (rs[0] ? null : null);
  if (dinner) insertAt("18:00", { ...dinner }, MEAL_DURATION);
  for (let i = 0; i < entries.length - 1; i++) {
    const a = entries[i].item;
    const b = entries[i + 1].item;
    if (a.kind === "spot" && b.kind === "spot") {
      const km = haversineKm(a.coords, b.coords);
      entries[i].travelToNext = travelEstimate(km);
    } else {
      entries[i].travelToNext = { minutes: 10, mode: "walk", km: 0.5 };
    }
  }
  entries[entries.length - 1] && (entries[entries.length - 1].travelToNext = void 0);
  return entries;
}
function totalRouteKm(entries) {
  const spotEntries = entries.filter((e) => e.item.kind === "spot");
  let km = 0;
  for (let i = 0; i < spotEntries.length - 1; i++) {
    km += haversineKm(spotEntries[i].item.coords, spotEntries[i + 1].item.coords);
  }
  return km;
}
const courseService = {
  /**
   * Updates the memo of a specific entry in the course.
   */
  updateMemo(course, index, memo) {
    const newCourse = [...course];
    newCourse[index] = { ...newCourse[index], memo };
    return newCourse;
  },
  /**
   * Updates the travel time and shifts subsequent entries.
   */
  updateTravelTime(course, index, minutes) {
    const newCourse = [...course];
    const entry = newCourse[index];
    if (!entry.travelToNext) return course;
    newCourse[index] = {
      ...entry,
      travelToNext: { ...entry.travelToNext, minutes }
    };
    let currentStartTime = addMinutes(entry.time, entry.durationMin + minutes);
    for (let i = index + 1; i < newCourse.length; i++) {
      newCourse[i] = { ...newCourse[i], time: currentStartTime };
      const nextTravel = newCourse[i].travelToNext?.minutes || 0;
      currentStartTime = addMinutes(currentStartTime, newCourse[i].durationMin + nextTravel);
    }
    return newCourse;
  },
  /**
   * Re-calculates all times based on a start time.
   */
  recalculateTimeline(course, startTime = "09:00") {
    let current = startTime;
    return course.map((entry) => {
      const updated = { ...entry, time: current };
      const travel = entry.travelToNext?.minutes || 0;
      current = addMinutes(current, entry.durationMin + travel);
      return updated;
    });
  }
};
function MyCoursePage() {
  const {
    t,
    i18n
  } = useTranslation();
  const lang = i18n.language || "zh-TW";
  const favorites = useAppStore((s) => s.favorites);
  const userStyle = useAppStore((s) => s.userStyle);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const navigate = useNavigate();
  const {
    spots: spots2,
    restaurants: restaurants2,
    cafes: cafes2
  } = useMemo(() => classifyFavorites(favorites), [favorites]);
  const [tab, setTab] = useState("course");
  const [seed, setSeed] = useState(0);
  const [editableCourse, setEditableCourse] = useState([]);
  useEffect(() => {
    if (favorites.length > 0) {
      const generated = generateCourse(favorites);
      setEditableCourse(generated);
    } else {
      setEditableCourse([]);
    }
  }, [favorites, seed]);
  const totalKm = useMemo(() => totalRouteKm(editableCourse), [editableCourse]);
  if (favorites.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 text-7xl", children: "🗺️" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: t("myCourse.title") }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-xs text-sm text-muted-foreground", children: t("myCourse.empty.message") }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6", children: /* @__PURE__ */ jsx(Link, { to: "/spots", children: t("myCourse.empty.cta") }) })
    ] });
  }
  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(t("common.copied"));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: t("myCourse.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: t("myCourse.subtitle", {
        spots: spots2.length,
        restaurants: restaurants2.length,
        cafes: cafes2.length
      }) })
    ] }),
    userStyle && /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl p-6 text-center shadow-lg animate-fade-up", style: {
      background: `linear-gradient(135deg, ${STYLE_META[userStyle].colorVar}, color-mix(in oklab, ${STYLE_META[userStyle].colorVar} 60%, white))`
    }, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-4", children: /* @__PURE__ */ jsxs(Link, { to: "/style-test", className: "flex items-center gap-1 text-[10px] font-bold text-foreground/60 hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "size-3" }),
        t("common.retake")
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-foreground/60", children: t("quiz.result.yourStyle") }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 text-5xl animate-bounce-slow", children: STYLE_META[userStyle].icon }),
      /* @__PURE__ */ jsx("h2", { className: "mt-2 text-2xl font-black text-foreground", children: t(`quiz.types.${userStyle}.name`) }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-medium text-foreground/70", children: t(`quiz.types.${userStyle}.tagline`) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 rounded-xl bg-muted p-1", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTab("course"), className: `rounded-lg px-3 py-2 text-sm font-medium transition ${tab === "course" ? "bg-background text-foreground shadow" : "text-muted-foreground"}`, children: t("myCourse.tabs.course") }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setTab("list"), className: `rounded-lg px-3 py-2 text-sm font-medium transition ${tab === "list" ? "bg-background text-foreground shadow" : "text-muted-foreground"}`, children: t("myCourse.tabs.list") })
    ] }),
    tab === "list" ? /* @__PURE__ */ jsx(ListView, { spots: spots2, restaurants: restaurants2, cafes: cafes2, lang, onRemove: (id) => {
      toggleFavorite(id);
      toast(t("myCourse.removed"));
    }, onOpen: (id, kind) => {
      if (kind === "spot") navigate({
        to: "/spots/$id",
        params: {
          id
        }
      });
    } }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-6 text-white shadow-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(Shuffle, { className: "size-24" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 mb-3", children: [
            /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-green-400 animate-pulse" }),
            "AI Optimized Path"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black mb-2 tracking-tight", children: "AI 추천 최적 경로" }),
          /* @__PURE__ */ jsxs("p", { className: "text-white/80 text-xs leading-relaxed max-w-[80%]", children: [
            "동선을 고려하여 가장 효율적인 방문 순서를 계산했습니다. ",
            totalKm.toFixed(1),
            "km의 여정을 지금 확인해보세요!"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(CourseView, { course: editableCourse, totalKm, lang, onUpdateMemo: (idx, val) => setEditableCourse((cur) => courseService.updateMemo(cur, idx, val)), onUpdateTravelTime: (idx, val) => setEditableCourse((cur) => courseService.updateTravelTime(cur, idx, val)) })
    ] }),
    tab === "course" && /* @__PURE__ */ jsxs("div", { className: "sticky bottom-20 z-10 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-lg backdrop-blur md:bottom-4", children: [
      /* @__PURE__ */ jsxs(Dialog, { children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "default", className: "gap-1", children: [
          /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" }),
          " ",
          t("myCourse.actions.share")
        ] }) }),
        /* @__PURE__ */ jsx(DialogContent, { className: "max-w-[400px] overflow-hidden p-0 sm:rounded-3xl", children: /* @__PURE__ */ jsx(ShareLayout, { course: editableCourse, lang }) })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => setSeed((s) => s + 1), className: "gap-1", children: [
        /* @__PURE__ */ jsx(Shuffle, { className: "h-4 w-4" }),
        " ",
        t("myCourse.actions.regen")
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => toast(t("myCourse.actions.exportSoon")), className: "gap-1", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        " ",
        t("myCourse.actions.export")
      ] })
    ] }),
    tab === "course" && /* @__PURE__ */ jsx("div", { className: "text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsx("button", { onClick: handleCopy, className: "underline", children: t("myCourse.actions.copyLink") }) })
  ] });
}
function ListView({
  spots: spots2,
  restaurants: restaurants2,
  cafes: cafes2,
  lang,
  onRemove,
  onOpen
}) {
  const {
    t
  } = useTranslation();
  const groups = [{
    key: "spots",
    label: t("myCourse.groups.spots"),
    items: spots2
  }, {
    key: "restaurants",
    label: t("myCourse.groups.restaurants"),
    items: restaurants2
  }, {
    key: "cafes",
    label: t("myCourse.groups.cafes"),
    items: cafes2
  }];
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: groups.map((g) => g.items.length ? /* @__PURE__ */ jsxs("section", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-muted-foreground", children: g.label }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: g.items.map((it) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-2 shadow-sm", children: [
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => onOpen(it.id, it.kind), className: "flex flex-1 items-center gap-3 text-left", children: [
        /* @__PURE__ */ jsx("img", { src: it.thumbnail, alt: "", className: "h-14 w-14 rounded-xl object-cover", loading: "lazy" }),
        /* @__PURE__ */ jsx("span", { className: "line-clamp-2 text-sm font-medium text-foreground", children: it.name[lang] ?? it.name["en"] })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", onClick: () => onRemove(it.id), "aria-label": "remove", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-muted-foreground" }) })
    ] }, it.id)) })
  ] }, g.key) : null) });
}
function CourseView({
  course,
  totalKm,
  lang,
  onUpdateMemo,
  onUpdateTravelTime
}) {
  const {
    t
  } = useTranslation();
  if (course.length === 1) {
    const e = course[0];
    return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/60 bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("myCourse.single.label") }),
      /* @__PURE__ */ jsx("h3", { className: "mt-1 text-lg font-semibold text-foreground", children: e.item.name[lang] ?? e.item.name["en"] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: t("myCourse.single.hint") })
    ] });
  }
  const tooFar = totalKm > 30;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    tooFar && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 rounded-xl border border-yellow-300/60 bg-yellow-50 p-3 text-sm text-yellow-800", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 h-4 w-4 shrink-0" }),
      /* @__PURE__ */ jsx("span", { children: t("myCourse.warnings.tooFar", {
        km: totalKm.toFixed(1)
      }) })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "relative ml-1", children: course.map((entry, i) => {
      const item = entry.item;
      const name = item.name[lang] ?? item.name["en"];
      const isLast = i === course.length - 1;
      const ItemLink = item.kind === "spot" ? Link : "div";
      const linkProps = item.kind === "spot" ? {
        to: "/spots/$id",
        params: {
          id: item.id
        }
      } : {};
      return /* @__PURE__ */ jsxs("li", { className: "relative pb-6 pl-16", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 w-12 text-right", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-foreground", children: entry.time }) }),
        /* @__PURE__ */ jsx("span", { className: "absolute left-[3.25rem] top-1.5 h-3 w-3 rounded-full border-2 border-background", style: {
          backgroundColor: dotColor(item.kind)
        } }),
        !isLast && /* @__PURE__ */ jsx("span", { className: "absolute left-[3.65rem] top-5 bottom-0 w-px bg-border" }),
        /* @__PURE__ */ jsxs(ItemLink, { ...linkProps, className: "block rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition hover:shadow-md", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("img", { src: item.thumbnail, alt: "", className: "h-14 w-14 rounded-xl object-cover", loading: "lazy" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: kindLabel(item.kind, t) }),
              /* @__PURE__ */ jsx("h4", { className: "line-clamp-1 text-sm font-semibold text-foreground", children: name }),
              /* @__PURE__ */ jsxs("p", { className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                " ",
                entry.durationMin,
                " min"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-1 text-[10px] font-medium text-muted-foreground/80", children: [
              /* @__PURE__ */ jsx(Pencil, { className: "h-2.5 w-2.5" }),
              t("myCourse.memo.label")
            ] }),
            /* @__PURE__ */ jsx(Textarea, { placeholder: t("myCourse.memo.placeholder"), value: entry.memo || "", onChange: (e) => onUpdateMemo(i, e.target.value), className: "min-h-[40px] resize-none border-none bg-muted/30 text-xs placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-primary/30" })
          ] })
        ] }),
        entry.travelToNext && !isLast && /* @__PURE__ */ jsx("div", { className: "group mt-2", children: /* @__PURE__ */ jsxs("div", { className: "ml-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground transition-colors group-hover:bg-muted", children: [
            /* @__PURE__ */ jsx(ModeIcon, { mode: entry.travelToNext.mode }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              entry.travelToNext.minutes,
              " ",
              t("myCourse.customTravel.unit"),
              " ",
              t(`myCourse.travel.${entry.travelToNext.mode}`)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100", children: [
            /* @__PURE__ */ jsx(Input, { type: "number", min: "1", max: "300", value: entry.travelToNext.minutes, onChange: (e) => onUpdateTravelTime(i, parseInt(e.target.value) || 1), className: "h-6 w-14 rounded-md border-border/40 bg-background px-1.5 py-0 text-[10px] focus-visible:ring-primary/30" }),
            /* @__PURE__ */ jsx(Timer, { className: "h-3 w-3 text-muted-foreground/60" })
          ] })
        ] }) })
      ] }, `${item.kind}-${item.id}-${i}`);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
        t("myCourse.totals.distance", {
          km: totalKm.toFixed(1)
        })
      ] }),
      /* @__PURE__ */ jsx("span", { children: t("myCourse.totals.stops", {
        count: course.length
      }) })
    ] })
  ] });
}
function ShareLayout({
  course,
  lang
}) {
  const {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxs("div", { className: "relative aspect-[9/16] w-full overflow-hidden bg-gradient-to-br from-[#003d99] via-[#0077cc] to-[#33ccff] p-6 text-white shadow-2xl", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-2 pt-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md", children: "Personal Trip" }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black tracking-tight drop-shadow-lg", children: t("myCourse.share.layoutTitle") }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-[10px] font-medium opacity-80", children: [
        /* @__PURE__ */ jsx("span", { children: (/* @__PURE__ */ new Date()).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US") }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsxs("span", { children: [
          course.length,
          " Spots"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mt-10 h-[65%] overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-[2.25rem] top-4 bottom-4 w-px bg-white/30" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        course.slice(0, 5).map((entry, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "relative flex-none", children: /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[10px] font-bold backdrop-blur-md border border-white/20", children: entry.time }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1 pt-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "line-clamp-1 text-sm font-bold tracking-tight", children: entry.item.name[lang] ?? entry.item.name["en"] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[9px] font-medium opacity-70", children: [
              /* @__PURE__ */ jsx("span", { className: "rounded-sm bg-white/20 px-1 py-0.5", children: t(`myCourse.kinds.${entry.item.kind}`) }),
              entry.memo && /* @__PURE__ */ jsxs("span", { className: "line-clamp-1 italic italic-medium", children: [
                "— ",
                entry.memo
              ] })
            ] })
          ] })
        ] }, idx)),
        course.length > 5 && /* @__PURE__ */ jsxs("div", { className: "pl-16 text-[10px] font-medium opacity-60", children: [
          "+ ",
          course.length - 5,
          " more places..."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 left-0 w-full px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-white/30" }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold leading-none tracking-widest opacity-80", children: t("common.appName") }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 opacity-50", children: [
        /* @__PURE__ */ jsx(Instagram, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100", children: /* @__PURE__ */ jsx("p", { className: "rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-black shadow-lg", children: "📸 Screenshot to share!" }) })
  ] });
}
function dotColor(kind) {
  if (kind === "spot") return "hsl(var(--primary, 0 84% 71%))";
  if (kind === "restaurant") return "#FFD93D";
  return "#4ECDC4";
}
function kindLabel(kind, t) {
  return t(`myCourse.kinds.${kind}`);
}
function ModeIcon({
  mode
}) {
  if (mode === "walk") return /* @__PURE__ */ jsx(Footprints, { className: "h-3 w-3" });
  if (mode === "taxi") return /* @__PURE__ */ jsx(Car, { className: "h-3 w-3" });
  return /* @__PURE__ */ jsx(TrainFront, { className: "h-3 w-3" });
}
export {
  MyCoursePage as component
};
