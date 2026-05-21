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

const translateAddress = (addr: string, lang: string) => {
  if (lang !== "en" || !addr) return addr;
  let translated = addr
    .replace("부산광역시 ", "")
    .replace("부산 ", "")
    .replace("영도구 ", "Yeongdo-gu, ")
    .replace("해운대구 ", "Haeundae-gu, ")
    .replace("중구 ", "Jung-gu, ")
    .replace("수영구 ", "Suyeong-gu, ")
    .replace("서구 ", "Seo-gu, ")
    .replace("사하구 ", "Saha-gu, ")
    .replace("동구 ", "Dong-gu, ")
    .replace("남구 ", "Nam-gu, ")
    .replace("북구 ", "Buk-gu, ")
    .replace("강서구 ", "Gangseo-gu, ")
    .replace("금정구 ", "Geumjeong-gu, ");

  // ① 도로/길 이름 번역 (반드시 동 이름보다 먼저 처리해야 중동1로 등이 깨지지 않음)
  const roadTr: Record<string, string> = {
    "감내2로": "Gamnae 2-ro", "감내1로": "Gamnae 1-ro",
    "옥천로": "Okcheon-ro", "감천로": "Gamcheon-ro",
    "흰여울길": "Huinnyeoul-gil", "절영로": "Jeoryeong-ro",
    "중리남로": "Jungrinam-ro", "꿈나무길": "Kkumnamu-gil",
    "하나길": "Hana-gil", "중리북로": "Jungribuk-ro",
    "태종로": "Taejong-ro", "와치로": "Wachi-ro",
    "해양로": "Haeyang-ro", "봉래나루로": "Bongnaenaru-ro",
    "청사포로": "Cheongsapo-ro", "구남로": "Gunam-ro",
    "중동2로": "Jungdong 2-ro", "중동1로": "Jungdong 1-ro",
    "달맞이길": "Dalmaji-gil", "해운대해변로": "Haeundaehaebyeon-ro",
    "자갈치로": "Jagalchi-ro", "자갈치해안로": "Jagalchihaean-ro",
    "백산길": "Baeksan-gil", "전망로": "Jeonmang-ro",
    "광안해변로": "Gwanganhaebyeon-ro", "민락수변로": "Millaksubyeon-ro",
    "송도해변로": "Songdohaebyeon-ro", "충무대로": "Chungmudae-ro",
  };

  for (const [ko, en] of Object.entries(roadTr)) {
    translated = translated.replace(ko, en);
  }

  // 번길 처리 (도로명 처리 직후)
  translated = translated.replace(/([0-9]+)번길/g, "$1-beongil");

  // ② 동(洞) 이름 번역 (도로명 처리 후에 실행 - 중동 제외: 중동1로/중동2로와 충돌)
  const dongTr: Record<string, string> = {
    "감천동": "Gamcheon-dong", "감내동": "Gamnae-dong",
    "흰여울동": "Huinnyeoul-dong", "동삼동": "Dongsam-dong",
    "청학동": "Cheonghak-dong", "봉래동": "Bongnae-dong",
    "영선동": "Yeongseon-dong", "태종동": "Taejong-dong",
    "중리동": "Jungri-dong", "신선동": "Sinseon-dong",
    "청사포동": "Cheongsapo-dong",
    "좌동": "Jwadong", "송정동": "Songjung-dong",
    "반여동": "Banyeo-dong", "재송동": "Jaesong-dong",
    "남포동": "Nampodong", "광복동": "Gwangbok-dong",
    "중앙동": "Jungangdong", "보수동": "Bosu-dong",
    "광안동": "Gwangan-dong", "민락동": "Millak-dong",
    "수영동": "Suyeong-dong", "망미동": "Mangmi-dong",
    "암남동": "Amnam-dong", "충무동": "Chungmu-dong",
  };

  for (const [ko, en] of Object.entries(dongTr)) {
    translated = translated.replace(ko, en);
  }

  // 층 → F (예: 2층 → 2F)
  translated = translated.replace(/([0-9]+)층/g, "$1F");

  // 혹시 남은 한글 '로', '길' 단독 문자 정리 (ex: 1로 → 1-ro)
  translated = translated.replace(/([0-9]+)로/g, "$1-ro");
  translated = translated.replace(/([0-9]+)길/g, "$1-gil");

  return translated.trim() + ", Busan";
};

export default function DiscoveryCard({ item, parentSpotName }: DiscoveryCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "ko";

  const myCourseItems = useAppStore((s) => s.myCourseItems);
  const toggleMyCourseItem = useAppStore((s) => s.toggleMyCourseItem);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const isFav = myCourseItems.some((x) => x.id === item.id);

  const imgUrl = item.thumbnail || item.images?.[0]?.url || "";
  const categoryStr = item.category || item.signatureMenu || item.food?.[lang] || item.food?.ko || item.food || item.signature?.[lang] || item.signature?.ko || (lang === 'en' ? "Recommended Spot" : "추천 명소");
  const signatureMenu = item.signatureMenu || categoryStr;
  const finalAddress = translateAddress(item.address, lang);
  const reviewSummary =
    item.reviewSummary ||
    (lang === 'en' ? "Highly recommended spot by locals. Great atmosphere and taste!" : "현지인들이 강력 추천하는 방문 필수 코스입니다. 분위기와 맛 모두 만족스러워요!");

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
              toast(t("nearby.addedToMyCourse"));
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
          {t("nearby.signature")}: {signatureMenu}
        </p>

        {/* Address */}
        {finalAddress && (
          <p className="text-[12px] font-medium text-[#717171] mb-2 flex items-start gap-1.5">
            <MapPin className="size-3.5 mt-0.5 shrink-0" />
            <span className="line-clamp-2 leading-relaxed">{finalAddress}</span>
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
