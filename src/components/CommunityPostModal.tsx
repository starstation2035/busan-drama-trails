"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, MapPin, Camera, Image as ImageIcon, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GoogleMapPicker } from "./GoogleMapPicker";

interface CommunityPostModalProps {
  open: boolean;
  onClose: () => void;
  initialCategory?: "reviews" | "talk";
}

const RANDOM_AUTHORS = [
  "드라마덕후_민지",
  "부산행열차_지훈",
  "K_Content_Lover",
  "바다바람_서연",
  "영화매니아_태민",
  "우영우귀여워_예린",
  "파친코인생작_도윤",
  "부산갈매기_민우",
  "시네마천국_수진",
  "부산투어러_준호",
];

export function CommunityPostModal({ open, onClose, initialCategory }: CommunityPostModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ko";
  const addPost = useCommunityStore((s) => s.addPost);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<"reviews" | "talk" | undefined>(initialCategory);
  const [selectedImage, setSelectedImage] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Initialize category when modal opens
  useEffect(() => {
    if (open) {
      setCategory(initialCategory);
    }
  }, [open, initialCategory]);

  const reset = () => {
    setSelectedImage("");
    setContent("");
    setLocation("");
    setCategory(undefined);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!category) {
      toast.error(t("community.post.categoryError", lang === "en" ? "Please select a category." : "어떤 글을 작성하실지 카테고리를 선택해주세요."));
      return;
    }

    // 여행후기 카테고리일 때만 사진 필수 검증
    if (category === "reviews" && !selectedImage) {
      toast.error(t("community.post.imageError", lang === "en" ? "Please attach at least one photo!" : "인증 사진을 최소 1장 이상 첨부해주세요!"));
      return;
    }

    if (!content.trim()) {
      toast.error(t("community.post.captionError"));
      return;
    }

    const randomIdx = Math.floor(Math.random() * RANDOM_AUTHORS.length);
    const authorName = RANDOM_AUTHORS[randomIdx];
    const avatarSeed = encodeURIComponent(authorName);

    addPost({
      author: authorName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
      image: (selectedImage as string) || "",
      content,
      location: location || "Busan, Korea",
      spotId: "custom",
      category,
    });

    toast.success(t("community.post.success"));
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
        <DialogContent
          hideClose
          className="max-w-[600px] w-full p-0 overflow-y-auto rounded-2xl bg-white border-none shadow-2xl max-h-[90vh]"
        >
          {/* Header */}
          <DialogHeader className="h-14 border-b border-border/50 flex-row items-center justify-between px-4 shrink-0 bg-white sticky top-0 z-20 space-y-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
              <DialogTitle className="font-bold text-foreground">{t("community.modal.title", lang === "en" ? "Create New Post" : "글쓰기")}</DialogTitle>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-[#FF385C] text-white font-bold px-5 h-9 rounded-full hover:bg-[#E31C5F] transition-all shadow-sm active:scale-95"
            >
              {t("community.post.submit", lang === "en" ? "Upload" : "등록")}
            </Button>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-8 pb-10">
            {/* 1. Category Selection (Always Visible) */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[19px] font-bold text-[#222222] tracking-tight">
                {t("community.modal.categoryTitle", lang === "en" ? "Category Settings" : "어떤 글을 작성하시겠어요?")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCategory("reviews")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all active:scale-[0.98]",
                    category === "reviews"
                      ? "border-[#FF385C] bg-[#FF385C]/5"
                      : "border-[#DDDDDD] bg-white hover:border-[#BBBBBB]",
                  )}
                >
                  <span className="text-2xl">📍</span>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "font-bold text-[15px]",
                        category === "reviews" ? "text-[#FF385C]" : "text-[#222222]",
                      )}
                    >
                      {t("community.filters.reviews", lang === "en" ? "Travel Reviews" : "여행후기")}
                    </span>
                    <span className="text-[11px] text-[#717171] font-medium hidden sm:block">
                      {t("community.sections.reviewsSubtitle", lang === "en" ? "K-Content location visits" : "K-콘텐츠 촬영지 방문 인증")}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setCategory("talk")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all active:scale-[0.98]",
                    category === "talk"
                      ? "border-[#FF385C] bg-[#FF385C]/5"
                      : "border-[#DDDDDD] bg-white hover:border-[#BBBBBB]",
                  )}
                >
                  <span className="text-2xl">💬</span>
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "font-bold text-[15px]",
                        category === "talk" ? "text-[#FF385C]" : "text-[#222222]",
                      )}
                    >
                      {t("community.filters.talk", lang === "en" ? "Free Talk" : "자유토크")}
                    </span>
                    <span className="text-[11px] text-[#717171] font-medium hidden sm:block">
                      {t("community.sections.freeTalkSubtitle", lang === "en" ? "Questions and free talk" : "질문 및 자유로운 대화")}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Rest of the form (Always visible) */}
            <div className="flex flex-col gap-8 border-t border-border/50 pt-8">
              {/* Text Content */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-[15px] text-[#222222]">{t("community.modal.details", lang === "en" ? "Post Details" : "내용")}</h4>
                <textarea
                  autoFocus
                  placeholder={t("community.post.placeholder", lang === "en" ? "Share your stories with other travelers..." : "다른 여행자들과 나누고 싶은 이야기를 적어보세요...")}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[140px] rounded-xl border border-[#DDDDDD] bg-[#F7F7F7] p-4 text-[15px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all placeholder:text-[#A0A0A0]"
                />
              </div>

              {/* Image Selection */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[15px] text-[#222222]">{t("community.modal.photo", lang === "en" ? "Attach Photo" : "사진 첨부")}</h4>
                  {selectedImage && (
                    <button
                      onClick={() => setSelectedImage("")}
                      className="text-xs font-bold text-[#717171] hover:text-[#222222] underline underline-offset-2"
                    >
                      {t("community.modal.clear", lang === "en" ? "Clear" : "지우기")}
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {selectedImage ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#DDDDDD] group">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="bg-white/90 text-black border-none hover:bg-white font-bold rounded-full px-6"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {t("community.modal.changePhoto", lang === "en" ? "Change Photo" : "사진 변경")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Upload Area */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-[#DDDDDD] bg-[#F7F7F7] flex flex-col items-center justify-center gap-3 hover:bg-[#F0F0F0] hover:border-[#BBBBBB] transition-colors"
                    >
                      <span className="text-3xl text-[#BBBBBB]">📸</span>
                      <span className="text-[#717171] font-bold text-[14px]">
                        {t("community.modal.addPhoto", lang === "en" ? "Click to add photo" : "클릭해서 사진 추가하기")}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-[15px] text-[#222222]">{t("community.modal.location", lang === "en" ? "Location Tag" : "장소 태그")}</h4>
                <div
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#DDDDDD] bg-white cursor-pointer hover:border-[#BBBBBB] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7F7F7] group-hover:bg-[#FF385C]/10 flex items-center justify-center transition-colors">
                      <MapPin
                        className={cn(
                          "h-4 w-4 transition-colors",
                          location ? "text-[#FF385C]" : "text-[#717171] group-hover:text-[#FF385C]",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[15px]",
                        location ? "text-[#222222] font-bold" : "text-[#717171]",
                      )}
                    >
                      {location || t("community.modal.locationPlaceholder", lang === "en" ? "Please select a location" : "장소를 선택해주세요")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <GoogleMapPicker
        open={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onSelect={(loc) => setLocation(loc)}
      />
    </>
  );
}
