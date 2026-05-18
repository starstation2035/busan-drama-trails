"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PhotoGridProps {
  images: { url: string; description: string }[];
}

export default function PhotoGrid({ images }: PhotoGridProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="px-8 mb-8">
      {/* 4-split Grid */}
      <div className="grid grid-cols-2 gap-3 aspect-square w-full">
        {images.slice(0, 4).map((img, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedIdx(idx)}
            className="relative overflow-hidden rounded-3xl bg-gray-100 cursor-zoom-in"
          >
            <img src={img.url} alt={img.description} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[600px] bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="aspect-square relative">
                <img
                  src={images[selectedIdx].url}
                  alt={images[selectedIdx].description}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIdx(null);
                  }}
                  className="absolute top-6 right-6 p-3 bg-black/20 text-white rounded-full backdrop-blur-md hover:bg-black/40 transition-all"
                >
                  <X className="size-6" />
                </button>
              </div>
              <div className="p-8 text-center bg-white">
                <p className="text-[18px] font-black text-[#1F2937] leading-relaxed">
                  {images[selectedIdx].description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
