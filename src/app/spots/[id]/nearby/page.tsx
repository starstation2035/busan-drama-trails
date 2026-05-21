"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ArrowLeft, MapPin, Utensils, Coffee } from "lucide-react";
import dynamic from "next/dynamic";
import spotsRaw from "@/data/spots.json";
import { toast } from "sonner";
import { JAGALCHI_NEARBY_CAFES } from "@/data/nearby_cafes";
import DiscoveryCard from "./_components/DiscoveryCard";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), { ssr: false });

const BASE_LAT = 35.0787;
const BASE_LNG = 129.0441;

const KOREAN_FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80",
  "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=800&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
  "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
  "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
];

const KOREAN_CAFE_IMAGES = [
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&q=80",
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80",
  "https://images.unsplash.com/photo-1510551310160-589462daf284?w=800&q=80",
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&q=80",
  "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80",
];

const HARDCODED_RESTAURANTS = [
  {
    id: "hr1",
    name: { ko: "흰여울점빵", en: "Huinnam-yeoul Bakery" },
    address: "부산 영도구 흰여울길 121",
    food: { ko: "라면/토스트", en: "Ramen/Toast" },
    latitude: 35.0795,
    longitude: 129.0432,
    thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800&q=80",
        description: "매콤달콤한 한국식 분식",
      },
      {
        url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
        description: "따뜻하고 깊은 맛의 국물",
      },
      {
        url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
        description: "정갈한 한국식 상차림",
      },
      {
        url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
        description: "아늑하고 따뜻한 식당 내부 분위기",
      },
    ],
    rating: 4.6,
  },
  {
    id: "hr2",
    name: { ko: "거청식당" },
    address: "부산 영도구 절영로 11",
    food: { ko: "생선구이" },
    latitude: 35.0815,
    longitude: 129.046,
    thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
        description: "바삭하게 구워낸 생선구이",
      },
      {
        url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=80",
        description: "신선한 한식 재료들",
      },
      {
        url: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=800&q=80",
        description: "푸짐한 한국의 맛",
      },
      {
        url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
        description: "깔끔하고 모던한 감성 식당",
      },
    ],
    rating: 4.4,
  },
  {
    id: "hr3",
    name: { ko: "달뜨네", en: "Dalteune" },
    address: "부산 영도구 절영로 13",
    food: { ko: "회밥/시나몬맥주", en: "Sashimi Rice/Cinnamon Beer" },
    latitude: 35.0801,
    longitude: 129.0445,
    thumbnail: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    rating: 4.7,
  },
  {
    id: "hr4",
    name: { ko: "영도해녀촌", en: "Yeongdo Haenyeo Village" },
    address: "부산 영도구 중리남로 2-35",
    food: { ko: "성게알/김밥", en: "Sea Urchin/Gimbap" },
    latitude: 35.0715,
    longitude: 129.0685,
    thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400",
    rating: 4.8,
  },
  {
    id: "hr5",
    name: { ko: "도날드", en: "Donald" },
    address: "부산 영도구 꿈나무길 267",
    food: { ko: "즉석떡볶이", en: "Instant Tteokbokki" },
    latitude: 35.0768,
    longitude: 129.0558,
    thumbnail: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    rating: 4.5,
  },
  {
    id: "hr6",
    name: { ko: "왔다식당", en: "Watta Restaurant" },
    address: "부산 영도구 하나길 811",
    food: { ko: "한우스지전골", en: "Hanwoo Beef Tendon Hot Pot" },
    latitude: 35.0895,
    longitude: 129.0542,
    thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
    rating: 4.6,
  },
  {
    id: "hr7",
    name: { ko: "재기돼지국밥", en: "Jaegi Pork Rice Soup" },
    address: "부산 영도구 절영로49번길 25",
    food: { ko: "남항시장", en: "Namhang Market" },
    latitude: 35.0921,
    longitude: 129.0375,
    thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
    rating: 4.4,
  },
  {
    id: "hr8",
    name: { ko: "와글와글", en: "Wagle Wagle" },
    address: "부산 영도구 중리북로22번길 5",
    food: { ko: "라밥", en: "Rabab" },
    latitude: 35.0812,
    longitude: 129.0571,
    thumbnail: "/wagle.jpg",
    rating: 4.3,
  },
  {
    id: "hr9",
    name: { ko: "청학동구이", en: "Cheonghakdong Grill" },
    address: "부산 영도구 태종로 315",
    food: { ko: "고기", en: "Meat" },
    latitude: 35.0955,
    longitude: 129.0621,
    thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
    rating: 4.2,
  },
  {
    id: "hr10",
    name: { ko: "삼진어묵 본점", en: "Samjin Amook Main Store" },
    address: "부산 영도구 태종로99번길 36",
    food: { ko: "어묵", en: "Fish Cake" },
    latitude: 35.0915,
    longitude: 129.0415,
    thumbnail: "/samjin.jpg",
    rating: 4.9,
  },
];

