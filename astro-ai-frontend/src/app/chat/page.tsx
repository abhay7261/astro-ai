"use client";

import Link from "next/link";
import { Bot, Users, Sparkles, ArrowRight } from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import AstrologerSection from "../components/AstrologerSection";

export default function ChatPage() {
  return (
    <MobileAppLayout showBack backTitle="Home" title="Astrologer Consultation">
      <div className="space-y-3.5 animate-in fade-in duration-300">
        
        {/* Dual Mode Switcher Bar */}
        <div className="bg-white/95 p-1.5 rounded-2xl border-2 border-amber-300/80 shadow-xs flex items-center gap-2">
          <Link
            href="/ai-chat"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-terracotta/15 text-terracotta border border-amber-300/70 hover:bg-peach/60 active:scale-95"
          >
            <Bot className="w-4 h-4 text-terracotta" />
            <span>🤖 AI Astrologer (Instant)</span>
          </Link>

          <div
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 bg-terracotta text-white shadow-xs"
          >
            <Users className="w-4 h-4 text-white" />
            <span>👨‍🏫 Human Acharyas</span>
          </div>
        </div>

        {/* Instant AI Astrologer Hero Banner */}
        <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FFEEDC] to-[#FFDFC8] p-4 rounded-2xl border-2 border-amber-300/80 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-terracotta text-white flex items-center justify-center shadow-md shadow-terracotta/25 flex-shrink-0 border border-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-xs sm:text-sm text-espresso">
                  Instant Answers Without Waiting?
                </h3>
                <span className="bg-gradient-to-r from-terracotta to-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-espresso/75 mt-0.5 font-medium">
                Ask our 24/7 AI Vedic Astrologer about Shaadi, Career & Upay.
              </p>
            </div>
          </div>

          <Link
            href="/ai-chat"
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/25 active:scale-95 flex-shrink-0 flex items-center gap-1 whitespace-nowrap"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Verified Human Astrologers Directory */}
        <AstrologerSection />
      </div>
    </MobileAppLayout>
  );
}
