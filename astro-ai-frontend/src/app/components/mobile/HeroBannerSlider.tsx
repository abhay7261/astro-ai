"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ChevronRight, ChevronLeft, Pencil, Check, X, 
  ArrowRight, Coins, ShieldCheck, HeartHandshake, Eye
} from "lucide-react";
import VedicAstrolabeChakra from "./VedicAstrolabeChakra";
import { bannersApi, BannerItem } from "../../services/apiClient";
import { AuthUser } from "./AuthScreen";

interface HeroBannerSliderProps {
  user: AuthUser | null;
  onOpenAuth?: (featureName: string, callback?: () => void) => void;
  onUserUpdate?: () => void;
}

// Fallback Default Preset Banners (including the primary animated Vedic Kalachakra)
const DEFAULT_PRESET_SLIDES: BannerItem[] = [
  {
    id: "banner-kalachakra",
    bannerId: "banner-kalachakra",
    title: "Daily Planetary Alignment",
    subtitle: "Real-time planetary transits and Vedic blessings aligned with your stars.",
    badge: "DAILY PLANETARY ALIGNMENT",
    imageUrl: "",
    type: "kalachakra_chakra",
    bgGradient: "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]",
    ctaText: "Ask AI Guru",
    ctaLink: "/ai-chat",
    order: 1,
    isActive: true,
  },
  {
    id: "banner-dhan-lakshmi",
    bannerId: "banner-dhan-lakshmi",
    title: "Auspicious Dhan & Lakshmi Yog",
    subtitle: "Unlock career growth, prosperity, and ancient Vedic wealth remedies.",
    badge: "🪙 SHREE DHAN & LAKSHMI YOG",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#FFFDF0] via-[#FEF3C7] to-[#FDE68A]",
    ctaText: "Check Dhan Yog",
    ctaLink: "/ai-chat",
    order: 2,
    isActive: true,
  },
  {
    id: "banner-graha-shanti",
    bannerId: "banner-graha-shanti",
    title: "Navagraha Dosh & Shani Shanti",
    subtitle: "Instant Vedic remedies for Shani Sade Sati, Rahu-Ketu, and Manglik Dosha.",
    badge: "🪐 GRAHA DOSH NIVARAN",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]",
    ctaText: "Talk to Astrologer",
    ctaLink: "/chat",
    order: 3,
    isActive: true,
  },
  {
    id: "banner-kundli-milan",
    bannerId: "banner-kundli-milan",
    title: "36 Gunas Kundli Milan & Vivah Yog",
    subtitle: "Check authentic relationship compatibility and auspicious wedding timings.",
    badge: "❤️ VIVAH & PREM SAMBANDH",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    type: "animated_card",
    bgGradient: "from-[#FFF1F2] via-[#FCE7F3] to-[#FBCFE8]",
    ctaText: "Match Kundli",
    ctaLink: "/kundli-milan",
    order: 4,
    isActive: true,
  },
];