const HARDCODED_CAFES = [
  {
    id: "hc1",
    name: { ko: "신기숲", en: "Singisup" },
    address: "부산 영도구 와치로 65",
    signature: { ko: "대나무뷰", en: "Bamboo View" },
    latitude: 35.0861,
    longitude: 129.0531,
    thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400",
    rating: 4.7,
  },
  {
    id: "hc2",
    name: { ko: "손목서가", en: "Sonmok Seoga" },
    address: "부산 영도구 흰여울길 307",
    signature: { ko: "오션뷰 서점", en: "Ocean View Bookstore" },
    latitude: 35.0792,
    longitude: 129.0435,
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    rating: 4.8,
  },
  {
    id: "hc3",
    name: { ko: "에테르", en: "Aether" },
    address: "부산 영도구 절영로 234",
    signature: { ko: "루프탑" },
    latitude: 35.0778,
    longitude: 129.0445,
    thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
    rating: 4.6,
  },
  {
    id: "hc4",
    name: { ko: "구름에" },
    address: "부산 영도구 흰여울길 253",
    signature: { ko: "디저트" },
    latitude: 35.0798,
    longitude: 129.0438,
    thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
    rating: 4.5,
  },
  {
    id: "hc5",
    name: { ko: "피아크 (P.ARK)" },
    address: "부산 영도구 해양로195번길 180",
    signature: { ko: "초대형" },
    latitude: 35.0885,
    longitude: 129.0765,
    thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    rating: 4.9,
  },
  {
    id: "hc6",
    name: { ko: "모모스커피 영도" },
    address: "부산 영도구 봉래나루로 160",
    signature: { ko: "스페셜티" },
    latitude: 35.0935,
    longitude: 129.0355,
    thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
    rating: 4.8,
  },
  {
    id: "hc7",
    name: { ko: "무명일기", en: "Unknown Diary" },
    address: "부산 영도구 봉래나루로 178",
    signature: { ko: "창고형" },
    latitude: 35.0945,
    longitude: 129.0365,
    thumbnail: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=400",
    rating: 4.6,
  },
  {
    id: "hc8",
    name: { ko: "쓰릴미" },
    address: "부산 영도구 절영로 246",
    signature: { ko: "오션뷰" },
    latitude: 35.0782,
    longitude: 129.0448,
    thumbnail: "https://images.unsplash.com/photo-1510551310160-589462daf284?w=400",
    rating: 4.5,
  },
  {
    id: "hc9",
    name: { ko: "카페 변호인" },
    address: "부산 영도구 흰여울길 135",
    signature: { ko: "촬영지" },
    latitude: 35.0791,
    longitude: 129.0431,
    thumbnail: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400",
    rating: 4.7,
  },
  {
    id: "hc10",
    name: { ko: "카린 영도 플레이스", en: "Karin Yeongdo Place" },
    address: "부산 영도구 청학동로 16",
    signature: { ko: "스칸디나비안 뷰" },
    latitude: 35.0905,
    longitude: 129.0565,
    thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400",
    rating: 4.8,
  },
];

