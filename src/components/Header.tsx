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
    { href: "/community", icon: MessageSquare, label: t("nav.community") },
    { href: "/my-course", icon: Heart, label: t("nav.myCourse") },
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
            className="hidden sm:flex relative items-center justify-center p-2.5 rounded-full border border-[#DDDDDD] bg-white hover:bg-[#F7F7F7] transition-all shadow-sm"
            title={t("nav.myCourse")}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${favorites.length > 0 ? "fill-[#FF385C] text-[#FF385C]" : "text-[#717171]"}`}
            />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in duration-300">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            href="/community"
            className="hidden sm:flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] shadow-sm transition-all"
          >
            <MessageSquare className="h-4 w-4 text-[#717171]" />
            <span>{t("nav.community")}</span>
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
              <div className="flex flex-col py-4 px-3 gap-1">
                <div className="px-3 pb-2 pt-1">
                  <p className="text-[11px] font-black text-[#717171] uppercase tracking-[0.2em]">
                    {t("common.quickStart")}
                  </p>
                </div>

                <SheetClose asChild>
                  <Link
                    href="/spots"
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[16px] font-bold text-[#222222] hover:bg-[#F7F7F7] hover:text-[#FF385C] transition-all group"
                  >
                    <MapPin className="h-5 w-5 text-[#717171] group-hover:text-[#FF385C] transition-colors" />
                    {t("landing.cta.explore")}
                  </Link>
                </SheetClose>

                {menuItems.map((item) => (
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

                <div className="px-3 pb-2 pt-4 border-t border-gray-100 mt-2">
                  <p className="text-[11px] font-black text-[#717171] uppercase tracking-[0.2em]">
                    {t("common.settings")}
                  </p>
                </div>

                <SheetClose asChild>
                  <button
                    onClick={onOpenLang}
                    className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl text-[16px] font-bold text-[#222222] hover:bg-[#F7F7F7] hover:text-[#FF385C] transition-all group"
                  >
                    <Globe className="h-5 w-5 text-[#717171] group-hover:text-[#FF385C] transition-colors" />
                    {t("language.choose")} ({meta.native})
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
