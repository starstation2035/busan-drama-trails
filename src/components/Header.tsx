import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Globe, Heart } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const FLAGS: Record<string, { flag: string; native: string }> = {
  "zh-TW": { flag: "🇹🇼", native: "繁中" },
  ko: { flag: "🇰🇷", native: "한국어" },
  en: { flag: "🇺🇸", native: "EN" },
  ja: { flag: "🇯🇵", native: "日本語" },
  "zh-CN": { flag: "🇨🇳", native: "简중" },
};

interface Props {
  onOpenLang: () => void;
}

export function Header({ onOpenLang }: Props) {
  const { t } = useTranslation();
  const lang = useAppStore((s) => s.lang) ?? "ko";
  const favorites = useAppStore((s) => s.favorites);
  const meta = FLAGS[lang] ?? FLAGS.ko;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
        <Link to="/" className="font-bold text-primary tracking-tight">
          {t("common.appName")}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/my-course"
            id="header-nav-my-course"
            className="relative flex items-center justify-center p-2 rounded-full border border-border bg-background hover:bg-muted transition-all"
            title={t("nav.myCourse")}
          >
            <Heart className={`h-4 w-4 transition-colors ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background animate-in zoom-in duration-300">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            onClick={onOpenLang}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{meta.flag}</span>
            <span>{meta.native}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
