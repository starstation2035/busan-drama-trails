"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Heart, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { type Review } from "@/data/mockReviews";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCommunityStore } from "@/stores/useCommunityStore";

interface Poster {
  id: string;
  year: string;
  img: string;
  link: string;
  title: string;
}

const POSTERS: Poster[] = [
  {
    id: "woo",
    year: "2022",
    img: "https://image.tmdb.org/t/p/original/u6Cx6ijenevIQjtrjFpPgQzgI10.jpg",
    link: "/spots/spot_001",
    title: "이상한 변호사 우영우",
  },
  {
    id: "runningman",
    year: "2010",
    img: "https://image.tmdb.org/t/p/original/15SMnscZqd7HZ0bzruatOcKUlOV.jpg",
    link: "/spots/spot_002",
    title: "런닝맨",
  },
  {
    id: "pachinko",
    year: "2022",
    img: "https://image.tmdb.org/t/p/w500/aK640gWriIscSoSf30MNqtsvseo.jpg",
    link: "/spots/pachinko",
    title: "파친코",
  },
  {
    id: "attorney",
    year: "2013",
    img: "https://upload.wikimedia.org/wikipedia/en/b/b5/The_Attorney_poster.jpg",
    link: "/spots/spot_004",
    title: "변호인",
  },
  {
    id: "haeundae",
    year: "2009",
    img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Haeundae_film_poster.jpg",
    link: "/spots/spot_003",
    title: "해운대",
  },
  {
    id: "market",
    year: "2014",
    img: "https://image.tmdb.org/t/p/original/rmZ4qkpDVdTgjwliJ84aJ43hStt.jpg",
    link: "/spots?dramas=국제시장",
    title: "국제시장",
  },
];

