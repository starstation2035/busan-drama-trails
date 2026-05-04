"use client";

import { X, MapPin, Star, Navigation } from "lucide-react";
import { useEffect } from "react";

interface DetailModalProps {
  isOpen: boolean;
  item: any;
  onClose: () => void;
}

export default function DetailModal({ isOpen, item, onClose }: DetailModalProps) {
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

  if (!isOpen || !item) return null;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
      <div 
        className="bg-background w-full max-w-md rounded-[24px] sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 border border-border/50"
      >
        <div className="relative aspect-[16/10] w-full bg-muted">
          <img 
            src={item.thumbnail} 
            alt={item.name?.ko} 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=600&auto=format&fit=crop'; }}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-[22px] font-bold text-foreground leading-tight">{item.name?.ko}</h2>
            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0 ml-2">
              <Star className="size-4 fill-yellow-700" />
              {item.rating || "4.5"}
            </div>
          </div>
          
          <p className="text-muted-foreground text-[15px] mb-6">
            {item.food?.ko || item.signature?.ko || "부산의 정취가 느껴지는 장소"}
          </p>

          <div className="flex items-center gap-2 text-[14px] text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-lg mb-6 font-medium">
            <MapPin className="size-4" />
            현 위치에서 {item.calculatedDistance}m
          </div>

          <div className="w-full h-[180px] mb-4 rounded-[12px] overflow-hidden bg-muted relative border border-border/50">
            {item.latitude && item.longitude ? (
              <iframe 
                src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                aria-hidden="false" 
                tabIndex={0}
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                지도 위치 정보가 없습니다
              </div>
            )}
          </div>

          <button 
            onClick={handleDirections}
            className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-4 rounded-[12px] flex items-center justify-center gap-2 transition-colors text-[16px]"
          >
            <Navigation className="size-5" />
            길찾기
          </button>
        </div>
      </div>
    </div>
  );
}
