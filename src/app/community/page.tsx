"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MessageSquare, Heart, MapPin, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { MOCK_REVIEWS } from "@/data/mockReviews";
import { LiveChatWidget } from "@/components/LiveChatWidget";

const CATEGORIES = ["all", "tips", "reviews"] as const;
type Category = (typeof CATEGORIES)[number];

export default function Community() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Category>("all");

  const filteredReviews =
    activeTab === "all" ? MOCK_REVIEWS : MOCK_REVIEWS.filter((r) => r.category === activeTab);

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <section className="animate-fade-up px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("community.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("community.subtitle")}</p>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-14 z-20 -mx-4 flex flex-col gap-3 bg-background/80 px-4 py-3 backdrop-blur-md animate-fade-up">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeTab === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t(`community.filters.${cat}`)}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("spots.searchPlaceholder")}
            className="w-full rounded-2xl border-none bg-muted/60 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>

      {/* Review Feed */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 animate-fade-up">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="group overflow-hidden rounded-[2.5rem] border border-border/50 bg-card shadow-sm transition-all hover:shadow-xl"
          >
            {/* Vertical Image */}
            <div className="relative aspect-[9/12] overflow-hidden">
              <img
                src={review.image}
                alt={review.location}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{review.location}</span>
                </div>
              </div>
              <button className="absolute right-4 top-4 rounded-full bg-white/20 p-2.5 text-white backdrop-blur-md transition-all hover:bg-white/40 active:scale-90">
                <Heart className="h-5 w-5 fill-current text-white" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="h-8 w-8 rounded-full border border-border bg-muted"
                />
                <span className="flex-1 text-sm font-bold text-foreground">{review.author}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {t(`community.filters.${review.category}`)}
                </span>
              </div>
              
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {review.content}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {review.likes} likes
                </span>
                <Link
                  href={`/spots/${review.spotId}`}
                  className="flex items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2"
                >
                  {t("detail.cta.added").split("→")[0]}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Real-time Global Live Chat Widget */}
      <LiveChatWidget />
    </div>
  );
}
