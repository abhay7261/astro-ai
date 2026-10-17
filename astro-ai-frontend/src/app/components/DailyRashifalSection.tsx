"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, Briefcase, Activity, MessageCircle, ChevronRight } from "lucide-react";

export interface RashiInfo {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  symbol: string;
  dates: string;
  element: string;
  ruler: string;
  prediction: string;
  loveScore: number;
  careerScore: number;
  healthScore: number;
  luckyColor: string;
  luckyNumber: number;
  luckyTime: string;
  dailyRemedy: string;
  colorScheme: string;
}

export const rashisData: RashiInfo[] = [
  {
    id: "aries",
    nameHindi: "मेष",
    nameEnglish: "Aries",
    symbol: "♈",
    dates: "Mar 21 - Apr 19",
    element: "Agni (Fire)",
    ruler: "Mangal (Mars)",
    colorScheme: "from-red-500 to-rose-600",
    prediction: "Aaj aatmavishwas me vriddhi hogi. Karyakshetra me nayi zimmedari mil sakti hai. Parivar ke sath shanti banaye rakhein aur gusse par kabu rakhein.",
    loveScore: 85,
    careerScore: 90,
    healthScore: 78,
    luckyColor: "Laal (Red)",
    luckyNumber: 9,
    luckyTime: "10:30 AM - 12:00 PM",
    dailyRemedy: "Surya Dev ko laal chandan milakar jal arpit karein.",
  },
  {
    id: "taurus",
    nameHindi: "वृषभ",
    nameEnglish: "Taurus",
    symbol: "♉",
    dates: "Apr 20 - May 20",
    element: "Prithvi (Earth)",
    ruler: "Shukra (Venus)",
    colorScheme: "from-emerald-500 to-teal-600",
    prediction: "Aarthik maamlo me safalta milegi. Purana ruka hua paisa wapas milne ke yog hain. Jeevansathi ka poora sahyog milega.",
    loveScore: 92,
    careerScore: 82,
    healthScore: 88,
    luckyColor: "Safed (White)",
    luckyNumber: 6,
    luckyTime: "02:15 PM - 03:45 PM",
    dailyRemedy: "Kanyao ko kheer ya safed mithai khilayein.",
  },
  {
    id: "gemini",
    nameHindi: "मिथुन",
    nameEnglish: "Gemini",
    symbol: "♊",
    dates: "May 21 - Jun 20",
    element: "Vayu (Air)",
    ruler: "Budh (Mercury)",
    colorScheme: "from-amber-500 to-orange-600",
    prediction: "Baatcheet aur naye contacts banane ke liye shubh din hai. Vyapar me labh ki sambhavna hai. Apni sehat par dhyan dein.",
    loveScore: 78,
    careerScore: 88,
    healthScore: 80,
    luckyColor: "Hara (Green)",
    luckyNumber: 5,
    luckyTime: "09:00 AM - 10:30 AM",
    dailyRemedy: "Gau mata ko hari ghaas ya palak khilayein.",
  },
  {
    id: "cancer",
    nameHindi: "कर्क",
    nameEnglish: "Cancer",
    symbol: "♋",
    dates: "Jun 21 - Jul 22",
    element: "Jal (Water)",
    ruler: "Chandra (Moon)",
    colorScheme: "from-sky-500 to-blue-600",
    prediction: "Bhaavuk roop se din mahatvapurna rahega. Mata-pita ka aashirwad lein. Purani yaadein taaza hongi. Karyakshetra me dhairya rakhein.",
    loveScore: 95,
    careerScore: 75,
    healthScore: 84,
    luckyColor: "Chandi / Moti (Silver)",
    luckyNumber: 2,
    luckyTime: "06:30 PM - 08:00 PM",
    dailyRemedy: "Shiv ji par kacha doodh arpit karein.",
  },
  {
    id: "leo",
    nameHindi: "सिंह",
    nameEnglish: "Leo",
    symbol: "♌",
    dates: "Jul 23 - Aug 22",
    element: "Agni (Fire)",
    ruler: "Surya (Sun)",
    colorScheme: "from-yellow-500 to-amber-600",
    prediction: "Netritva kshamta chamkegi. Ussadhikariyo se prashansa milegi. Samaj me maan-samman me vriddhi hogi. Ahenkar se bachein.",
    loveScore: 82,
    careerScore: 96,
    healthScore: 91,
    luckyColor: "Sunhera (Gold)",
    luckyNumber: 1,
    luckyTime: "07:00 AM - 08:30 AM",
    dailyRemedy: "Gayatri Mantra ka 108 baar jaap karein.",
  },
  {
    id: "virgo",
    nameHindi: "कन्या",
    nameEnglish: "Virgo",
    symbol: "♍",
    dates: "Aug 23 - Sep 22",
    element: "Prithvi (Earth)",
    ruler: "Budh (Mercury)",
    colorScheme: "from-emerald-600 to-green-700",
    prediction: "Naye vishleshanaatmak kaam me safalta milegi. Kharcho par nigaah rakhein. Padhai ya research me safalta ke aasaar hain.",
    loveScore: 88,
    careerScore: 89,
    healthScore: 79,
    luckyColor: "Panna Hara (Emerald)",
    luckyNumber: 7,
    luckyTime: "11:30 AM - 01:00 PM",
    dailyRemedy: "Ganpati ji ko durva arpit karein.",
  },
  {
    id: "libra",
    nameHindi: "तुला",
    nameEnglish: "Libra",
    symbol: "♎",
    dates: "Sep 23 - Oct 22",
    element: "Vayu (Air)",
    ruler: "Shukra (Venus)",
    colorScheme: "from-pink-500 to-rose-600",
    prediction: "Santulan aur samanjasya bana rahega. Naye partnership ya agreement ke liye din anukool hai. Prem sambandho me madhurta aayegi.",
    loveScore: 94,
    careerScore: 86,
    healthScore: 85,
    luckyColor: "Gulaabi (Pink)",
    luckyNumber: 6,
    luckyTime: "04:00 PM - 05:30 PM",
    dailyRemedy: "Sugandhit dhoop ya itra ka prayog karein.",
  },
  {
    id: "scorpio",
    nameHindi: "वृश्चिक",
    nameEnglish: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 - Nov 21",
    element: "Jal (Water)",
    ruler: "Mangal (Mars)",
    colorScheme: "from-purple-600 to-indigo-700",
    prediction: "Guhya gyan aur shodhkari kamo me ruchi badhegi. Shatru parast honge. Apni gupt yojanao ko kisi ke sath share na karein.",
    loveScore: 80,
    careerScore: 92,
    healthScore: 82,
    luckyColor: "Maroon / Deep Red",
    luckyNumber: 9,
    luckyTime: "01:00 PM - 02:30 PM",
    dailyRemedy: "Hanuman Chalisa ka paath karein.",
  },
  {
    id: "sagittarius",
    nameHindi: "धनु",
    nameEnglish: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 - Dec 21",
    element: "Agni (Fire)",
    ruler: "Brihaspati (Jupiter)",
    colorScheme: "from-amber-500 to-yellow-600",
    prediction: "Dharmik aur adhyatmik gatividhiyo me ruchi rahegi. Lambi yatra ke yog ban sakte hain. Guru aur buzurgon ka aashirwad labhkari hoga.",
    loveScore: 86,
    careerScore: 91,
    healthScore: 87,
    luckyColor: "Peela (Yellow)",
    luckyNumber: 3,
    luckyTime: "10:00 AM - 11:30 AM",
    dailyRemedy: "Vishnu Sahasranama ka shravan karein ya peeli chizo ka daan karein.",
  },
  {
    id: "capricorn",
    nameHindi: "मकर",
    nameEnglish: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 - Jan 19",
    element: "Prithvi (Earth)",
    ruler: "Shani (Saturn)",
    colorScheme: "from-slate-600 to-gray-800",
    prediction: "Kadi mehnat ka fal milne ka samay aa gaya hai. Karyakshetra me prabhav badhega. Ghutno aur jodo ke dard se savdhan rahein.",
    loveScore: 76,
    careerScore: 94,
    healthScore: 77,
    luckyColor: "Neela / Kaala (Navy Blue)",
    luckyNumber: 8,
    luckyTime: "03:00 PM - 04:30 PM",
    dailyRemedy: "Peepal ke ped ke paas sarson ke tel ka deepak jalayein.",
  },
  {
    id: "aquarius",
    nameHindi: "कुंभ",
    nameEnglish: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 - Feb 18",
    element: "Vayu (Air)",
    ruler: "Shani (Saturn)",
    colorScheme: "from-cyan-600 to-blue-700",
    prediction: "Kuch naya aur alag sochne ka din hai. Samajik kamo me maan-samman badhega. Naye dosto se sahyog prapt hoga.",
    loveScore: 84,
    careerScore: 87,
    healthScore: 83,
    luckyColor: "Aasmani (Cyan)",
    luckyNumber: 4,
    luckyTime: "05:00 PM - 06:15 PM",
    dailyRemedy: "Kisi zarooratmand ko kale til ya bhojan daan karein.",
  },
  {
    id: "pisces",
    nameHindi: "मीन",
    nameEnglish: "Pisces",
    symbol: "♓",
    dates: "Feb 19 - Mar 20",
    element: "Jal (Water)",
    ruler: "Brihaspati (Jupiter)",
    colorScheme: "from-teal-500 to-emerald-600",
    prediction: "Kalpana aur rachnatmakta se labh hoga. Man me shanti rahegi. Mandir darshan ya dhyan lagane ke liye atyant shubh din hai.",
    loveScore: 90,
    careerScore: 85,
    healthScore: 89,
    luckyColor: "Kesar Peela (Saffron)",
    luckyNumber: 3,
    luckyTime: "08:00 AM - 09:30 AM",
    dailyRemedy: "Chandan ka tilak lagayein.",
  },
];

