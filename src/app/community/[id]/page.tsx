"use client";

import { useMemo, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Heart, Share2, MapPin, PenLine, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { CommunityPostModal } from "@/components/CommunityPostModal";

export default function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ko";

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const addComment = useCommunityStore((s) => s.addComment);
  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error(t("detail.commentError", lang === "en" ? "Please enter a comment." : "댓글 내용을 입력해주세요."));
      return;
    }

    const COMMENT_AUTHORS = [
      { name: "부산 토박이", seed: "local" },
      { name: "성지순례 가이드", seed: "guide" },
      { name: "해운대 갈매기", seed: "seagull" },
      { name: "K-드라마 덕후", seed: "drama" },
      { name: "광안리 서퍼", seed: "surfer" },
      { name: "영도 등대지기", seed: "lighthouse" },
    ];
    const randomAuthor = COMMENT_AUTHORS[Math.floor(Math.random() * COMMENT_AUTHORS.length)];

    addComment(post!.id, {
      author: randomAuthor.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomAuthor.seed}`,
      content: commentText.trim(),
    });
    setCommentText("");
    toast.success(t("detail.commentSuccess", lang === "en" ? "Comment registered successfully!" : "답변이 정상적으로 등록되었습니다!"));
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/community" className="mt-4 text-primary hover:underline">
          Back to community
        </Link>
      </div>
    );
  }

  const isLiked = post.isLiked;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this Busan story from ${post.author}!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Busan Drama Trails", text, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success(t("detail.copied"));
  };

  const handleLike = () => {
    toggleLike(post.id);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* 1. HERO (Image at the top) */}
      {post.image ? (
        <section className="mx-auto w-full max-w-screen-md relative px-0 md:px-6 md:pt-6">
          <div
            className="group relative w-full overflow-hidden md:rounded-3xl bg-muted shadow-2xl"
            style={{ aspectRatio: "4/5" }}
          >
            <img src={post.image} alt={post.location} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating top controls */}
            <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
              <button
                onClick={() => router.back()}
                className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="grid size-9 place-items-center rounded-full bg-white/95 text-foreground shadow-md backdrop-blur transition active:scale-90 hover:bg-white"
                >
                  <Share2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Minimal navigation bar if no image */
        <section className="mx-auto w-full max-w-screen-md px-6 pt-6">
          <div className="flex items-center justify-between py-3 border-b border-border/40">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span>{t("detail.back", lang === "en" ? "Back" : "뒤로가기")}</span>
            </button>
            <button
              onClick={handleShare}
              className="grid size-9 place-items-center rounded-full bg-muted/65 text-foreground hover:bg-muted transition active:scale-90"
            >
              <Share2 className="size-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 2. Content */}
      <section className="mx-auto w-full max-w-screen-md px-6 pt-8">
        <div className="flex items-center justify-between border-b border-border/50 pb-6">
          <div className="flex items-center gap-4">
            <img
              src={post.avatar}
              alt={post.author}
              className="size-12 rounded-full border border-border bg-muted object-cover shadow-sm"
            />
            <div>
              <h2 className="text-lg font-bold text-foreground">{post.author}</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin className="size-3.5 text-primary" />
                <span className="font-medium">
                  {lang === "en" && post.location_en 
                    ? post.location_en 
                    : lang === "zh-TW" && post.location_zh_TW
                      ? post.location_zh_TW
                      : post.location}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-all active:scale-95 border ${
              isLiked
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <Heart className={`size-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            {post.likes}
          </button>
        </div>

        <div className="py-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary mb-4">
            {t(`community.filters.${post.category}`)}
          </span>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#333333]">
            {lang === "en" && post.content_en 
              ? post.content_en 
              : lang === "zh-TW" && post.content_zh_TW
                ? post.content_zh_TW
                : post.content}
          </p>
        </div>

        {/* 3. CTA or Comment Section based on category */}
        {post.category === "reviews" ? (
          /* 3. CTA Card for reviews */
          <div className="mt-8 rounded-2xl bg-[#F4F5F7] p-6 border border-black/5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1 space-y-1 text-center sm:text-left">
                <h3 className="text-[17px] font-bold text-[#222222] tracking-tight">
                  {t("community.shareTitle", lang === "en" ? "Share your special K-Content tour experience!" : "당신의 특별한 K-콘텐츠 투어 경험도 공유해 보세요!")}
                </h3>
                <p className="text-sm text-[#666666]">{t("community.shareSubtitle", lang === "en" ? "Start your own travel record with a single photo." : "사진 한 장으로 시작하는 나만의 여행 기록")}</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full sm:w-auto flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF385C] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#E31C5F] active:scale-95"
              >
                <PenLine className="size-4" />
                <span>{t("community.writeReview", lang === "en" ? "Write a Review" : "나도 후기 쓰기")}</span>
              </button>
            </div>
          </div>
        ) : (
          /* 3. Comment Section for talk */
          <div className="mt-12 border-t border-border/60 pt-10">
            {/* Header: 댓글 개수 */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>{t("detail.answers", lang === "en" ? "Answers" : "답변")}</span>
                <span className="text-[#FF385C] bg-[#FF385C]/10 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {(post.comments || []).length}
                </span>
              </h3>
            </div>

            {/* List: 댓글 리스트 */}
            {(post.comments || []).length > 0 ? (
              <div className="space-y-6 mb-10">
                {(post.comments || []).map((comment) => (
                  <div key={comment.id} className="flex gap-4 items-start animate-fade-in">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="size-10 rounded-full border border-border bg-muted object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-[#444444] leading-relaxed whitespace-pre-line bg-muted/30 rounded-2xl p-4.5 border border-black/5 mt-1">
                        {lang === "en" && comment.content_en 
                          ? comment.content_en 
                          : lang === "zh-TW" && comment.content_zh_TW
                            ? comment.content_zh_TW
                            : comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border/60 mb-10 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">💬</span>
                <p className="text-sm text-muted-foreground font-medium">
                  {t("detail.noAnswers", lang === "en" ? "No answers yet." : "아직 등록된 답변이 없습니다.")}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {t("detail.firstAnswer", lang === "en" ? "Leave the first warm answer!" : "첫 번째 따뜻한 답변을 남겨보세요!")}
                </p>
              </div>
            )}

            {/* Input: 댓글 입력창 */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div className="relative rounded-2xl border border-[#DDDDDD] bg-[#F7F7F7] focus-within:ring-2 focus-within:ring-[#FF385C]/20 focus-within:border-[#FF385C] transition-all overflow-hidden p-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("detail.answerPlaceholder", lang === "en" ? "Leave a warm answer to this question..." : "이 질문에 대한 따뜻한 답변을 남겨주세요...")}
                  className="w-full min-h-[90px] bg-transparent resize-none border-none focus:outline-none p-3 text-[14px] text-foreground leading-relaxed placeholder:text-[#A0A0A0]"
                />
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-[#FF385C] text-white font-bold px-5 py-2 rounded-xl hover:bg-[#E31C5F] transition-all shadow-sm active:scale-95 text-xs"
                  >
                    {t("detail.submit", lang === "en" ? "Submit" : "등록")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* The Write Post Modal - defaults to reviews */}
      <CommunityPostModal
        open={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        initialCategory="reviews"
      />
    </div>
  );
}
