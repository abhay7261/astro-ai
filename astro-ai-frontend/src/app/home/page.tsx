"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Bot, MessageCircle, Crown, ArrowRight, 
  Sun, Moon, ShoppingBag, BookOpen, Clapperboard, ChevronRight, Star, Flame, CheckCircle2,
  Pencil, Check, X
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import AstroChatModal from "../components/AstroChatModal";
import CosmicOrbAnimation from "../components/mobile/CosmicOrbAnimation";
import VedicAstrolabeChakra from "../components/mobile/VedicAstrolabeChakra";
import HeroBannerSlider from "../components/mobile/HeroBannerSlider";
import VedicPoojaSection from "../components/mobile/VedicPoojaSection";
import { astrologersApi } from "../services/apiClient";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedAstroForChat, setSelectedAstroForChat] = useState<{
    id: string;
    name: string;
    title: string;
    image: string;
    experience: string;
    specialty: string;
  } | null>(null);

  // Require Auth Helper for Action-Gating
  const handleActionClick = (e: React.MouseEvent, href: string, featureName: string) => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("astroai_open_auth", {
            detail: {
              featureName,
              callback: () => router.push(href),
            },
          })
        );
      }
    } catch {}
  };

  const handleAstroChatClick = (astro: any) => {
    try {
      const sessionToken = sessionStorage.getItem("astroai_session_token");
      if (!sessionToken) {
        window.dispatchEvent(
          new CustomEvent("astroai_open_auth", {
            detail: {
              featureName: `Chat with ${astro.name}`,
              callback: () => setSelectedAstroForChat(astro),
            },
          })
        );
      } else {
        setSelectedAstroForChat(astro);
      }
    } catch {
      setSelectedAstroForChat(astro);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, []);

  // Featured Astrologers State (Synced with Admin & Backend API)
  const [featuredAstrologers, setFeaturedAstrologers] = useState<any[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        // 1. Fetch live astrologers directly from backend MongoDB Atlas (Single Source of Truth)
        try {
          const live = await astrologersApi.getAll();
          if (Array.isArray(live)) {
            const formatted = live.map((a: any) => ({
              id: a.id || a.astrologerId || a._id,
              name: a.name,
              title: a.title,
              specialty: a.specialty,
              experience: a.experience,
              rating: String(a.rating || "4.9"),
              consults: a.totalConsultations || "10k+",
              image: a.image,
            }));
            setFeaturedAstrologers(formatted.slice(0, 3));
            localStorage.setItem("astroai_custom_astrologers", JSON.stringify(live));
            return;
          }
        } catch (e) {}

        // 2. Offline fallback if network is unreachable
        const saved = localStorage.getItem("astroai_custom_astrologers");
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const formatted = parsed.map((a: any) => ({
              id: a.id || a.astrologerId || a._id,
              name: a.name,
              title: a.title,
              specialty: a.specialty,
              experience: a.experience,
              rating: String(a.rating || "4.9"),
              consults: a.totalConsultations || "10k+",
              image: a.image,
            }));
            setFeaturedAstrologers(formatted.slice(0, 3));
            return;
          }
        }

        // If no astrologers exist anywhere, keep empty (Zero fake dummy astrologers)
        setFeaturedAstrologers([]);
      } catch (e) {
        console.warn("Featured astrologers load error", e);
        setFeaturedAstrologers([]);
      }
    };

    loadFeatured();
    window.addEventListener("astroai_astrologers_updated", loadFeatured);
    return () => window.removeEventListener("astroai_astrologers_updated", loadFeatured);
  }, []);

  return (
    <MobileAppLayout>
      <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
        
        {/* 1. Dynamic Hero Banner Scroller (Pure Animated Visuals - Zero Text Clutter) */}
        <HeroBannerSlider
          user={user}
          onOpenAuth={(featureName, callback) => {
            window.dispatchEvent(
              new CustomEvent("astroai_open_auth", {
                detail: { featureName, callback },
              })
            );
          }}
        />

        {/* 2. Interactive High-Impact Cosmic Orb Animation */}
        <CosmicOrbAnimation />

        {/* 2.5 Quick Vedic Services (Personalised Pooja, Astro Store, Solutions, Astro History) */}
        <section className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Pooja: Personalised Pooja */}
            <Link
              href="/pooja"
              onClick={(e) => handleActionClick(e, "/pooja", "Vedic Pooja & Anushthan")}
              className="bg-gradient-to-br from-[#FFF7ED] via-white to-[#FFEDD5] p-3.5 sm:p-4 rounded-2xl border-2 border-orange-300/80 hover:border-orange-500 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6500] to-amber-500 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                🕉️
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-[#FF6500] tracking-wider block">Sacred Vidhi</span>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-[#FF6500] transition-colors leading-tight">Pooja</h4>
                <p className="text-[10px] text-espresso/65 truncate mt-0.5">Personalised Pooja</p>
              </div>
            </Link>

            {/* Astro Store: Rudraksha & Gemstones */}
            <Link
              href="/services"
              onClick={(e) => handleActionClick(e, "/services", "Astro Store")}
              className="bg-gradient-to-br from-[#FFFDF5] via-white to-[#FEF3C7] p-3.5 sm:p-4 rounded-2xl border-2 border-amber-300/80 hover:border-amber-500 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-amber-700 tracking-wider block">Vedic Store</span>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-amber-700 transition-colors leading-tight">Astro Store</h4>
                <p className="text-[10px] text-espresso/65 truncate mt-0.5">Rudraksha & Gems</p>
              </div>
            </Link>

            {/* Solutions: Samadhan & Guidance */}
            <Link
              href="/ai-chat"
              onClick={(e) => handleActionClick(e, "/ai-chat", "Solutions & Samadhan")}
              className="bg-gradient-to-br from-[#FAF5FF] via-white to-[#F3E8FF] p-3.5 sm:p-4 rounded-2xl border-2 border-purple-300/80 hover:border-purple-500 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-purple-700 tracking-wider block">Upay & Guidance</span>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-purple-700 transition-colors leading-tight">Solutions</h4>
                <p className="text-[10px] text-espresso/65 truncate mt-0.5">Samadhan & Upay</p>
              </div>
            </Link>

            {/* Astro History: Astrology Readings */}
            <Link
              href="/kundli"
              onClick={(e) => handleActionClick(e, "/kundli", "Astro History & Kundli")}
              className="bg-gradient-to-br from-[#F0FDF4] via-white to-[#DCFCE7] p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-300/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex items-center gap-3 group active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider block">Janam Kundli</span>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-emerald-700 transition-colors leading-tight">Astro History</h4>
                <p className="text-[10px] text-espresso/65 truncate mt-0.5">Astrology Readings</p>
              </div>
            </Link>
          </div>

          {/* Sun (Surya) & Moon (Chandra) Celestial Energy Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Surya Transit Insight */}
            <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-100/40 p-3 rounded-2xl border border-amber-300/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-amber-700 uppercase block">Surya Gochar</span>
                <h5 className="font-bold text-xs text-espresso leading-tight truncate">Career & Tejas</h5>
                <p className="text-[9px] text-espresso/60 truncate">High Cosmic Vitality</p>
              </div>
            </div>

            {/* Chandra Nakshatra Insight */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-white to-blue-100/40 p-3 rounded-2xl border border-indigo-300/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-indigo-700 uppercase block">Chandra Dasha</span>
                <h5 className="font-bold text-xs text-espresso leading-tight truncate">Peace & Mind</h5>
                <p className="text-[9px] text-espresso/60 truncate">Shubh Nakshatra Yog</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Explore Astrology Services Grid (Launch Scope) */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="font-serif font-bold text-sm sm:text-base text-espresso flex items-center gap-1.5">
              <span>Explore Astrology Services</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h3>
            <span className="text-[11px] text-terracotta font-bold uppercase tracking-wider">Instant Access</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Dedicated AI Astrologer Chat */}
            <Link
              href="/ai-chat"
              onClick={(e) => handleActionClick(e, "/ai-chat", "24/7 AI Astrologer")}
              className="bg-gradient-to-br from-white via-[#FAF5FF] to-[#F3E8FF] p-4 rounded-2xl border-2 border-purple-300/80 hover:border-purple-500/70 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300/60 uppercase flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-purple-700" />
                  24/7 AI
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-purple-700 transition-colors">AI Astrologer</h4>
                <p className="text-[10px] text-espresso/65 mt-0.5">Instant Vedic Answers</p>
              </div>
            </Link>

            {/* Chat with Verified Astrologer */}
            <Link
              href="/chat"
              onClick={(e) => handleActionClick(e, "/chat", "Astrologer Chat")}
              className="bg-gradient-to-br from-white via-[#F6FCF9] to-[#E9F8F0] p-4 rounded-2xl border-2 border-emerald-300/80 hover:border-emerald-500/70 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 stroke-[2.2]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse" />
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300/60 uppercase">
                  Verified
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-emerald-700 transition-colors">Astrologer Chat</h4>
                <p className="text-[10px] text-espresso/65 mt-0.5">Senior Acharyas</p>
              </div>
            </Link>

            {/* Astro Reels */}
            <Link
              href="/reels"
              onClick={(e) => handleActionClick(e, "/reels", "Astro Short Video Reels")}
              className="bg-gradient-to-br from-white via-[#FFF7ED] to-[#FFEDD5] p-4 rounded-2xl border-2 border-orange-300/80 hover:border-orange-500/70 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8E2800] via-terracotta to-amber-500 text-white flex items-center justify-center shadow-md shadow-terracotta/30 group-hover:scale-105 transition-transform">
                  <Clapperboard className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300/60 uppercase flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                  Trending
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-terracotta transition-colors">Astro Reels</h4>
                <p className="text-[10px] text-espresso/65 mt-0.5">Fullscreen 1-Min Upay</p>
              </div>
            </Link>

            {/* VIP Astro Pass */}
            <Link
              href="/vip-pass"
              onClick={(e) => handleActionClick(e, "/vip-pass", "VIP Astro Pass")}
              className="bg-gradient-to-br from-white via-[#FFFDF5] to-[#FEF9C3]/50 p-4 rounded-2xl border-2 border-amber-300/80 hover:border-amber-500/70 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Crown className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60 uppercase">
                  ₹299/mo
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-espresso group-hover:text-amber-700 transition-colors">VIP Pass</h4>
                <p className="text-[10px] text-espresso/65 mt-0.5">Unlimited 24/7 Access</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 4. Verified Astrologers Online Section (Only shown if astrologers are available) */}
        {featuredAstrologers.length > 0 && (
          <section className="bg-gradient-to-b from-white to-[#FFFDF9] p-4 sm:p-5 rounded-3xl border-2 border-amber-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-3.5 px-1">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified & Available Now
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-espresso">
                  Verified Astrologers Online
                </h3>
              </div>
              <Link
                href="/chat"
                onClick={(e) => handleActionClick(e, "/chat", "Astrologers List")}
                className="text-xs font-bold text-terracotta hover:underline flex items-center gap-0.5 group"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {featuredAstrologers.map((astro) => (
                <div
                  key={astro.id}
                  className="bg-gradient-to-br from-white to-[#FFF9F3] p-3.5 rounded-2xl border-2 border-peach/80 hover:border-amber-400 flex sm:flex-col items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all text-left sm:text-center"
                >
                  <div className="flex sm:flex-col items-center gap-2.5 min-w-0">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-espresso">
                      <Image
                        src={astro.image}
                        alt={astro.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="object-cover w-full h-full"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-espresso truncate flex items-center sm:justify-center gap-1">
                        <span>{astro.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-sky-500 fill-sky-500 inline flex-shrink-0" />
                      </h4>
                      <p className="text-[10px] text-terracotta font-bold truncate">{astro.specialty}</p>
                      <div className="flex items-center sm:justify-center gap-1.5 text-[10px] text-espresso/60 mt-0.5 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          {astro.rating}
                        </span>
                        <span>•</span>
                        <span>{astro.experience}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAstroChatClick(astro)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all active:scale-95 flex-shrink-0 sm:w-full"
                  >
                    Chat Now
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Promotional VIP Pass Card (Royal Gold & Terracotta) */}
        <section className="bg-gradient-to-br from-[#2E1A11] via-[#482517] to-[#1C100A] text-white p-5 sm:p-6 rounded-3xl border-2 border-amber-400/70 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Golden Seal Watermark */}
          <div className="absolute -right-4 -bottom-6 w-32 h-32 opacity-15 pointer-events-none select-none">
            <span className="text-8xl">👑</span>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-espresso text-[10px] font-black uppercase tracking-wider mb-2.5 shadow-md">
              <Crown className="w-3.5 h-3.5 text-espresso fill-espresso" />
              VIP ASTRO PASS • ₹299 / MONTH
            </div>
            
            <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100 leading-snug">
              Unlock Unlimited 24/7 Astrologer Consultations
            </h3>
            
            <p className="text-xs text-white/80 mt-1 max-w-md leading-relaxed font-light">
              Ask unlimited questions, get 25-page deep Kundli reports, and priority instant responses for just ₹299/mo.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-3 text-[11px] text-amber-200/90 font-medium">
              <span>✨ 24/7 Unlimited Chat</span>
              <span>•</span>
              <span>✨ Detailed Dosha Upay</span>
              <span>•</span>
              <span>✨ Instant Audio Consult</span>
            </div>
          </div>

          <Link
            href="/vip-pass"
            onClick={(e) => handleActionClick(e, "/vip-pass", "VIP Astro Pass")}
            className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-espresso font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            <span>View VIP Pass</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </section>

        {/* 6. Vedic Pooja & Pandit Ji Anushthan Appointment Card */}
        <VedicPoojaSection />

      </div>

      {/* Interactive Chat Modal */}
      {selectedAstroForChat && (
        <AstroChatModal
          astrologer={selectedAstroForChat}
          onClose={() => setSelectedAstroForChat(null)}
        />
      )}
    </MobileAppLayout>
  );
}