const SPOT_CONFIGS: Record<string, any> = {
  spot_002: {
    baseLat: 35.0975,
    baseLng: 129.0107,
    radius: 1000,
    restaurants: [
      {
        id: "g2_r1",
        name: { ko: "머거방", en: "Meogeo Bang" },
        address: "부산 사하구 감내2로 198",
        food: { ko: "순두부/볶음밥/돈가스", en: "Soondubu/Fried Rice/Donkatsu" },
        latitude: 35.0968,
        longitude: 129.0112,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.3,
      },
      {
        id: "g2_r2",
        name: { ko: "감천 보리밥집", en: "Gamcheon Barley Rice" },
        address: "부산 사하구 감내2로 203",
        food: { ko: "보리밥/된장찌개", en: "Barley Rice/Doenjang Jjigae" },
        latitude: 35.0972,
        longitude: 129.0105,
        thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
        rating: 4.2,
      },
      {
        id: "g2_r3",
        name: { ko: "더플레이트", en: "The Plate" },
        address: "부산 사하구 감천동 6-1062",
        food: { ko: "수제버거/피쉬앤칩스", en: "Handmade Burger/Fish & Chips" },
        latitude: 35.0971,
        longitude: 129.0118,
        thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        rating: 4.4,
      },
    ],
    cafes: [
      {
        id: "g2_c1",
        name: { ko: "커피잇집", en: "Coffee It House" },
        address: "부산 사하구 옥천로 115 2층",
        signature: { ko: "루프탑 마을 전경 뷰", en: "Rooftop Village View" },
        latitude: 35.0978,
        longitude: 129.0121,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.6,
      },
      {
        id: "g2_c2",
        name: { ko: "감내카페", en: "Gamnae Cafe" },
        address: "부산 사하구 감내2로 177",
        signature: { ko: "팥빙수/마을 전망", en: "Patbingsu/Village View" },
        latitude: 35.0965,
        longitude: 129.0108,
        thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
        rating: 4.3,
      },
      {
        id: "g2_c3",
        name: { ko: "프롬초이", en: "From Choi" },
        address: "부산 사하구 감천동 6-1052 2층",
        signature: { ko: "루프탑 디저트", en: "Rooftop Dessert" },
        latitude: 35.0970,
        longitude: 129.0110,
        thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
        rating: 4.4,
      },
      {
        id: "g2_c4",
        name: { ko: "감천제빵소", en: "Gamcheon Bakery" },
        address: "부산 사하구 감내2로 145",
        signature: { ko: "감돌이빵/달빵", en: "Gamdori Bread/Dal Bread" },
        latitude: 35.0963,
        longitude: 129.0103,
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        rating: 4.5,
      },
    ],
  },
  spot_001: {
    baseLat: 35.1589,
    baseLng: 129.1992,
    radius: 1000,
    restaurants: [
      {
        id: "r1_1",
        name: { ko: "수민이네" },
        address: "부산 해운대구 청사포로58번길 118",
        food: { ko: "조개구이/장어구이" },
        latitude: 35.1601,
        longitude: 129.1985,
        thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
        rating: 4.6,
      },
      {
        id: "r1_2",
        name: { ko: "하진이네" },
        address: "부산 해운대구 청사포로 151",
        food: { ko: "조개구이" },
        latitude: 35.1595,
        longitude: 129.199,
        thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400",
        rating: 4.5,
      },
      {
        id: "r1_3",
        name: { ko: "청사포 다희네" },
        address: "부산 해운대구 청사포로 157",
        food: { ko: "장어구이" },
        latitude: 35.1605,
        longitude: 129.198,
        thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        rating: 4.4,
      },
    ],
    cafes: [
      {
        id: "c1_1",
        name: { ko: "앨리스 도넛" },
        address: "부산 해운대구 청사포로 128",
        signature: { ko: "청사포 도넛" },
        latitude: 35.161,
        longitude: 129.1975,
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        rating: 4.7,
      },
      {
        id: "c1_2",
        name: { ko: "카페 루프탑" },
        address: "부산 해운대구 청사포로 139",
        signature: { ko: "오션뷰" },
        latitude: 35.1585,
        longitude: 129.1995,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.8,
      },
    ],
  },
  spot_003: {
    baseLat: 35.1587,
    baseLng: 129.1604,
    radius: 1000,
    restaurants: [
      {
        id: "r3_1",
        name: { ko: "해운대 암소갈비집" },
        address: "부산 해운대구 중동2로10번길 32-10",
        food: { ko: "한우생갈비" },
        latitude: 35.163,
        longitude: 129.165,
        thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        rating: 4.7,
      },
      {
        id: "r3_2",
        name: { ko: "상국이네" },
        address: "부산 해운대구 구남로41번길 40-1",
        food: { ko: "떡볶이" },
        latitude: 35.1615,
        longitude: 129.1615,
        thumbnail: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
        rating: 4.4,
      },
      {
        id: "r3_3",
        name: { ko: "밀양순대돼지국밥 해운대점" },
        address: "부산 해운대구 구남로 28",
        food: { ko: "돼지국밥" },
        latitude: 35.161,
        longitude: 129.16,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.5,
      },
      {
        id: "r3_4",
        name: { ko: "금수복국 해운대본점" },
        address: "부산 해운대구 중동1로43번길 23",
        food: { ko: "뚝배기 복국" },
        latitude: 35.1612,
        longitude: 129.1625,
        thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
        rating: 4.6,
      },
      {
        id: "r3_5",
        name: { ko: "해성막창집 본점" },
        address: "부산 해운대구 중동1로19번길 29",
        food: { ko: "대창/곱창전골" },
        latitude: 35.162,
        longitude: 129.163,
        thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        rating: 4.5,
      },
    ],
    cafes: [
      {
        id: "c3_1",
        name: { ko: "호랑이젤라떡" },
        address: "부산 해운대구 달맞이길62번길 38",
        signature: { ko: "젤라떡" },
        latitude: 35.158,
        longitude: 129.165,
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        rating: 4.8,
      },
      {
        id: "c3_2",
        name: { ko: "랑데자뷰 해운대" },
        address: "부산 해운대구 달맞이길62번길 23",
        signature: { ko: "제주 감성/오션뷰" },
        latitude: 35.1595,
        longitude: 129.162,
        thumbnail: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400",
        rating: 4.6,
      },
      {
        id: "c3_3",
        name: { ko: "스누피플레이스 부산" },
        address: "부산 해운대구 해운대해변로 197",
        signature: { ko: "스누피 테마" },
        latitude: 35.159,
        longitude: 129.163,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.5,
      },
      {
        id: "c3_4",
        name: { ko: "오션어스" },
        address: "부산 해운대구 달맞이길62번길 28",
        signature: { ko: "오션뷰 커피" },
        latitude: 35.1585,
        longitude: 129.164,
        thumbnail: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400",
        rating: 4.4,
      },
      {
        id: "c3_5",
        name: { ko: "빌라혼네" },
        address: "부산 해운대구 구남로 41",
        signature: { ko: "에스프레소 바" },
        latitude: 35.161,
        longitude: 129.161,
        thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
        rating: 4.7,
      },
    ],
  },
  spot_004: {
    baseLat: 35.0787,
    baseLng: 129.0441,
    radius: 1500,
    restaurants: HARDCODED_RESTAURANTS,
    cafes: HARDCODED_CAFES,
  },
  spot_005: {
    baseLat: 35.0966,
    baseLng: 129.0306,
    radius: 1000,
    restaurants: [
      {
        id: "r5_1",
        name: { ko: "백화양곱창" },
        address: "부산 중구 자갈치로23번길 6",
        food: { ko: "양곱창" },
        latitude: 35.096,
        longitude: 129.031,
        thumbnail: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400",
        rating: 4.6,
      },
      {
        id: "r5_2",
        name: { ko: "제일꼼장어" },
        address: "부산 중구 자갈치해안로 65",
        food: { ko: "꼼장어" },
        latitude: 35.0955,
        longitude: 129.03,
        thumbnail: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
        rating: 4.5,
      },
      {
        id: "r5_3",
        name: { ko: "남포동 생선구이 골목" },
        address: "부산 중구 자갈치로23번길 15",
        food: { ko: "생선구이백반" },
        latitude: 35.097,
        longitude: 129.0305,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.4,
      },
    ],
    cafes: [
      {
        id: "c5_1",
        name: { ko: "바우노바 백산" },
        address: "부산 중구 백산길 9",
        signature: { ko: "드립커피" },
        latitude: 35.099,
        longitude: 129.033,
        thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
        rating: 4.8,
      },
    ],
  },
  pachinko: {
    baseLat: 35.0617,
    baseLng: 129.0767,
    radius: 1000,
    restaurants: [
      {
        id: "gr1",
        name: { ko: "태종대 짬뽕" },
        address: "부산 영도구 태종로 825",
        food: { ko: "해물짬뽕" },
        latitude: 35.0534,
        longitude: 129.0807,
        thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        rating: 4.5,
      },
      {
        id: "gr2",
        name: { ko: "충북식당" },
        address: "부산 영도구 태종로 831",
        food: { ko: "한식" },
        latitude: 35.0541,
        longitude: 129.0801,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.3,
      },
      {
        id: "gr3",
        name: { ko: "태종대 자갈마당 해녀촌" },
        address: "부산 영도구 전망로 24",
        food: { ko: "조개구이/해산물" },
        latitude: 35.0601,
        longitude: 129.077,
        thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400",
        rating: 4.6,
      },
    ],
    cafes: [
      {
        id: "gc1",
        name: { ko: "엔제리너스 태종대점" },
        address: "부산 영도구 태종로 834",
        signature: { ko: "프랜차이즈 카페" },
        latitude: 35.0532,
        longitude: 129.0811,
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        rating: 4.0,
      },
    ],
  },
  spot_007: {
    baseLat: 35.1531,
    baseLng: 129.1189,
    radius: 1000,
    restaurants: [
      {
        id: "r7_1",
        name: { ko: "톤쇼우 광안점" },
        address: "부산 수영구 광안해변로279번길 13",
        food: { ko: "돈카츠" },
        latitude: 35.154,
        longitude: 129.122,
        thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
        rating: 4.9,
      },
      {
        id: "r7_2",
        name: { ko: "수변최고돼지국밥" },
        address: "부산 수영구 광안해변로370번길 9-32",
        food: { ko: "돼지국밥" },
        latitude: 35.155,
        longitude: 129.124,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.6,
      },
    ],
    cafes: [
      {
        id: "c7_1",
        name: { ko: "광안리 뚜벅스" },
        address: "부산 수영구 광안해변로 239",
        signature: { ko: "오션뷰" },
        latitude: 35.153,
        longitude: 129.118,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.7,
      },
      {
        id: "c7_2",
        name: { ko: "밀락더마켓" },
        address: "부산 수영구 민락수변로17번길 56",
        signature: { ko: "복합문화공간" },
        latitude: 35.1545,
        longitude: 129.1235,
        thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
        rating: 4.8,
      },
    ],
  },
  spot_008: {
    baseLat: 35.0761,
    baseLng: 129.0173,
    radius: 1000,
    restaurants: [
      {
        id: "r8_1",
        name: { ko: "송도 1913" },
        address: "부산 서구 송도해변로 19-1",
        food: { ko: "조개구이" },
        latitude: 35.075,
        longitude: 129.018,
        thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea064eb?w=400",
        rating: 4.4,
      },
      {
        id: "r8_2",
        name: { ko: "사천해물탕" },
        address: "부산 서구 충무대로 12",
        food: { ko: "해물탕" },
        latitude: 35.077,
        longitude: 129.0165,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.5,
      },
    ],
    cafes: [
      {
        id: "c8_1",
        name: { ko: "TCC 송도" },
        address: "부산 서구 송도해변로 143",
        signature: { ko: "루프탑 뷰" },
        latitude: 35.0755,
        longitude: 129.0175,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.6,
      },
      {
        id: "c8_2",
        name: { ko: "이디야커피 부산송도해상케이블카점" },
        address: "부산 서구 송도해변로 171",
        signature: { ko: "케이블카 뷰" },
        latitude: 35.078,
        longitude: 129.02,
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400",
        rating: 4.3,
      },
    ],
  },
};

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function NearbyDiscovery({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const id = resolvedParams.id;
  const type = resolvedSearchParams.type;

  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "ko") as any;
  const router = useRouter();

  const spot = useMemo(() => (spotsRaw as any[]).find((s) => s.id === id), [id]);
  const initialTab = type === "cafe" ? "cafe" : "restaurant";
  const [activeTab, setActiveTab] = useState<"restaurant" | "cafe">(initialTab);
  const mapRadius = 1000;
  const mapCenter = useMemo(() => {
    const config = SPOT_CONFIGS[id as string];
    if (id === "spot_005" && activeTab === "cafe")
      return [config?.baseLat || 35.0966, config?.baseLng || 129.0306] as [number, number];
    return [config?.baseLat || BASE_LAT, config?.baseLng || BASE_LNG] as [number, number];
  }, [id, activeTab]);

  const allPlacesInRadius = useMemo(() => {
    let rawData: any[] = [];
    const baseLat = mapCenter[0];
    const baseLng = mapCenter[1];

    const config = SPOT_CONFIGS[id as string];

    if (id === "spot_005" && activeTab === "cafe") {
      rawData = JAGALCHI_NEARBY_CAFES;
    } else if (config) {
      rawData = activeTab === "restaurant" ? config.restaurants : config.cafes;
    }

    if (!rawData || rawData.length === 0) return [];

    const processed = rawData.map((item: any, idx: number) => {
      const dist =
        item.calculatedDistance || getDistance(baseLat, baseLng, item.latitude, item.longitude);

      // Dynamic translation dictionary for places without English data
      const tr: Record<string, string> = {
        "거청식당": "Geocheong Restaurant", "생선구이": "Grilled Fish",
        "에테르": "Aether", "루프탑": "Rooftop", "구름에": "Gureume", "디저트": "Dessert",
        "피아크 (P.ARK)": "P.ARK", "초대형": "Mega Cafe",
        "모모스커피 영도": "Momos Coffee Yeongdo", "스페셜티": "Specialty Coffee",
        "쓰릴미": "Thrill Me", "오션뷰": "Ocean View",
        "카페 변호인": "Cafe Attorney", "촬영지": "Filming Location",
        "수민이네": "Suminine", "조개구이/장어구이": "Grilled Clams/Eel",
        "하진이네": "Hajinine", "조개구이": "Grilled Clams",
        "청사포 다희네": "Cheongsapo Dahine", "장어구이": "Grilled Eel",
        "해운대 암소갈비집": "Haeundae Amso Galbi", "한우생갈비": "Hanwoo Fresh Ribs",
        "상국이네": "Sanggukine", "떡볶이": "Tteokbokki",
        "밀양순대돼지국밥 해운대점": "Miryang Sundae Dwaeji Gukbap", "돼지국밥": "Pork Rice Soup",
        "금수복국 해운대본점": "Geumsu Bokguk Main", "뚝배기 복국": "Pufferfish Soup",
        "해성막창집 본점": "Haeseong Makchang Main", "대창/곱창전골": "Beef Tripe Hot Pot",
        "호랑이젤라떡": "Horangi Gelatteok", "젤라떡": "Gelato Tteok",
        "랑데자뷰 해운대": "Rendezvous Haeundae", "제주 감성/오션뷰": "Jeju Vibe/Ocean View",
        "스누피플레이스 부산": "Snoopy Place Busan", "스누피 테마": "Snoopy Theme",
        "오션어스": "Ocean Us", "오션뷰 커피": "Ocean View Coffee",
        "빌라혼네": "Villa Honne", "에스프레소 바": "Espresso Bar",
        "백화양곱창": "Baekhwa Yanggopchang", "양곱창": "Beef Tripe",
        "제일꼼장어": "Jeil Kkomjangeo", "꼼장어": "Hagfish",
        "남포동 생선구이 골목": "Nampodong Grilled Fish Alley", "생선구이백반": "Grilled Fish Set",
        "태종대 짬뽕": "Taejongdae Jjamppong", "해물짬뽕": "Seafood Jjamppong",
        "충북식당": "Chungbuk Restaurant", "정식": "Set Menu",
        "태종대 자갈마당 촌락": "Taejongdae Jagal Madang", "조개구이/해산물": "Grilled Clams/Seafood",
        "엔제리너스 태종대점": "Angel-in-us Taejongdae", "프랜차이즈 카페": "Franchise Cafe",
        "톤쇼우 광안점": "Tonshou Gwangan", "돈카츠": "Tonkatsu",
        "수변최고돼지국밥": "Subyeon Choego Dwaeji Gukbap", "광안리 스타벅스": "Gwangalli Starbucks",
        "밀락더마켓": "Millac the Market", "복합문화공간": "Cultural Space",
        "송도 1913": "Songdo 1913", "사천해물탕": "Sacheon Seafood Stew", "해물탕": "Seafood Stew",
        "이디야커피 부산송도해상케이블카점": "Ediya Coffee Songdo Cable Car", "케이블카 뷰": "Cable Car View",
        "바우노바 백산": "Baunova Baeksan", "바우노바 시그니처 블렌드": "Baunova Signature Blend",
        "쿠오리노": "Kuorino", "쿠오리노 수제 팬케이크": "Kuorino Handmade Pancake",
        "노티스": "Notice", "노티스 콜드브루 라떼": "Notice Coldbrew Latte",
        "연경재": "Yeongyeongjae", "연경재 하이엔드 우차(Tea)": "Yeongyeongjae High-end Tea",
        "굿올데즈": "Good Old Days", "굿올데즈 원도심 블렌딩": "Good Old Days Original Blend"
      };

      const koName = item.name?.ko || item.name || "";
      const enName = item.name?.en || tr[koName] || koName;
      const finalName = lang === "en" ? enName : koName;

      const koSig = item.signatureMenu || item.signature?.ko || item.food?.ko || item.food || "";
      const enSig = item.signature?.en || item.food?.en || tr[koSig] || koSig;
      const finalSig = lang === "en" ? enSig : koSig;

      return {
        ...item,
        calculatedDistance: dist,
        name: finalName,
        thumbnail:
          item.thumbnail ||
          (activeTab === "restaurant"
            ? KOREAN_FOOD_IMAGES[idx % KOREAN_FOOD_IMAGES.length]
            : KOREAN_CAFE_IMAGES[idx % KOREAN_CAFE_IMAGES.length]),
        signatureMenu: finalSig || (lang === "en" ? "Recommended Spot" : "추천 명소"),
      };
    });

    return processed
      .filter((item: any) => item.calculatedDistance <= mapRadius)
      .sort((a: any, b: any) => a.calculatedDistance - b.calculatedDistance);
  }, [activeTab, id, mapRadius, mapCenter, lang]);

  const nearbyItems = useMemo(() => {
    return allPlacesInRadius;
  }, [allPlacesInRadius]);

  if (!spot) return <div>Spot not found</div>;

  return (
    <div className="min-h-screen bg-[#FFFBFB] pb-20 font-sans selection:bg-[#FFD1DC]">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#FEE2E2] px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6] transition-all active:scale-90"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-[20px] font-black text-[#1F2937] tracking-tight">
              {spot.name[lang] ?? spot.name.ko} {t("nearby.explore")}
            </h1>
            <p className="text-[12px] text-[#9CA3AF] font-bold flex items-center gap-1.5 mt-0.5">
              <MapPin className="size-3.5 text-[#FFB6C1]" /> {t("nearby.popular")}
            </p>
          </div>
        </div>
      </div>

      <div className="py-10 space-y-10">
        <div className="flex bg-[#F3F4F6] p-1.5 rounded-[24px] shadow-inner">
          <button
            onClick={() => setActiveTab("restaurant")}
            className={`flex-1 py-3.5 text-[14px] font-black rounded-[18px] transition-all flex items-center justify-center gap-2 ${
              activeTab === "restaurant"
                ? "bg-white shadow-[0_4px_12px_rgb(0,0,0,0.05)] text-[#1F2937]"
                : "text-[#9CA3AF] hover:text-[#4B5563]"
            }`}
          >
            <Utensils
              className={`size-4 ${activeTab === "restaurant" ? "text-[#FF4D8D]" : "text-[#D1D5DB]"}`}
            />
            {t("nearby.restaurants")}
          </button>
          <button
            onClick={() => setActiveTab("cafe")}
            className={`flex-1 py-3.5 text-[14px] font-black rounded-[18px] transition-all flex items-center justify-center gap-2 ${
              activeTab === "cafe"
                ? "bg-white shadow-[0_4px_12px_rgb(0,0,0,0.05)] text-[#1F2937]"
                : "text-[#9CA3AF] hover:text-[#4B5563]"
            }`}
          >
            <Coffee
              className={`size-4 ${activeTab === "cafe" ? "text-[#FF4D8D]" : "text-[#D1D5DB]"}`}
            />
            {t("nearby.cafes")}
          </button>
        </div>

        {/* Responsive List: Mobile(Horizontal Scroll) / Desktop(Grid) */}

        {/* Responsive List: Mobile(Horizontal Scroll) / Desktop(Grid) */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible gap-4 md:gap-6 lg:gap-8 snap-x snap-mandatory px-6 pb-4 -mx-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {nearbyItems.length > 0 ? (
            nearbyItems.map((item: any) => (
              <DiscoveryCard
                key={item.id}
                parentSpotName={spot.name[lang] ?? spot.name.ko}
                item={item}
              />
            ))
          ) : (
            <div className="w-full md:col-span-2 lg:col-span-4 text-center py-10 text-[#717171] font-medium text-[15px]">
              해당 반경 내에 장소가 없습니다.
            </div>
          )}
        </div>

        {/* The Single Map */}
        <div className="w-full h-[400px] md:h-[500px] bg-[#E5E7EB] rounded-[32px] overflow-hidden shadow-sm relative border border-[#F3F4F6]">
          <InteractiveMap center={mapCenter} radius={mapRadius} places={allPlacesInRadius} />
        </div>
      </div>
    </div>
  );
}
