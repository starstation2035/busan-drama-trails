"use client";

import { useState } from "react";
import { MessageSquare, PenLine, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LiveChatWidget } from "./LiveChatWidget";
import { Button } from "./ui/button";
import { toast } from "sonner";

import { CommunityPostModal } from "./CommunityPostModal";

export function FloatingActions() {
  const { t } = useTranslation();
  const [showWriteMenu, setShowWriteMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const handleWriteClick = () => {
    setIsWriteModalOpen(true);
    setShowWriteMenu(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
        {/* Write Option (shown when expanded) */}
        {showWriteMenu && (
          <div className="flex flex-col items-end gap-2 mb-1 animate-fade-up pointer-events-auto">
            <Button
              onClick={handleWriteClick}
              className="rounded-full bg-white text-[#222222] shadow-airbnb border border-[#DDDDDD] px-5 h-11 text-[13px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
            >
              <PenLine className="h-4 w-4 text-[#FF385C]" />
              {t("community.write") || "후기 작성"}
            </Button>
          </div>
        )}
        
        {/* Main Action Buttons (Stacked) */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Chat Toggle Button */}
          {!isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="flex h-14 w-14 animate-bounce items-center justify-center rounded-full bg-[#FAE100] text-[#3B1E1E] shadow-airbnb transition-all hover:scale-110 active:scale-90"
              title="Global Chat"
            >
              <MessageSquare className="h-6 w-6" />
            </button>
          )}

          {/* Write Toggle Button */}
          <button
            onClick={() => setShowWriteMenu(!showWriteMenu)}
            className={`flex h-14 w-14 items-center justify-center rounded-full shadow-airbnb transition-all active:scale-90 ${
              showWriteMenu 
                ? "bg-[#222222] text-white rotate-45" 
                : "bg-[#FF385C] text-white"
            }`}
            title="Write Community Post"
          >
            <Plus className="h-7 w-7" />
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
