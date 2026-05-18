"use client";

import { useState } from "react";
import { MessageSquare, PenLine, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LiveChatWidget } from "./LiveChatWidget";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { CommunityPostModal } from "./CommunityPostModal";

export function FloatingActions() {
  const { t } = useTranslation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-28 md:bottom-10 right-4 md:right-10 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        {/* Main Action Buttons (Stacked) */}
        <div className="flex flex-col gap-4 pointer-events-auto items-end">
          {/* Chat Toggle Button */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex h-12 w-12 md:h-14 md:w-14 animate-bounce items-center justify-center rounded-full bg-[#FAE100] text-[#3B1E1E] shadow-2xl transition-all hover:scale-110 active:scale-90 ring-4 ring-white/10"
              title="Global Chat"
            >
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          )}

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

      {/* Chat Panel */}
      <LiveChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Write Post Modal */}
      <CommunityPostModal open={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </>
  );
}
