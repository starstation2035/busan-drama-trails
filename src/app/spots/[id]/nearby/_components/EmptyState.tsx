"use client";

import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onFindMore: () => void;
}

export default function EmptyState({ onFindMore }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#FFF9FA] rounded-[40px] border-2 border-dashed border-[#FFE4E6]">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
        <Search className="size-8 text-[#FFB6C1]" />
      </div>
      <h3 className="text-xl font-bold text-[#1F2937] mb-2">찾으시는 장소가 없나요?</h3>
      <p className="text-[#6B7280] text-[15px] mb-8 max-w-[240px] leading-relaxed">
        더 다양한 인생샷 스팟을 <br />
        찾아보고 싶으시다면 버튼을 눌러주세요!
      </p>
      <Button 
        onClick={onFindMore}
        className="h-14 px-10 rounded-full bg-white text-[#FF4D8D] border border-[#FFE4E6] hover:bg-[#FFF1F2] shadow-sm text-base font-bold transition-all active:scale-95"
      >
        <MapPin className="size-4 mr-2" />
        더 많은 결과 보기
      </Button>
    </div>
  );
}
