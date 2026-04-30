import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LangCode = "zh-TW" | "ko" | "en" | "ja" | "zh-CN";
export type UserStyle = "healing" | "active" | "insta" | "kdrama" | null;

export interface MyCourseItem {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
}

interface AppState {
  lang: LangCode | null;
  userStyle: UserStyle;
  favorites: string[];
  myCourseItems: MyCourseItem[];
  setLang: (lang: LangCode) => void;
  setUserStyle: (style: UserStyle) => void;
  toggleFavorite: (id: string) => void;
  setFavorites: (ids: string[]) => void;
  toggleMyCourseItem: (item: MyCourseItem) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: null,
      userStyle: null,
      favorites: [],
      myCourseItems: [],
      setLang: (lang) => set({ lang }),
      setUserStyle: (userStyle) => set({ userStyle }),
      toggleFavorite: (id) => {
        const f = get().favorites;
        set({ favorites: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      },
      setFavorites: (favorites) => set({ favorites }),
      toggleMyCourseItem: (item) => {
        const items = get().myCourseItems;
        const exists = items.some((x) => x.id === item.id);
        set({
          myCourseItems: exists
            ? items.filter((x) => x.id !== item.id)
            : [...items, item],
        });
      },
    }),
    { name: "busan-app" },
  ),
);
