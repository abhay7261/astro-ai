"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Send, Trash2, ArrowLeft, Bot, Sun, 
  Heart, Briefcase, Coins, ShieldAlert, Copy, Check, MessageCircle, ChevronRight 
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import { ChatMessage, sendAIAstrologerMessage } from "../services/aiChatService";

const initialMessage: ChatMessage = {
  id: "welcome-1",
  sender: "ai",
  text: "Pranam! 🙏 Main hoon aapka Personal AI Astrologer 'Acharya AI'. \n\nAapki janam kundli aur grah-nakshatron ke aadhar par main aapko Shaadi, Career, Dhan, ya kisi bhi Dosha ka satik Vedic margdarshan aur Upay de sakta hoon. \n\nApna sawal neeche likhein ya quick topic select karein!",
  remedy: "Pratidin subah mata-pita ka aashirwad lein aur Surya Dev ko arghya dein.",
  mantra: "ॐ श्री गणेशाय नमः",
  timestamp: "Just now",
};

const topicCategories = [
  { id: "all", label: "✨ All Topics" },
  { id: "love", label: "❤️ Love & Vivah" },
  { id: "career", label: "💼 Career & Job" },
  { id: "wealth", label: "🪙 Dhan & Wealth" },
  { id: "dosha", label: "🪐 Shani & Dosha" },
];

const quickChips = [
  { category: "love", text: "💍 Meri shaadi kab tak hogi?" },
  { category: "career", text: "💼 Nayi job ya promotion kab milega?" },
  { category: "wealth", text: "🪙 Aarthik sthiti aur dhan labh kab hoga?" },
  { category: "dosha", text: "🪐 Kya meri kundli me Shani Sade Sati ya Manglik dosha hai?" },
  { category: "all", text: "🔮 Mera aane wala samay kaisa rahega?" },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setIsTyping(true);

    try {
      const aiResponse = await sendAIAstrologerMessage(query, {
        name: user?.name,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.text,
        remedy: aiResponse.remedy,
        mantra: aiResponse.mantra,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredChips = quickChips.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  );

  return (
    <MobileAppLayout showBack backTitle="Home" title="Acharya AI (Vedic Chatbot)">
      <div className="flex flex-col h-[calc(100dvh-150px)] max-w-xl mx-auto -my-2 relative">
        
        {/* 1. AI Astrologer Banner & Clear Chat */}
        <div className="bg-gradient-to-r from-amber-500/15 via-terracotta/15 to-orange-500/10 p-3 sm:p-3.5 rounded-2xl border border-amber-300/60 flex items-center justify-between gap-3 mb-2 shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-terracotta text-white flex items-center justify-center shadow-md shadow-terracotta/25 flex-shrink-0 border-2 border-white">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-sm text-espresso">Acharya AI</h2>
                <span className="px-1.5 py-0.2 rounded-full bg-terracotta text-white text-[9px] font-extrabold uppercase">
                  Vedic AI
                </span>
              </div>
              <p className="text-[10px] text-espresso/70">
                24/7 Instant Vedic Chart Analysis & Upay
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-[11px] font-semibold text-espresso/60 hover:text-rose-600 bg-white/80 border border-peach px-2.5 py-1 rounded-full transition-colors active:scale-95 shadow-xs"
            title="Clear Chat History"
          >
            <Trash2 className="w-3 h-3 text-rose-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* 2. Topic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-2 scrollbar-none flex-shrink-0">
          {topicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                activeCategory === cat.id
                  ? "bg-terracotta text-white shadow-xs"
                  : "bg-white/90 border border-peach text-espresso/70 hover:bg-peach/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3. Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 text-xs sm:text-sm animate-in fade-in duration-200 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                    isUser
                      ? "bg-terracotta text-white border-peach"
                      : "bg-gradient-to-tr from-amber-500 to-terracotta text-white border-amber-300 shadow-xs"
                  }`}
                >
                  {isUser ? (
                    <span className="text-[11px] font-bold">You</span>
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-xs relative ${
                    isUser
                      ? "bg-gradient-to-r from-terracotta to-[#9E3920] text-white rounded-tr-xs"
                      : "bg-white/95 border-2 border-amber-200/90 text-espresso rounded-tl-xs"
                  }`}
                >
                  {/* Text content with line breaks */}
                  <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {/* Pandit Ji Upay Scroll Box if present */}
                  {msg.remedy && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-100/80 to-orange-50 border border-amber-300 text-espresso text-xs shadow-xs">
                      <div className="flex items-center gap-1 text-terracotta font-extrabold uppercase text-[10px] mb-1">
                        <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>Pandit Ji Ka Upay:</span>
                      </div>
                      <p className="leading-relaxed">{msg.remedy}</p>

                      {msg.mantra && (
                        <div className="mt-2 pt-2 border-t border-amber-200/80 font-serif font-bold text-terracotta text-[11px]">
                          {msg.mantra}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bubble Footer: Timestamp & Copy */}
                  <div className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${
                    isUser ? "text-white/70" : "text-espresso/50"
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-terracotta flex items-center gap-0.5 active:scale-90 transition-transform"
                        title="Copy Answer"
                      >
                        {copiedId === msg.id ? (
                          <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                            <Check className="w-2.5 h-2.5" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-2.5 h-2.5" /> Copy
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 text-xs animate-in fade-in">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-terracotta text-white flex items-center justify-center flex-shrink-0 border border-amber-300">
                <Bot className="w-3.5 h-3.5 animate-spin-slow" />
              </div>
              <div className="bg-white/95 border-2 border-amber-200/90 rounded-2xl p-3 shadow-xs flex items-center gap-2 text-espresso">
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span className="text-xs font-semibold text-espresso/80">
                  Acharya AI grah-nakshatra calculate kar rahe hain...
                </span>
                <span className="inline-flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce delay-200" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Suggestion Chips (Horizontal Scroll) */}
        <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none flex-shrink-0">
          {filteredChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleSend(chip.text)}
              disabled={isTyping}
              className="flex-shrink-0 text-[11px] font-semibold bg-white/95 hover:bg-peach/60 border border-peach text-espresso px-3 py-1.5 rounded-full shadow-xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {chip.text}
            </button>
          ))}
        </div>

        {/* 5. Bottom Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-1 pb-1 flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Apna sawal likhein (e.g. Shaadi kab hogi?)..."
            className="flex-1 bg-white border-2 border-amber-300/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-espresso placeholder-espresso/45 focus:outline-none focus:border-terracotta shadow-xs disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-md shadow-terracotta/25 flex-shrink-0 transition-transform"
            title="Send Question"
          >
            <Send className="w-4 h-4 translate-x-0.5" />
          </button>
        </form>

      </div>
    </MobileAppLayout>
  );
}
