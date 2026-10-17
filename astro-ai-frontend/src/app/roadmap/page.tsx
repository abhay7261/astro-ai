"use client";

import Link from "next/link";
import { Download, ArrowLeft, Sparkles, CheckCircle2, Clock, Calendar, ShieldCheck, Flame, Bot } from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";

export default function RoadmapPage() {
  return (
    <MobileAppLayout showBack backTitle="Home" title="Product Roadmap & Updates">
      <div className="space-y-5 animate-in fade-in duration-300 max-w-xl mx-auto">
        
        {/* Header with Download PDF Button */}
        <div className="bg-gradient-to-r from-amber-500/15 via-terracotta/15 to-orange-500/10 p-5 rounded-3xl border-2 border-amber-300/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-terracotta text-white text-[10px] font-extrabold uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              AstroAI Roadmap Document
            </div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-espresso">
              Features Changelog & Release Plan
            </h1>
            <p className="text-xs text-espresso/70 mt-0.5">
              Launch scope, temporarily removed features & upcoming updates.
            </p>
          </div>

          <a
            href="/AstroAI_Upcoming_Features_Roadmap.pdf"
            download="AstroAI_Upcoming_Features_Roadmap.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 text-white text-xs font-bold shadow-lg shadow-terracotta/30 active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>

        {/* SECTION 1: ACTIVE LAUNCH FEATURES (v1.0) */}
        <section className="bg-white/95 p-5 rounded-3xl border-2 border-emerald-300/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <h2 className="font-serif font-bold text-base text-espresso">
              1. Active Launch Features (v1.0 Live)
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs text-espresso/85">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">24/7 AI Astrologer Chatbot (/ai-chat):</strong> Instant personalized Vedic answers, category filters, and Pandit Ji Upay scroll boxes.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">Verified Astrologers Directory (/chat):</strong> Profiles of top Vedic Acharyas with experience, ratings, and live consultation modals.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">Fullscreen Astro Reels (/reels):</strong> 100dvh Instagram-style vertical video reels feed with double-tap like, comments drawer, and share.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">Interactive Cosmic Orb Centerpiece:</strong> Animated planetary astrolabe with live aura recalibration on Home dashboard.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">Customizable User Name:</strong> Direct inline editing of display name after 'Namaste' greeting synced across app.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-emerald-900 font-bold">VIP Astro Pass (/vip-pass):</strong> ₹299/mo premium membership tier comparison.
              </div>
            </li>
          </ul>
        </section>

        {/* SECTION 2: TEMPORARILY REMOVED FEATURES */}
        <section className="bg-white/95 p-5 rounded-3xl border-2 border-amber-300/80 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-100">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h2 className="font-serif font-bold text-base text-espresso">
              2. Modules Temporarily Removed for Launch
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <h3 className="font-bold text-amber-900 text-xs">A. Free Janam Kundli Generator (/kundli)</h3>
              <p className="text-espresso/75 mt-0.5">Lagna D1 chart calculation form. Will be reintroduced in v1.3 with an interactive North Indian Diamond Chart.</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <h3 className="font-bold text-amber-900 text-xs">B. Kundli Milan & 36 Guna Matchmaking (/kundli-milan)</h3>
              <p className="text-espresso/75 mt-0.5">Ashtakoot 36-gun compatibility analysis and Nadi/Manglik dosha check. Scheduled as a marquee Relationship Update in v1.1.</p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
              <h3 className="font-bold text-amber-900 text-xs">C. Daily Rashifal & Transit (DailyRashifalSection)</h3>
              <p className="text-espresso/75 mt-0.5">12 Zodiac element chips with score meters. Scheduled to release with Daily Panchang & Rahu Kaal warnings in v1.2.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: FUTURE RELEASES ROADMAP */}
        <section className="bg-gradient-to-br from-[#2D160E] to-[#1C0D07] text-white p-5 rounded-3xl border-2 border-amber-400/60 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <Flame className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <h2 className="font-serif font-bold text-base text-amber-100">
              3. Upcoming Feature Releases Roadmap
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="border-l-2 border-amber-400 pl-3">
              <h3 className="font-bold text-amber-300">📦 Update 1 (v1.1) — Relationship & Vivah Suite</h3>
              <p className="text-white/80 mt-0.5">Re-enable Kundli Milan with 36 Gunas scorecard, Manglik cancellation rules, and partner compatibility meter.</p>
            </div>

            <div className="border-l-2 border-amber-400 pl-3">
              <h3 className="font-bold text-amber-300">📦 Update 2 (v1.2) — Daily Vedic Astro & Panchang</h3>
              <p className="text-white/80 mt-0.5">Re-enable Daily Rashifal with customized horoscope alerts + Aaj Ka Panchang (Tithi, Nakshatra, Shubh Abhijit Muhurat, Rahu Kaal).</p>
            </div>

            <div className="border-l-2 border-amber-400 pl-3">
              <h3 className="font-bold text-amber-300">📦 Update 3 (v1.3) — Visual Diamond Kundli & PDF Reports</h3>
              <p className="text-white/80 mt-0.5">Traditional North Indian Diamond Chart (D1 & D9) with tap-to-inspect houses + 25-Page Color Janam Kundli Dossier PDF download.</p>
            </div>

            <div className="border-l-2 border-amber-400 pl-3">
              <h3 className="font-bold text-amber-300">📦 Update 4 (v2.0) — Monetization & Calling Engine</h3>
              <p className="text-white/80 mt-0.5">Payment Gateway checkout (Razorpay / PhonePe) + 1-on-1 Live WebRTC Voice/Video calling with Acharyas + Bilingual Hindi/English switcher.</p>
            </div>
          </div>
        </section>

      </div>
    </MobileAppLayout>
  );
}
