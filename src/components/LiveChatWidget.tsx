"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Languages, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChatStore, SESSION_ID } from "@/stores/useChatStore";

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveChatWidget({ isOpen, onClose }: LiveChatWidgetProps) {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState("");
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const toggleTranslate = useChatStore((state) => state.toggleTranslate);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    addMessage({
      senderId: SESSION_ID,
      senderName: "Me (You)",
      avatar: "https://i.pravatar.cc/150?img=33",
      content: inputText,
      originalLanguage: i18n.language.split("-")[0] || "ko",
    });
    setInputText("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[70] flex h-[85vh] w-full flex-col overflow-hidden bg-[#b2c7d9] shadow-2xl transition-all sm:bottom-24 sm:right-6 sm:h-[600px] sm:w-[380px] sm:rounded-3xl border border-white/20 animate-fade-up">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between bg-black/10 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#3b1e1e]" />
          <div className="flex flex-col">
            <span className="font-bold text-[#3b1e1e] text-sm">글로벌 커뮤니티 채팅</span>
            <span className="text-[10px] text-[#3b1e1e]/70">실시간 양방향 번역 중 🌍</span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full bg-white/20 p-2 text-[#3b1e1e] hover:bg-white/40 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={scrollRef}>
        <div className="flex justify-center mb-6 mt-2">
          <span className="rounded-full bg-black/10 px-4 py-1.5 text-[11px] text-[#3b1e1e]/60 backdrop-blur-sm">
            채팅 커뮤니티에 입장하셨습니다.
          </span>
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === SESSION_ID;
          return (
            <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-slide-in`}>
              {!isMe && (
                <img src={msg.avatar} alt="avatar" className="h-9 w-9 rounded-[14px] shadow-sm border border-black/5 mr-2 mt-1" />
              )}
              <div className={`flex max-w-[75%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && <span className="mb-1 ml-1 text-[11px] font-semibold text-[#3b1e1e]/70">{msg.senderName}</span>}
                
                <div className={`relative px-3 py-2 text-[13px] leading-relaxed shadow-sm ${isMe ? "rounded-l-[18px] rounded-br-[4px] rounded-tr-[18px] bg-[#FAE100] text-[#3b1e1e]" : "rounded-r-[18px] rounded-bl-[4px] rounded-tl-[18px] bg-white text-[#3b1e1e]"}`}>
                  {/* Translated Content */}
                  {msg.translatedContent ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium text-[#3b1e1e] border-b border-[#3b1e1e]/10 pb-1.5 mb-0.5">{msg.translatedContent}</span>
                      <span className="text-[11px] opacity-60">원문: {msg.content}</span>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
                
                {/* Timestamp & Translate Action */}
                <div className={`mt-1 flex items-center gap-2 px-1 text-[10px] text-[#3b1e1e]/50 ${isMe ? "flex-row-reverse" : ""}`}>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!isMe && (
                    <button 
                      onClick={() => toggleTranslate(msg.id, i18n.language.split("-")[0] || "ko")}
                      className="flex items-center gap-1 rounded bg-black/5 px-1.5 py-0.5 hover:bg-black/10 active:scale-95 transition-all text-[#3b1e1e]/70 font-medium"
                    >
                      <Languages className="h-3 w-3" />
                      <span>{msg.translatedContent ? "원문 보기" : "번역 보기"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="bg-white p-3 md:p-4 shrink-0 border-t border-black/5">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="다국어로 실시간 번역됩니다..."
            className="max-h-[100px] min-h-[44px] flex-1 resize-none overflow-y-auto rounded-[20px] bg-gray-100 px-4 py-3 text-sm text-[#3b1e1e] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FAE100]/50 [scrollbar-width:none]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAE100] text-[#3b1e1e] transition-all hover:bg-[#f2d800] disabled:opacity-40 active:scale-95 shadow-sm"
          >
            <Send className="h-[18px] w-[18px] ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
