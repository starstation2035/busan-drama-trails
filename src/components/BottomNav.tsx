"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Heart, MessageSquare, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/useAppStore";

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const favorites = useAppStore((s) => s.favorites);

  const items = [
    { href: "/", icon: Home, label: t("nav.home"), match: (p: string) => p === "/" },
    { href: "/spots", icon: MapPin, label: t("nav.spots"), match: (p: string) => p.startsWith("/spots") },
    { href: "/community", icon: MessageSquare, label: t("nav.community") || "Community", match: (p: string) => p.startsWith("/community") },
    { href: "/my-course", icon: Heart, label: t("nav.myCourse"), match: (p: string) => p.startsWith("/my-course"), id: "bottom-nav-my-course" },
    { href: "/style-test", icon: Sparkles, label: t("nav.styleTest") || "Style", match: (p: string) => p.startsWith("/style-test") },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#DDDDDD] bg-white md:hidden safe-area-bottom shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-screen-xl items-center justify-around px-2 py-3">
        {items.map((item) => {
          const { href, icon: Icon, label, match } = item;
          const id = (item as any).id;
          const active = match(pathname);
          const isMyCourse = href === "/my-course";
          
          return (
            <Link
              key={href}
              href={href}
              id={id}
              className={`relative flex flex-1 flex-col items-center gap-1.5 transition-all active:scale-90 ${
                active ? "text-[#FF385C]" : "text-[#717171]"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 stroke-[1.5px] transition-transform ${active ? "scale-110" : "scale-100"}`} />
                {isMyCourse && favorites.length > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[9px] font-black text-white ring-2 ring-white animate-in zoom-in duration-300">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight ${active ? "font-bold" : "font-medium"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
