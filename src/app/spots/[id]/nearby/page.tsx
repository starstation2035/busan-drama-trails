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
        name: { ko: "수변최고돼지국밥", en: "Subyeon Best Pork Soup" },
        address: "부산 수영구 광안해변로370번길 9-32",
        food: { ko: "돼지국밥", en: "Pork Rice Soup" },
        latitude: 35.155,
        longitude: 129.124,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.6,
      },
    ],
    cafes: [
      {
        id: "c7_1",
        name: { ko: "광안리 뚜벅스", en: "Gwangalli Twobuks" },
        address: "부산 수영구 광안해변로 239",
        signature: { ko: "오션뷰", en: "Ocean View" },
        latitude: 35.153,
        longitude: 129.118,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.7,
      },
      {
        id: "c7_2",
        name: { ko: "밀락더마켓", en: "Millac the Market" },
        address: "부산 수영구 민락수변로17번길 56",
        signature: { ko: "복합문화공간", en: "Cultural Space" },
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
        name: { ko: "송도 1913", en: "Songdo 1913" },
        address: "부산 서구 송도해변로 19-1",
        food: { ko: "조개구이", en: "Grilled Clams" },
        latitude: 35.075,
        longitude: 129.018,
        thumbnail: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
        rating: 4.4,
      },
      {
        id: "r8_2",
        name: { ko: "사천해물탕", en: "Sacheon Seafood Stew" },
        address: "부산 서구 충무대로 12",
        food: { ko: "해물탕", en: "Seafood Stew" },
        latitude: 35.077,
        longitude: 129.0165,
        thumbnail: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=400",
        rating: 4.5,
      },
    ],
    cafes: [
      {
        id: "c8_1",
        name: { ko: "TCC 송도", en: "TCC Songdo" },
        address: "부산 서구 송도해변로 143",
        signature: { ko: "루프탑 뷰", en: "Rooftop View" },
        latitude: 35.0755,
        longitude: 129.0175,
        thumbnail: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=400",
        rating: 4.6,
      },
      {
        id: "c8_2",
        name: { ko: "이디야커피 부산송도해상케이블카점", en: "Ediya Coffee Songdo Cable Car" },
        address: "부산 서구 송도해변로 171",
        signature: { ko: "케이블카 뷰", en: "Cable Car View" },
        latitude: 35.078,
        longitude: 129.02,
        thumbnail: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400",
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
      const tr: Record<string, Record<string, string>> = {
        "거청식당": { "en": "Geocheong Restaurant", "zh-TW": "巨清食堂", "zh-CN": "巨清食堂", "ja": "巨清食堂" },
        "생선구이": { "en": "Grilled Fish", "zh-TW": "烤魚", "zh-CN": "烤鱼", "ja": "焼き魚" },
        "에테르": { "en": "Aether", "zh-TW": "Aether", "zh-CN": "Aether", "ja": "エテル" },
        "루프탑": { "en": "Rooftop", "zh-TW": "屋頂", "zh-CN": "屋顶", "ja": "ルーフトップ" },
        "구름에": { "en": "Gureume", "zh-TW": "雲端", "zh-CN": "云端", "ja": "クルメ" },
        "디저트": { "en": "Dessert", "zh-TW": "甜點", "zh-CN": "甜点", "ja": "デザート" },
        "피아크 (P.ARK)": { "en": "P.ARK", "zh-TW": "P.ARK", "zh-CN": "P.ARK", "ja": "ピアーク" },
        "초대형": { "en": "Mega Cafe", "zh-TW": "超大型咖啡廳", "zh-CN": "超大型咖啡厅", "ja": "超大型カフェ" },
        "모모스커피 영도": { "en": "Momos Coffee Yeongdo", "zh-TW": "Momos Coffee 影島", "zh-CN": "Momos Coffee 影岛", "ja": "モモスコヒー影島" },
        "스페셜티": { "en": "Specialty Coffee", "zh-TW": "精品咖啡", "zh-CN": "精品咖啡", "ja": "スペシャルティコーヒー" },
        "쓰릴미": { "en": "Thrill Me", "zh-TW": "Thrill Me", "zh-CN": "Thrill Me", "ja": "スリルミー" },
        "오션뷰": { "en": "Ocean View", "zh-TW": "無敵海景", "zh-CN": "无敌海景", "ja": "オーシャンビュー" },
        "카페 변호인": { "en": "Cafe Attorney", "zh-TW": "咖啡廳 辯護人", "zh-CN": "咖啡厅 辩护人", "ja": "カフェ弁護人" },
        "촬영지": { "en": "Filming Location", "zh-TW": "拍攝地", "zh-CN": "拍摄地", "ja": "撮影地" },
        "수민이네": { "en": "Suminine", "zh-TW": "秀敏家", "zh-CN": "秀敏家", "ja": "スミンイネ" },
        "조개구이/장어구이": { "en": "Grilled Clams/Eel", "zh-TW": "烤貝類/烤鰻魚", "zh-CN": "烤贝类/烤鳗鱼", "ja": "貝焼き/うなぎ焼き" },
        "하진이네": { "en": "Hajinine", "zh-TW": "河珍家", "zh-CN": "河珍家", "ja": "ハジンイネ" },
        "조개구이": { "en": "Grilled Clams", "zh-TW": "烤貝類", "zh-CN": "烤贝类", "ja": "貝焼き" },
        "청사포 다희네": { "en": "Cheongsapo Dahine", "zh-TW": "青沙浦多熙家", "zh-CN": "青沙浦多熙家", "ja": "青沙浦ダヒネ" },
        "장어구이": { "en": "Grilled Eel", "zh-TW": "烤鰻魚", "zh-CN": "烤鳗鱼", "ja": "うなぎ焼き" },
        "해운대 암소갈비집": { "en": "Haeundae Amso Galbi", "zh-TW": "海雲台母牛排骨", "zh-CN": "海云台母牛排骨", "ja": "海雲台アムソカルビ" },
        "한우생갈비": { "en": "Hanwoo Fresh Ribs", "zh-TW": "韓牛生排骨", "zh-CN": "韩牛生排骨", "ja": "韓牛生カルビ" },
        "상국이네": { "en": "Sanggukine", "zh-TW": "相國家", "zh-CN": "相国家", "ja": "サングク家" },
        "떡볶이": { "en": "Tteokbokki", "zh-TW": "辣炒年糕", "zh-CN": "辣炒年糕", "ja": "トッポッキ" },
        "밀양순대돼지국밥 해운대점": { "en": "Miryang Sundae Dwaeji Gukbap", "zh-TW": "密陽血腸豬肉湯飯 海雲台店", "zh-CN": "密阳血肠猪肉汤饭 海云台店", "ja": "密陽スンデデジクッパ 海雲台店" },
        "돼지국밥": { "en": "Pork Rice Soup", "zh-TW": "豬肉湯飯", "zh-CN": "猪肉汤饭", "ja": "豚骨スープご飯" },
        "금수복국 해운대본점": { "en": "Geumsu Bokguk Main", "zh-TW": "錦繡河豚 海雲台總店", "zh-CN": "锦绣河豚 海云台总店", "ja": "クムスボックッ 海雲台本店" },
        "뚝배기 복국": { "en": "Pufferfish Soup", "zh-TW": "砂鍋河豚湯", "zh-CN": "砂锅河豚汤", "ja": "土鍋フグスープ" },
        "해성막창집 본점": { "en": "Haeseong Makchang Main", "zh-TW": "海成烤腸 總店", "zh-CN": "海成烤肠 总店", "ja": "海星マクチャン 本店" },
        "대창/곱창전골": { "en": "Beef Tripe Hot Pot", "zh-TW": "大腸/牛腸鍋", "zh-CN": "大肠/牛肠锅", "ja": "テッチャン/ホルモン鍋" },
        "호랑이젤라떡": { "en": "Horangi Gelatteok", "zh-TW": "老虎義式冰淇淋大福", "zh-CN": "老虎意式冰淇淋大福", "ja": "虎ジェラ餅" },
        "젤라떡": { "en": "Gelato Tteok", "zh-TW": "義式冰淇淋大福", "zh-CN": "意式冰淇淋大福", "ja": "ジェラ餅" },
        "랑데자뷰 해운대": { "en": "Rendezvous Haeundae", "zh-TW": "Rendezvous 海雲台", "zh-CN": "Rendezvous 海云台", "ja": "ランデジャビュー 海雲台" },
        "제주 감성/오션뷰": { "en": "Jeju Vibe/Ocean View", "zh-TW": "濟州風情/海景", "zh-CN": "济州风情/海景", "ja": "済州感性/オーシャンビュー" },
        "스누피플레이스 부산": { "en": "Snoopy Place Busan", "zh-TW": "史努比咖啡廳 釜山", "zh-CN": "史努比咖啡厅 釜山", "ja": "スヌーピープレイス 釜山" },
        "스누피 테마": { "en": "Snoopy Theme", "zh-TW": "史努比主題", "zh-CN": "史努比主题", "ja": "スヌーピーテーマ" },
        "오션어스": { "en": "Ocean Us", "zh-TW": "Ocean Us", "zh-CN": "Ocean Us", "ja": "オーシャンアス" },
        "오션뷰 커피": { "en": "Ocean View Coffee", "zh-TW": "海景咖啡", "zh-CN": "海景咖啡", "ja": "オーシャンビューコーヒー" },
        "빌라혼네": { "en": "Villa Honne", "zh-TW": "Villa Honne", "zh-CN": "Villa Honne", "ja": "ビラホンネ" },
        "에스프레소 바": { "en": "Espresso Bar", "zh-TW": "義式濃縮咖啡吧", "zh-CN": "意式浓缩咖啡吧", "ja": "エスプレッソバー" },
        "백화양곱창": { "en": "Baekhwa Yanggopchang", "zh-TW": "百化羊腸", "zh-CN": "百化羊肠", "ja": "百花ヤンコプチャン" },
        "양곱창": { "en": "Beef Tripe", "zh-TW": "牛腸", "zh-CN": "牛肠", "ja": "ヤンコプチャン" },
        "제일꼼장어": { "en": "Jeil Kkomjangeo", "zh-TW": "第一盲鰻", "zh-CN": "第一盲鳗", "ja": "チェイルコムジャンオ" },
        "꼼장어": { "en": "Hagfish", "zh-TW": "盲鰻", "zh-CN": "盲鳗", "ja": "コムジャンオ" },
        "남포동 생선구이 골목": { "en": "Nampodong Grilled Fish Alley", "zh-TW": "南浦洞烤魚胡同", "zh-CN": "南浦洞烤鱼胡同", "ja": "南浦洞焼き魚横丁" },
        "생선구이백반": { "en": "Grilled Fish Set", "zh-TW": "烤魚套餐", "zh-CN": "烤鱼套餐", "ja": "焼き魚定食" },
        "태종대 짬뽕": { "en": "Taejongdae Jjamppong", "zh-TW": "太宗台炒碼麵", "zh-CN": "太宗台炒码面", "ja": "太宗台チャンポン" },
        "해물짬뽕": { "en": "Seafood Jjamppong", "zh-TW": "海鮮炒碼麵", "zh-CN": "海鲜炒码面", "ja": "海鮮チャンポン" },
        "충북식당": { "en": "Chungbuk Restaurant", "zh-TW": "忠北食堂", "zh-CN": "忠北食堂", "ja": "忠北食堂" },
        "정식": { "en": "Set Menu", "zh-TW": "定食", "zh-CN": "定食", "ja": "定食" },
        "태종대 자갈마당 촌락": { "en": "Taejongdae Jagal Madang", "zh-TW": "太宗台碎石灘", "zh-CN": "太宗台碎石滩", "ja": "太宗台ジャガルマダン" },
        "조개구이/해산물": { "en": "Grilled Clams/Seafood", "zh-TW": "烤貝類/海鮮", "zh-CN": "烤贝类/海鲜", "ja": "貝焼き/海鮮" },
        "엔제리너스 태종대점": { "en": "Angel-in-us Taejongdae", "zh-TW": "Angel-in-us 太宗台店", "zh-CN": "Angel-in-us 太宗台店", "ja": "エンジェリナス 太宗台店" },
        "프랜차이즈 카페": { "en": "Franchise Cafe", "zh-TW": "連鎖咖啡廳", "zh-CN": "连锁咖啡厅", "ja": "フランチャイズカフェ" },
        "톤쇼우 광안점": { "en": "Tonshou Gwangan", "zh-TW": "Tonshou 廣安", "zh-CN": "Tonshou 广安", "ja": "トンショウ 広安" },
        "돈카츠": { "en": "Tonkatsu", "zh-TW": "炸豬排", "zh-CN": "炸猪排", "ja": "豚カツ" },
        "수변최고돼지국밥": { "en": "Subyeon Choego Dwaeji Gukbap", "zh-TW": "水邊最高豬肉湯飯", "zh-CN": "水边最高猪肉汤饭", "ja": "水辺最高豚骨スープご飯" },
        "광안리 스타벅스": { "en": "Gwangalli Starbucks", "zh-TW": "廣安里星巴克", "zh-CN": "广安里星巴克", "ja": "広安里スターバックス" },
        "밀락더마켓": { "en": "Millac the Market", "zh-TW": "Millac the Market", "zh-CN": "Millac the Market", "ja": "ミラックザマーケット" },
        "복합문화공간": { "en": "Cultural Space", "zh-TW": "綜合文化空間", "zh-CN": "综合文化空间", "ja": "複合文化空間" },
        "송도 1913": { "en": "Songdo 1913", "zh-TW": "松島 1913", "zh-CN": "松岛 1913", "ja": "松島 1913" },
        "사천해물탕": { "en": "Sacheon Seafood Stew", "zh-TW": "四川海鮮湯", "zh-CN": "四川海鲜汤", "ja": "四川海鮮鍋" }, 
        "해물탕": { "en": "Seafood Stew", "zh-TW": "海鮮湯", "zh-CN": "海鲜汤", "ja": "海鮮鍋" },
        "해운대 기와집 대구탕": { "en": "Haeundae Giwajip Daegutang", "zh-TW": "海雲台瓦屋鱈魚湯", "zh-CN": "海云台瓦屋鳕鱼汤", "ja": "海雲台瓦屋タラ鍋" },
        "대구탕": { "en": "Daegutang", "zh-TW": "鱈魚湯", "zh-CN": "鳕鱼汤", "ja": "タラ鍋" },
        "옛날오막집": { "en": "Yetnal Omakjib", "zh-TW": "傳統五幕家", "zh-CN": "传统五幕家", "ja": "昔のオマク家" },
        "양대창": { "en": "Grilled Tripe", "zh-TW": "烤牛肚", "zh-CN": "烤牛肚", "ja": "ホルモン焼き" },
        "수영돼지국밥": { "en": "Suyeong Pork Rice Soup", "zh-TW": "水營豬肉湯飯", "zh-CN": "水营猪肉汤饭", "ja": "水営テジクッパ" },
        "언양불고기부산집": { "en": "Eonyang Bulgogi Busan", "zh-TW": "彥陽烤肉釜山家", "zh-CN": "彦阳烤肉釜山家", "ja": "彦陽プルコギ釜山家" },
        "불고기": { "en": "Bulgogi", "zh-TW": "烤肉", "zh-CN": "烤肉", "ja": "プルコギ" },
        "이디야커피 부산송도해상케이블카점": { "en": "Ediya Coffee Songdo Cable Car", "zh-TW": "Ediya Coffee 松島纜車店", "zh-CN": "Ediya Coffee 松岛缆车店", "ja": "イディヤコーヒー 松島ケーブルカー店" },
        "케이블카 뷰": { "en": "Cable Car View", "zh-TW": "纜車景觀", "zh-CN": "缆车景观", "ja": "ケーブルカービュー" },
        "바우노바 백산": { "en": "Baunova Baeksan", "zh-TW": "Baunova 白山", "zh-CN": "Baunova 白山", "ja": "バウノバ 白山" },
        "바우노바 시그니처 블렌드": { "en": "Baunova Signature Blend", "zh-TW": "Baunova 招牌特調", "zh-CN": "Baunova 招牌特调", "ja": "バウノバ シグネチャーブレンド" },
        "쿠오리노": { "en": "Kuorino", "zh-TW": "Kuorino", "zh-CN": "Kuorino", "ja": "クオリノ" },
        "쿠오리노 수제 팬케이크": { "en": "Kuorino Handmade Pancake", "zh-TW": "Kuorino 手工鬆餅", "zh-CN": "Kuorino 手工松饼", "ja": "クオリノ 手作りパンケーキ" },
        "노티스": { "en": "Notice", "zh-TW": "Notice", "zh-CN": "Notice", "ja": "ノーティス" },
        "노티스 콜드브루 라떼": { "en": "Notice Coldbrew Latte", "zh-TW": "Notice 冷萃拿鐵", "zh-CN": "Notice 冷萃拿铁", "ja": "ノーティス コールドブリューラテ" },
        "연경재": { "en": "Yeongyeongjae", "zh-TW": "延慶齋", "zh-CN": "延庆斋", "ja": "ヨンギョンジェ" },
        "연경재 하이엔드 우차(Tea)": { "en": "Yeongyeongjae High-end Tea", "zh-TW": "延慶齋 頂級茶", "zh-CN": "延庆斋 顶级茶", "ja": "ヨンギョンジェ ハイエンド茶" },
        "굿올데즈": { "en": "Good Old Days", "zh-TW": "Good Old Days", "zh-CN": "Good Old Days", "ja": "グッドオールドデイズ" },
        "굿올데즈 원도심 블렌딩": { "en": "Good Old Days Original Blend", "zh-TW": "Good Old Days 招牌特調", "zh-CN": "Good Old Days 招牌特调", "ja": "グッドオールドデイズ オリジナルブレンド" },
        "TCC 송도": { "en": "TCC Songdo", "zh-TW": "TCC 松島", "zh-CN": "TCC 松岛", "ja": "TCC 松島" },
        "루프탑 뷰": { "en": "Rooftop View", "zh-TW": "頂樓景觀", "zh-CN": "顶楼景观", "ja": "ルーフトップビュー" },
        "광안리 뚜벅스": { "en": "Gwangalli Twobuks", "zh-TW": "廣安里 Twobuks", "zh-CN": "广安里 Twobuks", "ja": "広安里 Twobuks" },
        "흰여울점빵": { "en": "Huinnyeoul Jeomppang", "zh-TW": "白淺灘點心店", "zh-CN": "白浅滩点心店", "ja": "ヒンヨウルチョンパン" },
        "라면/토스트": { "en": "Ramen/Toast", "zh-TW": "拉麵/吐司", "zh-CN": "拉面/吐司", "ja": "ラーメン/トースト" },
        "달뜨네": { "en": "Dalteune", "zh-TW": "月升", "zh-CN": "月升", "ja": "タルトゥネ" },
        "회밥/시나몬맥주": { "en": "Sashimi Rice/Cinnamon Beer", "zh-TW": "生魚片飯/肉桂啤酒", "zh-CN": "生鱼片饭/肉桂啤酒", "ja": "刺身ご飯/シナモンビール" },
        "영도해녀촌": { "en": "Yeongdo Haenyeo Village", "zh-TW": "影島海女村", "zh-CN": "影岛海女村", "ja": "影島海女村" },
        "성게알/김밥": { "en": "Sea Urchin/Gimbap", "zh-TW": "海膽/海苔飯捲", "zh-CN": "海胆/紫菜包饭", "ja": "ウニ/海苔巻き" },
        "도날드": { "en": "Donald", "zh-TW": "唐老鴨", "zh-CN": "唐老鸭", "ja": "ドナルド" },
        "즉석떡볶이": { "en": "Instant Tteokbokki", "zh-TW": "現煮辣炒年糕", "zh-CN": "现煮炒年糕", "ja": "即席トッポッキ" },
        "왔다식당": { "en": "Watta Restaurant", "zh-TW": "來了食堂", "zh-CN": "来了食堂", "ja": "ワッタ食堂" },
        "한우스지전골": { "en": "Hanwoo Beef Tendon Hot Pot", "zh-TW": "韓牛牛筋火鍋", "zh-CN": "韩牛牛筋火锅", "ja": "韓牛スジ鍋" },
        "재기돼지국밥": { "en": "Jaegi Pork Rice Soup", "zh-TW": "再起豬肉湯飯", "zh-CN": "再起猪肉汤饭", "ja": "チェギテジクッパ" },
        "남항시장": { "en": "Namhang Market", "zh-TW": "南港市場", "zh-CN": "南港市场", "ja": "南港市場" },
        "와글와글": { "en": "Wagle Wagle", "zh-TW": "熱熱鬧鬧", "zh-CN": "热热闹闹", "ja": "ワグルワグル" },
        "라밥": { "en": "Rabab", "zh-TW": "拉麵飯", "zh-CN": "拉面饭", "ja": "ラバプ" },
        "청학동구이": { "en": "Cheonghakdong Grill", "zh-TW": "青鶴洞烤肉", "zh-CN": "青鹤洞烤肉", "ja": "青鶴洞クイ" },
        "고기": { "en": "Meat", "zh-TW": "烤肉", "zh-CN": "烤肉", "ja": "肉" },
        "삼진어묵 본점": { "en": "Samjin Amook Main Store", "zh-TW": "三進魚糕總店", "zh-CN": "三进鱼糕总店", "ja": "サムジンオムク本店" },
        "어묵": { "en": "Fish Cake", "zh-TW": "魚糕", "zh-CN": "鱼糕", "ja": "おでん" },
        "신기숲": { "en": "Singisup", "zh-TW": "神奇森林", "zh-CN": "神奇森林", "ja": "シンギスプ" },
        "대나무뷰": { "en": "Bamboo View", "zh-TW": "竹林景觀", "zh-CN": "竹林景观", "ja": "竹林ビュー" },
        "손목서가": { "en": "Sonmok Seoga", "zh-TW": "手腕書架", "zh-CN": "手腕书架", "ja": "ソンモクソガ" },
        "오션뷰 서점": { "en": "Ocean View Bookstore", "zh-TW": "海景書店", "zh-CN": "海景书店", "ja": "オーシャンビュー書店" },

        "무명일기": { "en": "Unknown Diary", "zh-TW": "無名日記", "zh-CN": "无名日记", "ja": "無名日記" },
        "창고형": { "en": "Warehouse Type", "zh-TW": "倉庫型", "zh-CN": "仓库型", "ja": "倉庫型" },

      };

      const koName = item.name?.ko || item.name || "";
      const langName = item.name?.[lang] || (tr[koName] && tr[koName][lang]) || (lang === "en" && tr[koName]?.en) || koName;

      const koSig = item.signatureMenu || item.signature?.ko || item.food?.ko || item.food || "";
      const langSig = item.signature?.[lang] || item.food?.[lang] || (tr[koSig] && tr[koSig][lang]) || (lang === "en" && tr[koSig]?.en) || koSig;

      return {
        ...item,
        calculatedDistance: dist,
        name: langName,
        thumbnail:
          item.thumbnail ||
          (activeTab === "restaurant"
            ? KOREAN_FOOD_IMAGES[idx % KOREAN_FOOD_IMAGES.length]
            : KOREAN_CAFE_IMAGES[idx % KOREAN_CAFE_IMAGES.length]),
        signatureMenu: langSig || (lang === "en" ? "Recommended Spot" : lang === "zh-TW" ? "推薦名勝" : lang === "zh-CN" ? "推荐名胜" : lang === "ja" ? "おすすめスポット" : "추천 명소"),
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
              {lang === "en" ? "No places found within this radius." : "해당 반경 내에 장소가 없습니다."}
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
