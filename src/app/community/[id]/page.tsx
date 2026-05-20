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
  const { t } = useTranslation();

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId]);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

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
            <img
              src={post.image}
              alt={post.location}
              className="h-full w-full object-cover"
            />
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
              <span>뒤로가기</span>
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
                <span className="font-medium">{post.location}</span>
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
            {post.content}
          </p>
        </div>

        {/* 3. CTA Card */}
        <div className="mt-8 rounded-2xl bg-[#F4F5F7] p-6 border border-black/5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h3 className="text-[17px] font-bold text-[#222222] tracking-tight">
                당신의 특별한 K-콘텐츠 투어 경험도 공유해 보세요!
              </h3>
              <p className="text-sm text-[#666666]">
                사진 한 장으로 시작하는 나만의 여행 기록
              </p>
            </div>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="w-full sm:w-auto flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FF385C] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#E31C5F] active:scale-95"
            >
              <PenLine className="size-4" />
              <span>나도 후기 쓰기</span>
            </button>
          </div>
        </div>
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
