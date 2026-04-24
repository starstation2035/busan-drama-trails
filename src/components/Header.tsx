import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

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
  const meta = FLAGS[lang] ?? FLAGS.ko;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4">
        <Link href="/" className="font-bold text-primary tracking-tight">
          {t("common.appName")}
        </Link>
        <button
          onClick={onOpenLang}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{meta.flag}</span>
          <span>{meta.native}</span>
        </button>
      </div>
    </header>
  );
}
