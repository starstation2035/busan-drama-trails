"use client";

import { Star, Heart, MapPin } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { triggerHeartFly } from "@/components/HeartEffect";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface DiscoveryCardProps {
  item: any;
  parentSpotName: string;
}

export default function DiscoveryCard({ item, parentSpotName }: DiscoveryCardProps) {
  const { t } = useTranslation();

  const myCourseItems = useAppStore((s) => s.myCourseItems);
  const toggleMyCourseItem = useAppStore((s) => s.toggleMyCourseItem);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const isFav = myCourseItems.some((x) => x.id === item.id);

  const imgUrl = item.thumbnail || item.images?.[0]?.url || "";
  const categoryStr = item.food?.ko || item.food || item.signature?.ko || "추천 명소";
  const signatureMenu = item.signatureMenu || categoryStr;
  const reviewSummary =
    item.reviewSummary ||
    "현지인들이 강력 추천하는 방문 필수 코스입니다. 분위기와 맛 모두 만족스러워요!";

  return (
    <div className="group cursor-pointer flex flex-col w-[280px] md:w-auto shrink-0 md:shrink bg-white rounded-[28px] border border-[#F3F4F6] p-3 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      {/* Thumbnail */}
      <div className="relative w-full h-[220px] md:h-auto md:aspect-square bg-[#F8FAFC] rounded-[20px] overflow-hidden mb-4 shadow-sm">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Wish Action */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const payload = {
              id: item.id,
              name: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              category: "cafe",
            };
            if (!isFav) {
              triggerHeartFly(e.clientX, e.clientY);
              toast("마이코스에 찜했습니다!");
            }
            toggleMyCourseItem(payload);
            toggleFavorite(item.id);
          }}
          className="absolute top-3 right-3 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`size-4 ${isFav ? "fill-[#FF385C] text-[#FF385C]" : "text-[#222222]"}`}
            strokeWidth={isFav ? 2.5 : 1.5}
          />
        </button>
      </div>

      {/* Information Area */}
      <div className="flex-1 flex flex-col px-2 pb-2">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-[#717171] font-bold tracking-tight">{categoryStr}</span>
          <div className="flex items-center gap-1 text-[13px]">
            <Star className="size-3.5 fill-[#FF385C] text-[#FF385C]" strokeWidth={1.5} />
            <span className="font-bold text-[#222222]">{item.rating?.toFixed(1) || "0.0"}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-[18px] font-black tracking-tight text-[#222222] mb-2 line-clamp-1">
          {item.name}
        </h4>

        {/* Signature Menu */}
        <p className="text-[13px] font-bold text-[#FF385C] mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF385C]"></span>
          시그니처: {signatureMenu}
        </p>

        {/* Address */}
        {item.address && (
          <p className="text-[12px] font-medium text-[#717171] mb-2 flex items-start gap-1.5">
            <MapPin className="size-3.5 mt-0.5 shrink-0" />
            <span className="line-clamp-2 leading-relaxed">{item.address}</span>
          </p>
        )}

        {/* AI Review Summary */}
        <p className="text-[13px] font-medium text-[#555555] mb-4 line-clamp-2 leading-relaxed">
          "{reviewSummary}"
        </p>
      </div>
    </div>
  );
}
