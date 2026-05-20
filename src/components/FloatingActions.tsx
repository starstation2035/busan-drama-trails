"use client";

import { useState } from "react";
import { PenLine, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { CommunityPostModal } from "./CommunityPostModal";

export function FloatingActions() {
  const { t } = useTranslation();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-28 md:bottom-10 right-4 md:right-10 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        {/* Main Action Buttons (Stacked) */}
        <div className="flex flex-col gap-4 pointer-events-auto items-end">
          {/* Write Button */}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex h-12 md:h-14 items-center gap-2 rounded-full bg-[#FF385C] px-5 md:px-7 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 border-none ring-4 ring-white/10"
            title="Write Community Post"
          >
            <PenLine className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-bold text-sm md:text-[16px] whitespace-nowrap">
              {t("community.write") || "후기 작성"}
            </span>
          </button>
        </div>
      </div>

      {/* Write Post Modal */}
      <CommunityPostModal open={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </>
  );
}
