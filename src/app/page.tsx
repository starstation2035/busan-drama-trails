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
    link: "/spots/spot_003" 
  },
  { 
    title: "국제시장", 
    year: "2014", 
    genre: "드라마",
    img: "https://image.tmdb.org/t/p/original/rmZ4qkpDVdTgjwliJ84aJ43hStt.jpg", 
    link: "/spots?dramas=국제시장" 
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
      if (scrollRef.current && mousePos.w > 0 && mousePos.x !== 0) {
        const center = mousePos.w / 2;
        const diff = mousePos.x - center;
        const ratio = diff / center; // -1 to 1
        
        // 1. Add a dead zone in the middle (20%)
        const DEAD_ZONE = 0.2;
        let speed = 0;
        
        if (Math.abs(ratio) > DEAD_ZONE) {
          // 2. Normalize ratio after dead zone and apply a power function for smooth curve
          const sign = ratio > 0 ? 1 : -1;
          const adjustedRatio = (Math.abs(ratio) - DEAD_ZONE) / (1 - DEAD_ZONE);
          // Power of 1.5 gives a nice progressive acceleration
          speed = sign * Math.pow(adjustedRatio, 1.5) * 15; 
        }
        
        if (speed !== 0) {
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
    <div className="bg-background/0 text-foreground min-h-screen pb-20 space-y-16">
      {/* 🌟 Brand Hero Section (Restored & Centered) */}
      <section className="pt-20 pb-12 px-6 flex flex-col items-center text-center animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF385C]/10 text-[#FF385C] border border-[#FF385C]/20 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-[12px] font-bold tracking-wider uppercase">One Shot Trap</span>
        </div>
        
        {/* Title */}
        <h1 className="text-6xl sm:text-8xl font-black text-[#222222] tracking-tighter mb-6 leading-tight">
          원 샷 트랩
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-medium text-[#717171] flex items-center gap-2">
          K-컬처를 느껴보세요 <span className="animate-pulse">✨</span>
        </p>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 space-y-16">
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
      </div>

      {/* 🎭 Split Hero Section (Moved to 2nd position) */}
      <section className="relative w-full h-[500px] sm:h-[600px] flex flex-col md:flex-row overflow-hidden border-y border-white/10 my-8">
        {/* Left Side: Filming Locations */}
        <Link 
          href="/spots" 
          className="relative flex-1 group overflow-hidden border-b md:border-b-0 md:border-r border-white/20"
        >
          <img
            src="/busan_cinema_moody.png"
            alt="영화 속 그곳"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 transform group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-lg">
                영화 속 그곳
              </h2>
              <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                Filming Locations
              </p>
            </div>
          </div>
        </Link>

        {/* Right Side: My Course */}
        <Link 
          href="/my-course" 
          className="relative flex-1 group overflow-hidden"
        >
          <img
            src="/busan_playlist_sunset.png"
            alt="내 코스"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30 transform group-hover:scale-110 transition-transform duration-500">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-lg">
                너의 플레이리스트, 부산
              </h2>
              <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                Your Playlist, Busan
              </p>
            </div>
          </div>
        </Link>

        {/* Center Heart Icon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:block">
          <div className="bg-white rounded-full p-4 shadow-2xl ring-4 ring-white/20 animate-pulse">
            <Heart className="h-8 w-8 text-[#FF385C] fill-[#FF385C]" />
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 space-y-16">
        {/* Recent Reviews Section */}
        <section className="bg-[#F7F7F7] -mx-6 px-6 py-16 rounded-[40px] animate-fade-up shadow-inner">
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
