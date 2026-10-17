"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onComplete, durationMs = 2200 }: SplashScreenProps) {
  const [stage, setStage] = useState<"enter" | "orbit" | "tagline" | "exit">("enter");

  useEffect(() => {
    // Stage 1: Enter (0 - 400ms)
    const t1 = setTimeout(() => {
      setStage("orbit");
    }, 400);

    // Stage 2: Tagline reveal (400 - 1400ms)
    const t2 = setTimeout(() => {
      setStage("tagline");
    }, 1200);

    // Stage 3: Exit transition (1800 - 2200ms)
    const t3 = setTimeout(() => {
      setStage("exit");
    }, durationMs - 400);

    // Complete transition
    const t4 = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, durationMs]);

  return (
    <div
      onClick={onComplete}
      className={`fixed inset-0 z-50 bg-astro-bg flex flex-col items-center justify-center p-6 select-none transition-opacity duration-500 cursor-pointer overflow-hidden ${
        stage === "exit" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Soft Warm Glows */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-peach/70 blur-[90px] animate-pulse-glow pointer-events-none" />
      <div className="absolute w-[220px] h-[220px] rounded-full bg-terracotta/20 blur-[60px] pointer-events-none" />

      {/* Floating Sparkles & Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[20%] left-[25%] text-amber-500 text-sm animate-star-twinkle">✦</span>
        <span className="absolute top-[28%] right-[22%] text-terracotta text-xs animate-star-twinkle delay-100">✦</span>
        <span className="absolute bottom-[28%] left-[20%] text-peach text-sm animate-star-twinkle delay-300">✦</span>
        <span className="absolute bottom-[22%] right-[26%] text-amber-600 text-xs animate-star-twinkle delay-200">✦</span>
      </div>

      {/* Center Stage: Rotating Celestial Orbit + Glowing Logo */}
      <div className="relative flex items-center justify-center">
        {/* Outer Celestial Orbit Ring */}
        <div
          className={`absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-peach border-dashed transition-all duration-1000 ${
            stage !== "enter" ? "opacity-100 scale-100 animate-celestial-spin" : "opacity-0 scale-75"
          }`}
        >
          {/* Orbiting Jewel / Sun Marker */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-terracotta shadow-md shadow-terracotta/40" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/40" />
        </div>

        {/* Counter Orbit Ring */}
        <div
          className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-terracotta/25 transition-all duration-1000 ${
            stage !== "enter" ? "opacity-100 scale-100 animate-celestial-spin-reverse" : "opacity-0 scale-75"
          }`}
        />

        {/* Soft Glowing Halo behind Logo */}
        <div className="absolute w-32 h-32 rounded-full bg-terracotta/25 blur-xl animate-pulse" />

        {/* AstroAI Logo Container */}
        <div
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-terracotta/50 shadow-2xl bg-espresso flex items-center justify-center transition-all duration-700 ease-out ${
            stage === "enter" ? "scale-50 opacity-0 rotate-[-15deg]" : "scale-100 opacity-100 rotate-0"
          }`}
        >
          <Image
            src="/logo.png"
            alt="AstroAI Logo"
            width={128}
            height={128}
            priority
            unoptimized
            className="object-cover w-full h-full scale-125"
          />
        </div>
      </div>

      {/* Brand Title & Tagline Reveal */}
      <div className="mt-8 text-center relative z-10 flex flex-col items-center">
        <h1
          className={`text-3xl sm:text-4xl font-serif font-bold text-espresso tracking-tight transition-all duration-700 delay-150 ${
            stage === "enter" ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          Astro<span className="text-terracotta">AI</span>
        </h1>

        {/* Animated Tagline */}
        <div
          className={`mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-terracotta transition-all duration-700 delay-300 ${
            stage === "tagline" || stage === "exit"
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <span>✦</span>
          <span>Your Cosmic Guide</span>
          <span>✦</span>
        </div>
      </div>

      {/* Subtle bottom hint */}
      <p className="absolute bottom-6 text-[10px] text-espresso/40 tracking-wider">
        Tap anywhere to skip
      </p>
    </div>
  );
}