export default function LandingPage() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const [mousePos, setMousePos] = useState({ x: 0, w: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    const rect = scrollRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      w: rect.width,
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

  const posts = useCommunityStore((s) => s.posts);
  const [reviewTab, setReviewTab] = useState<"popular" | "recent">("popular");

  // Filter posts to only include travel reviews ('reviews') with images
  const onlyReviews = useMemo(() => {
    return posts.filter((p) => p.category === "reviews" && p.image);
  }, [posts]);

  // 🔥 Popular Reviews: sorted by likes descending, limit to 4
  const popularReviews = useMemo(() => {
    return [...onlyReviews].sort((a, b) => b.likes - a.likes).slice(0, 4);
  }, [onlyReviews]);

  // ⏰ Recent Reviews: sorted by id descending (newest), limit to 4
  const recentReviews = useMemo(() => {
    return [...onlyReviews].sort((a, b) => b.id - a.id).slice(0, 4);
  }, [onlyReviews]);

  const displayedReviews = useMemo(() => {
    return reviewTab === "popular" ? popularReviews : recentReviews;
  }, [reviewTab, popularReviews, recentReviews]);

  return (
    <div className="bg-background/0 text-foreground min-h-screen pb-20 space-y-16">
      {/* 🌟 Brand Hero Section (Restored & Centered) */}
      <section className="pt-20 pb-12 flex flex-col items-center text-center animate-fade-up px-4">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#222222] tracking-tighter mb-4 sm:mb-6 leading-tight break-keep">
          화면 속 그곳이 당신의<br className="hidden sm:block" /> 다음 여행지가 됩니다
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-[#717171] mb-8 sm:mb-10 max-w-2xl break-keep">
          영화, 드라마, 예능 속 대한민국 명소 찾기부터 나만의 코스 완성까지
        </p>

        {/* CTA Button */}
        <Link href="/spots">
          <Button className="bg-[#FF385C] hover:bg-[#E31C5F] text-white text-base sm:text-lg font-bold px-8 py-6 rounded-full shadow-lg shadow-[#FF385C]/30 transition-all hover:-translate-y-1">
            지금 인기 촬영지 둘러보기 <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      <div className="space-y-16">
        {/* 🎬 Movie Posters Carousel */}
        <section className="animate-fade-up space-y-6">

          <div
            ref={scrollRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 px-2 scroll-smooth custom-scrollbar"
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
                      {t(`movies.${poster.id}.title`)}
                    </h3>
                    <p className="text-[13px] text-[#717171] font-medium">
                      {poster.year} • {t(`movies.${poster.id}.genre`)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 🎭 Split Hero Section (Moved to 2nd position) */}
        <section className="relative w-full h-[400px] sm:h-[500px] flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-xl border border-white/10">
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
                  {t("landing.splitHero.leftTitle")}
                </h2>
                <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  {t("landing.splitHero.leftSubtitle")}
                </p>
              </div>
            </div>
          </Link>

          {/* Right Side: My Course */}
          <Link href="/style-test" className="relative flex-1 group overflow-hidden">
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
                  {t("landing.splitHero.rightTitle")}
                </h2>
                <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  {t("landing.splitHero.rightSubtitle")}
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

        {/* Travel Reviews Section (Popular / Recent tabs) */}
        <section className="bg-[#F7F7F7] -mx-6 px-6 py-16 rounded-[40px] animate-fade-up shadow-inner">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#222222] tracking-tight">
                  여행자들의 생생한 후기
                </h2>
                <p className="text-sm sm:text-base text-[#717171] mt-1.5 font-medium">
                  다른 여행자들의 생생한 부산 이야기를 실시간으로 확인해보세요
                </p>
              </div>
              
              {/* Pill Tabs Filter */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => setReviewTab("popular")}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                    reviewTab === "popular"
                      ? "bg-[#FF385C] text-white shadow-md shadow-[#FF385C]/20"
                      : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                  }`}
                >
                  <span>🔥 인기 후기</span>
                </button>
                <button
                  onClick={() => setReviewTab("recent")}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                    reviewTab === "recent"
                      ? "bg-[#FF385C] text-white shadow-md shadow-[#FF385C]/20"
                      : "bg-white text-[#222222] border border-[#DDDDDD] hover:bg-[#F7F7F7]"
                  }`}
                >
                  <span>⏰ 최신 후기</span>
                </button>
              </div>
            </div>

            <Link href="/community" className="shrink-0 self-start md:self-end">
              <Button
                variant="ghost"
                className="text-[#222222] font-black hover:bg-white/50 rounded-full text-sm py-5.5 px-6 border border-black/5 bg-white/20 backdrop-blur-sm"
              >
                전체 리뷰 보기
                <ArrowRight className="ml-2 h-4 w-4 text-[#FF385C]" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
            {displayedReviews.map((review: Review) => (
              <Link
                key={`${reviewTab}-${review.id}`}
                href={`/community/${review.id}`}
                className="group bg-white rounded-[2rem] p-5 shadow-airbnb border border-[#DDDDDD]/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] block flex flex-col justify-between h-full animate-fade-in"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4 relative">
                    <img
                      src={review.image}
                      alt={review.location}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute right-3.5 top-3.5 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Heart className="h-3 w-3 text-[#FF385C] fill-[#FF385C]" />
                      <span>{review.likes}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="h-6.5 w-6.5 rounded-full border border-[#DDDDDD] object-cover"
                      />
                      <span className="text-[13px] font-extrabold text-[#222222]">{review.author}</span>
                    </div>
                    <p className="text-[14px] leading-relaxed text-[#444444] line-clamp-3 font-semibold group-hover:text-primary transition-colors">
                      "{review.content}"
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#F0F0F0] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#717171]">
                    <MapPin className="h-3.5 w-3.5 text-[#FF385C]" strokeWidth={1.5} />
                    <span className="truncate max-w-[150px]">{review.location}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-primary flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    자세히 보기 <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}

            {displayedReviews.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-[#DDDDDD] flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">📍</span>
                <p className="text-sm font-semibold text-muted-foreground">아직 등록된 여행후기가 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
