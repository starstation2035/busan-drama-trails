"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { MOCK_REVIEWS, type Review } from "@/data/mockReviews";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const POSTERS = [
  { 
    title: "이상한 변호사 우영우", 
    year: "2022", 
    genre: "법정/휴먼",
    img: "https://image.tmdb.org/t/p/original/u6Cx6ijenevIQjtrjFpPgQzgI10.jpg", 
    link: "/spots/spot_001" 
  },
  { 
    title: "런닝맨", 
    year: "2010", 
    genre: "리얼리티/액션",
    img: "https://image.tmdb.org/t/p/original/15SMnscZqd7HZ0bzruatOcKUlOV.jpg", 
    link: "/spots/spot_002" 
  },
  { 
    title: "파친코", 
    year: "2022", 
    genre: "드라마",
    img: "https://image.tmdb.org/t/p/w500/aK640gWriIscSoSf30MNqtsvseo.jpg", 
    link: "/spots/pachinko" 
  },
  { 
    title: "변호인", 
    year: "2013", 
    genre: "드라마",
    img: "https://upload.wikimedia.org/wikipedia/en/b/b5/The_Attorney_poster.jpg", 
    link: "/spots/spot_004" 
  },
  { 
    title: "해운대", 
    year: "2009", 
    genre: "재난",
    img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Haeundae_film_poster.jpg", 
    link: "/spots?dramas=해운대" 
  }
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
          scrollLeft(speed);
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    const scrollLeft = (speed: number) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += speed;
      }
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
            {t("landing.hero.badge") || "One Shot Trap"}
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-bold leading-[1.1] tracking-tight text-[#222222]">
            {t("landing.title") || "부산의 영화 속으로,\n당신만의 트레일을 발견하세요"}
          </h1>
          <p className="text-lg text-[#717171] max-w-xl">
            {t("landing.subtitle") || "K-컬처를 느껴보세요 ✨"}
          </p>
          <div className="pt-2" />
        </header>

        {/* 🎬 Movie Posters Carousel */}
        <section className="animate-fade-up space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="text-2xl font-bold text-[#222222]">Busan in Cinema</h2>
              <p className="text-[13px] font-medium text-[#717171] uppercase tracking-widest mt-1">Filming Locations</p>
            </div>
            <Link href="/spots" className="text-sm font-bold text-[#FF385C] hover:underline underline-offset-4 decoration-2 transition-all">
              {t("landing.recentReviews.viewAll")}
            </Link>
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
                  className="group shrink-0 flex flex-col transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-airbnb aspect-[2/3] w-[220px] sm:w-[280px] mb-3">
                    <img
                      src={poster.img}
                      alt={poster.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-bold ring-1 ring-white/30 px-2 py-1 rounded backdrop-blur-sm">
                        {t("landing.cta.explore")}
                      </span>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="text-base font-bold text-[#222222] line-clamp-1 group-hover:text-[#FF385C] transition-colors">
                      {poster.title}
                    </h3>
                    <p className="text-[13px] text-[#717171] font-medium">
                      {poster.year} • {poster.genre}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="py-2" />

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

