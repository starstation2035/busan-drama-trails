'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ShoppingBag, Heart, Star, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GoodsPage() {
  const { t } = useTranslation();

  // 굿즈 데이터 정의 (번역 키 연결)
  const goodsItems = [
    {
      id: 1,
      title: t('goods.items.item1.title'),
      description: t('goods.items.item1.desc'),
      price: t('detail.info.status'),
      rating: '4.9',
      reviews: 128,
      category: t('goods.items.item1.category'),
      image: '/goods_1.png',
      link: 'https://noshproject.kr/'
    },
    {
      id: 2,
      title: t('goods.items.item2.title'),
      description: t('goods.items.item2.desc'),
      price: t('detail.info.status'),
      rating: '4.9',
      reviews: 142,
      category: t('goods.items.item2.category'),
      image: '/goods_2.png',
      link: 'https://m.smartstore.naver.com/cake-onl?'
    },
    {
      id: 3,
      title: t('goods.items.item3.title'),
      description: t('goods.items.item3.desc'),
      price: t('detail.info.status'),
      rating: '4.95',
      reviews: 342,
      category: t('goods.items.item3.category'),
      image: '/goods_3.png',
      link: 'https://smartstore.naver.com/mackerelbakery?'
    },
    {
      id: 4,
      title: t('goods.items.item4.title'),
      description: t('goods.items.item4.desc'),
      price: t('detail.info.status'),
      rating: '4.9',
      reviews: 215,
      category: t('goods.items.item4.category'),
      image: '/goods_4.png',
      link: 'https://ondodam.com/'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#222222] font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto w-full max-w-screen-xl px-6 py-4 flex items-center justify-between relative">
          <Link href="/" className="flex items-center gap-2 text-[#222222] hover:text-primary transition-colors">
            <Home className="size-5" strokeWidth={1.5} />
            <span className="text-sm font-bold">{t('goods.home')}</span>
          </Link>
          <h1 className="text-base font-bold absolute left-1/2 -translate-x-1/2 tracking-tight">
            {t('goods.title')}
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
            <h2 className="text-2xl font-black tracking-tight text-[#222222] leading-tight mb-3">{t('goods.heroTitle')}</h2>
            <p className="text-base font-medium text-[#555555]">
              {t('goods.heroSubtitle')}
            </p>
          </div>
        </section>

        {/* Goods List */}
        <section>
          {/* Responsive Grid 배열 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {goodsItems.map((item) => (
              <Link 
                href={item.link} 
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
