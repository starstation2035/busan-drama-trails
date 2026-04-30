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
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md md:hidden safe-area-bottom">
      <div className="mx-auto flex max-w-screen-md items-center justify-around px-2 py-2">
        {items.map(({ href, icon: Icon, label, match, id }) => {
          const active = match(pathname);
          const isMyCourse = href === "/my-course";
          
          return (
            <Link
              key={href}
              href={href}
              id={id}
              className={`relative flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-bold tracking-tight transition-all active:scale-90 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon className={`h-6 w-6 transition-transform ${active ? "scale-110" : "scale-100"}`} />
                {isMyCourse && favorites.length > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-background animate-in zoom-in duration-300">
                    {favorites.length}
                  </span>
                )}
              </div>
              <span className={active ? "font-black" : "font-medium"}>{label}</span>
              {active && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
