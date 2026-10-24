"use client";

import { useState, useEffect, useRef, TouchEvent } from "react";
import { useRouter } from "next/navigation";
import VedicAstrolabeChakra from "./VedicAstrolabeChakra";
import { bannersApi, BannerItem } from "../../services/apiClient";
import { AuthUser } from "./AuthScreen";

interface HeroBannerSliderProps {
  user: AuthUser | null;
  onOpenAuth?: (featureName: string, callback?: () => void) => void;
  onUserUpdate?: () => void;
}

// 4 High-UI Animated Preset Slides (100% Pure Visual Animated Artworks - No Text, No Names)
const DEFAULT_PRESET_SLIDES: BannerItem[] = [
  {
    id: "banner-kalachakra",
    bannerId: "banner-kalachakra",
    title: "Vedic Astrolabe Kalachakra",
    subtitle: "",
    badge: "",
    imageUrl: "",
    type: "kalachakra_chakra",
    bgGradient: "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]",
    ctaLink: "/chat",
    order: 1,
    isActive: true,
  },
  {
    id: "banner-dhan-lakshmi",
    bannerId: "banner-dhan-lakshmi",
    title: "Golden Sri Yantra & Wealth Chakra",
    subtitle: "",
    badge: "",
    imageUrl: "",
    type: "animated_sri_yantra",
    bgGradient: "from-[#2A1604] via-[#452208] to-[#1C0D02]",
    ctaLink: "/ai-chat",
    order: 2,
    isActive: true,
  },
  {
    id: "banner-graha-shanti",
    bannerId: "banner-graha-shanti",
    title: "Navagraha 9 Cosmic Planets Orbit",
    subtitle: "",
    badge: "",
    imageUrl: "",
    type: "animated_navagraha",
    bgGradient: "from-[#071324] via-[#102444] to-[#050C17]",
    ctaLink: "/chat",
    order: 3,
    isActive: true,
  },
  {
    id: "banner-kundli-milan",
    bannerId: "banner-kundli-milan",
    title: "Celestial Love Harmony Mandala",
    subtitle: "",
    badge: "",
    imageUrl: "",
    type: "animated_kundli_milan",
    bgGradient: "from-[#2B0818] via-[#48102B] to-[#18030D]",
    ctaLink: "/kundli-milan",
    order: 4,
    isActive: true,
  },
];

