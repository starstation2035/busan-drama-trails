"use client";

import { useState } from "react";
import { Star, Coffee, Heart, UtensilsCrossed, Sparkles, X, MapPin, Car, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CafeLocation } from "@/data/nearby_cafes";
import { useAppStore } from "@/stores/useAppStore";
import { triggerHeartFly } from "@/components/HeartEffect";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface DiscoveryCardProps {
  item: CafeLocation;
  parentSpotName: string;
}

export default function DiscoveryCard({ item, parentSpotName }: DiscoveryCardProps) {
  const { t } = useTranslation();
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  const myCourseItems = useAppStore((s) => s.myCourseItems);
  const toggleMyCourseItem = useAppStore((s) => s.toggleMyCourseItem);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  
  const isFav = myCourseItems.some(x => x.id === item.id);
  const walkingMinutes = Math.ceil(item.distance / 80);

  const handleCallCar = () => {
    toast.success("차량 호출 서비스를 준비 중입니다!");
  };

  return (
    <div className="group relative overflow-hidden rounded-[40px] bg-white border border-[#F3F4F6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_24px_50px_rgb(0,0,0,0.08)] mb-12">
      
      {/* 1. Upper Part: 4분할 그리드 이미지 */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 aspect-square relative">
        {item.images?.slice(0, 4).map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhotoIdx(idx)}
            className="relative overflow-hidden rounded-[24px] bg-[#F9FAFB] cursor-zoom-in group/photo"
          >
            <img
              src={img.url}
              alt={img.description}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-110"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/photo:opacity-100 transition-opacity" />
          </div>
        ))}

        {/* Wish Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const wasFav = isFav;
            const payload = {
              id: item.id,
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              category: "cafe"
            };
            if (!wasFav) {
              triggerHeartFly(e.clientX, e.clientY);
              toast("마이코스에 찜했습니다!");
            }
            toggleMyCourseItem(payload);
            toggleFavorite(item.id);
          }}
          className={`absolute top-6 right-6 z-20 w-16 h-16 rounded-3xl backdrop-blur-xl transition-all active:scale-90 flex items-center justify-center border-2 ${
            isFav 
              ? "bg-[#FF4D8D] border-[#FF4D8D] text-white shadow-xl shadow-[#FF4D8D]/40" 
              : "bg-white/40 border-white/60 text-white hover:bg-white/60"
          }`}
        >
          <Heart className={`size-8 ${isFav ? "fill-current" : "drop-shadow-lg"}`} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. Middle Part: AI Insight & Signature */}
      <div className="p-8 pb-4">
        {/* Title & Rating */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF9FB] rounded-2xl border border-[#FFE4E6]">
              <Coffee className="size-5 text-[#FF4D8D]" />
            </div>
            <h3 className="text-[23px] font-black text-[#1F2937] tracking-tight">{item.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFFBEB] text-[#B45309] px-4 py-2 rounded-2xl text-[16px] font-black border border-[#FEF3C7]">
            <Star className="size-4 fill-[#D97706] text-[#D97706]" />
            {item.rating.toFixed(1)}
          </div>
        </div>

        <div className="bg-[#FFF1F2] p-6 rounded-[32px] border border-[#FFE4E6] mb-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2.5 text-[#E11D48]">
            <Sparkles className="size-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">AI Insight</span>
          </div>
          <p className="text-[17px] font-black text-[#1F2937] leading-relaxed italic">
            "{item.reviewSummary}"
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F8FAFC] px-6 py-4 rounded-[28px] border border-[#F1F5F9] mb-6">
          <UtensilsCrossed className="size-5 text-[#64748B]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Signature</span>
            <span className="text-[16px] font-black text-[#475569]">{item.signatureMenu}</span>
          </div>
        </div>
      </div>

      {/* 3. Lower Part: Mini Map (Functional) */}
      <div className="px-8 pb-8">
        <div className="flex flex-col gap-4">
          <motion.div 
            animate={{ height: isMapExpanded ? 400 : 160 }}
            className="relative rounded-[32px] overflow-hidden border border-[#F1F5F9] shadow-inner cursor-pointer"
            onClick={() => setIsMapExpanded(!isMapExpanded)}
          >
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="grayscale-[0.2] contrast-[0.9] brightness-[1.05]"
              title={`${item.name} Location Map`}
            />
            
            {/* Overlay Info */}
            {!isMapExpanded && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-lg flex items-center gap-2.5">
                  <MapPin className="size-4 text-[#FF4D8D]" />
                  <span className="text-[14px] font-black text-[#1F2937]">
                    {parentSpotName}에서 {item.distance}m <span className="text-[#9CA3AF] mx-1">|</span> 도보 {walkingMinutes}분
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* 4. Vehicle Tour Booking Button (Premium & Accessible) */}
          <Button
            onClick={handleCallCar}
            className="w-full h-16 rounded-[28px] bg-gradient-to-r from-[#FF4D8D] to-[#FF8EBC] text-white font-black text-[17px] shadow-[0_12px_24px_rgba(255,77,141,0.3)] hover:shadow-[0_16px_32px_rgba(255,77,141,0.4)] transition-all active:scale-[0.98] border-none group/btn"
            aria-label={t("detail.cta.carTour") || "Book Vehicle Tour"}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md group-hover/btn:rotate-12 transition-transform">
                <Car className="size-5 text-white" />
              </div>
              <span>{t("detail.cta.carTour") || "차량 투어 예약"}</span>
              <ChevronRight className="size-5 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Button>
        </div>
      </div>

      {/* Internal Lightbox */}

      <AnimatePresence>
        {selectedPhotoIdx !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedPhotoIdx(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-[600px] bg-white rounded-[48px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square relative">
                <img src={item.images[selectedPhotoIdx].url} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedPhotoIdx(null)} className="absolute top-8 right-8 p-4 bg-black/20 text-white rounded-full backdrop-blur-xl"><X className="size-6" /></button>
              </div>
              <div className="p-10 text-center">
                <p className="text-[20px] font-black text-[#1F2937] leading-relaxed">{item.images[selectedPhotoIdx].description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



