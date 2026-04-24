"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Heart, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const items = [
    { href: "/", icon: Home, label: t("nav.home"), match: (p: string) => p === "/" },
    { href: "/spots", icon: MapPin, label: t("nav.spots"), match: (p: string) => p.startsWith("/spots") },
    { href: "/community", icon: MessageSquare, label: t("nav.community"), match: (p: string) => p.startsWith("/community") },
    { href: "/my-course", icon: Heart, label: t("nav.myCourse"), match: (p: string) => p.startsWith("/my-course") },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-screen-md items-center justify-around px-2 py-2">
        {items.map(({ href, icon: Icon, label, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
