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
import { supabase } from "@/lib/supabase";

import { FloatingActions } from "./FloatingActions";

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const lang = useAppStore((s: any) => s.lang);
  const guestId = useAppStore((s: any) => s.guestId);
  const initializeGuestId = useAppStore((s: any) => s.initializeGuestId);
  const setFavorites = useAppStore((s: any) => s.setFavorites);
  
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

  useEffect(() => {
    initializeGuestId();
  }, [initializeGuestId]);

  useEffect(() => {
    async function loadCourseFromSupabase() {
      if (!guestId) return;
      try {
        const { data, error } = await supabase
          .from("user_courses")
          .select("course_data")
          .eq("guest_id", guestId)
          .single();

        if (data && data.course_data) {
          const localFavs = useAppStore.getState().favorites;
          if (JSON.stringify(data.course_data) !== JSON.stringify(localFavs)) {
            setFavorites(data.course_data);
          }
        }
      } catch (err) {
        console.error("Global Supabase sync error:", err);
      }
    }
    if (mounted) {
      loadCourseFromSupabase();
    }
  }, [guestId, mounted, setFavorites]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        {pathname !== "/" && <Header onOpenLang={() => {}} />}
        <main
          className={`mx-auto w-full max-w-screen-xl px-6 ${pathname === "/" ? "py-0" : "py-6"}`}
        >
          {children}
        </main>
        <BottomNav />
      </div>
    );
  }

  const isHome = pathname === "/";

  return (
    <div className="min-h-screen bg-transparent relative">
      <HeartEffect />

      {/* 🏙️ Static Global Background (Busan Harbor Bridge at Sunset) */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <img
          src="/busan_harbor_bridge_sunset_1776481887078.png"
          alt="Busan Harbor Bridge Background"
          className="h-full w-full object-cover opacity-35 blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />
      </div>

      <Header onOpenLang={() => setModalOpen(true)} />
      <main className={`mx-auto w-full max-w-screen-xl px-6 ${isHome ? "" : "py-6"}`}>
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
