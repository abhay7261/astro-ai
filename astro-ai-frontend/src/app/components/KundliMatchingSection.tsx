"use client";

import { useState } from "react";
import { Heart, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, MessageCircle } from "lucide-react";

interface KootScore {
  name: string;
  nameHindi: string;
  maxPoints: number;
  obtainedPoints: number;
  description: string;
}

interface MatchResult {
  totalScore: number;
  verdict: string;
  verdictDescription: string;
  isManglikCompatible: boolean;
  manglikNote: string;
  koots: KootScore[];
}

export default function KundliMatchingSection() {
  const [boyName, setBoyName] = useState("Aman Sharma");
  const [boyDob, setBoyDob] = useState("1996-05-14");
  const [boyTob, setBoyTob] = useState("08:30");
  const [boyPlace, setBoyPlace] = useState("Delhi");

  const [girlName, setGirlName] = useState("Pooja Verma");
  const [girlDob, setGirlDob] = useState("1998-11-20");
  const [girlTob, setGirlTob] = useState("14:15");
  const [girlPlace, setGirlPlace] = useState("Jaipur");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatchCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Vedic Ashtakoot Calculation
    setTimeout(() => {
      const calculatedKoots: KootScore[] = [
        { name: "Varna", nameHindi: "वर्ण", maxPoints: 1, obtainedPoints: 1, description: "Spiritual harmony & ego balance" },
        { name: "Vashya", nameHindi: "वश्य", maxPoints: 2, obtainedPoints: 2, description: "Mutual respect & attraction" },
        { name: "Tara", nameHindi: "तारा", maxPoints: 3, obtainedPoints: 3, description: "Birth star destiny & health luck" },
        { name: "Yoni", nameHindi: "योनि", maxPoints: 4, obtainedPoints: 3, description: "Biological & temperament affinity" },
        { name: "Graha Maitri", nameHindi: "ग्रह मैत्री", maxPoints: 5, obtainedPoints: 5, description: "Planetary friendship & intellect" },
        { name: "Gana", nameHindi: "गण", maxPoints: 6, obtainedPoints: 6, description: "Behavioral compatibility (Dev-Dev)" },
        { name: "Bhakoot", nameHindi: "भकूट", maxPoints: 7, obtainedPoints: 0, description: "Emotional connection (Remedy advised)" },
        { name: "Nadi", nameHindi: "नाड़ी", maxPoints: 8, obtainedPoints: 8, description: "Genetic health & progeny (No Nadi Dosha)" },
      ];

      const total = calculatedKoots.reduce((acc, curr) => acc + curr.obtainedPoints, 0);

      setResult({
        totalScore: total,
        verdict: total >= 28 ? "Utkrisht (Highly Auspicious)" : total >= 18 ? "Madhyam (Good with Remedies)" : "Ashubh (Not Recommended)",
        verdictDescription:
          total >= 28
            ? "Atyant shubh yog ban raha hai! Var aur Kanya ka grah milan dampatya jeevan ke liye anukool hai."
            : "Vivah ke liye gun milan anukool hai, parantu Bhakoot shanti ke liye pandit ji se upaay karwayein.",
        isManglikCompatible: true,
        manglikNote: "Manglik Dosha cancelled by Jupiter's auspicious aspect. Dono ki kundli anukool hai.",
        koots: calculatedKoots,
      });

      setLoading(false);
    }, 1200);
  };

  return (
    <section id="matching" className="w-full py-16 bg-astro-bg border-t border-peach/80">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-peach/80 text-terracotta text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
            36 GUN MILAN & ASHTAKOOT
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-espresso">
            Free Kundli Milan for Marriage
          </h2>
          <p className="mt-2 text-espresso/70 text-sm md:text-base">
            Var aur Kanya ke janma vivaran daalkar dekhein 36 Gunas ka accurate Vedic matching score.
          </p>
        </div>

        {/* Input Form Cards */}
        <form onSubmit={handleMatchCalculation} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Boy's Details */}
            <div className="bg-white/80 rounded-3xl p-6 border border-peach shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-peach/60 mb-4">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <h3 className="font-serif font-bold text-base text-espresso">Var (Boy's Details)</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-espresso/70 mb-1">BOY'S FULL NAME</label>
                  <input
                    type="text"
                    value={boyName}
                    onChange={(e) => setBoyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-espresso/70 mb-1">DATE OF BIRTH</label>
                    <input
                      type="date"
                      value={boyDob}
                      onChange={(e) => setBoyDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-espresso/70 mb-1">TIME OF BIRTH</label>
                    <input
                      type="time"
                      value={boyTob}
                      onChange={(e) => setBoyTob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-espresso/70 mb-1">BIRTH CITY</label>
                  <input
                    type="text"
                    value={boyPlace}
                    onChange={(e) => setBoyPlace(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    placeholder="e.g. Delhi, India"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Girl's Details */}
            <div className="bg-white/80 rounded-3xl p-6 border border-peach shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-peach/60 mb-4">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h3 className="font-serif font-bold text-base text-espresso">Kanya (Girl's Details)</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-espresso/70 mb-1">GIRL'S FULL NAME</label>
                  <input
                    type="text"
                    value={girlName}
                    onChange={(e) => setGirlName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-espresso/70 mb-1">DATE OF BIRTH</label>
                    <input
                      type="date"
                      value={girlDob}
                      onChange={(e) => setGirlDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-espresso/70 mb-1">TIME OF BIRTH</label>
                    <input
                      type="time"
                      value={girlTob}
                      onChange={(e) => setGirlTob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-espresso/70 mb-1">BIRTH CITY</label>
                  <input
                    type="text"
                    value={girlPlace}
                    onChange={(e) => setGirlPlace(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-peach bg-astro-bg text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                    placeholder="e.g. Jaipur, Rajasthan"
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-hover disabled:opacity-50 text-astro-bg font-bold text-sm shadow-xl inline-flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating 36 Gunas...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Calculate Gun Milan (36 Points)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Match Result Display */}
        {result && (
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border-2 border-peach shadow-xl max-w-4xl mx-auto animate-in fade-in">
            
            {/* Top Score Summary Banner */}
            <div className="bg-gradient-to-r from-peach/60 via-peach/30 to-peach/60 rounded-2xl p-6 text-center border border-peach mb-8">
              <span className="text-xs font-semibold text-terracotta uppercase tracking-wider block mb-1">
                ASHTAKOOT MILAN SCORE
              </span>
              <div className="text-5xl font-serif font-bold text-espresso my-2">
                {result.totalScore} <span className="text-2xl text-espresso/50">/ 36 Gunas</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold my-2">
                <CheckCircle2 className="w-4 h-4" />
                {result.verdict}
              </div>
              <p className="text-xs text-espresso/80 max-w-xl mx-auto mt-2">
                {result.verdictDescription}
              </p>
            </div>

            {/* Manglik Status Badge */}
            <div className="bg-astro-bg p-4 rounded-2xl border border-peach mb-6 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-espresso font-bold">Manglik Dosha Matching:</strong>{" "}
                <span className="text-espresso/80">{result.manglikNote}</span>
              </div>
            </div>

            {/* 8 Koot Breakdown Grid */}
            <h4 className="font-serif font-bold text-base text-espresso mb-4">
              8 Kootas (Ashtakoot) Detailed Breakdown:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {result.koots.map((k, idx) => (
                <div key={idx} className="bg-astro-bg p-3.5 rounded-2xl border border-peach/70">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-espresso">{k.nameHindi} ({k.name})</span>
                    <span className="font-bold text-xs text-terracotta">
                      {k.obtainedPoints}/{k.maxPoints}
                    </span>
                  </div>
                  <p className="text-[11px] text-espresso/60 leading-tight">{k.description}</p>
                </div>
              ))}
            </div>

            {/* Talk to Astrologer CTA */}
            <div className="pt-6 border-t border-peach/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h5 className="font-bold text-sm text-espresso">Have doubts about Nadi or Bhakoot Dosha?</h5>
                <p className="text-xs text-espresso/70">Talk to our Marriage Specialist Astrologer for remedies.</p>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById("astrologers-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-hover text-astro-bg text-xs font-semibold shadow-md transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Consult Marriage Astrologer
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}