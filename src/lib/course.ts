import { type LangCode } from "@/stores/useAppStore";
import spotsData from "@/data/spots.json";
import restaurantsData from "@/data/restaurants.json";
import cafesData from "@/data/cafes.json";

export type Coords = { lat: number; lng: number };

export type SpotItem = {
  kind: "spot";
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  coords: Coords;
  region: Record<LangCode, string>;
};

export type RestaurantItem = {
  kind: "restaurant";
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  food?: Record<string, string>;
  region?: Record<LangCode, string>;
};

export type CafeItem = {
  kind: "cafe";
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  vibe?: Record<string, string>;
  region?: Record<LangCode, string>;
};

export type AnyItem = SpotItem | RestaurantItem | CafeItem;

export type TimelineEntry = {
  time: string;
  durationMin: number;
  item: AnyItem;
  travelToNext?: { minutes: number; mode: "walk" | "taxi" | "subway" | "bus"; km: number };
};

export const spots = spotsData as Array<{
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  coords: Coords;
  region: Record<LangCode, string>;
}>;
export const restaurants = restaurantsData as Array<{
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  food?: Record<string, string>;
  region?: Record<LangCode, string>;
}>;
export const cafes = cafesData as Array<{
  id: string;
  name: Record<string, string>;
  thumbnail: string;
  vibe?: Record<string, string>;
  region?: Record<LangCode, string>;
}>;

export function classifyFavorites(favIds: string[]): {
  spots: SpotItem[];
  restaurants: RestaurantItem[];
  cafes: CafeItem[];
} {
  const sp: SpotItem[] = [];
  const rs: RestaurantItem[] = [];
  const cf: CafeItem[] = [];
  for (const id of favIds) {
    const s = spots.find((x) => x.id === id);
    if (s) {
      sp.push({
        kind: "spot",
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        coords: s.coords,
        region: (s as any).region,
      });
      continue;
    }
    const r = restaurants.find((x) => x.id === id);
    if (r) {
      rs.push({
        kind: "restaurant",
        id: r.id,
        name: r.name,
        thumbnail: r.thumbnail,
        food: r.food,
        region: (r as any).region,
      });
      continue;
    }
    const c = cafes.find((x) => x.id === id);
    if (c) {
      cf.push({
        kind: "cafe",
        id: c.id,
        name: c.name,
        thumbnail: c.thumbnail,
        vibe: (c as any).vibe,
        region: (c as any).region,
      });
    }
  }
  return { spots: sp, restaurants: rs, cafes: cf };
}

function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function travelEstimate(km: number): {
  minutes: number;
  mode: "walk" | "taxi" | "subway" | "bus";
  km: number;
} {
  if (km < 1) return { minutes: Math.max(3, Math.round(km * 12)), mode: "walk", km };
  if (km <= 5) return { minutes: Math.max(5, Math.round(km * 3)), mode: "taxi", km };
  // Default to bus/subway for longer distances
  return { minutes: Math.round(km * 4) + 10, mode: "bus", km };
}

export function modeSpecificEstimate(km: number, mode: "walk" | "taxi" | "subway" | "bus"): number {
  switch (mode) {
    case "walk":
      return Math.max(3, Math.round(km * 12));
    case "taxi":
      return Math.max(5, Math.round(km * 3));
    case "bus":
      return Math.max(10, Math.round(km * 5) + 5);
    case "subway":
      return Math.max(15, Math.round(km * 4) + 10);
    default:
      return 10;
  }
}

function nearestNeighborOrder(spotsIn: SpotItem[]): SpotItem[] {
  if (spotsIn.length <= 1) return spotsIn.slice();
  // Start from northernmost
  const remaining = spotsIn.slice();
  remaining.sort((a, b) => b.coords.lat - a.coords.lat);
  const ordered: SpotItem[] = [remaining.shift()!];
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

export function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

const SPOT_DURATION = 60;
const MEAL_DURATION = 60;
const CAFE_DURATION = 45;

export function generateCourse(favIds: string[]): TimelineEntry[] {
  const { spots: sp, restaurants: rs, cafes: cf } = classifyFavorites(favIds);
  const ordered = nearestNeighborOrder(sp);

  // Build raw spot timeline starting at 09:00
  const entries: TimelineEntry[] = [];
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

  // Helper to insert a meal/cafe at target time
  const insertAt = (target: string, item: AnyItem, duration: number) => {
    const targetMin = timeToMinutes(target);
    let insertIdx = entries.length;
    for (let i = 0; i < entries.length; i++) {
      if (timeToMinutes(entries[i].time) >= targetMin) {
        insertIdx = i;
        break;
      }
    }
    const newEntry: TimelineEntry = { time: target, durationMin: duration, item };
    entries.splice(insertIdx, 0, newEntry);
    // Re-sequence times from the inserted point onward
    let c = addMinutes(target, duration);
    for (let i = insertIdx + 1; i < entries.length; i++) {
      // small travel gap
      c = addMinutes(c, 10);
      entries[i].time = c;
      c = addMinutes(c, entries[i].durationMin);
    }
  };

  // Lunch ~12:00 (first restaurant)
  if (rs[0]) insertAt("12:00", { ...rs[0] }, MEAL_DURATION);
  // Cafe ~15:00 (first cafe)
  if (cf[0]) insertAt("15:00", { ...cf[0] }, CAFE_DURATION);
  // Dinner ~18:00 (second restaurant if exists, else first if not used)
  const dinner = rs[1] ?? (rs[0] ? null : null);
  if (dinner) insertAt("18:00", { ...dinner }, MEAL_DURATION);

  // Recompute travelToNext between consecutive spots only (rough heuristic)
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
  entries[entries.length - 1] && (entries[entries.length - 1].travelToNext = undefined);

  return entries;
}

export function totalRouteKm(entries: TimelineEntry[]): number {
  let km = 0;
  for (const entry of entries) {
    if (entry.travelToNext) {
      km += entry.travelToNext.km;
    }
  }
  return km;
}
