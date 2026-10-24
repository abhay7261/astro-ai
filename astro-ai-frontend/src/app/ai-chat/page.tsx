"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Send, Trash2, ArrowLeft, Bot, Sun, 
  Heart, Briefcase, Coins, ShieldAlert, Copy, Check, MessageCircle, ChevronRight,
  Star, CheckCircle2, UserCheck, Flame, Compass, RefreshCw
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import { ChatMessage, sendAIAstrologerMessage } from "../services/aiChatService";
import { astrologersApi } from "../services/apiClient";

export interface AstrologerPersona {
  id: string;
  name: string;
  title: string;
  category: "all" | "love" | "career" | "wealth" | "dosha";
  experience: string;
  rating: number;
  consultations: string;
  image: string;
  specialty: string;
  badge: string;
  welcomeGreeting: string;
  mantra: string;
  remedy: string;
  chips: string[];
}

export const defaultAstrologers: AstrologerPersona[] = [
  {
    id: "acharya-vidyadhar",
    name: "Acharya Vidyadhar",
    title: "Chief Vedic Pandit & Kundli Expert",
    category: "all",
    experience: "18+ Yrs Exp",
    rating: 4.95,
    consultations: "34.5K+",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    specialty: "Janam Kundli, Graha Gochar & Dosha",
    badge: "Vedic Chief",
    welcomeGreeting: "Pranam! 🙏 Main hoon Acharya Vidyadhar Shastri.\n\nAapki janam kundli aur grah-nakshatron ke aadhar par main aapko Shaadi, Career, Dhan, ya kisi bhi Dosha ka satik Vedic margdarshan aur Upay de sakta hoon.\n\nApna sawal neeche likhein ya quick topic select karein!",
    remedy: "Pratidin subah mata-pita ka aashirwad lein aur Surya Dev ko arghya dein.",
    mantra: "ॐ श्री गणेशाय नमः",
    chips: [
      "🔮 Mera aane wala samay kaisa rahega?",
      "🪐 Kya meri kundli me Shani Sade Sati ya Manglik dosha hai?",
      "🪔 Shubh Muhurat aur Graha Shanti ke upay",
      "✨ Janam Kundli ke anukool shubh kshetr kaun sa hai?"
    ]
  },
  {
    id: "dr-ananya",
    name: "Dr. Ananya Mukherjee",
    title: "Love & Marriage Compatibility Guru",
    category: "love",
    experience: "12+ Yrs Exp",
    rating: 4.92,
    consultations: "28.1K+",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialty: "Kundli Milan, Vivah Yog & Relationship",
    badge: "Love & Marriage",
    welcomeGreeting: "Namaste! 🌸 Main hoon Dr. Ananya Mukherjee, aapki Love & Marriage Counselor.\n\nAapki love life, partner compatibility, shaadi me deri, ya vivah ke shubh yog ke baare me aap mujhse khul kar consult kar sakte hain.\n\nApna sawal poochein!",
    remedy: "Guruwar ko peele vastra dharan karein aur Radha-Krishna ji ko pushp arpit karein.",
    mantra: "ॐ क्लीं कृष्णाय नमः • ॐ कामदेवाय नमः",
    chips: [
      "💍 Meri shaadi kab tak hogi?",
      "❤️ Mera jeevansathi kaisa hoga aur kab milega?",
      "🕊️ Rishton me prem aur vishwas kaise badhayein?",
      "🌹 Kya meri kundli me Love Marriage ke prabal yog hain?"
    ]
  },
  {
    id: "pt-radheshyam",
    name: "Pt. Radheshyam Joshi",
    title: "Career & Business Astrology Specialist",
    category: "career",
    experience: "15+ Yrs Exp",
    rating: 4.88,
    consultations: "22.4K+",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialty: "Job Timing, Promotion & Dhan Yog",
    badge: "Career & Dhan",
    welcomeGreeting: "Hari Om! 💼 Main hoon Pandit Radheshyam Joshi.\n\nNayi naukri, promotion, business growth ya aarthik sthiti se juda koi bhi sawal ho, Dasham bhaav aur Budhaditya yog ke aadhar par satik margdarshan lein!",
    remedy: "Pratidin suryoday ke samay tambe ke lote se Surya Dev ko arghya dein aur laal chandan lagayein.",
    mantra: "ॐ घृणिः सूर्याय नमः • ॐ श्रीं ह्रीं क्लीं",
    chips: [
      "💼 Nayi job ya promotion kab milega?",
      "🏢 Khud ka naya business shuru karna kaisa rahega?",
      "🪙 Aarthik unnati aur dhan labh kab hoga?",
      "📈 Career me safalta ke satik Vedic upay"
    ]
  },
  {
    id: "maa-gayatri",
    name: "Maa Gayatri Devi",
    title: "Karmic Healer & Sade Sati Specialist",
    category: "dosha",
    experience: "21+ Yrs Exp",
    rating: 4.98,
    consultations: "45.2K+",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    specialty: "Shani Sade Sati, Rahu-Ketu & Dosha",
    badge: "Shani & Dosha",
    welcomeGreeting: "Jai Mata Di! 🔮 Main hoon Maa Gayatri Devi.\n\nShani Sade Sati, Rahu-Ketu dasha, Manglik dosha ya mansik ashaanti se ghabrayein nahi. Vedic granthon ke anusaar satik shanti upay aur mantra lein.",
    remedy: "Shanivaar ki shaam peepal ke ped ke paas sarson ke tel ka deepak jalayein aur Hanuman Chalisa padhein.",
    mantra: "ॐ शं शनैश्चराय नमः • ॐ हं हनुमते नमः",
    chips: [
      "🪐 Shani Sade Sati ka prabhav kab tak rahega?",
      "🧿 Nazar dosha aur Rahu Shanti ke upay",
      "🛡️ Manglik dosha ka saral aur satik nivaran",
      "✨ Kaal Sarp Yog se mukti ke niyam"
    ]
  },
  {
    id: "guruji-devendra",
    name: "Guruji Devendra Nath",
    title: "Vastu Shastra & Gemstone Expert",
    category: "wealth",
    experience: "14+ Yrs Exp",
    rating: 4.89,
    consultations: "18.7K+",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialty: "Ghar Vastu, Lucky Ratna & Health",
    badge: "Vastu & Gems",
    welcomeGreeting: "Pranam! 💎 Main hoon Guruji Devendra Nath.\n\nGhar ya office ka Vastu dosha, kundli ke anukool shubh Ratna (Gemstone), aur swasthya-urja ke Vedic upay ke baare me poochiye.",
    remedy: "Ghar ki Uttar-Purva (Ishan) disha ko swachh rakhein aur Gangajal chhidkein.",
    mantra: "ॐ वास्तुपुरुषाय नमः • ॐ नमः शिवाय",
    chips: [
      "💎 Mere liye kaun sa Ratna (Gemstone) pehanna shubh hai?",
      "🏡 Ghar me sukh-shanti aur Vastu dosh nivaran",
      "🪙 Tijori aur dhan sthan ki sahi disha",
      "🌿 Rog mukti aur sharirik urja ke upay"
    ]
  },
  {
    id: "acharya-priyadarshini",
    name: "Acharya Priyadarshini",
    title: "Relationship & Tarot Astrologer",
    category: "love",
    experience: "10+ Yrs Exp",
    rating: 4.85,
    consultations: "15.3K+",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialty: "Relationship Healing & Intuitive Tarot",
    badge: "Tarot & Healing",
    welcomeGreeting: "Pranam! ✨ Main hoon Acharya Priyadarshini.\n\nTarot cards aur Vedic grah anukulata ke madhyam se aapke rishton, bhavishya ki disha aur dil ke sawalon ka satik margdarshan karein.",
    remedy: "Subah Chandrama ko namaskar karein aur safed vastra ya chandi dharan karein.",
    mantra: "ॐ ऐं सरस्वत्यै नमः",
    chips: [
      "❤️ Kya mera partner sachcha hai?",
      "🔮 Tarot cards aane wale 3 mahino ke bare me kya kehte hain?",
      "✨ Mann me chal rahi uljhan aur anxiety se kaise bachein?",
      "🕊️ Rishte me purani galatfehmiyon ko kaise dur karein?"
    ]
  }
];

