import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LangCode = "zh-TW" | "ko" | "en" | "ja" | "zh-CN";
export type UserStyle = "healing" | "active" | "insta" | "kdrama" | null;

interface AppState {
  lang: LangCode | null;
  userStyle: UserStyle;
  favorites: string[];
  setLang: (lang: LangCode) => void;
  setUserStyle: (style: UserStyle) => void;
  toggleFavorite: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: null,
      userStyle: null,
      favorites: [],
      setLang: (lang) => set({ lang }),
      setUserStyle: (userStyle) => set({ userStyle }),
      toggleFavorite: (id) => {
        const f = get().favorites;
        set({ favorites: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      },
    }),
    { name: "busan-app" },
  ),
);
