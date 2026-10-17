"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Flame, Bot, Sparkles } from "lucide-react";

export default function FloatingReelsButton() {
  const pathname = usePathname();

  // On full-screen Reels page, hide all floating buttons
  if (pathname === "/reels") {
    return null;
  }

  return (
    <aside
      aria-label="Floating Action Shortcuts"
      className="fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-40 select-none pointer-events-auto flex flex-col items-center gap-3"
    >
      {/* 1. Ask AI Floating Button (Placed Directly ABOVE Reels) */}
      {pathname !== "/ai-chat" && (
        <Link
          href="/ai-chat"
          title="Chat with 24/7 AI Astrologer"
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#581C87] via-[#9333EA] to-[#F59E0B] text-white shadow-[0_8px_25px_rgba(147,51,234,0.4)] border-2 border-white/95 hover:scale-110 active:scale-90 transition-all duration-300"
        >
          {/* Pulsing Outer Glow Aura */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-amber-400 opacity-40 blur-xs animate-pulse group-hover:opacity-75 transition-opacity" />

          {/* Floating AI Badge */}
          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 border border-white text-white text-[8px] font-black uppercase tracking-tight flex items-center gap-0.5 shadow-md">
            <Sparkles className="w-2 h-2 fill-white" />
            <span>AI</span>
          </span>

          {/* Center Bot Icon & Label */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2] group-hover:rotate-6 transition-transform drop-shadow-sm" />
            <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-200 mt-0.5 leading-none">
              Ask AI
            </span>
          </div>
        </Link>
      )}

      {/* 2. Astro Reels Floating Button (Placed Directly BELOW Ask AI) */}
      <Link
        href="/reels"
        title="Watch Fullscreen Astro Reels"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#8E2800] via-terracotta to-amber-500 text-white shadow-[0_8px_25px_rgba(183,71,42,0.45)] border-2 border-white/95 hover:scale-110 active:scale-90 transition-all duration-300"
      >
        {/* Pulsing Outer Glow Aura */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-terracotta to-amber-400 opacity-40 blur-xs animate-pulse group-hover:opacity-75 transition-opacity" />

        {/* Floating LIVE Badge */}
        <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-rose-600 border border-white text-white text-[8px] font-black uppercase tracking-tight flex items-center gap-0.5 shadow-md">
          <Flame className="w-2 h-2 fill-white" />
          <span>LIVE</span>
        </span>

        {/* Center Clapperboard Icon & Label */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2] group-hover:rotate-6 transition-transform drop-shadow-sm" />
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-amber-200 mt-0.5 leading-none">
            Reels
          </span>
        </div>
      </Link>
    </aside>
  );
}