const topicCategories = [
  { id: "all", label: "✨ All Topics" },
  { id: "love", label: "❤️ Love & Vivah" },
  { id: "career", label: "💼 Career & Job" },
  { id: "wealth", label: "🪙 Dhan & Wealth" },
  { id: "dosha", label: "🪐 Shani & Dosha" },
];

export default function AIChatPage() {
  const [astrologers, setAstrologers] = useState<AstrologerPersona[]>(defaultAstrologers);
  const [selectedAstrologer, setSelectedAstrologer] = useState<AstrologerPersona>(defaultAstrologers[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const astrologerListRef = useRef<HTMLDivElement>(null);

  // 1. Fetch live astrologers if added in Admin/Backend and merge
  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn("Storage error", e);
    }

    const loadLiveAstrologers = async () => {
      try {
        const live = await astrologersApi.getAll();
        if (Array.isArray(live) && live.length > 0) {
          const formattedLive: AstrologerPersona[] = live.map((a: any, idx: number) => ({
            id: String(a.id || `live-${idx}`),
            name: a.name,
            title: a.title || "Vedic Astrologer",
            category: (a.category?.toLowerCase() || "all") as any,
            experience: a.experience || "10+ Yrs Exp",
            rating: a.rating || 4.9,
            consultations: a.totalConsultations || "10K+",
            image: a.image || defaultAstrologers[0].image,
            specialty: a.specialty || "Vedic Guidance & Upay",
            badge: a.category || "Vedic Expert",
            welcomeGreeting: `Pranam! 🙏 Main hoon ${a.name}.\n\nAapki kundli aur grah-gochar ke vishleshan se aapke sabhi sawalon ka margdarshan karne ke liye upasthit hoon. Apna sawal poochein!`,
            mantra: "ॐ नमः शिवाय",
            remedy: "Pratidin subah Surya Dev ko arghya dein aur shubh sankalp karein.",
            chips: [
              "🔮 Mera aane wala samay kaisa rahega?",
              "💼 Karyasthal par unnati ke yog kab hain?",
              "💍 Vivah aur jeevansathi se judi baatein"
            ]
          }));

          // Avoid duplicates by name
          const existingNames = new Set(formattedLive.map(a => a.name.toLowerCase()));
          const remainingDefaults = defaultAstrologers.filter(d => !existingNames.has(d.name.toLowerCase()));
          setAstrologers([...formattedLive, ...remainingDefaults]);
        }
      } catch (err) {
        console.warn("Could not load backend astrologers, using rich default roster:", err);
      }
    };

    loadLiveAstrologers();
  }, []);

  // 2. Initialize or update welcome message when astrologer changes
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${selectedAstrologer.id}`,
      sender: "ai",
      text: selectedAstrologer.welcomeGreeting,
      remedy: selectedAstrologer.remedy,
      mantra: selectedAstrologer.mantra,
      timestamp: "Just now",
    };
    setMessages([welcomeMsg]);

    // Align topic category with astrologer's specialty if applicable
    if (selectedAstrologer.category && selectedAstrologer.category !== "all") {
      setActiveCategory(selectedAstrologer.category);
    } else {
      setActiveCategory("all");
    }
  }, [selectedAstrologer]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectAstrologer = (astro: AstrologerPersona) => {
    setSelectedAstrologer(astro);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    setIsTyping(true);

    try {
      const aiResponse = await sendAIAstrologerMessage(query, {
        name: user?.name,
        astrologerName: selectedAstrologer.name,
        specialty: selectedAstrologer.specialty,
        title: selectedAstrologer.title,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.text,
        remedy: aiResponse.remedy || selectedAstrologer.remedy,
        mantra: aiResponse.mantra || selectedAstrologer.mantra,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    const freshWelcomeMsg: ChatMessage = {
      id: `welcome-${selectedAstrologer.id}-${Date.now()}`,
      sender: "ai",
      text: selectedAstrologer.welcomeGreeting,
      remedy: selectedAstrologer.remedy,
      mantra: selectedAstrologer.mantra,
      timestamp: "Just now",
    };
    setMessages([freshWelcomeMsg]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Combine chips: selected astrologer's customized questions + active category chips
  const activeChips = Array.from(
    new Set([
      ...(selectedAstrologer.chips || []),
      "🔮 Mera aane wala samay kaisa rahega?",
      "💍 Meri shaadi kab tak hogi?",
      "💼 Nayi job ya promotion kab milega?",
      "🪙 Aarthik sthiti aur dhan labh kab hoga?",
      "🪐 Kya meri kundli me Shani Sade Sati ya Manglik dosha hai?"
    ])
  );

  return (
    <MobileAppLayout 
      showBack 
      backTitle="Home" 
      title={`${selectedAstrologer.name} (AI Consultation)`}
    >
      <div className="flex flex-col h-[calc(100dvh-150px)] max-w-xl mx-auto -my-2 relative">
        
        {/* 1. TOP ASTROLOGER SELECTOR LIST (Interactive Roster) */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex items-center justify-between px-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-espresso">
                Choose Astrologer
              </span>
              <span className="text-[10px] text-espresso/60 font-medium">
                (Tap to consult)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {astrologers.length} Online
            </span>
          </div>

          {/* Horizontally scrollable astrologer cards */}
          <div 
            ref={astrologerListRef}
            className="flex items-stretch gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-none"
          >
            {astrologers.map((astro) => {
              const isSelected = selectedAstrologer.id === astro.id;

              return (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => handleSelectAstrologer(astro)}
                  className={`flex-shrink-0 w-28 sm:w-32 rounded-2xl p-2 text-center transition-all duration-200 relative flex flex-col items-center justify-between border-2 active:scale-95 ${
                    isSelected
                      ? "bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-white border-terracotta shadow-md shadow-terracotta/20 ring-2 ring-terracotta/30 scale-[1.02]"
                      : "bg-white/95 border-amber-200/80 hover:border-amber-400/90 hover:bg-amber-50/40 shadow-xs"
                  }`}
                >
                  {/* Selected checkmark pill */}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1 bg-terracotta text-white rounded-full p-0.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Avatar with ring and online dot */}
                  <div className="relative mb-1.5 mt-0.5">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 shadow-xs transition-transform ${
                      isSelected ? "border-terracotta ring-2 ring-amber-400" : "border-amber-300/80"
                    }`}>
                      <Image
                        src={astro.image}
                        alt={astro.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Live Online Badge */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  </div>

                  {/* Name */}
                  <h3 className={`font-serif font-bold text-[11px] leading-tight line-clamp-1 w-full ${
                    isSelected ? "text-terracotta" : "text-espresso"
                  }`}>
                    {astro.name}
                  </h3>

                  {/* Specialty badge */}
                  <span className={`mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold line-clamp-1 max-w-full ${
                    isSelected 
                      ? "bg-terracotta text-white" 
                      : "bg-amber-100/80 text-espresso/80 border border-amber-300/60"
                  }`}>
                    {astro.badge}
                  </span>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-0.5 mt-1 text-[10px] text-amber-600 font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>{astro.rating}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ACTIVE ASTROLOGER HERO BANNER */}
        <div className="bg-gradient-to-r from-amber-500/15 via-terracotta/15 to-orange-500/10 p-2.5 sm:p-3 rounded-2xl border-2 border-amber-300/70 flex items-center justify-between gap-2.5 mb-2 shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-terracotta shadow-md flex-shrink-0 ring-2 ring-white">
              <Image
                src={selectedAstrologer.image}
                alt={selectedAstrologer.name}
                width={44}
                height={44}
                unoptimized
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-serif font-bold text-sm text-espresso truncate">
                  {selectedAstrologer.name}
                </h2>
                <span className="px-1.5 py-0.2 rounded-full bg-terracotta text-white text-[9px] font-extrabold uppercase whitespace-nowrap">
                  {selectedAstrologer.badge}
                </span>
              </div>
              <p className="text-[10px] text-espresso/80 truncate">
                {selectedAstrologer.specialty} • {selectedAstrologer.experience}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-[11px] font-bold text-espresso/70 hover:text-rose-600 bg-white/90 border border-peach px-2.5 py-1.5 rounded-xl transition-all active:scale-95 shadow-xs whitespace-nowrap flex-shrink-0"
            title="Reset Chat with this Astrologer"
          >
            <RefreshCw className="w-3 h-3 text-terracotta" />
            <span>Reset</span>
          </button>
        </div>

        {/* 3. TOPIC CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1.5 scrollbar-none flex-shrink-0">
          {topicCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                activeCategory === cat.id
                  ? "bg-terracotta text-white shadow-xs"
                  : "bg-white/90 border border-peach text-espresso/70 hover:bg-peach/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 4. MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 text-xs sm:text-sm animate-in fade-in duration-200 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border overflow-hidden ${
                    isUser
                      ? "bg-terracotta text-white border-peach font-bold text-xs"
                      : "border-terracotta shadow-xs ring-1 ring-amber-300"
                  }`}
                >
                  {isUser ? (
                    <span>You</span>
                  ) : (
                    <Image
                      src={selectedAstrologer.image}
                      alt={selectedAstrologer.name}
                      width={32}
                      height={32}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-xs relative ${
                    isUser
                      ? "bg-gradient-to-r from-terracotta to-[#9E3920] text-white rounded-tr-xs"
                      : "bg-white/95 border-2 border-amber-200/90 text-espresso rounded-tl-xs"
                  }`}
                >
                  {/* Astrologer Name Sub-header on AI bubble */}
                  {!isUser && (
                    <div className="flex items-center gap-1 mb-1 text-[10px] font-serif font-bold text-terracotta">
                      <Sparkles className="w-2.5 h-2.5 fill-terracotta text-terracotta" />
                      <span>{selectedAstrologer.name}</span>
                    </div>
                  )}

                  {/* Text content with line breaks */}
                  <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {/* Upay & Mantra Box */}
                  {msg.remedy && (
                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-100/90 to-orange-50 border border-amber-300 text-espresso text-xs shadow-xs">
                      <div className="flex items-center gap-1 text-terracotta font-extrabold uppercase text-[10px] mb-1">
                        <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>Pandit Ji Ka Upay:</span>
                      </div>
                      <p className="leading-relaxed">{msg.remedy}</p>

                      {msg.mantra && (
                        <div className="mt-2 pt-2 border-t border-amber-200/80 font-serif font-bold text-terracotta text-[11px]">
                          {msg.mantra}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bubble Footer: Timestamp & Copy */}
                  <div className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${
                    isUser ? "text-white/70" : "text-espresso/50"
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="hover:text-terracotta flex items-center gap-0.5 active:scale-90 transition-transform"
                        title="Copy Answer"
                      >
                        {copiedId === msg.id ? (
                          <span className="flex items-center gap-0.5 text-emerald-600 font-bold">
                            <Check className="w-2.5 h-2.5" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-2.5 h-2.5" /> Copy
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2 text-xs animate-in fade-in">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-300 flex-shrink-0">
                <Image
                  src={selectedAstrologer.image}
                  alt={selectedAstrologer.name}
                  width={32}
                  height={32}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white/95 border-2 border-amber-200/90 rounded-2xl p-3 shadow-xs flex items-center gap-2 text-espresso">
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span className="text-xs font-semibold text-espresso/80">
                  {selectedAstrologer.name} grah-nakshatra calculate kar rahe hain...
                </span>
                <span className="inline-flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce delay-200" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 5. QUICK SUGGESTION CHIPS (Horizontal Scroll) */}
        <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none flex-shrink-0">
          {activeChips.map((chip, index) => (
            <button
              key={index}
              onClick={() => handleSend(chip)}
              disabled={isTyping}
              className="flex-shrink-0 text-[11px] font-semibold bg-white/95 hover:bg-peach/60 border border-peach text-espresso px-3 py-1.5 rounded-full shadow-xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 6. BOTTOM INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-1 pb-1 flex-shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder={`Ask ${selectedAstrologer.name} (e.g. Shaadi kab hogi?)...`}
            className="flex-1 bg-white border-2 border-amber-300/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-espresso placeholder-espresso/45 focus:outline-none focus:border-terracotta shadow-xs disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-terracotta to-amber-600 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-md shadow-terracotta/25 flex-shrink-0 transition-transform"
            title="Send Question"
          >
            <Send className="w-4 h-4 translate-x-0.5" />
          </button>
        </form>

      </div>
    </MobileAppLayout>
  );
}
