"use client";

import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";

export default function CosmicOrbAnimation() {
  const [auraScore, setAuraScore] = useState(96);
  const [isAligning, setIsAligning] = useState(false);
  const [blessingText, setBlessingText] = useState(
    "Jupiter’s golden transit is activating your house of fortune & success today."
  );

  const blessings = [
    "Jupiter’s golden transit is activating your house of fortune & success today.",
    "Moon in Rohini Nakshatra brings supreme mental peace and emotional clarity.",
    "Surya's radiant energy brings authority and career breakthroughs this week.",
    "Venus transit attracts harmonious relationships and auspicious opportunities.",
    "Budhaditya Yoga is forming in your chart, ideal for new decisions and wealth.",
    "Mangal's strong placement gives you high confidence, energy, and victory.",
  ];

  const handleAlignAura = () => {
    setIsAligning(true);
    setTimeout(() => {
      const nextScore = Math.floor(Math.random() * 5) + 95; // 95% to 99%
      setAuraScore(nextScore);
      const nextBlessing = blessings[Math.floor(Math.random() * blessings.length)];
      setBlessingText(nextBlessing);
      setIsAligning(false);
    }, 700);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241008] via-[#3D1A10] to-[#180803] text-white p-5 sm:p-6 border-2 border-amber-400/60 shadow-2xl">
      {/* Background Stardust Pattern */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#FFE5D4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Floating Twinkling Stars */}
      <span className="absolute top-3 left-6 text-amber-300 text-xs animate-star-twinkle">✦</span>
      <span className="absolute top-7 right-8 text-amber-200 text-sm animate-star-twinkle [animation-delay:1s]">✧</span>
      <span className="absolute bottom-4 left-10 text-peach text-xs animate-star-twinkle [animation-delay:2s]">★</span>
      <span className="absolute bottom-8 right-6 text-yellow-300 text-xs animate-star-twinkle [animation-delay:1.5s]">✦</span>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        
        {/* Left Side: Aura Score & Blessing Insight */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-terracotta/30 to-amber-500/20 text-amber-300 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-amber-400/40 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Live Celestial Alignment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100 leading-snug">
            Your Cosmic Aura:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 font-extrabold">
              {auraScore}% Shubh
            </span>
          </h3>

          <p className="text-xs text-white/80 mt-1 max-w-sm leading-relaxed font-light">
            {blessingText}
          </p>

          {/* Interactive Align Aura Button */}
          <div className="mt-3.5 flex items-center justify-center sm:justify-start gap-2">
            <button
              onClick={handleAlignAura}
              disabled={isAligning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-terracotta/35 border border-white/20 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isAligning ? "animate-spin" : "fill-amber-300 text-amber-300"}`} />
              <span>{isAligning ? "Recalibrating Planetary Energy..." : "Recalibrate Aura"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Dynamic Planetary Revolution System (Grah Running in Orbits) */}
        <div 
          onClick={handleAlignAura}
          className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center flex-shrink-0 cursor-pointer group select-none"
          title="Tap to Align Your Planetary Energy"
        >
          {/* Outer Pulsing Glow Aura */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-500/30 via-terracotta/40 to-yellow-500/20 blur-xl group-hover:opacity-100 transition-opacity animate-pulse-glow" />

          {/* ========================================================
              ORBIT 3 (OUTER TRACK): Jupiter (Brihaspati) & Mars (Mangal)
              Clockwise 28s orbit
             ======================================================== */}
          <div className="absolute inset-0 rounded-full border border-amber-400/20 border-dashed animate-orbit-3">
            {/* Brihaspati / Jupiter (Top Right, ~45deg) */}
            <div 
              className="absolute top-2 right-6 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center text-xs shadow-[0_0_12px_rgba(245,158,11,0.9)] border border-amber-200"
              title="Brihaspati (Jupiter) - Fortune & Wisdom"
            >
              <div className="animate-counter-rotate-3 flex items-center justify-center">
                🪐
              </div>
            </div>

            {/* Mangal / Mars (Bottom Left, ~225deg) */}
            <div 
              className="absolute bottom-2 left-6 translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-rose-200"
              title="Mangal (Mars) - Energy & Courage"
            >
              <div className="animate-counter-rotate-3 flex items-center justify-center">
                🔴
              </div>
            </div>
          </div>

          {/* ========================================================
              ORBIT 2 (MIDDLE TRACK): Sun (Surya) & Venus (Shukra)
              Counter-Clockwise 18s orbit
             ======================================================== */}
          <div className="absolute inset-5 sm:inset-6 rounded-full border border-amber-300/40 animate-orbit-2">
            {/* Surya / Sun (Right, 0deg) */}
            <div 
              className="absolute top-1/2 -right-3 -translate-y-1/2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 flex items-center justify-center text-xs shadow-[0_0_16px_rgba(251,191,36,0.95)] border-2 border-amber-100"
              title="Surya Dev (Sun) - Vitality & Success"
            >
              <div className="animate-counter-rotate-2 flex items-center justify-center">
                ☀️
              </div>
            </div>

            {/* Shukra / Venus (Left, 180deg) */}
            <div 
              className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-pink-400 via-fuchsia-300 to-white flex items-center justify-center text-[11px] shadow-[0_0_12px_rgba(244,114,182,0.9)] border border-white"
              title="Shukra (Venus) - Harmony & Prosperity"
            >
              <div className="animate-counter-rotate-2 flex items-center justify-center">
                ✨
              </div>
            </div>
          </div>

          {/* ========================================================
              ORBIT 1 (INNER TRACK): Moon (Chandra) & Mercury (Budh)
              Clockwise 12s fast orbit
             ======================================================== */}
          <div className="absolute inset-11 sm:inset-12 rounded-full border border-peach/30 border-dashed animate-orbit-1">
            {/* Chandra / Moon (Top, 90deg) */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-slate-100 via-white to-amber-100 flex items-center justify-center text-[10px] shadow-[0_0_12px_rgba(255,255,255,0.9)] border border-white"
              title="Chandra Dev (Moon) - Peace & Intuition"
            >
              <div className="animate-counter-rotate-1 flex items-center justify-center">
                🌙
              </div>
            </div>

            {/* Budh / Mercury (Bottom, 270deg) */}
            <div 
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-[9px] shadow-[0_0_10px_rgba(52,211,153,0.9)] border border-emerald-100"
              title="Budh (Mercury) - Intellect & Communication"
            >
              <div className="animate-counter-rotate-1 flex items-center justify-center">
                💫
              </div>
            </div>
          </div>

          {/* ========================================================
              CENTER CORE: Sacred Vedic Sun & Kalachakra Mandala
              Continuously rotating inner wheel with radiant golden border
             ======================================================== */}
          <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#9B2C00] via-terracotta to-amber-500 p-0.5 shadow-[0_0_25px_rgba(251,191,36,0.5)] flex items-center justify-center border-2 border-amber-300 group-hover:scale-105 active:scale-95 transition-transform">
            <div className="w-full h-full rounded-full bg-[#200A04] flex items-center justify-center overflow-hidden relative">
              {/* Spinning Sacred Chakra Wheel */}
              <span className="text-2xl sm:text-3xl text-amber-300 filter drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] animate-chakra-spin select-none">
                ☸
              </span>
              {/* Radial Center Aura Glow */}
              <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

      </div>

      {/* Scoped CSS Fallback to Guarantee 100% Orbit Rotation in all Environments */}
      <style jsx>{`
        @keyframes celestial-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes celestial-spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-orbit-1 {
          animation: celestial-spin 12s linear infinite;
        }
        .animate-orbit-2 {
          animation: celestial-spin-reverse 18s linear infinite;
        }
        .animate-orbit-3 {
          animation: celestial-spin 28s linear infinite;
        }
        .animate-counter-rotate-1 {
          animation: celestial-spin-reverse 12s linear infinite;
        }
        .animate-counter-rotate-2 {
          animation: celestial-spin 18s linear infinite;
        }
        .animate-counter-rotate-3 {
          animation: celestial-spin-reverse 28s linear infinite;
        }
        .animate-chakra-spin {
          animation: celestial-spin 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