export default function DailyRashifalSection() {
  const [selectedRashi, setSelectedRashi] = useState<RashiInfo>(rashisData[0]);

  return (
    <section className="bg-gradient-to-b from-white via-[#FFFDF9] to-[#FFF8F3] p-4 sm:p-5 rounded-3xl border-2 border-amber-300/60 shadow-md shadow-terracotta/5 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 px-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-terracotta/15 to-amber-500/15 text-terracotta text-[10px] font-extrabold uppercase mb-1 border border-peach">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Today’s Vedic Horoscope
          </div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-espresso flex items-center gap-1.5">
            <span>Daily Rashifal & Transit</span>
            <span className="text-xs font-sans font-normal text-terracotta bg-peach/70 px-2 py-0.5 rounded-full">
              Live
            </span>
          </h3>
        </div>
        <Link
          href="/chat"
          className="text-xs font-bold text-terracotta hover:underline flex items-center gap-0.5 group"
        >
          <span>Ask Pandit Ji</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Swipeable Zodiac Strip for Mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2.5 mb-3.5 scrollbar-none -mx-1 px-1">
        {rashisData.map((rashi) => {
          const isSelected = selectedRashi.id === rashi.id;
          return (
            <button
              key={rashi.id}
              onClick={() => setSelectedRashi(rashi)}
              className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-2xl border-2 transition-all text-center min-w-[68px] active:scale-95 ${
                isSelected
                  ? "bg-gradient-to-b from-terracotta to-[#9E3920] text-white border-amber-400 shadow-lg shadow-terracotta/30 scale-105 ring-2 ring-terracotta/30"
                  : "bg-white/90 border-peach/80 text-espresso hover:border-amber-400 hover:bg-peach/30 shadow-xs"
              }`}
            >
              <span className="text-2xl leading-none mb-1 filter drop-shadow-xs">{rashi.symbol}</span>
              <span className="font-bold text-xs leading-tight">{rashi.nameHindi}</span>
              <span className={`text-[9px] uppercase tracking-wider font-semibold ${isSelected ? "text-amber-200" : "text-espresso/60"}`}>
                {rashi.nameEnglish}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Rashi Detail Card */}
      <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FFF3EB] rounded-2xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm relative overflow-hidden">
        {/* Top: Symbol, Name & Element */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-peach/70">
          <div className="flex items-center gap-3">
            <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${selectedRashi.colorScheme} text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-terracotta/20 flex-shrink-0 border-2 border-white/60`}>
              {selectedRashi.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base sm:text-lg text-espresso">
                  {selectedRashi.nameHindi} ({selectedRashi.nameEnglish})
                </h4>
                <span className="text-[10px] bg-peach border border-peach text-espresso font-extrabold px-2 py-0.5 rounded-full">
                  {selectedRashi.element}
                </span>
              </div>
              <p className="text-[11px] text-espresso/70 mt-0.5 font-medium">
                Swami Grah: <strong className="text-terracotta">{selectedRashi.ruler}</strong> • {selectedRashi.dates}
              </p>
            </div>
          </div>

          <Link
            href="/chat"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-terracotta/20 transition-all flex-shrink-0 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat</span>
          </Link>
        </div>

        {/* Prediction Quote */}
        <div className="my-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Aaj Ka Bhavishyafal (Prediction):</span>
          </div>
          <p className="text-xs sm:text-sm text-espresso leading-relaxed bg-white/95 p-3.5 rounded-xl border border-peach shadow-xs italic font-serif">
            "{selectedRashi.prediction}"
          </p>
        </div>

        {/* Scores: Love, Career, Health */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/95 p-2.5 rounded-xl border border-peach shadow-xs">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                Love
              </span>
              <span className="font-extrabold text-espresso">{selectedRashi.loveScore}%</span>
            </div>
            <div className="w-full bg-peach/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedRashi.loveScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white/95 p-2.5 rounded-xl border border-peach shadow-xs">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-amber-600" />
                Career
              </span>
              <span className="font-extrabold text-espresso">{selectedRashi.careerScore}%</span>
            </div>
            <div className="w-full bg-peach/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedRashi.careerScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white/95 p-2.5 rounded-xl border border-peach shadow-xs">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-600" />
                Health
              </span>
              <span className="font-extrabold text-espresso">{selectedRashi.healthScore}%</span>
            </div>
            <div className="w-full bg-peach/40 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedRashi.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lucky info */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-peach/80 text-[11px] text-espresso/85 font-medium">
          <div>
            <span className="font-bold text-espresso">🎨 Lucky Color:</span> {selectedRashi.luckyColor}
          </div>
          <div>
            <span className="font-bold text-espresso">🔢 Lucky No:</span> {selectedRashi.luckyNumber}
          </div>
          <div>
            <span className="font-bold text-espresso">⏰ Shubh Time:</span> {selectedRashi.luckyTime}
          </div>
        </div>

        {/* Upay Scroll Box */}
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-100/70 via-orange-50 to-amber-50 border-2 border-amber-300/80 flex items-start gap-2.5 text-xs text-espresso shadow-xs">
          <Sparkles className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-terracotta font-bold">Pandit Ji Ka Aaj Ka Upay:</strong>{" "}
            {selectedRashi.dailyRemedy}
          </div>
        </div>
      </div>
    </section>
  );
}