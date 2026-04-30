"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Globe } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { LanguageModal } from "./LanguageModal";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/stores/useAppStore";
import { HeartEffect } from "./HeartEffect";
import "@/lib/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const lang = useAppStore((s: any) => s.lang);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!lang) {
      setModalOpen(true);
    } else if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!mounted) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        {/* Global Background Image (Busan Harbor Bridge at Sunset - Refined Visibility) */}
        <div className="fixed inset-0 -z-10 h-full w-full">
          <img
            src="/busan_harbor_bridge_sunset_1776481887078.png"
            alt="Busan Harbor Bridge Background"
            className="h-full w-full object-cover opacity-35 grayscale-[0.4]"
          />
          {/* Subtle Gradient Overlay - Adjusted for clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
        </div>
        
        {pathname !== "/" && <Header onOpenLang={() => {}} />}
        <main className={`mx-auto max-w-screen-md px-4 ${pathname === "/" ? "py-0" : "py-6"}`}>
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  const isHome = pathname === "/";

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <HeartEffect />
      {/* Global Background Image (Busan Harbor Bridge at Sunset - Refined Visibility) */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <img
          src="/busan_harbor_bridge_sunset_1776481887078.png"
          alt="Busan Harbor Bridge Background"
          className="h-full w-full object-cover opacity-35 grayscale-[0.4]"
        />
        {/* Subtle Gradient Overlay - Adjusted for clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
      </div>

      {!isHome && <Header onOpenLang={() => setModalOpen(true)} />}
      <main className={`mx-auto max-w-screen-md px-4 ${isHome ? "py-0" : "py-6"}`}>
        {children}
      </main>
      <BottomNav />
      
      {/* Global Floating Language Button (Top Right) */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed right-6 top-6 z-[60] flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition-all hover:bg-black/20 active:scale-95"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{i18n.language.split("-")[0]}</span>
      </button>

      <LanguageModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Toaster position="top-center" />
    </div>
  );
}
