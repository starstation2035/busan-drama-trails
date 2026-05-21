## Busan Drama Spot & Style — Phase 1 Setup

### Tech & adaptations

- **Routing**: TanStack Router file-based routes (project default) instead of React Router v6 — same UX, type-safe links.
- **Styling**: Tailwind v4 tokens added to `src/styles.css` (coral / mint / yellow + Noto Sans TC/KR via Google Fonts in root `head()`).
- **State**: Zustand store with `lang`, `userStyle`, `favorites` (persisted to localStorage).
- **i18n**: `i18next` + `react-i18next` + `i18next-browser-languagedetector`, language stored in localStorage as `lang`.

### Folder structure

```
src/
  components/
    Header.tsx              // logo + language switcher chip
    BottomNav.tsx           // 3-tab mobile bottom nav (Home / Spots / My Course)
    LanguageModal.tsx       // first-visit forced modal
    SpotCard.tsx            // reusable card (thumb, title, drama tag, ❤)
    Layout.tsx              // wraps Header + <Outlet/> + BottomNav
  data/
    spots.json              // 5 Busan filming locations w/ multilingual fields
  locales/
    zh-TW.json
    ko.json
    en.json                 // minimal
    ja.json                 // minimal
    zh-CN.json              // minimal
  stores/
    useAppStore.ts          // Zustand: lang, userStyle, favorites
  lib/
    i18n.ts                 // i18next init + browser detection (zh-TW/zh-HK → zh-TW)
  routes/
    __root.tsx              // adds fonts, i18n provider, LanguageModal
    index.tsx               // Landing placeholder
    style-test.tsx          // Quiz placeholder
    spots.tsx               // Spots list placeholder
    spots.$id.tsx           // Spot detail placeholder
    my-course.tsx           // My Course placeholder
```

### Design tokens (added to `src/styles.css`)

- `--color-busan-coral: #FF6B6B`
- `--color-gamcheon-mint: #4ECDC4`
- `--color-drama-yellow: #FFD93D`
- Font stack: `'Noto Sans TC', 'Noto Sans KR', sans-serif`
- Default radius bumped so `rounded-2xl` and soft shadows feel Instagram-clean.

### Language modal behavior

- Shows on first visit only (no `lang` key in localStorage).
- Auto-highlights Traditional Chinese if `navigator.language` starts with `zh-TW` or `zh-HK`; otherwise highlights detected match or falls back to Korean.
- 5 options shown as large tappable cards: 🇹🇼 繁體中文 · 🇰🇷 한국어 · 🇺🇸 English · 🇯🇵 日本語 · 🇨🇳 简体中文.
- Selection: updates Zustand + i18next + localStorage, closes modal.
- Header language switcher reopens the same modal.

### Header & BottomNav

- **Header**: sticky top, white, logo wordmark "Busan Drama Spot & Style" in coral, right-side language chip showing flag + native name.
- **BottomNav**: fixed bottom on mobile, 3 icons (Home / MapPin / Heart) with active state in coral; hidden on `md+` where a top nav could appear later.

### Placeholder pages

Each route renders only its translated title + route path string, wrapped in the shared layout. No real content yet — Phase 2+ will fill them.

### Mock data (`src/data/spots.json`)

5 spots with full multilingual `name` + `description` (zh-TW, ko, en; ja/zh-CN seeded), drama tags, region, type tags, Unsplash thumbnails, coords, popularity.

### i18n keys (Phase 1 scope)

`common.appName`, `nav.home`, `nav.spots`, `nav.myCourse`, `language.choose`, `language.subtitle`, `language.continue`, `pages.landing`, `pages.styleTest`, `pages.spots`, `pages.spotDetail`, `pages.myCourse` — fully translated for zh-TW + ko, stub translations for en/ja/zh-CN.

### Out of scope for Phase 1

Quiz logic, spot list UI, detail page, favorites UI, map integration — added in later prompts.
