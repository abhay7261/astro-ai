"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Send, Trash2, ArrowLeft, Bot, Sun, 
  Heart, Briefcase, Coins, ShieldAlert, Copy, Check, MessageCircle, ChevronRight,
  Star, CheckCircle2, RefreshCw, Info, X, SlidersHorizontal, Award, Globe, Flame
} from "lucide-react";
import MobileAppLayout from "../components/mobile/MobileAppLayout";
import { AuthUser } from "../components/mobile/AuthScreen";
import { ChatMessage, sendAIAstrologerMessage } from "../services/aiChatService";
import { astrologersApi } from "../services/apiClient";

export interface AstrologerPersona {
  id: string;
  name: string;
  shortName: string;
  title: string;
  category: "all" | "love" | "career" | "wealth" | "dosha";
  experience: string;
  rating: number;
  consultations: string;
  image: string;
  specialty: string;
  badge: string;
  languages: string[];
  bio: string;
  welcomeGreeting: string;
  mantra: string;
  remedy: string;
  chips: string[];
}

export const defaultAstrologers: AstrologerPersona[] = [
  {
    id: "1",
    name: "Acharya Vidyadhar Shastri",
    shortName: "Acharya Ji",
    title: "Chief Vedic Pandit & Kundli Expert",
    category: "all",
    experience: "18+ Yrs Exp",
    rating: 4.95,
    consultations: "34.5K+",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    specialty: "Lagna Dosha, Graha Shanti & Kundli",
    badge: "Vedic Chief",
    languages: ["Hindi", "Sanskrit", "English"],
    bio: "Gold Medalist Jyotish Acharya with 18+ years of authentic Vedic Parashari practice. Expert in Janam Kundli decoding and accurate planetary transit analysis.",
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
    id: "2",
    name: "Dr. Ananya Mukherjee",
    shortName: "Dr. Ananya",
    title: "Love & Marriage Compatibility Guru",
    category: "love",
    experience: "12+ Yrs Exp",
    rating: 4.92,
    consultations: "28.1K+",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    specialty: "Kundli Milan, Vivah Yog & Relationship",
    badge: "Love & Vivah",
    languages: ["Hindi", "English", "Bengali"],
    bio: "PhD in Astrological Psychology and Synastry. Specializes in solving delay in marriage, soulmate compatibility, and relationship healing through Vedic remedies.",
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
    id: "3",
    name: "Pandit Radheshyam Joshi",
    shortName: "Pt. Radhey",
    title: "Career & Business Astrology Specialist",
    category: "career",
    experience: "15+ Yrs Exp",
    rating: 4.88,
    consultations: "22.4K+",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialty: "Job Timing, Wealth & Dhan Yog",
    badge: "Career & Dhan",
    languages: ["Hindi", "Gujarati"],
    bio: "Senior corporate astrology consultant. Guides entrepreneurs and professionals on job switches, promotion timing, financial stability, and business growth.",
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
    id: "4",
    name: "Maa Gayatri Devi",
    shortName: "Maa Gayatri",
    title: "Karmic Healer & Sade Sati Specialist",
    category: "dosha",
    experience: "21+ Yrs Exp",
    rating: 4.98,
    consultations: "45.2K+",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    specialty: "Shani Sade Sati, Rahu-Ketu & Dosha",
    badge: "Shani & Dosha",
    languages: ["Hindi", "English"],
    bio: "Spiritual Sadhika and Prashna Kundli expert. Over two decades of experience neutralizing harsh planetary periods like Shani Sade Sati, Rahu Mahadasha, and Pitra Dosha.",
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
    id: "5",
    name: "Guruji Devendra Nath",
    shortName: "Guruji Dev",
    title: "Vastu Shastra & Gemstone Expert",
    category: "wealth",
    experience: "14+ Yrs Exp",
    rating: 4.89,
    consultations: "18.7K+",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialty: "Home Vastu, Ratna Salah & Swasthya",
    badge: "Vastu & Gems",
    languages: ["Hindi", "Marathi"],
    bio: "Certified Gemological Astrologer and Vastu Vidya Acharya. Advises auspicious gemstones and remedies to channelize positive energy at home and workplace.",
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
    id: "6",
    name: "Acharya Priyadarshini",
    shortName: "Priyadarshini",
    title: "Relationship & Tarot Astrologer",
    category: "love",
    experience: "10+ Yrs Exp",
    rating: 4.85,
    consultations: "15.3K+",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialty: "Relationship Healing & Intuitive Tarot",
    badge: "Tarot & Healing",
    languages: ["Hindi", "English"],
    bio: "Intuitive Tarot Reader and Vedic Counselor specializing in emotional healing, overcoming breakups, and uncovering hidden romantic opportunities.",
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
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [inspectedAstro, setInspectedAstro] = useState<AstrologerPersona | null>(null);
  const [backendStatus, setBackendStatus] = useState<"connected" | "connecting" | "offline">("connecting");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch live astrologers directly from the backend API & MongoDB Atlas
  useEffect(() => {
    try {
      const saved = localStorage.getItem("astroai_auth_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn("Storage error", e);
    }

    const loadBackendAstrologers = async () => {
      try {
        const live = await astrologersApi.getAll();
        if (Array.isArray(live) && live.length > 0) {
          setBackendStatus("connected");

          // Map backend records to rich personas
          const mapped: AstrologerPersona[] = live.map((a: any, idx: number) => {
            // Find existing matching preset or build rich persona
            const matchedDefault = defaultAstrologers.find(
              (d) => d.id === String(a.id || a.astrologerId) || d.name.toLowerCase() === a.name.toLowerCase()
            );

            return {
              id: String(a.id || a.astrologerId || `astro-${idx}`),
              name: a.name,
              shortName: matchedDefault?.shortName || a.name.split(" ")[0] || a.name,
              title: a.title || matchedDefault?.title || "Vedic Astrologer",
              category: (a.category?.toLowerCase() || matchedDefault?.category || "all") as any,
              experience: a.experience || matchedDefault?.experience || "10+ Yrs Exp",
              rating: a.rating || matchedDefault?.rating || 4.9,
              consultations: a.totalConsultations || matchedDefault?.consultations || "10K+",
              image: a.image || matchedDefault?.image || defaultAstrologers[0].image,
              specialty: a.specialty || matchedDefault?.specialty || "Vedic Guidance & Upay",
              badge: a.category || matchedDefault?.badge || "Vedic Expert",
              languages: a.languages && a.languages.length > 0 ? a.languages : (matchedDefault?.languages || ["Hindi", "English"]),
              bio: matchedDefault?.bio || `${a.name} is an experienced Vedic Jyotish consultant providing guidance on life, career, and marriage.`,
              welcomeGreeting: matchedDefault?.welcomeGreeting || `Pranam! 🙏 Main hoon ${a.name}.\n\nAapki kundli aur grah-gochar ke vishleshan se aapke sabhi sawalon ka margdarshan karne ke liye upasthit hoon. Apna sawal poochein!`,
              mantra: matchedDefault?.mantra || "ॐ नमः शिवाय",
              remedy: matchedDefault?.remedy || "Pratidin subah Surya Dev ko arghya dein aur shubh sankalp karein.",
              chips: matchedDefault?.chips || [
                "🔮 Mera aane wala samay kaisa rahega?",
                "💼 Karyasthal par unnati ke yog kab hain?",
                "💍 Vivah aur jeevansathi se judi baatein"
              ]
            };
          });

          setAstrologers(mapped);
          // Keep current selected or default to first
          setSelectedAstrologer((prev) => {
            const found = mapped.find(m => m.id === prev.id || m.name === prev.name);
            return found || mapped[0];
          });
          return;
        }
      } catch (err) {
        console.warn("Backend API error or waking up:", err);
        setBackendStatus("offline");
      }
    };

    loadBackendAstrologers();
    window.addEventListener("astroai_astrologers_updated", loadBackendAstrologers);
    return () => window.removeEventListener("astroai_astrologers_updated", loadBackendAstrologers);
  }, []);

  // 2. Initialize or update welcome greeting when astrologer changes
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

    // Align topic category with astrologer's specialty
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
    setShowCatalogModal(false);
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
      title={`${selectedAstrologer.shortName} (Vedic AI)`}
    >
      <div className="flex flex-col h-[calc(100dvh-150px)] max-w-xl mx-auto -my-2 relative">
        
        {/* ======================================================== */}
        {/* 1. VEDIC ASTROLOGER "STORIES" CAROUSEL (Top Ribbon)      */}
        {/* ======================================================== */}
        <div className="flex-shrink-0 pt-0.5 pb-2 border-b border-peach/50 mb-2">
          
          {/* Subtle Ribbon Header */}
          <div className="flex items-center justify-between px-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-espresso/90 font-serif">
                Select Astrologer
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300/80">
                Live Backend
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="text-[10px] font-bold text-terracotta hover:text-amber-700 flex items-center gap-0.5 active:scale-95 transition-transform"
            >
              <span>Explore All ({astrologers.length})</span>
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          {/* Glowing Circular Story Avatars Carousel */}
          <div 
            ref={storiesContainerRef}
            className="flex items-center gap-3 overflow-x-auto px-2 py-1 scrollbar-none scroll-smooth"
          >
            {astrologers.map((astro) => {
              const isSelected = selectedAstrologer.id === astro.id;

              return (
                <button
                  key={astro.id}
                  type="button"
                  onClick={() => handleSelectAstrologer(astro)}
                  className="flex flex-col items-center flex-shrink-0 group focus:outline-none transition-transform active:scale-95"
                >
                  {/* Glowing Story Ring */}
                  <div className={`relative rounded-full transition-all duration-300 ${
                    isSelected
                      ? "p-[3px] bg-gradient-to-tr from-amber-500 via-orange-500 to-terracotta ring-2 ring-terracotta/40 scale-105 shadow-md shadow-terracotta/25"
                      : "p-[2px] bg-gradient-to-tr from-amber-300 via-peach to-orange-200 group-hover:from-amber-400 group-hover:to-terracotta opacity-85 group-hover:opacity-100"
                  }`}>
                    {/* Portrait Avatar */}
                    <div className="w-13 h-13 rounded-full overflow-hidden bg-espresso border-2 border-white relative shadow-xs">
                      <Image
                        src={astro.image}
                        alt={astro.name}
                        width={52}
                        height={52}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Online Dot */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse" />

                    {/* Checkmark Badge on Active */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-terracotta text-white flex items-center justify-center border-2 border-white shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Astrologer Short Name */}
                  <span className={`text-[11px] font-bold mt-1 text-center truncate max-w-[68px] ${
                    isSelected ? "text-terracotta font-extrabold" : "text-espresso/80"
                  }`}>
                    {astro.shortName}
                  </span>

                  {/* Micro Domain Pill */}
                  <span className={`text-[9px] px-1.5 py-0.1 rounded-full font-bold truncate max-w-[68px] ${
                    isSelected 
                      ? "bg-terracotta text-white" 
                      : "bg-peach/60 text-espresso/70"
                  }`}>
                    {astro.badge}
                  </span>
                </button>
              );
            })}

            {/* Quick Catalog Opener Card in Carousel */}
            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none transition-transform active:scale-95"
            >
              <div className="w-13 h-13 rounded-full border-2 border-dashed border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shadow-xs group-hover:border-terracotta group-hover:bg-amber-100/60 transition-colors">
                <Sparkles className="w-5 h-5 text-terracotta fill-amber-300" />
              </div>
              <span className="text-[11px] font-bold mt-1 text-terracotta text-center truncate max-w-[68px]">
                View All
              </span>
              <span className="text-[9px] px-1.5 py-0.1 rounded-full font-bold bg-amber-100 text-amber-800">
                Directory
              </span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. COMPACT ACTIVE ASTROLOGER GLASS CARD                  */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-amber-500/10 via-terracotta/10 to-orange-500/10 backdrop-blur-xs p-2 sm:p-2.5 rounded-2xl border border-amber-300/80 flex items-center justify-between gap-2 mb-2 shadow-xs flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-terracotta shadow-xs flex-shrink-0">
              <Image
                src={selectedAstrologer.image}
                alt={selectedAstrologer.name}
                width={36}
                height={36}
                unoptimized
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-xs sm:text-sm text-espresso truncate">
                  {selectedAstrologer.name}
                </h2>
                <CheckCircle2 className="w-3 h-3 text-sky-500 fill-sky-500 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-espresso/70 truncate">
                <span className="text-terracotta font-semibold truncate">{selectedAstrologer.specialty}</span>
                <span>•</span>
                <span className="font-medium">{selectedAstrologer.experience}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setInspectedAstro(selectedAstrologer)}
              className="text-[10px] font-bold text-espresso/70 hover:text-terracotta bg-white/90 border border-peach px-2 py-1 rounded-xl shadow-xs active:scale-95 flex items-center gap-1"
              title="View Profile Bio & Upay"
            >
              <Info className="w-3 h-3 text-terracotta" />
              <span className="hidden sm:inline">Bio</span>
            </button>

            <button
              onClick={handleClearChat}
              className="text-[10px] font-bold text-espresso/60 hover:text-rose-600 bg-white/90 border border-peach px-2 py-1 rounded-xl shadow-xs active:scale-95 flex items-center gap-1"
              title="Reset Chat"
            >
              <RefreshCw className="w-3 h-3 text-espresso/60" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. TOPIC CATEGORY FILTER PILLS                           */}
        {/* ======================================================== */}
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

        {/* ======================================================== */}
        {/* 4. CHAT MESSAGES STREAM                                  */}
        {/* ======================================================== */}
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

                  {/* Pandit Ji Upay & Mantra Box */}
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

        {/* ======================================================== */}
        {/* 5. QUICK SUGGESTION CHIPS                                */}
        {/* ======================================================== */}
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

        {/* ======================================================== */}
        {/* 6. BOTTOM INPUT BAR                                      */}
        {/* ======================================================== */}
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
            placeholder={`Ask ${selectedAstrologer.shortName} (e.g. Shaadi kab hogi?)...`}
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

        {/* ======================================================== */}
        {/* 7. ALL ASTROLOGERS CATALOG MODAL (Bottom Sheet / Drawer) */}
        {/* ======================================================== */}
        {showCatalogModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-[#FFFDF9] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-amber-300 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-peach/80 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-terracotta text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-espresso">
                      Choose Your Vedic Astrologer
                    </h3>
                    <p className="text-[11px] text-espresso/70">
                      Select an Acharya based on your question or life situation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="w-8 h-8 rounded-full bg-white border border-peach text-espresso/70 hover:text-espresso flex items-center justify-center active:scale-90 shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Astrologers Card Deck */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin">
                {astrologers.map((astro) => {
                  const isSelected = selectedAstrologer.id === astro.id;

                  return (
                    <div
                      key={astro.id}
                      onClick={() => handleSelectAstrologer(astro)}
                      className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all duration-200 relative flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-white border-terracotta shadow-md shadow-terracotta/20 ring-1 ring-terracotta/40"
                          : "bg-white border-amber-200/80 hover:border-amber-400 hover:bg-amber-50/40 shadow-xs"
                      }`}
                    >
                      {/* Avatar with Halo Ring */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-sm ${
                          isSelected ? "border-terracotta ring-2 ring-amber-400" : "border-amber-300"
                        }`}>
                          <Image
                            src={astro.image}
                            alt={astro.name}
                            width={64}
                            height={64}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                      </div>

                      {/* Info Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="font-serif font-bold text-espresso text-sm truncate">
                              {astro.name}
                            </h4>
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 flex-shrink-0" />
                          </div>
                          
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isSelected ? "bg-terracotta text-white" : "bg-amber-100 text-amber-900 border border-amber-300/80"
                          }`}>
                            {astro.badge}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-terracotta line-clamp-1 mt-0.5">
                          {astro.specialty}
                        </p>

                        <p className="text-[11px] text-espresso/70 line-clamp-2 mt-1 leading-snug">
                          {astro.bio}
                        </p>

                        {/* Rating, Consultations & Select Button Row */}
                        <div className="mt-2.5 pt-2 border-t border-peach/60 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-[10px] text-espresso/70 font-medium">
                            <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {astro.rating}
                            </span>
                            <span>•</span>
                            <span>{astro.experience}</span>
                            <span>•</span>
                            <span>{astro.consultations}</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAstrologer(astro);
                            }}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1 ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "bg-gradient-to-r from-terracotta to-amber-600 text-white hover:opacity-95"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <span>Select</span>
                                <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 8. SINGLE ASTROLOGER BIO DETAIL POPUP                    */}
        {/* ======================================================== */}
        {inspectedAstro && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#FFFDF9] w-full max-w-sm rounded-3xl border-2 border-amber-300 p-5 shadow-2xl relative animate-in zoom-in-95 duration-200 text-espresso">
              
              <button
                type="button"
                onClick={() => setInspectedAstro(null)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white border border-peach text-espresso/70 hover:text-espresso flex items-center justify-center active:scale-90"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="text-center">
                <div className="relative w-20 h-20 rounded-full mx-auto p-1 bg-gradient-to-tr from-amber-500 via-orange-500 to-terracotta shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                    <Image
                      src={inspectedAstro.image}
                      alt={inspectedAstro.name}
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-espresso mt-2.5">
                  {inspectedAstro.name}
                </h3>
                <p className="text-xs font-semibold text-terracotta">
                  {inspectedAstro.title}
                </p>

                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-espresso/70">
                  <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {inspectedAstro.rating}
                  </span>
                  <span>•</span>
                  <span>{inspectedAstro.experience}</span>
                  <span>•</span>
                  <span>{inspectedAstro.consultations}</span>
                </div>
              </div>

              <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs leading-relaxed text-espresso/80">
                {inspectedAstro.bio}
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-espresso/70">
                <Globe className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
                <span className="font-semibold text-espresso">Languages:</span>
                <span>{inspectedAstro.languages.join(", ")}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-peach flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectAstrologer(inspectedAstro);
                    setInspectedAstro(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-terracotta to-amber-600 text-white font-bold text-xs shadow-md shadow-terracotta/25 active:scale-95"
                >
                  Consult with {inspectedAstro.shortName}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </MobileAppLayout>
  );
}
