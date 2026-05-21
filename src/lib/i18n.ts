import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhTW from "@/locales/zh-TW.json";
import ko from "@/locales/ko.json";
import en from "@/locales/en.json";
import ja from "@/locales/ja.json";
import zhCN from "@/locales/zh-CN.json";

export const SUPPORTED_LANGS = ["zh-TW", "ko", "en", "ja", "zh-CN"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export function detectBrowserLang(): SupportedLang {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language || "";
  if (nav.startsWith("zh-TW") || nav.startsWith("zh-HK")) return "zh-TW";
  if (nav.startsWith("zh")) return "zh-CN";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("en")) return "en";
  return "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      "zh-TW": { translation: zhTW },
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja },
      "zh-CN": { translation: zhCN },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
// Force HMR
