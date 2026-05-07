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

import { FloatingActions } from "./FloatingActions";

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
      <div className="min-h-screen bg-white">
        {pathname !== "/" && <Header onOpenLang={() => {}} />}
        <main className={`mx-auto max-w-screen-md ${pathname === "/" ? "py-0" : "py-6"}`}>
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-white">
      <HeartEffect />
      
      <Header onOpenLang={() => setModalOpen(true)} />
      <main className={`mx-auto max-w-screen-md ${isHome ? "py-0" : "py-6"}`}>
        {children}
      </main>
      <BottomNav />
      
      {/* Global Action Buttons (Chat & Write) */}
      <FloatingActions />
      
      <LanguageModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Toaster position="top-center" />
    </div>
  );
}
