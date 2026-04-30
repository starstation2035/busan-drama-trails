import { create } from "zustand";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  translatedContent?: string;
  originalLanguage: string;
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  toggleTranslate: (id: string, currentLang: string) => void;
}

// Ensure the broadcaster uses a stable session ID per window
export const SESSION_ID = typeof window !== "undefined" ? Math.random().toString(36).substring(7) : "server";

export const useChatStore = create<ChatState>((set, get) => {
  let channel: BroadcastChannel | null = null;
  if (typeof window !== "undefined") {
    channel = new BroadcastChannel("busan_traveler_chat");
    channel.onmessage = (event) => {
      if (event.data && event.data.type === "NEW_MESSAGE") {
        const incomingMsg = event.data.payload;
        // avoid duplicate if same session
        if (incomingMsg.senderId !== SESSION_ID) {
          set((state) => ({ messages: [...state.messages, incomingMsg] }));
        }
      }
    };
  }

  const initialMessages: ChatMessage[] = [
    {
      id: "bot_1",
      senderId: "bot_jp",
      senderName: "Sakura (Japanese)",
      avatar: "https://i.pravatar.cc/150?img=9",
      content: "釜山の海雲台は本当に綺麗ですね！おすすめのレストランはありますか？",
      originalLanguage: "ja",
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: "bot_2",
      senderId: "bot_us",
      senderName: "John (English)",
      avatar: "https://i.pravatar.cc/150?img=11",
      content: "I recommend the Dwaeji Gukbap place near the beach. It's iconic!",
      originalLanguage: "en",
      timestamp: Date.now() - 1000 * 60 * 2,
    }
  ];

  return {
    messages: initialMessages,
    addMessage: (msgInput) => {
      const newMsg: ChatMessage = {
        ...msgInput,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      set((state) => ({ messages: [...state.messages, newMsg] }));
      if (channel) {
        channel.postMessage({ type: "NEW_MESSAGE", payload: newMsg });
      }
    },
    toggleTranslate: (id, currentLang) => {
      set((state) => ({
        messages: state.messages.map((m) => {
          if (m.id === id) {
            // Toggle off if already translated
            if (m.translatedContent) {
               return { ...m, translatedContent: undefined };
            }
            // Mock translation logic based on input
            let translated = "";
            if (m.originalLanguage === "ja") translated = "부산의 해운대는 정말 아름답네요! 추천할 만한 식당이 있나요?";
            else if (m.originalLanguage === "en" && m.content.includes("Gukbap")) translated = "해변 근처에 있는 돼지국밥집을 추천해요. 정말 상징적인 곳이에요!";
            else if (currentLang === "ko") translated = "번역됨: " + m.content;
            else if (currentLang === "zh-TW") translated = "已翻譯: " + m.content;
            else translated = "Translated: " + m.content;

            return { ...m, translatedContent: translated };
          }
          return m;
        }),
      }));
    },
  };
});
