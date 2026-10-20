"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, Bot, MessageCircle, Crown, ArrowRight, 
  Sun, Clapperboard, ChevronRight, Star, Flame, CheckCircle2,
  Pencil, Check, X
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import AstroChatModal from "../components/AstroChatModal";
import CosmicOrbAnimation from "../components/mobile/CosmicOrbAnimation";
import VedicAstrolabeChakra from "../components/mobile/VedicAstrolabeChakra";

export default function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameToast, setNameToast] = useState(false);
  const [selectedAstroForChat, setSelectedAstroForChat] = useState<{
    id: string;
    name: string;
    title: string;
    image: string;
    experience: string;
    specialty: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setNameInput(parsed.name || "");
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, []);

  // Save updated custom display name
  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nameInput.trim()) return;

    const trimmed = nameInput.trim();
    const updatedUser = {
      ...(user || { id: "user_1", email: "seeker@astroai.com" }),
      name: trimmed,
    };

    setUser(updatedUser);
    localStorage.setItem("astroai_auth_user", JSON.stringify(updatedUser));
    setIsEditingName(false);

    // Broadcast update across app header and layout
    window.dispatchEvent(new Event("astroai_user_updated"));

    setNameToast(true);
    setTimeout(() => setNameToast(false), 2500);
  };

  // Featured Astrologers State (Synced with Admin & Exclusion Tracking)
  const [featuredAstrologers, setFeaturedAstrologers] = useState<any[]>([]);

  useEffect(() => {
    const loadFeatured = () => {
      try {
        const deletedAstrosStr = localStorage.getItem("astroai_deleted_astros");
        const deletedAstros: string[] = deletedAstrosStr ? JSON.parse(deletedAstrosStr) : [];
        const saved = localStorage.getItem("astroai_custom_astrologers");

        if (saved !== null) {
          // Admin has explicitly configured or deleted astrologers
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const nonDeleted = parsed
              .filter((a: any) => !deletedAstros.includes(String(a.id)))
              .map((a: any) => ({
                id: a.id,
                name: a.name,
                title: a.title,
                specialty: a.specialty,
                experience: a.experience,
                rating: String(a.rating || "4.9"),
                consults: a.totalConsultations || "10k+",
                image: a.image,
              }));
            setFeaturedAstrologers(nonDeleted.slice(0, 3));
            return;
          }
        }

        // If no custom config in localStorage, filter defaults by deletedAstros
        const defaults = [
          {
            id: "1",
            name: "Acharya Vidyadhar",
            title: "Vedic Astrologer",
            specialty: "Lagna Dosha & Shanti",
            experience: "18+ Yrs",
            rating: "4.9",
            consults: "14.2k",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
          },
          {
            id: "2",
            name: "Dr. Ananya Mukherjee",
            title: "Love & Marriage Guru",
            specialty: "Vivah Yog & Matching",
            experience: "12+ Yrs",
            rating: "4.95",
            consults: "18.6k",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
          },
          {
            id: "3",
            name: "Pandit Radheshyam",
            title: "Career & Wealth Specialist",
            specialty: "Job & Business Growth",
            experience: "15+ Yrs",
            rating: "4.88",
            consults: "11.9k",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
          },
        ];

        const filteredDefaults = defaults.filter(
          (a) => !deletedAstros.includes(String(a.id))
        );
        setFeaturedAstrologers(filteredDefaults.slice(0, 3));
      } catch (e) {
        console.warn("Featured astrologers load error", e);
      }
    };

    loadFeatured();
    window.addEventListener("astroai_astrologers_updated", loadFeatured);
    return () => window.removeEventListener("astroai_astrologers_updated", loadFeatured);
  }, []);

  return (
    <MobileAppLayout>
      <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
        
        {/* Name Updated Toast Notification */}
        {nameToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-espresso text-amber-200 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-amber-400/40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Aapka naam safalta-poorvak update ho gaya! ✨</span>
          </div>
        )}

        {/* 1. Welcome Greeting Banner with Editable Display Name */}
        <section className="bg-gradient-to-br from-[#FFF9F2] via-[#FFEEDC] to-[#FFDFC8] p-5 sm:p-6 rounded-3xl border-2 border-amber-300/70 shadow-lg shadow-amber-950/5 relative overflow-hidden">
          {/* Animated Ambient Vedic Astrolabe Kalachakra (Dual Counter-Rotating Zodiac & Lotus Rings + OM Sun Core) */}
          <div className="absolute -right-12 -bottom-12 sm:-right-8 sm:-bottom-8 pointer-events-none select-none opacity-80 sm:opacity-90">
            <VedicAstrolabeChakra />
          </div>

          <div className="relative z-10">
            {/* Shimmering Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-terracotta to-amber-600 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              Daily Planetary Alignment
            </div>
            
            {/* User Greeting with Editable Name Control */}
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
                    setNameInput(user?.name || "");
                    setIsEditingName(true);
                  }}
                  title="Click to change your display name"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-terracotta border border-amber-300/80 text-[10px] font-bold shadow-xs active:scale-95 transition-all"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Change Name</span>
                </button>
              </div>
            ) : (
              /* Inline Editable Form */
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1 mb-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your real name..."
                  autoFocus
                  className="bg-white/95 border-2 border-amber-400 rounded-xl px-3 py-1.5 text-xs font-bold text-espresso focus:outline-none shadow-xs max-w-[200px]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-1.5 rounded-xl bg-white/80 hover:bg-white text-espresso/70 text-xs font-semibold active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            
            <p className="text-xs sm:text-sm text-espresso/80 mt-1 max-w-md leading-relaxed font-medium">
              Jupiter’s positive transit in your chart brings auspicious opportunities today. Explore your cosmic destiny below.
            </p>

            {/* Micro Astrological Status Indicators */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-peach/80 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-amber-300/70 text-terracotta font-bold shadow-xs">
                <Sun className="w-3 h-3 text-amber-500 animate-spin-slow" />
                Aura: 94% Auspicious
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 border border-amber-300/70 text-espresso font-bold shadow-xs">
                ⏰ Abhijit Muhurat: 11:45 AM
              </span>
            </div>
          </div>
        </section>

        {/* 2. Interactive High-Impact Cosmic Orb Animation */}
        <CosmicOrbAnimation />

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
                    onClick={() => setSelectedAstroForChat(astro)}
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
            className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-espresso font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            <span>View VIP Pass</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </section>

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
