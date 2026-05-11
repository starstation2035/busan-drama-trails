'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ShoppingBag, Heart, Star, ChevronRight } from 'lucide-react';

// 임시 굿즈 데이터 (Domain 영역에서 관리되어야 하나 UI 퍼블리싱을 위해 임시 작성)
const mockGoods = [
  {
    id: 1,
    title: '자갈치 오지매 (건어물 스낵)',
    description: '"휴식을 맛있고 즐겁게" 6종의 건어물 제품으로 맛있는 휴식을 제공합니다.',
    price: '가격 미정',
    rating: '4.9',
    reviews: 128,
    category: '식품',
    image: '/goods_1.png', // 실제 이미지로 교체 필요 (현재는 임시)
    link: 'https://noshproject.kr/'
  },
  {
    id: 2,
    title: '예쁜떡오늘 (부산 디자인 특화떡)',
    description: '부산에서 나고 자라는 재료를 사용하고, 부산 대표 테마를 형상화한 디자인 특화떡',
    price: '가격 미정',
    rating: '4.9',
    reviews: 142,
    category: '식품',
    image: '/goods_2.png', // 실제 떡 이미지로 교체 필요
    link: 'https://m.smartstore.naver.com/cake-onl?'
  },
  {
    id: 3,
    title: '부산고등어빵 & 고도리빵',
    description: '부산시어 고등어를 모티브로 만든 쌀빵으로 글루텐프리 제품입니다.',
    price: '가격 미정',
    rating: '4.95',
    reviews: 342,
    category: '식품',
    image: '/goods_3.png', // 생성된 빵 이미지
    link: 'https://smartstore.naver.com/mackerelbakery?'
  },
  {
    id: 4,
    title: '온도담 (장인의 진심 유기그릇)',
    description: '진심을 담다. 장인의 정성이 깃든 진짜 유기, 2003년부터 연구한 믿을 수 있는 유기 브랜드',
    price: '가격 미정',
    rating: '4.9',
    reviews: 215,
    category: '리빙/식기',
    image: '/goods_4.png', // 실제 유기그릇 이미지로 교체 완료
    link: 'https://ondodam.com/'
  }
];

export default function GoodsPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#222222] font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-4 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2 text-[#222222] hover:text-primary transition-colors">
            <Home className="size-5" strokeWidth={1.5} />
            <span className="text-sm font-bold">홈으로</span>
          </Link>
          <h1 className="text-base font-bold absolute left-1/2 -translate-x-1/2 tracking-tight">
            공식 스토어
          </h1>
          <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 size-2 bg-primary rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-xl px-6 py-10">
        {/* Hero Banner */}
        <section className="mb-12">
          <div className="bg-muted/30 rounded-3xl p-10 flex flex-col items-center text-center border border-border/50">
            <h2 className="text-2xl font-black tracking-tight text-[#222222] leading-tight mb-3">부산의 추억을 간직하세요</h2>
            <p className="text-base font-medium text-[#555555]">
              드라마 속 그 장소의 감동을 그대로 담은 오리지널 굿즈
            </p>
          </div>
        </section>

        {/* Goods List */}
        <section>
          {/* Responsive Grid 배열 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {mockGoods.map((item) => (
              <Link 
                href={item.link || `/goods/${item.id}`} 
                key={item.id} 
                target={item.link ? "_blank" : "_self"}
                rel={item.link ? "noopener noreferrer" : ""}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative w-full aspect-square bg-muted rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all">
                  <Image 
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-[#FFFFFF]/80 backdrop-blur-sm rounded-full hover:bg-[#FFFFFF] transition-colors z-10">
                    <Heart className="w-4 h-4 text-[#222222]" strokeWidth={1.5} />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[#717171] font-medium">{item.category}</span>
                    <div className="flex items-center gap-1 text-[13px]">
                      <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" strokeWidth={1.5} />
                      <span className="font-medium">{item.rating}</span>
                      <span className="text-[#717171]">({item.reviews})</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold tracking-tight text-[#222222] mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-sm font-medium text-[#555555] mb-2 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
