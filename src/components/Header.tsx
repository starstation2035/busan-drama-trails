"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Globe, Heart, Menu, Home, MapPin, Sparkles, MessageSquare, Briefcase } from "lucide-react";
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

  const menuItems = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/spots", icon: MapPin, label: t("nav.spots") },
    { href: "/style-test", icon: Sparkles, label: t("nav.styleTest") },
    { href: "/community", icon: MessageSquare, label: t("nav.community") },
    { href: "/my-course", icon: Heart, label: t("nav.myCourse") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DDDDDD] bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-md items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-[#FF385C] tracking-tight text-xl">
            {t("common.appName")}
          </Link>

          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/spots" className="text-sm font-bold text-[#222222] hover:text-[#FF385C] transition-colors">
              {t("nav.spots")}
            </Link>
            <Link href="/style-test" className="text-sm font-bold text-[#222222] hover:text-[#FF385C] transition-colors">
              {t("nav.styleTest")}
            </Link>
            <Link href="/community" className="text-sm font-bold text-[#222222] hover:text-[#FF385C] transition-colors">
              {t("nav.community")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/my-course"
            id="header-nav-my-course"
            className="hidden sm:flex relative items-center justify-center p-2.5 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#F7F7F7] transition-all shadow-sm"
            title={t("nav.myCourse")}
          >
            <Heart className={`h-4 w-4 transition-colors ${favorites.length > 0 ? "fill-[#FF385C] text-[#FF385C]" : "text-[#717171]"}`} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in duration-300">
                {favorites.length}
              </span>
            )}
          </Link>
          
          <button
            onClick={onOpenLang}
            className="hidden sm:flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] shadow-sm transition-all"
          >
            <Globe className="h-4 w-4 text-[#717171]" />
            <span>{meta.native}</span>
          </button>

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
              <div className="flex flex-col py-2">
                <div className="px-6 py-4 flex flex-col gap-3 border-b border-gray-100">
                  <p className="text-[11px] font-black text-[#717171] uppercase tracking-[0.2em] mb-1">Quick Start</p>
                  <SheetClose asChild>
                    <Link href="/spots">
                      <button className="w-full rounded-full bg-[#FF385C] hover:bg-[#E31C5F] text-white h-12 text-[15px] font-bold shadow-md transition-all active:scale-95 flex items-center justify-center">
                        {t("landing.cta.explore")}
                      </button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/community">
                      <button className="w-full rounded-full border border-[#DDDDDD] bg-white text-[#222222] h-12 text-[15px] font-bold shadow-sm hover:bg-[#F7F7F7] transition-all active:scale-95 flex items-center justify-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#FF385C]" />
                        {t("landing.categories.community")}
                      </button>
                    </Link>
                  </SheetClose>
                </div>

                {menuItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 px-6 py-4 text-lg font-bold text-[#222222] hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-[#FF385C]"
                    >
                      <item.icon className="h-5 w-5 text-[#717171]" />
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                
                <div className="mt-4 px-6 pt-6 border-t border-gray-100">
                  <p className="text-[11px] font-black text-[#717171] uppercase tracking-[0.2em] mb-4">Settings</p>
                  <SheetClose asChild>
                    <button
                      onClick={onOpenLang}
                      className="flex items-center gap-4 w-full text-left py-2 text-base font-semibold text-[#222222] hover:text-[#FF385C]"
                    >
                      <Globe className="h-5 w-5 text-[#717171]" />
                      {t("language.choose")} ({meta.native})
                    </button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
