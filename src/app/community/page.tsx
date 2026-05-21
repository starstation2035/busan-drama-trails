"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { MessageSquare, Heart, MapPin, Search, ArrowRight, PenLine } from "lucide-react";
import { useState } from "react";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { getLocalizedField } from "@/data/mockReviews";
import { CommunityPostModal } from "@/components/CommunityPostModal";

const CATEGORIES = ["all", "reviews", "talk"] as const;
type Category = (typeof CATEGORIES)[number];

export default function Community() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ko";
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(id);
  };

  // Filter posts by category
  const talkPosts = posts.filter((p) => p.category === "talk");
  const reviewPosts = posts.filter((p) => p.category === "reviews");

  return (
    <div className="space-y-8 pb-24">
      {/* Header Section */}
      <section className="animate-fade-up px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("community.title")}
        </h1>
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

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("community.searchPlaceholder")}
              className="w-full rounded-2xl border-none bg-muted/60 py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-2xl bg-[#FF385C] px-5 py-3 text-sm font-bold text-white hover:bg-[#FF385C]/90 transition-colors shadow-sm"
          >
            <PenLine className="h-4 w-4" />
            <span>{t("community.writeButton")}</span>
          </button>
        </div>
      </section>

      {/* Conditional Layout Rendering */}
      <div className="space-y-10 animate-fade-up">
        {/* 1. [전체] 탭 혹은 [자유토크] 탭일 때: 💬 실시간 자유토크 Q&A 섹션 */}
        {(activeTab === "all" || activeTab === "talk") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-[#222222] flex items-center gap-2.5">
                  <span>💬 {t("community.sections.freeTalkTitle")}</span>
                  {activeTab === "all" && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                      {t("community.sections.latestQuestion", lang === "en" ? "Latest" : "최신 질문")}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t("community.sections.freeTalkSubtitle")}
                </p>
              </div>
              {activeTab === "all" && talkPosts.length > 3 && (
                <button
                  onClick={() => setActiveTab("talk")}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline transition-all"
                >
                  <span>{t("community.viewAll", lang === "en" ? "View All" : "전체보기")}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {(activeTab === "all" ? talkPosts.slice(0, 3) : talkPosts).map((post) => (
                <Link
                  href={`/community/${post.id}`}
                  key={post.id}
                  className="flex items-center justify-between gap-4 p-4.5 rounded-2xl bg-card border border-border/60 hover:border-[#FF385C]/30 hover:shadow-md transition-all group block"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="h-8.5 w-8.5 rounded-full border border-border bg-muted shrink-0 object-cover"
                    />
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-xs font-extrabold text-foreground/80 shrink-0">
                        {getLocalizedField(post, "author", lang)}
                        </span>
                      <span className="h-3 w-[1px] bg-border/80 shrink-0" />
                      <p className="text-sm text-foreground/90 font-semibold truncate group-hover:text-primary transition-colors flex-1">
                        {getLocalizedField(post, "content", lang)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1.5 rounded-xl">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/80" />
                      <span className="font-bold text-[11px] text-muted-foreground/90">
                        {(post.comments || []).length}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-1 group-hover:text-[#FF385C]" />
                  </div>
                </Link>
              ))}

              {talkPosts.length === 0 && (
                <div className="text-center py-10 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center gap-1.5">
                  <span className="text-xl">💬</span>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t("community.emptyTalk", lang === "en" ? "No free talk posts yet." : "등록된 자유토크가 없습니다.")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 2. [전체] 탭 분리선 */}
        {activeTab === "all" && talkPosts.length > 0 && (
          <div className="border-t border-border/40 my-8" />
        )}

        {/* 3. [전체] 탭 혹은 [여행후기] 탭일 때: 📍 생생한 여행후기 섹션 */}
        {(activeTab === "all" || activeTab === "reviews") && (
          <section className="space-y-4">
            <div className="px-2 space-y-0.5">
              <h2 className="text-lg font-bold text-[#222222] flex items-center gap-2">
                <span>📍 {t("community.sections.reviewsTitle")}</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("community.sections.reviewsSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {reviewPosts.map((review) => {
                const isLiked = review.isLiked;
                return (
                  <Link
                    href={`/community/${review.id}`}
                    key={review.id}
                    className="group overflow-hidden rounded-[2.5rem] border border-border/50 bg-card shadow-sm transition-all hover:shadow-xl block flex flex-col h-full"
                  >
                    {/* Vertical Image */}
                    {review.image && (
                      <div className="relative aspect-[9/12] overflow-hidden shrink-0">
                        <img
                          src={review.image}
                          alt={review.location}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {getLocalizedField(review, "location", lang)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleLike(e, review.id)}
                          className={`absolute right-4 top-4 z-30 rounded-full p-2.5 backdrop-blur-md transition-all active:scale-90 ${
                            isLiked
                              ? "bg-primary text-white shadow-lg"
                              : "bg-white/20 text-white hover:bg-white/40"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    )}

                    {/* Content Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="h-8 w-8 rounded-full border border-border bg-muted object-cover"
                          />
                          <span className="flex-1 text-sm font-bold text-foreground">
                            {getLocalizedField(review, "author", lang)}
                          </span>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {t(`community.filters.${review.category}`)}
                          </span>
                        </div>

                        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                          {getLocalizedField(review, "content", lang)}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {review.likes} likes
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {reviewPosts.length === 0 && (
                <div className="col-span-full text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-border/60 flex flex-col items-center justify-center gap-1.5">
                  <span className="text-xl">📍</span>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {t("community.emptyReviews", lang === "en" ? "No travel reviews yet." : "등록된 여행후기가 없습니다.")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <CommunityPostModal open={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </div>
  );
}
