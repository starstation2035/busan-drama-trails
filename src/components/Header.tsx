"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Globe, Heart, Menu, MessageSquare, Home, ShoppingBag, MapPin } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const FLAGS: Record<string, { flag: string; native: string }> = {
  "zh-TW": { flag: "🇹🇼", native: "繁中" },
  ko: { flag: "🇰🇷", native: "한국어" },
  en: { flag: "🇺🇸", native: "EN" },
  ja: { flag: "🇯🇵", native: "日本語" },
  "zh-CN": { flag: "🇨🇳", native: "简中" },
};

interface Props {
  onOpenLang: () => void;
}

export function Header({ onOpenLang }: Props) {
  const { t } = useTranslation();
  const lang = useAppStore((s) => s.lang) ?? "ko";
  const favorites = useAppStore((s) => s.favorites);
  const meta = FLAGS[lang] ?? FLAGS.ko;

  const serviceItems = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/spots", icon: MapPin, label: t("nav.spots") },
    { href: "/my-course", icon: Heart, label: t("nav.myCourse") },
  ];

  const moreItems = [
    { href: "/community", icon: MessageSquare, label: t("nav.community") },
    { href: "/goods", icon: ShoppingBag, label: t("nav.goods") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DDDDDD] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-[#FF385C] tracking-tight text-xl">
            {t("common.appName")}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/my-course"
            id="header-nav-my-course"
            className="flex items-center gap-1.5 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7F7F7] shadow-sm transition-all"
            title="내 코스"
          >
            <span>{t("nav.myCourse")}</span>
            <Heart
              className={`h-4 w-4 text-[#FF385C] ${favorites.length > 0 ? "fill-[#FF385C]" : ""}`}
            />
            <span className="font-black text-[#FF385C]">{favorites.length}</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Menu className="h-6 w-6 text-[#222222]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l-0 shadow-2xl">
              <SheetHeader className="p-6 border-b border-gray-100">
                <SheetTitle className="text-left font-black text-2xl tracking-tighter text-[#FF385C]">
                  {t("common.appName")}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-6 px-3 gap-2">
                {[...serviceItems, ...moreItems].map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[16px] font-bold text-[#222222] hover:bg-[#F7F7F7] hover:text-[#FF385C] transition-all group"
                    >
                      <item.icon className="h-5 w-5 text-[#717171] group-hover:text-[#FF385C] transition-colors" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}

                <SheetClose asChild>
                  <button
                    onClick={onOpenLang}
                    className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl text-[16px] font-bold text-[#222222] hover:bg-[#F7F7F7] hover:text-[#FF385C] transition-all group"
                  >
                    <Globe className="h-5 w-5 text-[#717171] group-hover:text-[#FF385C] transition-colors" />
                    {t("nav.language", "언어 설정")} ({meta.native})
                  </button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
