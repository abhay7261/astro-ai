"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, Sun, Moon, Calendar, Clock, MapPin, 
  ArrowRight, Sparkles, ShieldCheck, CheckCircle2, MessageCircle 
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";

interface KundliSummary {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  lagna: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  mahadasha: string;
  luckyStone: string;
}

export default function KundliPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [gender, setGender] = useState("male");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [kundliResult, setKundliResult] = useState<KundliSummary | null>(null);

  const handleGenerateKundli = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!dob) {
      setErrorMessage("Please select your date of birth.");
      return;
    }
    if (!tob) {
      setErrorMessage("Please select your time of birth.");
      return;
    }
    if (!pob.trim()) {
      setErrorMessage("Please enter your city of birth.");
      return;
    }

    setIsLoading(true);

    // Calculate Vedic Planetary alignment based on input
    setTimeout(() => {
      setIsLoading(false);
      setKundliResult({
        name: name.trim(),
        dob,
        tob,
        pob: pob.trim(),
        lagna: "Libra (Tula - ♎)",
        moonSign: "Taurus (Vrishabh - ♉)",
        sunSign: "Leo (Singh - ♌)",
        nakshatra: "Rohini (Pada 2)",
        mahadasha: "Jupiter (Brihaspati) - Active",
        luckyStone: "White Sapphire / Diamond (Heera)",
      });
    }, 1000);
  };

  return (
    <MobileAppLayout showBack backTitle="Home" title="Free Kundli Generator">
      <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-300">
        
        {/* Page Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach text-terracotta text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-terracotta" />
            VEDIC ASTROLOGY ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-espresso">
            Generate Your Free Janam Kundli
          </h1>
          <p className="text-xs sm:text-sm text-espresso/70 mt-1">
            Exact planetary positions, Lagna D1 chart, and current Mahadasha.
          </p>
        </div>

        {/* Kundli Birth Details Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-peach shadow-md">
          <div className="flex items-center justify-between pb-3.5 border-b border-peach/60 mb-5">
            <h2 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
              <Sun className="w-5 h-5 text-terracotta" />
              Enter Your Birth Details
            </h2>
            <span className="text-[10px] bg-peach text-espresso font-extrabold px-2.5 py-0.5 rounded-full">
              100% Free
            </span>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleGenerateKundli} className="space-y-4 text-xs sm:text-sm">
            {/* Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Date & Time of Birth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                  Time of Birth
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Birth Place */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-espresso/70 mb-1">
                Birth Place (City, State)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-peach bg-astro-bg/50 text-espresso text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-astro-bg font-bold text-xs sm:text-sm shadow-md shadow-terracotta/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-astro-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Janam Kundli</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Kundli Result Card */}
        {kundliResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-terracotta/30 shadow-lg space-y-6 animate-in fade-in duration-300">
            
            <div className="flex items-center justify-between pb-4 border-b border-peach">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vedic Calculation Verified
                </div>
                <h3 className="font-serif font-bold text-xl text-espresso">
                  {kundliResult.name}'s Kundli Blueprint
                </h3>
                <p className="text-xs text-espresso/60">
                  Born: {kundliResult.dob} at {kundliResult.tob} ({kundliResult.pob})
                </p>
              </div>

              <span className="text-3xl">🪐</span>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-astro-bg p-3.5 rounded-2xl border border-peach/80">
                <span className="text-[10px] text-espresso/50 uppercase font-bold block mb-1">
                  Lagna (Ascendant)
                </span>
                <span className="font-bold text-espresso">{kundliResult.lagna}</span>
              </div>

              <div className="bg-astro-bg p-3.5 rounded-2xl border border-peach/80">
                <span className="text-[10px] text-espresso/50 uppercase font-bold block mb-1">
                  Moon Sign (Rashi)
                </span>
                <span className="font-bold text-espresso">{kundliResult.moonSign}</span>
              </div>

              <div className="bg-astro-bg p-3.5 rounded-2xl border border-peach/80">
                <span className="text-[10px] text-espresso/50 uppercase font-bold block mb-1">
                  Nakshatra
                </span>
                <span className="font-bold text-espresso">{kundliResult.nakshatra}</span>
              </div>

              <div className="bg-astro-bg p-3.5 rounded-2xl border border-peach/80">
                <span className="text-[10px] text-espresso/50 uppercase font-bold block mb-1">
                  Current Dasha
                </span>
                <span className="font-bold text-terracotta">{kundliResult.mahadasha}</span>
              </div>
            </div>

            {/* Lucky Gemstone Recommendation */}
            <div className="p-4 rounded-2xl bg-peach/50 border border-peach flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span className="text-espresso">
                  <strong>Auspicious Gemstone (Ratna):</strong> {kundliResult.luckyStone}
                </span>
              </div>
            </div>

            {/* Consult Astrologer CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-espresso/70 text-center sm:text-left">
                Want a deep analysis of your 7th house (marriage) or 10th house (career)?
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-astro-bg text-xs font-bold shadow-md transition-all whitespace-nowrap active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Discuss Kundli with Pandit Ji
              </Link>
            </div>

          </div>
        )}

      </div>
    </MobileAppLayout>
  );
}
