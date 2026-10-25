"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, CheckCircle2, MessageCircle, Globe, Shield, Sparkles } from "lucide-react";
import AstroChatModal from "./AstroChatModal";
import { astrologersApi } from "../services/apiClient";

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  category: string;
  experience: string;
  languages: string[];
  rating: number;
  totalConsultations: string;
  pricePerMin: number;
  image: string;
  specialty: string;
  isOnline: boolean;
}

export const astrologersData: Astrologer[] = [];

const categories = [
  { id: "all", label: "All Acharyas" },
  { id: "Love", label: "Love & Vivah" },
  { id: "Career", label: "Career & Wealth" },
  { id: "Kundli", label: "Kundli & Dosha" },
  { id: "Vastu", label: "Vastu & Ratna" },
];

export default function AstrologerSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAstroForChat, setSelectedAstroForChat] = useState<Astrologer | null>(null);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);

  useEffect(() => {
    const loadAstros = async () => {
      // 1. Fetch live astrologers directly from MongoDB Atlas backend
      try {
        const res = await astrologersApi.getAll();
        if (Array.isArray(res)) {
          const sanitized = res.map((a: any) => ({
            ...a,
            id: String(a.id || a.astrologerId || a._id),
            languages: a.languages && Array.isArray(a.languages) && a.languages.length > 0 ? a.languages : ["Hindi", "English"],
            rating: a.rating || 4.9,
            totalConsultations: a.totalConsultations || "10K+",
            experience: a.experience || "10+ Yrs Exp",
            pricePerMin: a.pricePerMin || 20,
            specialty: a.specialty || "Vedic Astrology",
            title: a.title || "Vedic Astrologer",
            isOnline: a.isOnline !== undefined ? a.isOnline : true,
          }));
          setAstrologers(sanitized);
          localStorage.setItem("astroai_custom_astrologers", JSON.stringify(sanitized));
          return;
        }
      } catch (err) {
        console.warn("Backend read error, trying offline cache:", err);
      }

      // 2. Offline fallback to cached astrologers if network fails
      try {
        const saved = localStorage.getItem("astroai_custom_astrologers");
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAstrologers(parsed);
            return;
          }
        }
      } catch (e) {}

      // 3. If no astrologers exist in database, display clean empty state (Zero fake dummy astrologers)
      setAstrologers([]);
    };

    loadAstros();
    window.addEventListener("astroai_astrologers_updated", loadAstros);
    return () => window.removeEventListener("astroai_astrologers_updated", loadAstros);
  }, []);

  const filteredAstrologers =
    selectedCategory === "all"
      ? astrologers
      : astrologers.filter((a) => a.category === selectedCategory);

  return (
    <section className="w-full space-y-4">
      {/* Section Sub-header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified & Available Now
          </div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-espresso">
            Senior Vedic Astrologers
          </h2>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-terracotta font-extrabold">
            {filteredAstrologers.length} Online Now
          </span>
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              selectedCategory === cat.id
                ? "bg-terracotta text-white shadow-md shadow-terracotta/25"
                : "bg-white/90 text-espresso/70 hover:bg-peach/50 border border-peach shadow-xs"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Astrologers Cards List: Spacious Responsive Single-Column / Two-Column Cards */}
      {filteredAstrologers.length === 0 ? (
        <div className="bg-white/80 border-2 border-dashed border-peach rounded-3xl p-8 text-center text-espresso/60 col-span-full">
          <p className="font-semibold text-sm text-espresso">Koi Astrologer Uplabdh Nahi Hai</p>
          <p className="text-xs text-espresso/50 mt-1">
            Admin panel se naye certified Acharyas aur Pandits add karein.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredAstrologers.map((astro) => (
          <div
            key={astro.id}
            className="bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF9F3] rounded-3xl p-4 border-2 border-amber-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between gap-3 group hover:-translate-y-0.5"
          >
            <div>
              {/* Top Row: Avatar + Info */}
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md bg-espresso ring-2 ring-terracotta/20 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={astro.image}
                      alt={astro.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Live Online Badge */}
                  {astro.isOnline && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-3.5 h-3.5 rounded-full shadow-xs" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <h3 className="font-serif font-bold text-espresso text-sm sm:text-base leading-snug group-hover:text-terracotta transition-colors truncate">
                      {astro.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 flex-shrink-0" />
                  </div>

                  <p className="text-[11px] text-espresso/70 line-clamp-1 mt-0.5 font-medium">
                    {astro.title}
                  </p>
                  
                  <p className="text-[11px] font-bold text-terracotta mt-0.5 line-clamp-1">
                    {astro.specialty}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-espresso/60 font-medium">
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {astro.rating}
                    </span>
                    <span>•</span>
                    <span>{astro.experience}</span>
                    <span>•</span>
                    <span>{astro.totalConsultations}</span>
                  </div>
                </div>
              </div>

              {/* Languages & Free Offer Row */}
              <div className="mt-3 pt-2.5 border-t border-peach/70 flex items-center justify-between text-[11px] text-espresso/75">
                <span className="flex items-center gap-1 truncate max-w-[170px]">
                  <Globe className="w-3 h-3 text-terracotta flex-shrink-0" />
                  <span className="truncate">{(astro.languages || ["Hindi", "English"]).join(", ")}</span>
                </span>
                <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider border border-amber-300/60 shadow-xs flex-shrink-0">
                  First Chat Free
                </span>
              </div>
            </div>

            {/* Bottom Row: Price & Chat Button */}
            <div className="pt-2.5 border-t border-peach/70 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-espresso/50 line-through">₹{astro.pricePerMin}/min</span>
                <div className="text-xs font-black text-emerald-700 leading-none">₹0 (Free Chat)</div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAstroForChat(astro)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/25 active:scale-95 transition-all flex-shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Now</span>
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Live Chat Modal */}
      {selectedAstroForChat && (
        <AstroChatModal
          astrologer={selectedAstroForChat}
          onClose={() => setSelectedAstroForChat(null)}
        />
      )}
    </section>
  );
}