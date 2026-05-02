"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, MapPin, Camera, ChevronRight, ChevronLeft, Check, Search, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommunityPostModalProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  "/images/spots/haeundae.png",
  "/images/spots/gwangalli.png",
  "/images/spots/gamcheon.png",
  "/images/spots/huinnyeoul.png",
  "/images/spots/cheongsapo.png",
  "/images/spots/jagalchi.png",
  "/images/spots/taejongdae.png",
  "/images/spots/songdo.png",
];

import { GoogleMapPicker } from "./GoogleMapPicker";

export function CommunityPostModal({ open, onClose }: CommunityPostModalProps) {
  const { t } = useTranslation();
  const addPost = useCommunityStore((s) => s.addPost);
  
  const [step, setStep] = useState(1); // 1: Image, 2: Details
  const [selectedImage, setSelectedImage] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"reviews" | "tips">("reviews");
  const [isMapOpen, setIsMapOpen] = useState(false);

  const reset = () => {
    setStep(1);
    setSelectedImage("");
    setContent("");
    setLocation("");
    setCategory("reviews");
  };

  const handleNext = () => {
    if (!selectedImage) {
      toast.error("게시할 사진을 먼저 선택해주세요!");
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("캡션을 입력해주세요!");
      return;
    }
    
    addPost({
      author: "Busan Traveler",
      avatar: "https://i.pravatar.cc/150?img=33",
      image: selectedImage,
      content,
      location: location || "Busan, Korea",
      spotId: "custom",
      category,
    });
    
    toast.success("게시물이 성공적으로 공유되었습니다! ✨");
    reset();
    onClose();
  };

  return (
    <>
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent hideClose className="max-w-4xl p-0 overflow-hidden rounded-none sm:rounded-2xl gap-0 bg-white border-none shadow-2xl h-[95vh] sm:h-[600px]">
        {/* Instagram Header */}
        <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4 shrink-0 bg-white z-10">
          <div className="flex items-center gap-2">
            {step === 2 ? (
              <button onClick={() => setStep(1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="h-6 w-6 text-[#262626]" />
              </button>
            ) : (
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-6 w-6 text-[#262626]" />
              </button>
            )}
            <span className="font-semibold text-[#262626]">
              {step === 1 ? "새 게시물 만들기" : "정보 입력"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {step === 2 && (
              <div className="flex items-center gap-2 mr-2">
                <button 
                  onClick={() => toast.success("카카오톡으로 공유되었습니다! 💬")}
                  className="hover:scale-110 transition-transform"
                  title="카카오톡 공유"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" className="h-5 w-5" alt="Kakao" />
                </button>
                <button 
                  onClick={() => toast.success("라인으로 공유되었습니다! 🟢")}
                  className="hover:scale-110 transition-transform"
                  title="라인 공유"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" className="h-5 w-5" alt="Line" />
                </button>
              </div>
            )}
            
            {step === 1 ? (
              <button 
                onClick={handleNext}
                className="text-[#0095F6] font-bold text-sm hover:text-[#00376b] transition-colors"
              >
                다음
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="bg-[#0095F6] text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-[#1877F2] transition-colors shadow-sm"
              >
                게시물 작성
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-full overflow-hidden">
          {/* Left Side: Image Area */}
          <div className={cn(
            "flex-1 bg-[#FAFAFA] flex items-center justify-center relative group overflow-hidden",
            step === 2 ? "hidden sm:flex" : "flex"
          )}>
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full h-full object-cover animate-fade-in" 
              />
            ) : (
              <div className="flex flex-col items-center text-[#262626]">
                <Camera className="h-20 w-20 mb-4 stroke-[0.5]" />
                <p className="text-xl font-light">사진을 이곳에 끌어다 놓으세요</p>
                <Button className="mt-6 bg-[#0095F6] hover:bg-[#1877F2] text-white rounded-lg px-4 py-1.5 text-sm h-auto">
                  컴퓨터에서 선택
                </Button>
              </div>
            )}
          </div>

          {/* Right Side: Inputs / Selectors */}
          <div className={cn(
            "w-full sm:w-[400px] bg-white border-l border-gray-100 flex flex-col overflow-y-auto",
            step === 1 ? "h-auto max-h-[300px] sm:max-h-none" : "flex-1"
          )}>
            {step === 1 ? (
              /* Step 1: Image Grid */
              <div className="p-1">
                <div className="grid grid-cols-3 gap-1">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square overflow-hidden transition-all group ${
                        selectedImage === img ? "brightness-50" : "hover:brightness-90"
                      }`}
                    >
                      <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      {selectedImage === img && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 2: Content Details */
              <div className="flex flex-col divide-y divide-gray-100 animate-fade-in">
                {/* User Info */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-bold text-[#262626]">Busan Traveler</span>
                </div>

                {/* Caption Input */}
                <div className="p-4">
                  <textarea
                    autoFocus
                    placeholder="문구를 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[160px] resize-none border-none focus:ring-0 p-0 text-sm leading-relaxed placeholder:text-[#8e8e8e]"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <svg aria-label="이모티콘" color="#8e8e8e" fill="#8e8e8e" height="20" role="img" viewBox="0 0 24 24" width="20"><path d="M15.83 10.997a1.167 1.167 0 101.167 1.167 1.167 1.167 0 00-1.167-1.167zm-7.66 0a1.167 1.167 0 101.166 1.167 1.167 1.167 0 00-1.166-1.167zm3.83 6.11a5.457 5.457 0 01-4.004-1.745l-.478.478A6.134 6.134 0 0012 18c2.404 0 4.298-1.464 5.215-2.613l-.534-.39a4.708 4.708 0 01-3.681 2.11zM12 2.5a9.5 9.5 0 109.5 9.5A9.51 9.51 0 0012 2.5zm0 18a8.5 8.5 0 118.5-8.5 8.51 8.51 0 01-8.5 8.5z"></path></svg>
                    </button>
                    <span className="text-[12px] text-gray-300">{content.length}/2,200</span>
                  </div>
                </div>

                {/* Location Input */}
                <div className="flex flex-col">
                  <div 
                    onClick={() => setIsMapOpen(true)}
                    className="p-4 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <MapPin className="h-5 w-5 text-[#262626] group-hover:text-primary transition-colors" />
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-sm",
                          location ? "text-[#262626] font-medium" : "text-[#8e8e8e]"
                        )}>
                          {location || "위치 추가 (Google Maps)"}
                        </span>
                        {location && <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Selected via Google Maps</span>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </div>

                {/* Accessibility / Category */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm font-medium text-[#262626]">카테고리 설정</span>
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-2">
                    {(["reviews", "tips"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                          category === cat
                            ? "bg-[#262626] text-white border-[#262626]"
                            : "bg-white text-[#262626] border-gray-200 hover:border-gray-400"
                        )}
                      >
                        {cat === "reviews" ? "방문후기" : "여행꿀팁"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Post Preview Info */}
                <div className="p-4 bg-[#FAFAFA] flex-1">
                  <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <p className="text-[11px] text-[#8e8e8e] leading-relaxed">
                      작성하신 게시물은 부산 드라마 트레일 커뮤니티에 공개되며, 다른 사용자들이 좋아요를 누르거나 위치 정보를 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
