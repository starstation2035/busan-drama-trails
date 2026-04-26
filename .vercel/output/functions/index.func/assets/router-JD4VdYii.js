import { jsx, jsxs } from "react/jsx-runtime";
import { Link, useLocation, Outlet, createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, notFound, createRouter, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation, initReactI18next } from "react-i18next";
import { Heart, Globe, Home, MapPin, Sparkles } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "i18next";
import { Toaster as Toaster$1 } from "sonner";
import { z } from "zod";
const useAppStore = create()(
  persist(
    (set, get) => ({
      lang: null,
      userStyle: null,
      favorites: [],
      setLang: (lang) => set({ lang }),
      setUserStyle: (userStyle) => set({ userStyle }),
      toggleFavorite: (id) => {
        const f = get().favorites;
        set({ favorites: f.includes(id) ? f.filter((x) => x !== id) : [...f, id] });
      }
    }),
    { name: "busan-app" }
  )
);
const FLAGS = {
  "zh-TW": { flag: "🇹🇼", native: "繁中" },
  ko: { flag: "🇰🇷", native: "한국어" },
  en: { flag: "🇺🇸", native: "EN" },
  ja: { flag: "🇯🇵", native: "日本語" },
  "zh-CN": { flag: "🇨🇳", native: "简중" }
};
function Header({ onOpenLang }) {
  const { t } = useTranslation();
  const lang = useAppStore((s) => s.lang) ?? "ko";
  const favorites = useAppStore((s) => s.favorites);
  const meta = FLAGS[lang] ?? FLAGS.ko;
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-14 max-w-screen-md items-center justify-between px-4", children: [
    /* @__PURE__ */ jsx(Link, { to: "/", className: "font-bold text-primary tracking-tight", children: t("common.appName") }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/my-course",
          id: "header-nav-my-course",
          className: "relative flex items-center justify-center p-2 rounded-full border border-border bg-background hover:bg-muted transition-all",
          title: t("nav.myCourse"),
          children: [
            /* @__PURE__ */ jsx(Heart, { className: `h-4 w-4 transition-colors ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}` }),
            favorites.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-background animate-in zoom-in duration-300", children: favorites.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onOpenLang,
          className: "flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted",
          children: [
            /* @__PURE__ */ jsx(Globe, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: meta.flag }),
            /* @__PURE__ */ jsx("span", { children: meta.native })
          ]
        }
      )
    ] })
  ] }) });
}
function BottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const favorites = useAppStore((s) => s.favorites);
  const items = [
    { to: "/", icon: Home, label: t("nav.home"), match: (p) => p === "/" },
    { to: "/spots", icon: MapPin, label: t("nav.spots"), match: (p) => p.startsWith("/spots") },
    { to: "/my-course", icon: Heart, label: t("nav.myCourse"), match: (p) => p.startsWith("/my-course"), id: "bottom-nav-my-course" },
    { to: "/style-test", icon: Sparkles, label: t("nav.styleTest"), match: (p) => p.startsWith("/style-test") }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl md:hidden safe-area-bottom", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex max-w-screen-md items-center justify-around px-4 py-3", children: items.map(({ to, icon: Icon, label, match, id }) => {
    const active = match(pathname);
    const isMyCourse = to === "/my-course";
    return /* @__PURE__ */ jsxs(
      Link,
      {
        to,
        id,
        className: `relative flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-bold tracking-tight transition-all active:scale-90 ${active ? "text-primary" : "text-muted-foreground"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Icon, { className: `h-6 w-6 transition-transform ${active ? "scale-110" : "scale-100"}` }),
            isMyCourse && favorites.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-background animate-in zoom-in duration-300", children: favorites.length })
          ] }),
          /* @__PURE__ */ jsx("span", { className: active ? "font-black" : "font-medium", children: label }),
          active && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 h-1 w-1 rounded-full bg-primary" })
        ]
      },
      to
    );
  }) }) });
}
const common$4 = { "appName": "釜山劇場 & 風格", "back": "上一題", "retake": "再測一次", "share": "分享結果", "copied": "已複製連結！" };
const nav$4 = { "home": "首頁", "spots": "拍攝地", "myCourse": "我的行程", "styleTest": "風格測試" };
const language$4 = { "choose": "選擇您的語言", "subtitle": "請選擇您偏好的語言以開始旅程", "continue": "繼續" };
const pages$4 = { "landing": "歡迎來到釜山", "styleTest": "旅遊風格測驗", "spots": "拍攝地點", "spotDetail": "地點詳情", "myCourse": "我的行程" };
const landing$4 = { "tagline": "走進韓劇場景，感受釜山的小確幸 ✨", "valueProp": { "spotsTitle": "韓劇拍攝地", "spotsDesc": "50+ 經典場景一次收藏", "foodTitle": "周邊美食精選", "foodDesc": "在地人推薦的隱藏名店", "routeTitle": "智慧行程規劃", "routeDesc": "一鍵生成你的釜山路線" }, "cta": { "explore": "開始探索拍攝地", "style": "找出我的旅遊風格" }, "stats": "50+ 拍攝地・200+ 美食・5 種語言" };
const quiz$4 = { "intro": { "badge": "6 題小測驗・約 1 分鐘", "title": "找出你的釜山旅遊風格 ✨", "subtitle": "用 6 個簡單問題，幫你量身打造最適合的釜山行程", "start": "開始測驗" }, "progress": "第 {{current}} / {{total}} 題", "questions": { "q1": { "title": "你心中最棒的釜山時刻是？", "a": "在安靜的海邊看夕陽", "b": "在熱鬧的市場逛逛吃吃" }, "q2": { "title": "你最想拍照的地方是？", "a": "色彩繽紛的藝術小村", "b": "韓劇裡的經典場景" }, "q3": { "title": "結束一天行程後，你想去？", "a": "可以看海的療癒咖啡廳", "b": "夜市攤販吃個過癮" }, "q4": { "title": "你的旅遊照通常是？", "a": "極簡空景＋美學構圖", "b": "充滿動感的抓拍瞬間" }, "q5": { "title": "到了拍攝地你會？", "a": "重現劇中的招牌姿勢", "b": "找出最美的拍照角度" }, "q6": { "title": "你理想的旅遊節奏是？", "a": "慢慢來，景點少而精", "b": "一天跑滿，玩好玩滿" } }, "result": { "yourStyle": "你的旅遊風格是", "recommendedTitle": "為你精選的 3 個拍攝地", "seeAll": "看全部適合我的拍攝地", "shareLine": "分享到 LINE", "shareIG": "分享到 IG 限動", "copyLink": "複製連結", "shareText": "我的釜山旅遊風格是「{{type}}」{{icon}} 來測測你的吧！" }, "types": { "healing": { "name": "治癒系旅人", "tagline": "你嚮往寧靜海邊與慢活咖啡廳" }, "active": { "name": "活力探險家", "tagline": "你愛市場、巷弄與滿滿煙火氣" }, "insta": { "name": "IG 美學控", "tagline": "你為了美照而旅行，講究每一格" }, "kdrama": { "name": "韓劇魂", "tagline": "你想親自走進每一幕喜歡的場景" } } };
const spots$4 = { "searchPlaceholder": "搜尋地點或韓劇", "addedToCourse": "已加入我的行程 ❤", "styleBanner": "正在顯示「{{style}}」風格的拍攝地", "clearStyle": "清除篩選", "count": "{{count}} 個拍攝地", "filters": { "drama": "韓劇", "region": "區域", "type": "類型" }, "sort": { "popular": "熱門", "newest": "最新", "nearest": "最近" }, "empty": { "title": "找不到符合的拍攝地", "subtitle": "試著調整搜尋或篩選條件吧", "reset": "重設所有篩選" } };
const detail$4 = { "back": "返回", "share": "分享", "copy": "複製", "copied": "已複製！", "info": { "address": "地址", "hours": "營業時間", "admission": "門票", "bestTime": "最佳時間" }, "bestTime": { "morning": "上午", "sunset": "日落", "night": "夜晚", "anytime": "任何時間" }, "scene": { "title": "場景對照", "drama": "韓劇場景", "real": "實景" }, "description": "地點介紹", "map": { "title": "位置地圖", "google": "Google Maps", "kakao": "KakaoMap", "copyAddr": "複製地址" }, "restaurants": { "title": "附近必吃 🍜", "distance": "{{m}} m", "price": "消費", "signature": "招牌", "directions": "前往這裡" }, "cafes": { "title": "絕美咖啡廳 ☕" }, "photoTips": { "title": "IG 必拍角度 📸" }, "visitTips": { "title": "旅遊小提醒 ⚠️", "show": "展開", "hide": "收合" }, "cta": { "add": "加入我的行程", "added": "查看我的行程 →" } };
const myCourse$4 = { "title": "我的釜山行程", "subtitle": "{{spots}} 個景點・{{restaurants}} 間餐廳・{{cafes}} 間咖啡廳", "removed": "已移除", "empty": { "message": "開始規劃你的釜山一日遊，把喜歡的景點加進來吧！", "cta": "去逛逛拍攝地" }, "tabs": { "course": "智慧行程", "list": "清單檢視" }, "groups": { "spots": "拍攝地", "restaurants": "餐廳", "cafes": "咖啡廳" }, "kinds": { "spot": "景點", "restaurant": "用餐", "cafe": "咖啡時間" }, "travel": { "walk": "步行", "taxi": "計程車", "subway": "地鐵" }, "totals": { "distance": "全長約 {{km}} km", "stops": "共 {{count}} 站" }, "warnings": { "tooFar": "景點分布較廣（約 {{km}} km），建議分成兩天走 ✨" }, "single": { "label": "今日唯一行程", "hint": "再加幾個景點，就能自動生成路線囉！" }, "actions": { "share": "分享", "regen": "重新規劃", "export": "匯出", "exportSoon": "PDF 匯出即將推出 ✨", "copyLink": "複製行程連結" }, "share": { "header": "我的釜山韓劇之旅 🎬" } };
const zhTW = {
  common: common$4,
  nav: nav$4,
  language: language$4,
  pages: pages$4,
  landing: landing$4,
  quiz: quiz$4,
  spots: spots$4,
  detail: detail$4,
  myCourse: myCourse$4
};
const common$3 = { "appName": "부산 드라마 스팟 & 스타일", "back": "이전", "retake": "다시 하기", "share": "결과 공유", "copied": "링크가 복사되었어요!" };
const nav$3 = { "home": "홈", "spots": "촬영지", "myCourse": "내 코스", "styleTest": "스타일 테스트" };
const language$3 = { "choose": "언어를 선택하세요", "subtitle": "여행을 시작하기 위해 선호하는 언어를 선택해주세요", "continue": "계속" };
const pages$3 = { "landing": "부산에 오신 것을 환영합니다", "styleTest": "여행 스타일 테스트", "spots": "촬영 장소", "spotDetail": "장소 상세", "myCourse": "내 코스" };
const landing$3 = { "tagline": "드라마 장면 속으로, 부산의 이야기를 만나다 ✨", "valueProp": { "spotsTitle": "드라마 촬영지", "spotsDesc": "50+ 명장면을 한 곳에", "foodTitle": "주변 맛집 큐레이션", "foodDesc": "현지인이 사랑하는 숨은 명소", "routeTitle": "스마트 코스 추천", "routeDesc": "나만의 부산 여행 코스 한 번에" }, "cta": { "explore": "촬영지 둘러보기", "style": "스마트 코스 추천" }, "stats": "50+ 촬영지・200+ 맛집・5개 언어" };
const quiz$3 = { "intro": { "badge": "6문항・약 1분 소요", "title": "나의 부산 여행 스타일은? ✨", "subtitle": "간단한 6가지 질문으로 딱 맞는 부산 코스를 찾아드려요", "start": "테스트 시작하기" }, "progress": "{{current}} / {{total}}", "questions": { "q1": { "title": "부산에서 가장 완벽한 순간은?", "a": "조용한 해변에서 보는 노을", "b": "활기찬 시장 구경" }, "q2": { "title": "최고의 인생샷 장소는?", "a": "벽화 가득한 알록달록 마을", "b": "유명 드라마의 상징적 장면" }, "q3": { "title": "긴 하루를 마치고 가고 싶은 곳은?", "a": "오션뷰 아늑한 카페", "b": "야시장 길거리 음식" }, "q4": { "title": "내 여행 사진 스타일은?", "a": "사람 적은 미니멀 풍경", "b": "역동적인 순간 포착" }, "q5": { "title": "촬영지에 도착하면?", "a": "드라마 속 포즈 그대로 재현", "b": "가장 예쁜 앵글 탐색" }, "q6": { "title": "이상적인 여행 페이스는?", "a": "여유롭게, 적게 깊게", "b": "하루를 가득, 다 보기" } }, "result": { "yourStyle": "당신의 여행 스타일은", "recommendedTitle": "당신을 위한 3개의 촬영지", "seeAll": "맞춤 촬영지 모두 보기", "shareLine": "LINE으로 공유", "shareIG": "IG 스토리에 공유", "copyLink": "링크 복사", "shareText": "내 부산 여행 스타일은 「{{type}}」 {{icon}} 너도 해봐!" }, "types": { "healing": { "name": "힐링 여행자", "tagline": "조용한 바다와 느린 카페를 좋아해요" }, "active": { "name": "액티브 탐험가", "tagline": "시장과 골목, 활기찬 거리를 사랑해요" }, "insta": { "name": "인스타 감성러", "tagline": "감성 사진을 위한 여행을 즐겨요" }, "kdrama": { "name": "K-드라마 덕후", "tagline": "좋아하는 장면 속으로 들어가요" } } };
const spots$3 = { "searchPlaceholder": "장소 또는 드라마 검색", "addedToCourse": "내 코스에 추가되었어요 ❤", "styleBanner": "「{{style}}」스타일 촬영지 보기", "clearStyle": "필터 초기화", "count": "{{count}}개 촬영지", "filters": { "drama": "드라마", "region": "지역", "type": "유형" }, "sort": { "popular": "인기순", "newest": "최신순", "nearest": "가까운순" }, "empty": { "title": "조건에 맞는 촬영지가 없어요", "subtitle": "검색어나 필터를 조정해보세요", "reset": "필터 초기화" } };
const detail$3 = { "back": "뒤로", "share": "공유", "copy": "복사", "copied": "복사됨!", "info": { "address": "주소", "hours": "운영시간", "admission": "입장료", "bestTime": "추천 시간" }, "bestTime": { "morning": "오전", "sunset": "노을", "night": "밤", "anytime": "언제든" }, "scene": { "title": "장면 비교", "drama": "드라마 장면", "real": "실제 장소" }, "description": "장소 소개", "map": { "title": "지도", "google": "Google Maps", "kakao": "카카오맵", "copyAddr": "주소 복사" }, "restaurants": { "title": "근처 맛집 🍜", "distance": "{{m}} m", "price": "가격", "signature": "시그니처", "directions": "길찾기" }, "cafes": { "title": "뷰 맛집 카페 ☕" }, "photoTips": { "title": "인생샷 가이드 📸" }, "visitTips": { "title": "방문 팁 ⚠️", "show": "펼치기", "hide": "접기" }, "cta": { "add": "내 코스에 추가", "added": "내 코스 보기 →" } };
const myCourse$3 = { "title": "나의 부산 코스", "subtitle": "스팟 {{spots}}・맛집 {{restaurants}}・카페 {{cafes}}", "removed": "삭제되었습니다", "empty": { "message": "좋아하는 장소를 담아 나만의 부산 하루 코스를 만들어보세요", "cta": "촬영지 둘러보기" }, "tabs": { "course": "스마트 코스", "list": "리스트 보기" }, "groups": { "spots": "촬영지", "restaurants": "맛집", "cafes": "카페" }, "kinds": { "spot": "스팟", "restaurant": "식사", "cafe": "카페 타임" }, "travel": { "walk": "도보", "taxi": "택시", "subway": "지하철" }, "totals": { "distance": "총 약 {{km}} km", "stops": "총 {{count}}곳" }, "warnings": { "tooFar": "장소가 멀리 떨어져 있어요 ({{km}} km). 2일로 나누는 걸 추천!" }, "single": { "label": "오늘의 유일한 일정", "hint": "몇 곳 더 추가하면 자동 코스가 생성돼요!" }, "actions": { "share": "공유", "regen": "다시 짜기", "export": "내보내기", "exportSoon": "PDF 내보내기는 곧 제공돼요 ✨", "copyLink": "링크 복사" }, "share": { "header": "나의 부산 K-드라마 코스 🎬", "layoutTitle": "부산 여행 코스" }, "memo": { "placeholder": "여행 메모를 남겨보세요...", "label": "메모" }, "customTravel": { "edit": "이동 시간 수정", "unit": "분" } };
const ko = {
  common: common$3,
  nav: nav$3,
  language: language$3,
  pages: pages$3,
  landing: landing$3,
  quiz: quiz$3,
  spots: spots$3,
  detail: detail$3,
  myCourse: myCourse$3
};
const common$2 = { "appName": "Busan Drama Spot & Style", "back": "Back", "retake": "Retake", "share": "Share result", "copied": "Link copied!" };
const nav$2 = { "home": "Home", "spots": "Spots", "myCourse": "My Course", "styleTest": "Style Test" };
const language$2 = { "choose": "Choose your language", "subtitle": "Select your preferred language to start your journey", "continue": "Continue" };
const pages$2 = { "landing": "Welcome to Busan", "styleTest": "Travel Style Test", "spots": "Filming Locations", "spotDetail": "Location Detail", "myCourse": "My Course" };
const landing$2 = { "tagline": "Step into K-drama scenes and discover the story of Busan ✨", "valueProp": { "spotsTitle": "Drama Filming Spots", "spotsDesc": "50+ iconic scenes in one place", "foodTitle": "Curated Local Eats", "foodDesc": "Hidden gems loved by locals", "routeTitle": "Smart Route Planning", "routeDesc": "Build your Busan trip in one tap" }, "cta": { "explore": "Explore Filming Locations", "style": "Find My Travel Style" }, "stats": "50+ Spots・200+ Restaurants・5 Languages" };
const quiz$2 = { "intro": { "badge": "6 questions・about 1 min", "title": "Find Your Busan Travel Style ✨", "subtitle": "Six quick questions to match you with the perfect Busan itinerary", "start": "Start the quiz" }, "progress": "{{current}} / {{total}}", "questions": { "q1": { "title": "Your ideal Busan moment?", "a": "Sunset at a quiet beach", "b": "Exploring a lively market" }, "q2": { "title": "Your perfect photo spot?", "a": "Colorful village with murals", "b": "Iconic drama scene" }, "q3": { "title": "After a long day, you want…", "a": "A cozy cafe with ocean view", "b": "Street food at a night market" }, "q4": { "title": "Your travel photos are usually…", "a": "Aesthetic minimal landscapes", "b": "Action shots and candids" }, "q5": { "title": "At a filming location, you…", "a": "Recreate the exact scene pose", "b": "Hunt the best photo angle" }, "q6": { "title": "Your ideal travel pace?", "a": "Slow and relaxed, fewer places", "b": "Maximize the day, see it all" } }, "result": { "yourStyle": "Your travel style is", "recommendedTitle": "3 spots picked for you", "seeAll": "See all spots for me", "shareLine": "Share to LINE", "shareIG": "Share to IG Story", "copyLink": "Copy link", "shareText": 'My Busan travel style is "{{type}}" {{icon}} — try it!' }, "types": { "healing": { "name": "Healing Traveler", "tagline": "You crave peaceful beaches and slow cafes" }, "active": { "name": "Active Explorer", "tagline": "You love markets, alleys, and vibrant streets" }, "insta": { "name": "Insta Photographer", "tagline": "You live for aesthetic photos and unique views" }, "kdrama": { "name": "K-Drama Devotee", "tagline": "You want to step into your favorite scenes" } } };
const spots$2 = { "searchPlaceholder": "Search by location or drama", "addedToCourse": "Added to My Course ❤", "styleBanner": "Showing spots for {{style}}", "clearStyle": "Clear filter", "count": "{{count}} locations", "filters": { "drama": "Drama", "region": "Region", "type": "Type" }, "sort": { "popular": "Popular", "newest": "Newest", "nearest": "Nearest" }, "empty": { "title": "No spots match", "subtitle": "Try adjusting your search or filters", "reset": "Reset filters" } };
const detail$2 = { "back": "Back", "share": "Share", "copy": "Copy", "copied": "Copied!", "info": { "address": "Address", "hours": "Hours", "admission": "Admission", "bestTime": "Best time" }, "bestTime": { "morning": "Morning", "sunset": "Sunset", "night": "Night", "anytime": "Anytime" }, "scene": { "title": "Scene comparison", "drama": "Drama scene", "real": "Real location" }, "description": "About this spot", "map": { "title": "Location", "google": "Google Maps", "kakao": "KakaoMap", "copyAddr": "Copy address" }, "restaurants": { "title": "Where to Eat Nearby 🍜", "distance": "{{m}} m", "price": "Price", "signature": "Signature", "directions": "Directions" }, "cafes": { "title": "Cafes with a View ☕" }, "photoTips": { "title": "Perfect Instagram Shots 📸" }, "visitTips": { "title": "Visit tips ⚠️", "show": "Show", "hide": "Hide" }, "cta": { "add": "Add to My Course", "added": "View My Course →" } };
const myCourse$2 = { "title": "My Busan Course", "subtitle": "{{spots}} spots・{{restaurants}} restaurants・{{cafes}} cafes", "removed": "Removed", "empty": { "message": "Start building your perfect Busan day trip", "cta": "Browse Filming Locations" }, "tabs": { "course": "Smart Course", "list": "List View" }, "groups": { "spots": "Spots", "restaurants": "Restaurants", "cafes": "Cafes" }, "kinds": { "spot": "Spot", "restaurant": "Meal", "cafe": "Cafe break" }, "travel": { "walk": "walk", "taxi": "taxi", "subway": "subway" }, "totals": { "distance": "Total ~{{km}} km", "stops": "{{count}} stops" }, "warnings": { "tooFar": "Spots are spread out (~{{km}} km). Consider splitting into 2 days." }, "single": { "label": "Today's only stop", "hint": "Add a few more spots to auto-generate a route!" }, "actions": { "share": "Share", "regen": "Regenerate", "export": "Export", "exportSoon": "PDF export coming soon ✨", "copyLink": "Copy course link" }, "share": { "header": "My Busan K-Drama Course 🎬" } };
const en = {
  common: common$2,
  nav: nav$2,
  language: language$2,
  pages: pages$2,
  landing: landing$2,
  quiz: quiz$2,
  spots: spots$2,
  detail: detail$2,
  myCourse: myCourse$2
};
const common$1 = { "appName": "釜山ドラマスポット & スタイル", "back": "戻る", "retake": "もう一度", "share": "結果をシェア", "copied": "リンクをコピーしました!" };
const nav$1 = { "home": "ホーム", "spots": "撮影地", "myCourse": "マイコース", "styleTest": "スタイルテスト" };
const language$1 = { "choose": "言語を選択してください", "subtitle": "旅を始めるためのお好みの言語を選んでください", "continue": "続ける" };
const pages$1 = { "landing": "釜山へようこそ", "styleTest": "旅行スタイル診断", "spots": "撮影スポット", "spotDetail": "スポット詳細", "myCourse": "マイコース" };
const landing$1 = { "tagline": "ドラマの世界へ、釜山の物語を歩く ✨", "valueProp": { "spotsTitle": "ドラマ撮影地", "spotsDesc": "50以上の名シーンを一挙紹介", "foodTitle": "周辺グルメ厳選", "foodDesc": "地元で愛される隠れた名店", "routeTitle": "スマートコース提案", "routeDesc": "あなただけの釜山プランをワンタップで" }, "cta": { "explore": "撮影地を見る", "style": "私の旅スタイル診断" }, "stats": "50+ スポット・200+ グルメ・5言語" };
const quiz$1 = { "intro": { "badge": "全6問・約1分", "title": "あなたの釜山旅スタイル診断 ✨", "subtitle": "6つの質問でぴったりの釜山プランを見つけよう", "start": "診断スタート" }, "progress": "{{current}} / {{total}}", "questions": { "q1": { "title": "理想の釜山の瞬間は?", "a": "静かな海辺で見る夕日", "b": "活気ある市場めぐり" }, "q2": { "title": "最高のフォトスポットは?", "a": "壁画あふれるカラフルな村", "b": "有名ドラマの名シーン" }, "q3": { "title": "長い一日の後に行きたいのは?", "a": "オーシャンビューのカフェ", "b": "夜市の屋台グルメ" }, "q4": { "title": "旅の写真スタイルは?", "a": "ミニマルな風景重視", "b": "躍動感ある瞬間ショット" }, "q5": { "title": "撮影地に着いたら?", "a": "ドラマのポーズを再現", "b": "最高のアングルを探す" }, "q6": { "title": "理想の旅のペースは?", "a": "ゆったり少なく深く", "b": "1日を満喫、全部回る" } }, "result": { "yourStyle": "あなたの旅スタイルは", "recommendedTitle": "あなたへのおすすめ3スポット", "seeAll": "おすすめスポットを全部見る", "shareLine": "LINEでシェア", "shareIG": "IGストーリーズでシェア", "copyLink": "リンクをコピー", "shareText": "私の釜山旅スタイルは「{{type}}」{{icon}} 試してみて!" }, "types": { "healing": { "name": "癒し系トラベラー", "tagline": "静かな海とゆるカフェが好き" }, "active": { "name": "アクティブ探検家", "tagline": "市場と路地、賑わいが大好き" }, "insta": { "name": "インスタ映え派", "tagline": "美しい一枚のために旅をする" }, "kdrama": { "name": "K-ドラマ沼", "tagline": "好きなシーンの中に飛び込みたい" } } };
const spots$1 = { "searchPlaceholder": "場所やドラマで検索", "addedToCourse": "マイコースに追加しました ❤", "styleBanner": "「{{style}}」スタイルの撮影地", "clearStyle": "フィルター解除", "count": "{{count}}件の撮影地", "filters": { "drama": "ドラマ", "region": "エリア", "type": "タイプ" }, "sort": { "popular": "人気", "newest": "新着", "nearest": "近い順" }, "empty": { "title": "該当する撮影地がありません", "subtitle": "検索やフィルターを調整してみてください", "reset": "フィルターをリセット" } };
const detail$1 = { "back": "戻る", "share": "シェア", "copy": "コピー", "copied": "コピーしました!", "info": { "address": "住所", "hours": "営業時間", "admission": "入場料", "bestTime": "おすすめ時間" }, "bestTime": { "morning": "午前", "sunset": "夕焼け", "night": "夜", "anytime": "いつでも" }, "scene": { "title": "シーン比較", "drama": "ドラマシーン", "real": "実際の場所" }, "description": "スポット紹介", "map": { "title": "地図", "google": "Google Maps", "kakao": "KakaoMap", "copyAddr": "住所コピー" }, "restaurants": { "title": "周辺グルメ 🍜", "distance": "{{m}} m", "price": "価格", "signature": "看板", "directions": "道順" }, "cafes": { "title": "絶景カフェ ☕" }, "photoTips": { "title": "映え撮影ガイド 📸" }, "visitTips": { "title": "訪問のコツ ⚠️", "show": "開く", "hide": "閉じる" }, "cta": { "add": "マイコースに追加", "added": "マイコースを見る →" } };
const myCourse$1 = { "title": "私の釜山コース", "subtitle": "スポット{{spots}}・グルメ{{restaurants}}・カフェ{{cafes}}", "removed": "削除しました", "empty": { "message": "お気に入りを集めて、あなただけの釜山1日プランを作ろう", "cta": "撮影地を見る" }, "tabs": { "course": "スマートコース", "list": "リスト表示" }, "groups": { "spots": "撮影地", "restaurants": "グルメ", "cafes": "カフェ" }, "kinds": { "spot": "スポット", "restaurant": "食事", "cafe": "カフェタイム" }, "travel": { "walk": "徒歩", "taxi": "タクシー", "subway": "地下鉄" }, "totals": { "distance": "全長約 {{km}} km", "stops": "全{{count}}スポット" }, "warnings": { "tooFar": "スポットが離れています（約{{km}}km）。2日に分けるのがおすすめ" }, "single": { "label": "今日の唯一の予定", "hint": "もう数か所追加すると自動コースが作れます!" }, "actions": { "share": "シェア", "regen": "作り直す", "export": "エクスポート", "exportSoon": "PDF出力は近日公開 ✨", "copyLink": "リンクをコピー" }, "share": { "header": "私の釜山ドラマ巡り 🎬" } };
const ja = {
  common: common$1,
  nav: nav$1,
  language: language$1,
  pages: pages$1,
  landing: landing$1,
  quiz: quiz$1,
  spots: spots$1,
  detail: detail$1,
  myCourse: myCourse$1
};
const common = { "appName": "釜山剧场 & 风格", "back": "上一题", "retake": "再测一次", "share": "分享结果", "copied": "链接已复制!" };
const nav = { "home": "首页", "spots": "拍摄地", "myCourse": "我的行程", "styleTest": "风格测试" };
const language = { "choose": "选择您的语言", "subtitle": "请选择您偏好的语言以开始旅程", "continue": "继续" };
const pages = { "landing": "欢迎来到釜山", "styleTest": "旅游风格测验", "spots": "拍摄地点", "spotDetail": "地点详情", "myCourse": "我的行程" };
const landing = { "tagline": "走进韩剧场景,感受釜山的小确幸 ✨", "valueProp": { "spotsTitle": "韩剧拍摄地", "spotsDesc": "50+ 经典场景一次收藏", "foodTitle": "周边美食精选", "foodDesc": "本地人推荐的隐藏名店", "routeTitle": "智能行程规划", "routeDesc": "一键生成你的釜山路线" }, "cta": { "explore": "开始探索拍摄地", "style": "找出我的旅游风格" }, "stats": "50+ 拍摄地・200+ 美食・5 种语言" };
const quiz = { "intro": { "badge": "6 题・约 1 分钟", "title": "找出你的釜山旅游风格 ✨", "subtitle": "6 个简单问题,帮你定制最合适的釜山行程", "start": "开始测验" }, "progress": "第 {{current}} / {{total}} 题", "questions": { "q1": { "title": "你最棒的釜山时刻?", "a": "安静海边看夕阳", "b": "热闹市场逛吃" }, "q2": { "title": "最想拍照的地方?", "a": "色彩缤纷的艺术村", "b": "韩剧经典场景" }, "q3": { "title": "结束一天后想去?", "a": "海景治愈咖啡馆", "b": "夜市街头小吃" }, "q4": { "title": "你的旅游照风格?", "a": "极简空景＋美学构图", "b": "动感抓拍瞬间" }, "q5": { "title": "到拍摄地你会?", "a": "重现剧中招牌姿势", "b": "寻找最美拍照角度" }, "q6": { "title": "理想的旅游节奏?", "a": "慢慢来,少而精", "b": "一天跑满,全部打卡" } }, "result": { "yourStyle": "你的旅游风格是", "recommendedTitle": "为你精选 3 个拍摄地", "seeAll": "查看全部适合我的拍摄地", "shareLine": "分享到 LINE", "shareIG": "分享到 IG 快拍", "copyLink": "复制链接", "shareText": "我的釜山旅游风格是「{{type}}」{{icon}} 你也来测!" }, "types": { "healing": { "name": "治愈系旅人", "tagline": "向往宁静海边与慢活咖啡馆" }, "active": { "name": "活力探险家", "tagline": "热爱市场、巷弄与满满烟火气" }, "insta": { "name": "IG 美学控", "tagline": "为了美照而旅行,讲究每一格" }, "kdrama": { "name": "韩剧魂", "tagline": "想亲自走进每一幕喜欢的场景" } } };
const spots = { "searchPlaceholder": "搜索地点或韩剧", "addedToCourse": "已加入我的行程 ❤", "styleBanner": "正在显示「{{style}}」风格的拍摄地", "clearStyle": "清除筛选", "count": "{{count}} 个拍摄地", "filters": { "drama": "韩剧", "region": "区域", "type": "类型" }, "sort": { "popular": "热门", "newest": "最新", "nearest": "最近" }, "empty": { "title": "找不到符合的拍摄地", "subtitle": "试着调整搜索或筛选条件吧", "reset": "重置所有筛选" } };
const detail = { "back": "返回", "share": "分享", "copy": "复制", "copied": "已复制!", "info": { "address": "地址", "hours": "营业时间", "admission": "门票", "bestTime": "最佳时间" }, "bestTime": { "morning": "上午", "sunset": "日落", "night": "夜晚", "anytime": "任何时间" }, "scene": { "title": "场景对照", "drama": "韩剧场景", "real": "实景" }, "description": "地点介绍", "map": { "title": "位置地图", "google": "Google Maps", "kakao": "KakaoMap", "copyAddr": "复制地址" }, "restaurants": { "title": "附近必吃 🍜", "distance": "{{m}} m", "price": "消费", "signature": "招牌", "directions": "前往这里" }, "cafes": { "title": "绝美咖啡馆 ☕" }, "photoTips": { "title": "IG 必拍角度 📸" }, "visitTips": { "title": "旅游小提醒 ⚠️", "show": "展开", "hide": "收起" }, "cta": { "add": "加入我的行程", "added": "查看我的行程 →" } };
const myCourse = { "title": "我的釜山行程", "subtitle": "{{spots}} 个景点・{{restaurants}} 间餐厅・{{cafes}} 间咖啡馆", "removed": "已移除", "empty": { "message": "开始打造你的釜山一日游，把喜欢的地点加进来吧!", "cta": "去逛拍摄地" }, "tabs": { "course": "智能行程", "list": "清单视图" }, "groups": { "spots": "拍摄地", "restaurants": "餐厅", "cafes": "咖啡馆" }, "kinds": { "spot": "景点", "restaurant": "用餐", "cafe": "咖啡时间" }, "travel": { "walk": "步行", "taxi": "出租车", "subway": "地铁" }, "totals": { "distance": "全长约 {{km}} km", "stops": "共 {{count}} 站" }, "warnings": { "tooFar": "景点分布较广(约 {{km}} km)，建议分两天游玩" }, "single": { "label": "今日唯一行程", "hint": "再加几个地点就能自动生成路线!" }, "actions": { "share": "分享", "regen": "重新规划", "export": "导出", "exportSoon": "PDF 导出即将推出 ✨", "copyLink": "复制行程链接" }, "share": { "header": "我的釜山韩剧之旅 🎬" } };
const zhCN = {
  common,
  nav,
  language,
  pages,
  landing,
  quiz,
  spots,
  detail,
  myCourse
};
function detectBrowserLang() {
  if (typeof navigator === "undefined") return "ko";
  const nav2 = navigator.language || "";
  if (nav2.startsWith("zh-TW") || nav2.startsWith("zh-HK")) return "zh-TW";
  if (nav2.startsWith("zh")) return "zh-CN";
  if (nav2.startsWith("ko")) return "ko";
  if (nav2.startsWith("ja")) return "ja";
  if (nav2.startsWith("en")) return "en";
  return "ko";
}
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      "zh-TW": { translation: zhTW },
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja },
      "zh-CN": { translation: zhCN }
    },
    lng: "ko",
    fallbackLng: "ko",
    interpolation: { escapeValue: false }
  });
}
const OPTIONS = [
  { code: "zh-TW", flag: "🇹🇼", native: "繁體中文" },
  { code: "ko", flag: "🇰🇷", native: "한국어" },
  { code: "en", flag: "🇺🇸", native: "English" },
  { code: "ja", flag: "🇯🇵", native: "日本語" },
  { code: "zh-CN", flag: "🇨🇳", native: "简体中文" }
];
function LanguageModal({ open, onClose }) {
  const { t, i18n: i18n2 } = useTranslation();
  const { lang, setLang } = useAppStore();
  const [selected, setSelected] = useState(lang ?? detectBrowserLang());
  useEffect(() => {
    if (open) setSelected(lang ?? detectBrowserLang());
  }, [open, lang]);
  if (!open) return null;
  const handleConfirm = () => {
    setLang(selected);
    void i18n2.changeLanguage(selected);
    onClose();
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-3xl bg-background p-6 shadow-2xl animate-in slide-in-from-bottom-8", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: t("language.choose") }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: t("language.subtitle") }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2", children: OPTIONS.map((o) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setSelected(o.code),
        className: `flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${selected === o.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xl", children: o.flag }),
          /* @__PURE__ */ jsx("span", { className: "flex-1 font-semibold text-foreground", children: o.native }),
          selected === o.code && /* @__PURE__ */ jsx("span", { className: "h-3 w-3 rounded-full bg-primary", "aria-hidden": true })
        ]
      },
      o.code
    )) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleConfirm,
        className: "mt-6 w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90",
        children: t("language.continue")
      }
    )
  ] }) });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function HeartEffect() {
  const [hearts, setHearts] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHeartFly = (e) => {
      const newHeart = {
        id: Date.now() + Math.random(),
        startX: e.detail.x,
        startY: e.detail.y
      };
      setHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1200);
    };
    window.addEventListener("heart-fly", handleHeartFly);
    return () => window.removeEventListener("heart-fly", handleHeartFly);
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0 z-[100] overflow-hidden", children: hearts.map((heart) => /* @__PURE__ */ jsx(HeartAnimation, { ...heart }, heart.id)) });
}
function HeartAnimation({ startX, startY }) {
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targetEl = document.getElementById("header-nav-my-course");
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      setTargetPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    } else {
      setTargetPos({ x: window.innerWidth / 2, y: 50 });
    }
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "absolute animate-heart-fly",
      style: {
        "--start-x": `${startX}px`,
        "--start-y": `${startY}px`,
        "--target-x": `${targetPos.x - startX}px`,
        "--target-y": `${targetPos.y - startY}px`
      },
      children: /* @__PURE__ */ jsx(Heart, { className: "size-6 fill-rose-500 text-rose-500" })
    }
  );
}
function triggerHeartFly(x, y) {
  const event = new CustomEvent("heart-fly", { detail: { x, y } });
  window.dispatchEvent(event);
}
function Layout() {
  const { i18n: i18n2 } = useTranslation();
  const lang = useAppStore((s) => s.lang);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (!lang) {
      setModalOpen(true);
    } else if (i18n2.language !== lang) {
      void i18n2.changeLanguage(lang);
    }
  }, [lang, i18n2]);
  if (!mounted) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsx("div", { className: "h-14 border-b border-border/60" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background pb-20 md:pb-0", children: [
    /* @__PURE__ */ jsx(HeartEffect, {}),
    /* @__PURE__ */ jsx(Header, { onOpenLang: () => setModalOpen(true) }),
    /* @__PURE__ */ jsx("main", { className: "mx-auto max-w-screen-md px-4 py-6", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(BottomNav, {}),
    /* @__PURE__ */ jsx(LanguageModal, { open: modalOpen, onClose: () => setModalOpen(false) }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center" })
  ] });
}
const appCss = "/assets/styles-PCHZ_u_G.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$7 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Busan Drama Spot & Style" },
      {
        name: "description",
        content: "Discover K-drama filming locations, restaurants, and cafes in Busan."
      },
      { property: "og:title", content: "Busan Drama Spot & Style" },
      { name: "twitter:title", content: "Busan Drama Spot & Style" },
      { name: "description", content: "Busan Drama Trails is a mobile-first tourism guide for K-drama and movie fans." },
      { property: "og:description", content: "Busan Drama Trails is a mobile-first tourism guide for K-drama and movie fans." },
      { name: "twitter:description", content: "Busan Drama Trails is a mobile-first tourism guide for K-drama and movie fans." },
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: Layout,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$6 = () => import("./style-test-m3ep_CQi.js");
const Route$6 = createFileRoute("/style-test")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  head: () => ({
    meta: [{
      title: "Travel Style Test — Busan Drama Spot & Style"
    }, {
      name: "description",
      content: "Take a quick 6-question quiz to discover your Busan travel style and get matched with the perfect K-drama filming locations."
    }]
  })
});
const $$splitComponentImporter$5 = () => import("./spots-BK1OCTk0.js");
const searchSchema = z.object({
  tab: z.enum(["drama", "tour"]).optional().catch("drama")
});
const Route$5 = createFileRoute("/spots")({
  validateSearch: (search) => searchSchema.parse(search),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./my-course-DFbNBW0k.js");
const Route$4 = createFileRoute("/my-course")({
  head: () => ({
    meta: [{
      title: "My Busan Course — Drama Spot & Style"
    }, {
      name: "description",
      content: "Build your personal Busan filming-location itinerary with smart route planning."
    }, {
      property: "og:title",
      content: "My Busan Course"
    }, {
      property: "og:description",
      content: "Your saved spots as a smart day-trip plan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-BFRY3GCO.js");
const Route$3 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Busan Drama Spot & Style — K-Drama Filming Locations Guide"
    }, {
      name: "description",
      content: "Discover Busan's K-drama and movie filming locations with curated nearby restaurants and smart route planning."
    }, {
      property: "og:title",
      content: "Busan Drama Spot & Style"
    }, {
      property: "og:description",
      content: "Step into K-drama scenes and discover the story of Busan."
    }, {
      property: "og:image",
      content: "https://image.tmdb.org/t/p/original/cQ6bU0C7hFkPqS06rR13M3eP6z4.jpg"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const spotsRaw = [
  {
    id: "spot_001",
    name: {
      ko: "청사포 다릿돌전망대",
      en: "Cheongsapo Daritdol Observatory"
    },
    drama: [
      "이상한 변호사 우영우"
    ],
    category: "drama",
    region: "해운대",
    thumbnail: "https://images.unsplash.com/photo-1620317510793-780965768f7b?w=1200",
    coords: {
      lat: 35.1589,
      lng: 129.1992
    },
    description: {
      ko: "드라마 '우영우'의 배경이 된 바다 위 투명 다리."
    },
    address: {
      ko: "부산 해운대구 청사포로 132번길"
    },
    nearby_restaurants: [
      "r1",
      "r12"
    ],
    nearby_cafes: [
      "c1",
      "c7"
    ]
  },
  {
    id: "spot_002",
    name: {
      ko: "감천문화마을",
      en: "Gamcheon Culture Village"
    },
    drama: [
      "런닝맨"
    ],
    category: "landmark",
    region: "사하구",
    thumbnail: "https://images.unsplash.com/photo-1544551763-47a0159f963f?w=1200",
    coords: {
      lat: 35.0975,
      lng: 129.0107
    },
    description: {
      ko: "부산의 마추픽추라 불리는 알록달록한 산자락 마을."
    },
    address: {
      ko: "부산 사하구 감내2로 203"
    },
    nearby_restaurants: [
      "r2",
      "r11"
    ],
    nearby_cafes: [
      "c2",
      "c10"
    ]
  },
  {
    id: "spot_003",
    name: {
      ko: "해운대 해수욕장",
      en: "Haeundae Beach"
    },
    drama: [
      "해운대"
    ],
    category: "landmark",
    region: "해운대",
    thumbnail: "https://images.unsplash.com/photo-1578326309852-f94d93077755?w=1200",
    coords: {
      lat: 35.1587,
      lng: 129.1604
    },
    description: {
      ko: "부산을 상징하는 대한민국 대표 해수욕장."
    },
    address: {
      ko: "부산 해운대구 해운대해변로 264"
    },
    nearby_restaurants: [
      "r3",
      "r10"
    ],
    nearby_cafes: [
      "c3",
      "c11"
    ]
  },
  {
    id: "spot_004",
    name: {
      ko: "흰여울문화마을",
      en: "Huinnyeoul Culture Village"
    },
    drama: [
      "변호인"
    ],
    category: "drama",
    region: "영도구",
    thumbnail: "https://images.unsplash.com/photo-1610478050965-f485f4705500?w=1200",
    coords: {
      lat: 35.0786,
      lng: 129.0436
    },
    description: {
      ko: "영화 '변호인'의 배경이 된 아름다운 해안 절벽 마을."
    },
    address: {
      ko: "부산 영도구 흰여울길 307"
    },
    nearby_restaurants: [
      "r4",
      "r8"
    ],
    nearby_cafes: [
      "c4",
      "c12"
    ]
  },
  {
    id: "spot_005",
    name: {
      ko: "자갈치시장",
      en: "Jagalchi Market"
    },
    drama: [
      "친구"
    ],
    category: "drama",
    region: "중구",
    thumbnail: "https://images.unsplash.com/photo-1616110825704-57223b204683?w=1200",
    coords: {
      lat: 35.0966,
      lng: 129.0306
    },
    description: {
      ko: "영화 '친구'의 추격전이 벌어진 한국 최대 수산시장."
    },
    address: {
      ko: "부산 중구 자갈치해안로 52"
    },
    nearby_restaurants: [
      "r5",
      "r8"
    ],
    nearby_cafes: [
      "c9"
    ]
  },
  {
    id: "pachinko",
    name: {
      ko: "영도 감지해변",
      en: "Yeongdo Gamji Beach"
    },
    drama: [
      "파친코"
    ],
    category: "drama",
    region: "영도구",
    thumbnail: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200",
    coords: {
      lat: 35.0617,
      lng: 129.0767
    },
    description: {
      ko: "드라마 '파칭코'의 오프닝과 선자의 어린 시절 주요 무대가 된 이곳은 실제 부산 영도의 '감지해변'입니다. 영화 속에서는 일제강점기 척박한 삶을 견뎌내는 선자의 강인한 생명력을 상징하는 장소로 그려졌습니다. 실제 감지해변은 파도에 부딪히는 자갈 소리가 아름다운 몽돌 해변이며, 지금도 해녀들이 갓 잡은 해산물을 파는 해녀촌이 운영되고 있어 영화 속 분위기와 현대의 정취를 동시에 느낄 수 있습니다."
    },
    address: {
      ko: "부산광역시 영도구 동삼동 감지해변"
    },
    drama_scenes: [
      {
        title: "Young Sunja at the beach",
        episode: 1,
        scene_image: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1200"
      }
    ],
    photo_tips: [
      {
        image: "https://images.unsplash.com/photo-1544551763-47a0159f963f?w=1200",
        tip: {
          ko: "해안가 바위 위에서 바다를 배경으로 찍어보세요."
        }
      }
    ],
    nearby_restaurants: [
      "r4",
      "r11"
    ],
    nearby_cafes: [
      "c4",
      "c12"
    ],
    visit_tips: {
      ko: "해변을 따라 늘어선 해녀촌에서 신선한 해산물을 맛볼 수 있습니다. 자갈 해변이므로 편한 신발을 신는 것을 추천드려요!"
    }
  },
  {
    id: "spot_007",
    name: {
      ko: "광안리 해수욕장",
      en: "Gwangalli Beach"
    },
    drama: [
      "블랙팬서"
    ],
    category: "landmark",
    region: "수영구",
    thumbnail: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1200",
    coords: {
      lat: 35.1531,
      lng: 129.1189
    },
    description: {
      ko: "광안대교의 야경이 환상적인 부산의 핫플레이스."
    },
    address: {
      ko: "부산 수영구 광안해변로 219"
    },
    nearby_restaurants: [
      "r6",
      "r9"
    ],
    nearby_cafes: [
      "c5"
    ]
  },
  {
    id: "spot_008",
    name: {
      ko: "송도 해수욕장",
      en: "Songdo Beach"
    },
    drama: [
      "마이네임"
    ],
    category: "landmark",
    region: "서구",
    thumbnail: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=1200",
    coords: {
      lat: 35.0761,
      lng: 129.0173
    },
    description: {
      ko: "한국 최초의 공설 해수욕장으로, 송도해상케이블카와 스카이워크가 유명합니다."
    },
    address: {
      ko: "부산 서구 송도해변로 100"
    },
    nearby_restaurants: [
      "r5",
      "r8"
    ],
    nearby_cafes: [
      "c9"
    ]
  }
];
const $$splitNotFoundComponentImporter = () => import("./spots._id-B-Y9ybBE.js");
const $$splitComponentImporter$2 = () => import("./spots._id-BV9AI62V.js");
const SPOTS = spotsRaw;
const Route$2 = createFileRoute("/spots/$id")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  loader: ({
    params
  }) => {
    const spot = SPOTS.find((s) => s.id === params.id);
    if (!spot) throw notFound();
    return {
      spot
    };
  },
  head: ({
    loaderData
  }) => {
    const spot = loaderData?.spot;
    if (!spot) return {
      meta: [{
        title: "Spot — Busan Drama Spot & Style"
      }]
    };
    const name = spot.name.en ?? spot.name.ko ?? "Filming spot";
    const desc = spot.description.en ?? spot.description.ko ?? "";
    return {
      meta: [{
        title: `${name} — Busan Drama Spot & Style`
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: name
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:image",
        content: spot.thumbnail
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:image",
        content: spot.thumbnail
      }]
    };
  },
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$1 = () => import("./spots._id.nearby-DvB5hTYW.js");
const Route$1 = createFileRoute("/spots/$id/nearby")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./spots._id.nearby._itemId-ClcpDUrq.js");
const Route = createFileRoute("/spots/$id/nearby/$itemId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StyleTestRoute = Route$6.update({
  id: "/style-test",
  path: "/style-test",
  getParentRoute: () => Route$7
});
const SpotsRoute = Route$5.update({
  id: "/spots",
  path: "/spots",
  getParentRoute: () => Route$7
});
const MyCourseRoute = Route$4.update({
  id: "/my-course",
  path: "/my-course",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const SpotsIdRoute = Route$2.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => SpotsRoute
});
const SpotsIdNearbyRoute = Route$1.update({
  id: "/nearby",
  path: "/nearby",
  getParentRoute: () => SpotsIdRoute
});
const SpotsIdNearbyItemIdRoute = Route.update({
  id: "/$itemId",
  path: "/$itemId",
  getParentRoute: () => SpotsIdNearbyRoute
});
const SpotsIdNearbyRouteChildren = {
  SpotsIdNearbyItemIdRoute
};
const SpotsIdNearbyRouteWithChildren = SpotsIdNearbyRoute._addFileChildren(
  SpotsIdNearbyRouteChildren
);
const SpotsIdRouteChildren = {
  SpotsIdNearbyRoute: SpotsIdNearbyRouteWithChildren
};
const SpotsIdRouteWithChildren = SpotsIdRoute._addFileChildren(SpotsIdRouteChildren);
const SpotsRouteChildren = {
  SpotsIdRoute: SpotsIdRouteWithChildren
};
const SpotsRouteWithChildren = SpotsRoute._addFileChildren(SpotsRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  MyCourseRoute,
  SpotsRoute: SpotsRouteWithChildren,
  StyleTestRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$2 as R,
  Route$1 as a,
  Route as b,
  router as r,
  spotsRaw as s,
  triggerHeartFly as t,
  useAppStore as u
};
