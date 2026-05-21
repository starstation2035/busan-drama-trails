"use client";

import { Sparkles, UtensilsCrossed, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ReviewSummaryProps {
  summary: string;
  signature: string;
  rating: number;
}

export default function ReviewSummary({ summary, signature, rating }: ReviewSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="px-8 pb-10 space-y-8 bg-white">
      {/* AI Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#FDF2F8] p-8 rounded-[40px] border border-[#FBCFE8] relative overflow-hidden"
      >
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FBCFE8]/20 rounded-full blur-2xl" />

        <div className="flex items-center gap-2 mb-4 text-[#DB2777]">
          <div className="p-1.5 bg-white rounded-lg shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="text-[13px] font-black uppercase tracking-wider">AI Insight</span>
        </div>

        <h3 className="text-[19px] sm:text-[21px] font-black text-[#1F2937] leading-[1.4] tracking-tight">
          {summary}
        </h3>

        <div className="mt-6 flex items-center gap-1.5 text-[#DB2777]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${i < Math.floor(rating) ? "fill-[#DB2777]" : "opacity-30"}`}
            />
          ))}
          <span className="ml-2 text-[14px] font-black">{rating.toFixed(1)} / 5.0</span>
        </div>
      </motion.div>

      {/* Signature Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <UtensilsCrossed className="size-5 text-[#FF4D8D]" />
          <h4 className="text-[17px] font-black text-[#1F2937]">{t("nearby.recommendedSignature")}</h4>
        </div>

        <div className="bg-[#FFF9FB] p-6 rounded-[32px] border border-[#FFE4E6] flex items-center justify-between group cursor-default">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#FFE4E6] text-[20px]">
              ✨
            </div>
            <div>
              <div className="text-[16px] font-black text-[#1F2937] group-hover:text-[#FF4D8D] transition-colors">
                {signature}
              </div>
              <div className="text-[12px] text-[#9CA3AF] font-bold">
                {t("nearby.mostPopularMenu")}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
