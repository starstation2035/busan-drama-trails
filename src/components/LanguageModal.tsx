import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore, type LangCode } from "@/stores/useAppStore";
import { detectBrowserLang } from "@/lib/i18n";

const OPTIONS: { code: LangCode; flag: string; native: string }[] = [
  { code: "ko", flag: "🇰🇷", native: "한국어" },
  { code: "en", flag: "🇺🇸", native: "English" },
  { code: "ja", flag: "🇯🇵", native: "日本語" },
  { code: "zh-TW", flag: "🇹🇼", native: "繁體中文" },
  { code: "zh-CN", flag: "🇨🇳", native: "简体中文" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LanguageModal({ open, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { lang, setLang } = useAppStore();
  const [selected, setSelected] = useState<LangCode>(lang ?? detectBrowserLang());

  useEffect(() => {
    if (open) setSelected(lang ?? detectBrowserLang());
  }, [open, lang]);

  if (!open) return null;

  const handleConfirm = () => {
    setLang(selected);
    void i18n.changeLanguage(selected);
    localStorage.setItem("busan-drama-lang-selected", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom-8 border border-[#DDDDDD]">
        <h2 className="text-2xl font-bold text-[#222222]">{t("language.choose")}</h2>
        <p className="mt-1 text-sm text-[#717171]">{t("language.subtitle")}</p>

        <div className="mt-6 space-y-2">
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              onClick={() => setSelected(o.code)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                selected === o.code
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-3xl">{o.flag}</span>
              <span className="flex-1 font-semibold text-[#222222]">{o.native}</span>
              {selected === o.code && (
                <span className="h-3 w-3 rounded-full bg-primary" aria-hidden />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="mt-6 w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
        >
          {t("language.continue")}
        </button>
      </div>
    </div>
  );
}
