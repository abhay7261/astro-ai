"use client";

import { useState, useRef, TouchEvent, MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface SlideData {
  id: number;
  badge: string;
  title: string;
  highlightText: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "DESTINY & KARMA",
    title: "Discover Your",
    highlightText: "Cosmic Blueprint",
    description:
      "Explore your birth chart and uncover the cosmic patterns that make you unique with authentic Vedic calculations.",
  },
  {
    id: 2,
    badge: "AI + VEDIC WISDOM",
    title: "Your Stars.",
    highlightText: "Your Answers.",
    description:
      "Get personalized astrological insights powered by AI and ancient Vedic wisdom for career, love, and life timing.",
  },
  {
    id: 3,
    badge: "RELATIONSHIPS & HARMONY",
    title: "Discover Your",
    highlightText: "Connections",
    description:
      "Explore kundli matching, relationship compatibility, and meaningful connections with 36 Gunas Ashtakoot analysis.",
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isDraggingRef = useRef(false);

  // Swipe gesture thresholds
  const minSwipeDistance = 50;

  const onTouchStartHandler = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Mouse drag support for desktop/browser testing
  const onMouseDownHandler = (e: MouseEvent) => {
    isDraggingRef.current = true;
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMoveHandler = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUpHandler = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full bg-astro-bg flex flex-col justify-between overflow-hidden select-none"
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
      onMouseDown={onMouseDownHandler}
      onMouseMove={onMouseMoveHandler}
      onMouseUp={onMouseUpHandler}
    >
      {/* Background Ambient Cosmic Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full bg-peach/50 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[340px] h-[340px] rounded-full bg-terracotta/10 blur-[100px] pointer-events-none" />

      {/* Top Bar: Brand Emblem & Skip Button */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:pt-8 max-w-md mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-terracotta/40 shadow-sm bg-espresso flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="AstroAI Logo"
              width={32}
              height={32}
              unoptimized
              className="object-cover w-full h-full scale-125"
            />
          </div>
          <span className="font-serif font-bold text-lg text-espresso tracking-tight">
            Astro<span className="text-terracotta">AI</span>
          </span>
        </div>

        <button
          onClick={onComplete}
          className="text-xs font-semibold tracking-wider text-espresso/60 hover:text-terracotta px-3 py-1.5 rounded-full hover:bg-peach/40 transition-colors uppercase"
        >
          Skip
        </button>
      </header>

      {/* Main Swipeable Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full py-4">
        {/* Dynamic Visual Illustration for each slide */}
        <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] flex items-center justify-center mb-6">
          {currentSlide === 0 && (
            <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-500">
              {/* Outer Golden Zodiac Wheel */}
              <div className="absolute inset-0 rounded-full border border-peach/80 border-dashed animate-celestial-spin" />
              <div className="absolute inset-4 rounded-full border border-terracotta/20 animate-celestial-spin-reverse" />
              
              {/* Orbiting Planetary Nodes */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-terracotta shadow-md shadow-terracotta/40 animate-pulse" />
              <div className="absolute bottom-6 right-8 w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/40" />
              <div className="absolute top-1/3 left-3 w-2.5 h-2.5 rounded-full bg-peach border border-terracotta" />

              {/* Constellation Nodes with Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="50%" y1="10%" x2="75%" y2="40%" stroke="#B7472A" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="75%" y1="40%" x2="70%" y2="80%" stroke="#B7472A" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="70%" y1="80%" x2="30%" y2="70%" stroke="#B7472A" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="30%" y1="70%" x2="20%" y2="35%" stroke="#B7472A" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="20%" y1="35%" x2="50%" y2="10%" stroke="#B7472A" strokeWidth="1" strokeDasharray="3,3" />
              </svg>

              {/* Center Cosmic Core */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-espresso via-terracotta to-amber-600 p-1 shadow-2xl animate-float-subtle">
                <div className="w-full h-full rounded-full bg-espresso flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,229,212,0.3)_0%,transparent_70%)]" />
                  <span className="text-4xl filter drop-shadow">☀️</span>
                </div>
              </div>

              {/* Twinkling Stars */}
              <span className="absolute top-6 right-6 text-amber-500 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-10 left-6 text-terracotta text-xs animate-star-twinkle delay-150">✦</span>
              <span className="absolute top-1/2 right-2 text-peach text-xs animate-star-twinkle delay-300">✦</span>
            </div>
          )}

          {currentSlide === 1 && (
            <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-500">
              {/* Sacred Geometry AI Hexagon Halo */}
              <div className="absolute inset-2 rounded-3xl border border-peach rotate-12 animate-celestial-spin" />
              <div className="absolute inset-2 rounded-3xl border border-terracotta/30 -rotate-12 animate-celestial-spin-reverse" />

              {/* Neural Insight Orbit Radii */}
              <div className="absolute w-56 h-56 rounded-full border border-terracotta/20 animate-pulse-glow" />

              {/* Center Mystical AI Crystal Orb */}
              <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-terracotta via-amber-500 to-peach p-1 shadow-2xl animate-float-subtle">
                <div className="w-full h-full rounded-full bg-espresso flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,229,212,0.4)_0%,transparent_70%)]" />
                  <Sparkles className="w-10 h-10 text-amber-300 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-peach/80 mt-1 uppercase font-bold">
                    AI • GURU
                  </span>
                </div>
              </div>

              {/* Floating Planetary Glyphs */}
              <div className="absolute top-4 left-6 px-2.5 py-1 rounded-full bg-white/90 border border-peach text-terracotta text-xs font-bold shadow-sm animate-float-subtle">
                ♃ Jupiter
              </div>
              <div className="absolute bottom-8 right-6 px-2.5 py-1 rounded-full bg-white/90 border border-peach text-espresso text-xs font-bold shadow-sm animate-float-subtle delay-200">
                ♀ Venus
              </div>
            </div>
          )}

          {currentSlide === 2 && (
            <div className="relative w-full h-full flex items-center justify-center animate-in fade-in duration-500">
              {/* Ethereal Connection Ring */}
              <div className="absolute w-60 h-60 rounded-full border border-peach/80 animate-celestial-spin" />

              {/* Twin Constellations connected by a glowing line */}
              <div className="relative w-full flex items-center justify-around px-2">
                {/* Partner 1 Orb */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-espresso to-terracotta p-0.5 shadow-lg animate-float-subtle">
                    <div className="w-full h-full rounded-full bg-espresso flex items-center justify-center text-2xl">
                      ♈
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-espresso bg-white/80 border border-peach px-2 py-0.5 rounded-full">
                    Aries
                  </span>
                </div>

                {/* Glowing Cosmic Pulse Line */}
                <div className="flex-1 mx-2 relative flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-terracotta via-amber-400 to-terracotta animate-pulse" />
                  <div className="absolute w-7 h-7 rounded-full bg-terracotta text-astro-bg flex items-center justify-center shadow-md text-xs font-bold">
                    36
                  </div>
                </div>

                {/* Partner 2 Orb */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-terracotta to-amber-500 p-0.5 shadow-lg animate-float-subtle delay-150">
                    <div className="w-full h-full rounded-full bg-espresso flex items-center justify-center text-2xl">
                      ♎
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-espresso bg-white/80 border border-peach px-2 py-0.5 rounded-full">
                    Libra
                  </span>
                </div>
              </div>

              {/* Sparkles on the connection */}
              <span className="absolute top-10 text-amber-500 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-6 text-terracotta text-xs animate-star-twinkle delay-200">✦</span>
            </div>
          )}
        </div>

        {/* Text Information for the Slide */}
        <div className="text-center w-full px-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/70 text-terracotta text-[10px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3 h-3 text-terracotta" />
            {slides[currentSlide].badge}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-espresso leading-snug">
            {slides[currentSlide].title} <br />
            <span className="text-terracotta italic font-normal">
              {slides[currentSlide].highlightText}
            </span>
          </h2>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm text-espresso/75 leading-relaxed max-w-xs mx-auto">
            {slides[currentSlide].description}
          </p>
        </div>
      </main>

      {/* Bottom Controls: Indicators & Action Buttons */}
      <footer className="relative z-20 px-6 pb-8 pt-4 max-w-md mx-auto w-full flex flex-col gap-5">
        {/* 3 Pagination Indicators */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-terracotta shadow-sm shadow-terracotta/30"
                  : "w-2 bg-peach hover:bg-peach/80"
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {currentSlide > 0 ? (
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="w-12 h-12 rounded-2xl border-2 border-peach bg-white/80 hover:bg-white text-espresso flex items-center justify-center shadow-sm transition-all active:scale-95 flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : null}

          <button
            onClick={handleNext}
            className="flex-1 h-12 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-astro-bg font-semibold text-sm shadow-lg shadow-terracotta/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
