import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { LanguageModal } from "./LanguageModal";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/stores/useAppStore";
import "@/lib/i18n";

export function Layout() {
  const { i18n } = useTranslation();
  const lang = useAppStore((s) => s.lang);
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
      <div className="min-h-screen bg-background">
        <div className="h-14 border-b border-border/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header onOpenLang={() => setModalOpen(true)} />
      <main className="mx-auto max-w-screen-md px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
      <LanguageModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Toaster position="top-center" />
    </div>
  );
}