export default function HeroBannerSlider({ user, onOpenAuth }: HeroBannerSliderProps) {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_PRESET_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load Banners from LocalStorage & Live Backend API
  const loadBanners = async () => {
    try {
      const localStr = localStorage.getItem("astroai_hero_banners");
      if (localStr) {
        try {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBanners(parsed.filter((b) => b.isActive !== false));
          }
        } catch {}
      }

      const live = await bannersApi.getAll();
      if (Array.isArray(live) && live.length > 0) {
        const activeBanners = live.filter((b) => b.isActive !== false);
        const hasKalachakra = activeBanners.some(
          (b) => b.type === "kalachakra_chakra" || b.bannerId === "banner-kalachakra"
        );
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

  // Auto-advance slider every 4.5 seconds
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, banners.length]);

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
    if (distance > 40) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (distance < -40) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Card Click Action (with guest auth gate)
  const handleCardClick = () => {
    const slide = banners[currentIndex] || DEFAULT_PRESET_SLIDES[0];
    const targetLink = slide.ctaLink || "/chat";

    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        if (onOpenAuth) {
          onOpenAuth("Astrology Consultation", () => router.push(targetLink));
        } else {
          window.dispatchEvent(
            new CustomEvent("astroai_open_auth", {
              detail: {
                featureName: "Astrology Consultation",
                callback: () => router.push(targetLink),
              },
            })
          );
        }
        return;
      }
    } catch {}

    router.push(targetLink);
  };

  const currentSlide = banners[currentIndex] || DEFAULT_PRESET_SLIDES[0];
  const isCustomImage = Boolean(
    currentSlide.imageUrl &&
    currentSlide.type !== "kalachakra_chakra" &&
    currentSlide.bannerId !== "banner-kalachakra" &&
    currentSlide.bannerId !== "banner-dhan-lakshmi" &&
    currentSlide.bannerId !== "banner-graha-shanti" &&
    currentSlide.bannerId !== "banner-kundli-milan"
  );

  return (
    <div
      className="relative select-none w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pure Animated Visual Hero Card (Zero Text, Zero Names, Zero Clutter) */}
      <section
        onClick={handleCardClick}
        title="Tap to explore"
        className={`bg-gradient-to-br ${
          currentSlide.bgGradient || "from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8]"
        } rounded-3xl border-2 border-amber-300/80 shadow-lg shadow-amber-950/10 relative overflow-hidden h-[180px] sm:h-[210px] flex items-center justify-center transition-all duration-700 cursor-pointer group active:scale-[0.99]`}
      >
        {/* ================= 1. SLIDE 1: VEDIC ASTROLABE KALACHAKRA ================= */}
        {(currentSlide.type === "kalachakra_chakra" || currentSlide.bannerId === "banner-kalachakra") && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background Ambient Cosmic Glows */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-400/30 via-orange-300/20 to-yellow-200/40 blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,243,199,0.35)_0%,transparent_70%)]" />

            {/* Glowing Centered Astrolabe Kalachakra Mandala */}
            <div className="relative scale-110 sm:scale-125 transform transition-transform duration-700 group-hover:scale-120 sm:group-hover:scale-130 pointer-events-none">
              <VedicAstrolabeChakra />
            </div>

            {/* Orbiting Twinkling Star Sparks */}
            <span className="absolute top-5 left-10 text-amber-500 text-sm animate-star-twinkle">✦</span>
            <span className="absolute bottom-5 left-16 text-amber-600 text-xs animate-star-twinkle delay-150">✦</span>
            <span className="absolute top-6 right-12 text-amber-400 text-xs animate-star-twinkle delay-300">✦</span>
            <span className="absolute bottom-6 right-16 text-orange-500 text-sm animate-star-twinkle delay-200">✦</span>
          </div>
        )}

        {/* ================= 2. SLIDE 2: GOLDEN SRI YANTRA & WEALTH MANDALA ================= */}
        {currentSlide.bannerId === "banner-dhan-lakshmi" && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Ambient Golden Core Radiance */}
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/25 to-amber-600/30 blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.2)_0%,transparent_65%)]" />

            {/* Center Golden Rotating Sri Yantra Portal */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center pointer-events-none">
              {/* Outer 16-Petal Lotus Dashed Ring (Clockwise) */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 border-dashed animate-celestial-spin" />
              <div className="absolute inset-3 rounded-full border border-yellow-300/40 animate-celestial-spin-reverse" />
              <div className="absolute inset-7 rounded-full border border-amber-500/30 animate-celestial-spin" />

              {/* Sacred Triangles Core & OM/Coin Center */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-1 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-[#301A06] flex items-center justify-center relative overflow-hidden border border-amber-300/40 shadow-inner">
                  {/* Internal Geometrical Triangle Overlay */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 animate-celestial-spin-reverse">
                    <polygon points="50,10 90,80 10,80" fill="none" stroke="#FDE68A" strokeWidth="1.5" />
                    <polygon points="50,90 90,20 10,20" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="18" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 2" />
                  </svg>
                  <span className="text-4xl filter drop-shadow-[0_2px_10px_rgba(251,191,36,0.8)] animate-pulse">
                    🪙
                  </span>
                </div>
              </div>

              {/* Floating Golden Sparks */}
              <span className="absolute top-3 left-4 text-amber-300 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-3 right-4 text-yellow-400 text-sm animate-star-twinkle delay-150">✦</span>
              <span className="absolute top-1/2 -left-6 text-amber-400 text-xs animate-star-twinkle delay-300">✦</span>
              <span className="absolute top-1/2 -right-6 text-yellow-300 text-xs animate-star-twinkle delay-200">✦</span>
            </div>
          </div>
        )}

        {/* ================= 3. SLIDE 3: NAVAGRAHA 9 COSMIC PLANETS ORBIT ================= */}
        {currentSlide.bannerId === "banner-graha-shanti" && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Deep Cosmic Nebula Pulse */}
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-sky-600/30 via-indigo-500/25 to-cyan-400/25 blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2)_0%,transparent_70%)]" />

            {/* Orbiting Planetary System */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center pointer-events-none">
              {/* Outer Orbit Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 border-dashed animate-celestial-spin" />
              <div className="absolute inset-3 rounded-full border border-indigo-400/35 animate-celestial-spin-reverse" />
              <div className="absolute inset-7 rounded-full border border-cyan-400/30 animate-celestial-spin" />

              {/* Orbiting Planetary Spheres */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              <div className="absolute bottom-3 right-5 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              <div className="absolute top-1/3 left-1 w-3 h-3 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              <div className="absolute bottom-1/3 -right-1 w-3 h-3 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

              {/* Central Radiant Saturn Nucleus */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 p-1 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-[#08182E] flex items-center justify-center relative overflow-hidden border border-sky-300/40">
                  <span className="text-4xl filter drop-shadow-[0_2px_12px_rgba(56,189,248,0.8)] animate-pulse">
                    🪐
                  </span>
                </div>
              </div>

              {/* Twinkling Starfield */}
              <span className="absolute top-4 right-8 text-sky-300 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-4 left-8 text-cyan-200 text-xs animate-star-twinkle delay-150">✦</span>
            </div>
          </div>
        )}

        {/* ================= 4. SLIDE 4: KUNDLI 36 GUNAS CELESTIAL LOVE HARMONY ================= */}
        {currentSlide.bannerId === "banner-kundli-milan" && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Rose-Wine Cosmic Love Radiance */}
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-500/25 to-purple-600/25 blur-2xl animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.2)_0%,transparent_70%)]" />

            {/* Rotating Harmony Rings */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 rounded-full border-2 border-rose-400/50 border-dashed animate-celestial-spin" />
              <div className="absolute inset-3 rounded-full border border-pink-400/40 animate-celestial-spin-reverse" />
              <div className="absolute inset-7 rounded-full border border-rose-500/30 animate-celestial-spin" />

              {/* Dual Partner Nodes */}
              <div className="absolute top-2 left-1/3 w-3.5 h-3.5 rounded-full bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.9)]" />
              <div className="absolute bottom-2 right-1/3 w-3.5 h-3.5 rounded-full bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.9)]" />

              {/* Central Glowing Sacred Heart */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-purple-600 p-1 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-[#2E0716] flex items-center justify-center relative overflow-hidden border border-rose-300/40">
                  <span className="text-4xl filter drop-shadow-[0_2px_12px_rgba(244,63,94,0.9)] animate-pulse">
                    ❤️
                  </span>
                </div>
              </div>

              {/* Love Sparkles */}
              <span className="absolute top-4 left-6 text-pink-300 text-sm animate-star-twinkle">✦</span>
              <span className="absolute bottom-4 right-6 text-rose-300 text-xs animate-star-twinkle delay-150">✦</span>
            </div>
          </div>
        )}

        {/* ================= 5. CUSTOM ADMIN UPLOADED ANIMATED BANNER/IMAGE ================= */}
        {isCustomImage && (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={currentSlide.imageUrl}
              alt="AstroAI Banner"
              className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Inner Glow Vignette */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
          </div>
        )}

        {/* Minimal Floating Indicator Dots (Zero Counter Text) */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md pointer-events-none">
            {banners.map((b, idx) => (
              <span
                key={b.bannerId || b.id || `dot-${idx}`}
                className={`rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-4 h-1.5 bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                    : "w-1.5 h-1.5 bg-white/45"
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