export default function HeroBannerSlider({ user, onOpenAuth, onUserUpdate }: HeroBannerSliderProps) {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_PRESET_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameToast, setNameToast] = useState(false);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 1. Load Banners from LocalStorage & Live Backend API
  const loadBanners = async () => {
    try {
      // First check local storage cache for immediate offline render
      const localStr = localStorage.getItem("astroai_hero_banners");
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBanners(parsed.filter((b) => b.isActive !== false));
          }
        } catch {}
      }

      // Fetch fresh data from backend API
      const live = await bannersApi.getAll();
      if (Array.isArray(live) && live.length > 0) {
        const activeBanners = live.filter((b) => b.isActive !== false);
        // Ensure the primary animated Vedic chakra card is always present at index 0
        const hasKalachakra = activeBanners.some((b) => b.type === "kalachakra_chakra" || b.bannerId === "banner-kalachakra");
        const finalBanners = hasKalachakra
          ? activeBanners
          : [DEFAULT_PRESET_SLIDES[0], ...activeBanners];

        setBanners(finalBanners);
        localStorage.setItem("astroai_hero_banners", JSON.stringify(finalBanners));
      }
    } catch (e) {
      console.warn("HeroBannerSlider load error:", e);
    }
  };

  useEffect(() => {
    loadBanners();
    const handleUpdated = () => loadBanners();
    window.addEventListener("astroai_banners_updated", handleUpdated);
    return () => window.removeEventListener("astroai_banners_updated", handleUpdated);
  }, []);

  // 2. Auto-advance slider every 5 seconds (pauses when hovered/touched)
  useEffect(() => {
    if (isPaused || isEditingName || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isEditingName, banners.length]);

  // Touch Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      // Swiped Left -> Next
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (distance < -45) {
      // Swiped Right -> Previous
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Action Click Handler (Enforcing login for guests)
  const handleCtaClick = (e: React.MouseEvent, href: string, featureTitle: string) => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        e.preventDefault();
        if (onOpenAuth) {
          onOpenAuth(featureTitle, () => router.push(href));
        } else {
          window.dispatchEvent(
            new CustomEvent("astroai_open_auth", {
              detail: {
                featureName: featureTitle,
                callback: () => router.push(href),
              },
            })
          );
        }
      }
    } catch {}
  };

  // Save Display Name
  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) return;

    const trimmed = nameInput.trim();
    const updatedUser = {
      ...(user || { id: "user_1", email: "seeker@astroai.com" }),
      name: trimmed,
    };

    localStorage.setItem("astroai_auth_user", JSON.stringify(updatedUser));
    try {
      sessionStorage.setItem("astroai_session_user", JSON.stringify(updatedUser));
    } catch (e) {}
    setIsEditingName(false);
    window.dispatchEvent(new Event("astroai_user_updated"));
    if (onUserUpdate) onUserUpdate();

    setNameToast(true);
    setTimeout(() => setNameToast(false), 2500);
  };

  const currentSlide = banners[currentIndex] || DEFAULT_PRESET_SLIDES[0];

  return (
    <div 
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toast Notification for Name Update */}
      {nameToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-espresso text-amber-200 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-amber-400/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Aapka naam safalta-poorvak update ho gaya! ✨</span>
        </div>
      )}

      {/* Main Hero Card Container with Dynamic Smooth Gradient Background */}
      <section 
        className={`bg-gradient-to-br ${
          currentSlide.bgGradient || "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]"
        } p-5 sm:p-6 rounded-3xl border-2 border-amber-300/70 shadow-lg shadow-amber-950/5 relative overflow-hidden min-h-[175px] sm:min-h-[185px] flex flex-col justify-between transition-all duration-500`}
      >
        {/* ================= BACKGROUND ANIMATED GRAPHICS ================= */}

        {/* 1. SLIDE 1: Original Vedic Astrolabe Kalachakra (Dual Rotating Lotus & Zodiac Chakra + OM Sun Core) */}
        {currentSlide.type === "kalachakra_chakra" && (
          <div className="absolute -right-12 -bottom-12 sm:-right-8 sm:-bottom-8 pointer-events-none select-none opacity-85 sm:opacity-95">
            <VedicAstrolabeChakra />
          </div>
        )}

        {/* 2. SLIDE 2: Auspicious Golden Sri Yantra & Wealth Mandala Animation */}
        {currentSlide.bannerId === "banner-dhan-lakshmi" && (
          <div className="absolute -right-8 -bottom-8 pointer-events-none select-none opacity-85">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Outer Golden Aura Pulsing Halo */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/40 border-dashed animate-celestial-spin" />
              <div className="absolute inset-3 rounded-full border border-amber-600/30 animate-celestial-spin-reverse" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-amber-400/25 to-yellow-200/40 blur-md animate-pulse" />
              
              {/* Spinning Sacred Geometry Lotus */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#3B220C] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.35)_0%,transparent_75%)]" />
                  <span className="text-3xl filter drop-shadow">🪙</span>
                  <span className="text-[9px] font-black text-amber-300 uppercase tracking-widest mt-0.5">
                    DHAN YOG
                  </span>
                </div>
              </div>

              {/* Floating Sparkles & Coins */}
              <span className="absolute top-4 right-4 text-amber-500 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-6 left-6 text-amber-600 text-xs animate-star-twinkle delay-150">✦</span>
            </div>
          </div>
        )}

        {/* 3. SLIDE 3: Cosmic Navagraha 9 Planets Orbital Rings Animation */}
        {currentSlide.bannerId === "banner-graha-shanti" && (
          <div className="absolute -right-8 -bottom-8 pointer-events-none select-none opacity-85">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Planetary Orbital Rings */}
              <div className="absolute inset-0 rounded-full border border-sky-400/40 border-dashed animate-celestial-spin" />
              <div className="absolute inset-4 rounded-full border border-sky-600/30 animate-celestial-spin-reverse" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-500 shadow-md shadow-sky-400/50" />
              <div className="absolute bottom-5 right-7 w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50" />
              
              {/* Central Nucleus */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-400 p-1 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0C2340] flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-3xl filter drop-shadow">🪐</span>
                  <span className="text-[9px] font-black text-sky-200 uppercase tracking-widest mt-0.5">
                    SHANTI
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SLIDE 4: Kundli Milan & Venus Love Harmony Mandala Animation */}
        {currentSlide.bannerId === "banner-kundli-milan" && (
          <div className="absolute -right-8 -bottom-8 pointer-events-none select-none opacity-85">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Counter-Rotating Harmony Rings */}
              <div className="absolute inset-0 rounded-full border border-rose-400/40 border-dashed animate-celestial-spin" />
              <div className="absolute inset-4 rounded-full border border-rose-600/30 animate-celestial-spin-reverse" />
              
              {/* Dual Matching Orbs */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-600 p-1 shadow-xl flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#400B1A] flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-3xl filter drop-shadow">❤️</span>
                  <span className="text-[9px] font-black text-rose-200 uppercase tracking-widest mt-0.5">
                    36 GUNAS
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CUSTOM ADMIN UPLOADED BANNER IMAGE (If Image Provided) */}
        {currentSlide.imageUrl && 
         currentSlide.bannerId !== "banner-dhan-lakshmi" && 
         currentSlide.bannerId !== "banner-graha-shanti" && 
         currentSlide.bannerId !== "banner-kundli-milan" && (
          <div className="absolute -right-3 sm:right-2 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-90 sm:opacity-100">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-white/80 shadow-md">
              <Image
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                width={160}
                height={160}
                unoptimized
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
            </div>
          </div>
        )}

        {/* ================= FOREGROUND CARD CONTENT ================= */}
        <div className="relative z-10 max-w-[70%] sm:max-w-[72%]">
          
          {/* Shimmering Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-terracotta to-amber-600 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
            <span>{currentSlide.badge || "DAILY PLANETARY ALIGNMENT"}</span>
          </div>

          {/* Slide 1 Special Greeting with Inline Name Editor */}
          {currentSlide.type === "kalachakra_chakra" ? (
            <div>
              {!isEditingName ? (
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-espresso leading-snug">
                    Namaste,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta via-[#C84524] to-amber-600 font-extrabold">
                      {user?.name || "Seeker"}
                    </span>{" "}
                    🙏
                  </h1>

                  {/* Edit Name Button */}
                  <button
                    onClick={() => {
                      try {
                        const sessionToken = sessionStorage.getItem("astroai_session_token");
                        if (!sessionToken) {
                          if (onOpenAuth) {
                            onOpenAuth("Profile & Name Settings");
                          } else {
                            window.dispatchEvent(
                              new CustomEvent("astroai_open_auth", {
                                detail: { featureName: "Profile & Name Settings" },
                              })
                            );
                          }
                          return;
                        }
                      } catch {}
                      setNameInput(user?.name || "");
                      setIsEditingName(true);
                    }}
                    title="Click to change your display name"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-terracotta border border-amber-300/80 text-[10px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                    <span>Change Name</span>
                  </button>
                </div>
              ) : (
                /* Inline Editable Name Form */
                <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1 mb-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your real name..."
                    autoFocus
                    className="bg-white/95 border-2 border-amber-400 rounded-xl px-3 py-1.5 text-xs font-bold text-espresso focus:outline-none shadow-xs max-w-[180px]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-xs active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1.5 rounded-xl bg-white/80 hover:bg-white text-espresso/70 text-xs font-semibold active:scale-95 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Subtitle / Description */}
              <p className="text-xs sm:text-sm text-espresso/80 mt-1 font-medium line-clamp-2">
                {currentSlide.subtitle || "Real-time planetary transits and Vedic blessings aligned with your stars."}
              </p>
            </div>
          ) : (
            /* Custom / Preset Slides (Title & Subtitle) */
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-espresso leading-snug line-clamp-1">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-espresso/80 mt-1 font-medium line-clamp-2">
                {currentSlide.subtitle}
              </p>
            </div>
          )}

          {/* Action CTA Button */}
          <div className="mt-3.5">
            <Link
              href={currentSlide.ctaLink || "/chat"}
              onClick={(e) => handleCtaClick(e, currentSlide.ctaLink || "/chat", currentSlide.title)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/20 active:scale-95 transition-all"
            >
              <span>{currentSlide.ctaText || "Explore Now"}</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>

        </div>

        {/* ================= PAGINATION BULLETS & CHEVRON CONTROLS ================= */}
        {banners.length > 1 && (
          <div className="relative z-20 flex items-center justify-between mt-3 pt-2 border-t border-peach/50">
            {/* Left/Right Clickable Nav Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                aria-label="Previous Banner"
                className="w-6 h-6 rounded-full bg-white/80 hover:bg-white border border-peach/80 flex items-center justify-center text-espresso/70 hover:text-espresso transition-all shadow-xs cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                aria-label="Next Banner"
                className="w-6 h-6 rounded-full bg-white/80 hover:bg-white border border-peach/80 flex items-center justify-center text-espresso/70 hover:text-espresso transition-all shadow-xs cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Bullet Dots */}
            <div className="flex items-center gap-1.5">
              {banners.map((b, idx) => (
                <button
                  key={b.bannerId || b.id || `dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-6 bg-terracotta shadow-xs"
                      : "w-2 bg-espresso/25 hover:bg-espresso/40"
                  }`}
                />
              ))}
            </div>

            {/* Slide Index Pill */}
            <span className="text-[10px] font-bold text-espresso/60 bg-white/70 px-2 py-0.5 rounded-full border border-peach/60">
              {currentIndex + 1} / {banners.length}
            </span>
          </div>
        )}

      </section>
    </div>
  );
}
