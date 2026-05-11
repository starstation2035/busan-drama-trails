"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Languages, Globe, Users, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useChatStore, SESSION_ID } from "@/stores/useChatStore";

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUNTRIES = [
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "US", name: "USA", flag: "🇺🇸" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "GB", name: "UK", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

export function LiveChatWidget({ isOpen, onClose }: LiveChatWidgetProps) {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Profile Setup State
  const [nickname, setNickname] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  
  const messages = useChatStore((state) => state.messages);
  const userProfile = useChatStore((state) => state.userProfile);
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const setProfile = useChatStore((state) => state.setProfile);
  const addMessage = useChatStore((state) => state.addMessage);
  const toggleTranslate = useChatStore((state) => state.toggleTranslate);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, showUserList, isMinimized]);

  const handleJoin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nickname.trim()) return;
    
    setProfile({
      id: SESSION_ID,
      name: nickname,
      country: selectedCountry.code,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile) return;
    
    addMessage({
      senderId: SESSION_ID,
      senderName: userProfile.name,
      senderCountry: userProfile.country,
      avatar: userProfile.avatar,
      content: inputText,
      originalLanguage: i18n.language.split("-")[0] || "ko",
    });
    setInputText("");
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-0 right-0 z-[70] flex flex-col overflow-hidden bg-[#b2c7d9] shadow-2xl transition-all duration-300 ease-in-out sm:right-6 sm:rounded-2xl border border-white/20 animate-fade-up ${isMinimized ? "h-[50px] w-[240px] sm:bottom-6" : "h-[80vh] w-full sm:bottom-6 sm:h-[420px] sm:w-[360px]"}`}>
      {/* Header */}
      <div 
        className="flex flex-shrink-0 items-center justify-between bg-black/10 px-3 py-2 backdrop-blur-md cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#3b1e1e]" />
          <div className="flex flex-col">
            <span className="font-bold text-[#3b1e1e] text-xs">{t("chat.title")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userProfile && !isMinimized && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowUserList(!showUserList);
              }}
              className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold transition-all ${showUserList ? "bg-[#3b1e1e] text-white" : "bg-white text-[#3b1e1e] shadow-sm hover:bg-gray-100"}`}
            >
              <Users className="h-3 w-3" />
              <span>{onlineUsers.length + 1}</span>
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAE100] text-[#3b1e1e] shadow-md hover:bg-[#f2d800] transition-all"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/40 text-[#3b1e1e] shadow-md hover:bg-white/60 transition-all"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!userProfile ? (
            /* Profile Setup Screen */
            <div className="flex flex-1 flex-col overflow-y-auto custom-scrollbar p-4 text-[#3b1e1e] animate-fade-in">
              <div className="flex flex-col items-center mb-3">
                <div className="mb-2 rounded-2xl bg-white/30 p-2 backdrop-blur-xl border border-white/20 shadow-lg">
                   <div className="h-10 w-10 rounded-[12px] bg-[#FAE100] flex items-center justify-center shadow-inner">
                      <MessageSquare className="h-5 w-5 text-[#3b1e1e]" />
                   </div>
                </div>
                <h2 className="mb-0 text-base font-black uppercase tracking-tight">{t("chat.setup.title") || "Traveler Profile"}</h2>
              </div>
              
              <form onSubmit={(e) => handleJoin(e)} className="w-full space-y-3">
                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-bold uppercase opacity-60 tracking-wider">Nickname</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Ex. BusanExplorer"
                    className="w-full rounded-xl bg-white/60 px-4 py-2.5 text-sm font-bold border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FAE100]/50 transition-all"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="ml-1 text-[9px] font-bold uppercase opacity-60 tracking-wider">Country</label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedCountry(c)}
                        className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition-all border-2 ${selectedCountry.code === c.code ? "bg-[#FAE100] border-[#3b1e1e] shadow-sm scale-105" : "bg-white/40 border-transparent hover:bg-white/60"}`}
                      >
                        <span className="text-lg mb-0.5">{c.flag}</span>
                        <span className="text-[8px] font-black uppercase">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!nickname.trim()}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b1e1e] py-3 text-sm font-black text-[#FAE100] shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <span className="uppercase">{t("chat.setup.enter") || "START CHATTING"}</span>
                  <Check className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : showUserList ? (
            /* Online User List Screen */
            <div className="flex flex-1 flex-col p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-[#3b1e1e] uppercase tracking-wider">Online Travelers</h3>
                <button onClick={() => setShowUserList(false)} className="text-xs font-bold text-[#3b1e1e]/60 hover:text-[#3b1e1e]">Close</button>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none]">
                {/* Self */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/40 p-3 border border-white/20">
                   <img src={userProfile.avatar} className="h-10 w-10 rounded-xl" />
                   <div className="flex flex-1 flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{userProfile.name}</span>
                        <span className="rounded bg-[#FAE100] px-1 text-[8px] font-black">ME</span>
                      </div>
                      <span className="text-[10px] opacity-60 font-medium">{COUNTRIES.find(c => c.code === userProfile.country)?.flag} {COUNTRIES.find(c => c.code === userProfile.country)?.name}</span>
                   </div>
                </div>
                {/* Others */}
                {onlineUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-white/20 p-3 border border-white/10">
                    <img src={user.avatar} className="h-10 w-10 rounded-xl" />
                    <div className="flex flex-1 flex-col">
                       <span className="text-xs font-bold">{user.name}</span>
                       <span className="text-[10px] opacity-60 font-medium">{COUNTRIES.find(c => c.code === user.country)?.flag} {COUNTRIES.find(c => c.code === user.country)?.name}</span>
                    </div>
                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                 </div>
                ))}
              </div>
            </div>
          ) : (
            /* Messages Section */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={scrollRef}>
                <div className="flex justify-center mb-6 mt-2">
                  <span className="rounded-full bg-black/10 px-4 py-1.5 text-[11px] text-[#3b1e1e]/60 backdrop-blur-sm">
                    {t("chat.welcome")}
                  </span>
                </div>
                
                {messages.map((msg) => {
                  const isMe = msg.senderId === SESSION_ID;
                  const country = COUNTRIES.find(c => c.code === msg.senderCountry);
                  
                  return (
                    <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-slide-in`}>
                      {!isMe && (
                        <img src={msg.avatar} alt="avatar" className="h-9 w-9 rounded-[14px] shadow-sm border border-black/5 mr-2 mt-1" />
                      )}
                      <div className={`flex max-w-[75%] flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && (
                          <div className="mb-1 ml-1 flex items-center gap-1">
                            <span className="text-[11px] font-semibold text-[#3b1e1e]/70">{msg.senderName}</span>
                            {country && <span className="text-[10px]">{country.flag}</span>}
                          </div>
                        )}
                        
                        <div className={`relative px-3 py-2 text-[13px] leading-relaxed shadow-sm ${isMe ? "rounded-l-[18px] rounded-br-[4px] rounded-tr-[18px] bg-[#FAE100] text-[#3b1e1e]" : "rounded-r-[18px] rounded-bl-[4px] rounded-tl-[18px] bg-white text-[#3b1e1e]"}`}>
                          {msg.translatedContent ? (
                            <div className="flex flex-col gap-1.5">
                              <span className="font-medium text-[#3b1e1e] border-b border-[#3b1e1e]/10 pb-1.5 mb-0.5">{msg.translatedContent}</span>
                              <span className="text-[11px] opacity-60">{t("chat.original")}: {msg.content}</span>
                            </div>
                          ) : (
                            <span>{msg.content}</span>
                          )}
                        </div>
                        
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
                              <span>{msg.translatedContent ? t("chat.showOriginal") : t("chat.showTranslate")}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                    placeholder={t("chat.placeholder")}
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
            </>
          )}
        </>
      )}
    </div>
  );
}
