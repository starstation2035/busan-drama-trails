"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, ArrowRight, MessageCircle, Map, Sparkles } from "lucide-react";
import { MOCK_REVIEWS, type Review } from "@/data/mockReviews";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

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
        
        if (mousePos.x !== 0) {
          const speed = (diff / center) * 12; 
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
    <div className="bg-background text-foreground min-h-screen">

      <div className="max-w-screen-xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <header className="flex flex-col items-start text-left animate-fade-up space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/10 text-[#FF385C] text-[13px] font-bold tracking-tight">
            <Sparkles className="h-3.5 w-3.5" />
            {t("landing.hero.badge") || "Busan Drama Trails"}
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-bold leading-[1.1] tracking-tight text-[#222222]">
            {t("landing.title") || "부산의 영화 속으로,\n당신만의 트레일을 발견하세요"}
          </h1>
          <p className="text-lg text-[#717171] max-w-xl">
            {t("landing.subtitle") || "에어비앤비처럼 편안하게, 한국 공공디자인의 직관성을 담아 부산의 숨겨진 영화 촬영지를 안내합니다."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/spots">
              <Button className="rounded-full bg-[#FF385C] hover:bg-[#E31C5F] text-white px-8 h-12 text-base font-bold shadow-md transition-all active:scale-95">
                {t("landing.cta.explore")}
              </Button>
            </Link>
            <Link href="/community">
              <Button variant="outline" className="rounded-full border-[#DDDDDD] bg-white text-[#222222] px-8 h-12 text-base font-bold shadow-sm hover:bg-[#F7F7F7] transition-all active:scale-95">
                <MessageCircle className="mr-2 h-4 w-4 text-[#FF385C]" />
                {t("landing.categories.community")}
              </Button>
            </Link>
          </div>
        </header>

        {/* 🎬 Movie Posters Carousel */}
        <section className="animate-fade-up space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-2xl font-bold text-[#222222]">Busan in Cinema</h2>
              <p className="text-[13px] font-medium text-[#717171] uppercase tracking-widest mt-1">Filming Locations</p>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="overflow-x-auto no-scrollbar scroll-smooth"
          >
            <div className="flex gap-6 w-max py-4 px-2">
              {POSTERS.map((poster, i) => (
                <Link 
                  key={i} 
                  href={poster.link} 
                  className="shrink-0 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="group relative overflow-hidden rounded-2xl shadow-airbnb aspect-[2/3] w-[220px] sm:w-[280px]">
                    <img
                      src={poster.img}
                      alt="Movie Poster"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 animate-fade-up">
          {[
            { id: "spots", img: "/spot_category.png", label: t("nav.spots"), link: "/spots", desc: t("landing.cta.explore") },
            { id: "myCourse", img: "/busan_harbor_bridge_sunset_1776481887078.png", label: t("nav.myCourse"), link: "/my-course", desc: t("pages.myCourse") },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex flex-col space-y-4"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-3xl shadow-airbnb border border-[#DDDDDD] bg-[#F7F7F7]">
                <img
                  src={item.img}
                  alt={item.label}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-2">
                <h3 className="text-lg font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors flex items-center gap-2">
                  {item.label}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-[15px] text-[#717171]">{item.desc}</p>
              </div>
            </Link>
          ))}
        </section>

        {/* Recent Reviews Section */}
        <section className="bg-[#F7F7F7] -mx-6 px-6 py-16 rounded-[40px] animate-fade-up">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-bold text-[#222222]">{t("landing.recentReviews.title")}</h2>
              <p className="text-base text-[#717171] mt-1">{t("landing.recentReviews.subtitle")}</p>
            </div>
            <Link href="/community">
              <Button variant="ghost" className="text-[#222222] font-bold hover:bg-white/50 rounded-full">
                {t("landing.recentReviews.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentReviews.map((review: Review) => (
              <Link
                key={review.id}
                href="/community"
                className="group bg-white rounded-3xl p-5 shadow-airbnb border border-[#DDDDDD] transition-all hover:-translate-y-1 active:scale-[0.98]"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl mb-4">
                  <img
                    src={review.image}
                    alt={review.location}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={review.avatar} alt={review.author} className="h-6 w-6 rounded-full border border-[#DDDDDD]" />
                    <span className="text-[13px] font-bold text-[#222222]">{review.author}</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[#222222] line-clamp-3 font-medium">
                    "{review.content}"
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#717171]">
                    <MapPin className="h-3.5 w-3.5 text-[#FF385C]" strokeWidth={1.5} />
                    <span className="truncate">{review.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

