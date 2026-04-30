"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, ArrowRight, MessageCircle, Map } from "lucide-react";
import { MOCK_REVIEWS, type Review } from "@/data/mockReviews";

import { useEffect, useRef, useState } from "react";

const POSTERS = [
  { img: "https://upload.wikimedia.org/wikipedia/en/9/95/Train_to_Busan.jpg", link: "/spots?types=맛집" },
  { img: "https://upload.wikimedia.org/wikipedia/en/0/04/Ode_to_My_Father.jpg", link: "/spots?types=카페" },
  { img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Haeundae_film_poster.jpg", link: "/spots?types=맛집" },
  { img: "https://upload.wikimedia.org/wikipedia/en/8/82/Decision_to_Leave_film_poster.jpg", link: "/spots?types=카페" },
  { img: "https://upload.wikimedia.org/wikipedia/en/b/b5/The_Attorney_poster.jpg", link: "/spots?types=맛집" },
  { img: "https://upload.wikimedia.org/wikipedia/en/3/3f/New_World2013-poster.jpg", link: "/spots?types=카페" },
  { img: "https://upload.wikimedia.org/wikipedia/en/2/20/Pachinko_%28TV_series%29.jpeg", link: "/spots?types=맛집" }
];

export default function Landing() {
  const { t } = useTranslation();
  const recentReviews = MOCK_REVIEWS.slice(0, 3);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, w: 0 });
  const requestRef = useRef<number>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      w: rect.width
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, w: 0 });
  };

  useEffect(() => {
    const animate = () => {
      if (scrollRef.current && mousePos.w > 0) {
        const center = mousePos.w / 2;
        const diff = mousePos.x - center;
        
        // Only move if mouse is inside and not exactly at center
        if (mousePos.x !== 0) {
          // Speed scale: max speed around 5-10px per frame
          const speed = (diff / center) * 10; 
          scrollRef.current.scrollLeft += speed;
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mousePos]);

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] flex-col items-center justify-between pb-10 pt-4">
      {/* Top Right Actions (Under Language Button) */}
      <div className="fixed right-6 top-[4.5rem] z-[50] flex flex-col items-end gap-3 animate-fade-up">
        <Link
          href="/community"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition-all hover:bg-black/30 active:scale-95"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t("nav.community")}
        </Link>
      </div>

      {/* 🎬 Movie Posters Cursor-Following Slider */}
      <section className="w-full mb-10 animate-fade-up mt-2 px-4">
        <h2 className="mb-4 text-left px-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
          Busan in Cinema
        </h2>
        <div 
          ref={scrollRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 sm:gap-6 w-max px-2">
            {POSTERS.map((poster, i) => (
              <Link 
                key={i} 
                href={poster.link} 
                className="shrink-0 transition-transform duration-500 hover:scale-[1.03] active:scale-95"
              >
                <img
                  src={poster.img}
                  alt="Busan Filming Location Poster"
                  className="h-[300px] w-[200px] sm:h-[420px] sm:w-[280px] rounded-3xl object-cover shadow-2xl border border-white/10"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Header (Top Center) */}
      <header className="flex flex-col items-center text-center animate-fade-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          부산여행 정보 및 스타일 추천
        </h1>
      </header>

      {/* Visual Category Navigator (Replaces Hero Image & Quick Nav) */}
      <section className="mt-4 w-full px-6 animate-fade-up">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { id: "spots", img: "/spot_category.png", label: "spots", link: "/spots" },
            { id: "myCourse", img: "/busan_harbor_bridge_sunset_1776481887078.png", label: "myCourse", link: "/my-course" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/20 bg-muted shadow-lg transition-all duration-500 hover:scale-[1.02] active:scale-95 sm:aspect-[3/4]"
            >
              <img
                src={item.img}
                alt={item.id}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="rounded-2xl bg-white/10 px-6 py-2 backdrop-blur-md border border-white/20">
                  <span className="text-lg font-black tracking-widest text-white drop-shadow-lg">
                    {item.id === "myCourse" ? t("nav.myCourse") : t(`landing.categories.${item.label}`)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Reviews Section (Real-time Updated Feed) */}
      <section className="mt-4 w-full px-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {t("landing.recentReviews.title")}
          </h2>
          <Link
            href="/community"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all"
          >
            {t("landing.recentReviews.viewAll")}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-4">
          {recentReviews.map((review: Review) => (
            <Link
              key={review.id}
              href="/community"
              className="group relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/20 bg-muted shadow-lg transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
              <img
                src={review.image}
                alt={review.location}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-colors group-hover:from-black/70" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-4 text-center pb-3">
                <div className="flex flex-col items-center gap-1.5 opacity-90 mb-1">
                  <img src={review.avatar} alt={review.author} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-white/50 shadow-sm" />
                  <span className="text-[9px] sm:text-[11px] font-bold text-white/90">{review.author}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-black tracking-wide text-white drop-shadow-md line-clamp-2 leading-snug px-1">
                  {review.content}
                </span>
                <div className="mt-1.5 flex items-center gap-0.5 text-[8px] sm:text-[10px] text-primary">
                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="truncate max-w-[70px] sm:max-w-none">{review.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
