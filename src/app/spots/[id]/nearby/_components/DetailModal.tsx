"use client";

import { X, MapPin, Car, Navigation, ChevronRight, Info } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import PhotoGrid from "./PhotoGrid";
import ReviewSummary from "./ReviewSummary";
import { useTranslation } from "react-i18next";

interface DetailModalProps {
  isOpen: boolean;
  item: any;
  onClose: () => void;
}

export default function DetailModal({ isOpen, item, onClose }: DetailModalProps) {
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Calculate real-time walking data
  const walkingData = useMemo(() => {
    if (!item) return null;
    const distanceMeters = item.calculatedDistance || item.distance || 0;
    const km = (distanceMeters / 1000).toFixed(1);
    const minutes = Math.ceil(distanceMeters / 80); // 80m per min
    return { km, minutes };
  }, [item]);

  if (!isOpen || !item) return null;

  const handleCallCar = () => {
    // Logic for transportation service
    alert(`${item.name?.ko || item.name} 장소로 차량을 호출합니다.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#00000080] backdrop-blur-[12px] p-0 sm:p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white w-full max-w-[500px] h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.3)] flex flex-col"
          >
            {/* Top Handle for Mobile */}
            <div className="w-14 h-1.5 bg-[#F3F4F6] rounded-full mx-auto mt-5 mb-1 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5">
              <div className="flex flex-col">
                <h2 className="text-[22px] font-black text-[#1F2937] tracking-tight leading-none mb-1">
                  {item.name?.ko || item.name}
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[12px] font-bold text-[#6B7280]">현재 영업 중</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-[#F9FAFB] text-[#9CA3AF] rounded-2xl hover:bg-[#F3F4F6] hover:text-[#4B5563] transition-all active:scale-90"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              
              {/* 1. Interactive Photo Grid (Main Visual) */}
              <PhotoGrid images={item.images} />

              {/* 2. AI-Powered Review Summary */}
              <ReviewSummary 
                summary={item.reviewSummary} 
                signature={item.signatureMenu} 
                rating={item.rating}
              />

              {/* 3. Map & Navigation Integration */}
              <div className="px-8 pb-10">
                <div className="flex items-center gap-3 mb-6">
                  <Navigation className="size-5 text-[#3B82F6]" />
                  <h4 className="text-[17px] font-black text-[#1F2937]">이동 정보</h4>
                </div>

                <div className="relative w-full aspect-[16/10] bg-[#F9FAFB] rounded-[32px] overflow-hidden border border-[#F3F4F6] mb-8">
                  {item.latitude && item.longitude ? (
                    <iframe 
                      src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=16&ie=UTF8&iwloc=&output=embed&style=feature:poi|element:labels|visibility:off`} 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0, filter: 'grayscale(0.1) contrast(1.05)' }} 
                      allowFullScreen={false} 
                    ></iframe>
                  ) : null}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[32px]"></div>
                </div>

                {/* Real-time Distance Info */}
                <div className="text-center p-8 bg-[#F8FAFC] rounded-[40px] border border-[#F1F5F9]">
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-[26px] font-black text-[#1F2937] tracking-tight">
                      현 위치에서 <span className="text-[#3B82F6]">{walkingData?.km}km</span>
                    </h3>
                    <p className="text-[19px] font-bold text-[#6B7280]">
                      도보 약 <span className="text-[#1F2937] underline decoration-[#3B82F6] decoration-4 underline-offset-4">{walkingData?.minutes}분</span>
                    </p>
                  </div>
                </div>

                {/* 4. Vehicle Tour Booking Button (Premium & Accessible) */}
                <div className="mt-8">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

