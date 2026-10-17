"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Send, ShieldCheck, Sparkles, User, Clock } from "lucide-react";

export interface ChatAstrologer {
  id: string;
  name: string;
  title: string;
  image: string;
  experience: string;
  specialty: string;
}

interface Message {
  id: string;
  sender: "user" | "astrologer";
  text: string;
  time: string;
}

interface AstroChatModalProps {
  astrologer: ChatAstrologer;
  onClose: () => void;
}

const suggestedQuestions = [
  "💍 Meri shaadi kab tak hogi?",
  "💼 Career me promotion ya nayi job kab milegi?",
  "🪐 Kya meri kundli me koi bada dosha hai?",
  "🔮 Mera aane wala samay kaisa rahega?",
];

export default function AstroChatModal({ astrologer, onClose }: AstroChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "astrologer",
      text: `Pranam! 🙏 Main ${astrologer.name}. Aapka swagat hai. Kripya apna naam, janam tithi (DOB) aur apna sawal batayein, taaki main aapke grahon aur kundli ke aadhar par satik margdarshan kar sakun.`,
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Send Message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Simulate Astrologer Realistic Typing & Response
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `Aapka sawal grahon ke gochar ke hisab se bahut mahatvapurna hai. Aapke lagna aur dasham bhaav (10th house) me Shani aur Guru ka prabhav ban raha hai. Aane wale 3 se 6 mahine me aapko shubh samachar milne ke prabal yog hain. Subah Surya Dev ko arghya dein aur Om Namah Shivaya ka jaap karein.`;

      if (text.includes("shaadi") || text.includes("marriage")) {
        replyText = `Kundli ke 7th house (Saptam Bhaav) me Guru aur Shukra ki drishti ban rahi hai. Agle varsh ke madhya tak vivah ke yog bahut mazboot ho rahe hain. Guruwar ko peele vastra pehenna aur Vishnu Sahasranama ka paath karna atyant labhkari rahega.`;
      } else if (text.includes("job") || text.includes("career")) {
        replyText = `Aapke 10th bhaav ke anusar, Suryadev aur Budh ki sthiti karobaar aur naukri me sthirta layegi. Agle 45 dinon me nayi opportunity ke aane ke sanket hain. Karya sthal par pashchim disha ki taraf muh karke baithne se bachein.`;
      }

      const astroMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "astrologer",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, astroMsg]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-astro-bg w-full sm:max-w-xl h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-peach">
        
        {/* 1. Header */}
        <div className="px-5 py-3.5 bg-white border-b border-peach/70 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-peach">
                <Image
                  src={astrologer.image}
                  alt={astrologer.name}
                  width={48}
                  height={48}
                  unoptimized
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-espresso text-base">
                  {astrologer.name}
                </h3>
              </div>
              <p className="text-[11px] text-espresso/70 flex items-center gap-1.5">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ● Online Now
                </span>
                <span>•</span>
                <span>{astrologer.experience}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-peach/70 text-terracotta px-2.5 py-1 rounded-full font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Private
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-peach/50 flex items-center justify-center text-espresso hover:bg-peach transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Free Chat Badge Banner */}
        <div className="bg-peach/50 border-b border-peach/50 px-4 py-1.5 text-center text-xs font-semibold text-terracotta flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          First Consultation Free • Ask anything about your future
        </div>

        {/* 3. Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-peach flex-shrink-0 mt-1">
                    <Image
                      src={astrologer.image}
                      alt={astrologer.name}
                      width={28}
                      height={28}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-terracotta text-astro-bg rounded-tr-none"
                      : "bg-white text-espresso border border-peach/70 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      isUser ? "text-astro-bg/70" : "text-espresso/50"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-espresso/60 text-xs pl-9">
              <span className="font-medium">{astrologer.name} is typing</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse delay-200"></span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Suggested Questions */}
        <div className="px-4 py-2 border-t border-peach/40 bg-white/50 overflow-x-auto flex gap-2 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-astro-bg hover:bg-peach/70 text-espresso/90 border border-peach px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 5. Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3.5 bg-white border-t border-peach/70 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your question for Pandit ji..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-peach bg-astro-bg text-espresso text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-full bg-terracotta hover:bg-terracotta-hover disabled:opacity-40 text-astro-bg flex items-center justify-center shadow-md transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}