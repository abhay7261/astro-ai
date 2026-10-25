"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, Send, Trash2, ArrowLeft, Bot, Sun, 
  Search, CheckCheck, Star, CheckCircle2, RefreshCw, 
  Info, X, Globe, SlidersHorizontal, MoreVertical, Check
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
  defaultLastSnippet: string;
  defaultTime: string;
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
    defaultLastSnippet: "Kundli dosha, graha shanti aur aane wale samay ka Vedic aakalan...",
    defaultTime: "14:05",
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
    defaultLastSnippet: "Vivah yog aur partner compatibility par satik paramarsh...",
    defaultTime: "13:59",
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
    defaultLastSnippet: "Nayi naukri, promotion aur business me dhan vriddhi ke yog...",
    defaultTime: "12:35",
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
    defaultLastSnippet: "Shani Sade Sati, Rahu-Ketu dasha aur Manglik dosha shanti...",
    defaultTime: "11:46",
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
    defaultLastSnippet: "Ghar ka Vastu dosha aur kundli anusaar shubh Ratna (Gemstone)...",
    defaultTime: "10:15",
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
    defaultLastSnippet: "Tarot guidance aur emotional relationship healing paramarsh...",
    defaultTime: "Yesterday",
    chips: [
      "❤️ Kya mera partner sachcha hai?",
      "🔮 Tarot cards aane wale 3 mahino ke bare me kya kehte hain?",
      "✨ Mann me chal rahi uljhan aur anxiety se kaise bachein?",
      "🕊️ Rishte me purani galatfehmiyon ko kaise dur karein?"
    ]
  }
];

const topicCategories = [
  { id: "all", label: "All" },
  { id: "love", label: "Love & Vivah" },
  { id: "career", label: "Career & Job" },
  { id: "wealth", label: "Dhan & Wealth" },
  { id: "dosha", label: "Shani & Dosha" },
];

export default function AIChatPage() {
  const [astrologers, setAstrologers] = useState<AstrologerPersona[]>(defaultAstrologers);
  const [selectedAstrologer, setSelectedAstrologer] = useState<AstrologerPersona>(defaultAstrologers[0]);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeView, setActiveView] = useState<"list" | "chat">("list");
  const [inspectedAstro, setInspectedAstro] = useState<AstrologerPersona | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch live astrologers directly from Backend API & MongoDB Atlas
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
          const mapped: AstrologerPersona[] = live.map((a: any, idx: number) => {
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
              defaultLastSnippet: matchedDefault?.defaultLastSnippet || "Vedic kundli aur grah gochar aakalan...",
              defaultTime: matchedDefault?.defaultTime || "Just now",
              chips: matchedDefault?.chips || [
                "🔮 Mera aane wala samay kaisa rahega?",
                "💼 Karyasthal par unnati ke yog kab hain?",
                "💍 Vivah aur jeevansathi se judi baatein"
              ]
            };
          });

          setAstrologers(mapped);
          setSelectedAstrologer((prev) => {
            const found = mapped.find(m => m.id === prev.id || m.name === prev.name);
            return found || mapped[0];
          });
        }
      } catch (err) {
        console.warn("Backend API error or waking up:", err);
      }
    };

    loadBackendAstrologers();
    window.addEventListener("astroai_astrologers_updated", loadBackendAstrologers);
    return () => window.removeEventListener("astroai_astrologers_updated", loadBackendAstrologers);
  }, []);

  // 2. Initialize chat histories for all astrologers
  useEffect(() => {
    setChatHistories((prev) => {
      const updated = { ...prev };
      astrologers.forEach((astro) => {
        if (!updated[astro.id] || updated[astro.id].length === 0) {
          updated[astro.id] = [
            {
              id: `welcome-${astro.id}`,
              sender: "ai",
              text: astro.welcomeGreeting,
              remedy: astro.remedy,
              mantra: astro.mantra,
              timestamp: "Just now",
            }
          ];
        }
      });
      return updated;
    });
  }, [astrologers]);

  // Current active chat messages
  const activeMessages = chatHistories[selectedAstrologer.id] || [
    {
      id: `welcome-${selectedAstrologer.id}`,
      sender: "ai",
      text: selectedAstrologer.welcomeGreeting,
      remedy: selectedAstrologer.remedy,
      mantra: selectedAstrologer.mantra,
      timestamp: "Just now",
    }
  ];

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, isTyping, activeView]);

  const handleSelectAstrologer = (astro: AstrologerPersona) => {
    setSelectedAstrologer(astro);
    setActiveView("chat");
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

    const astroId = selectedAstrologer.id;

    // Update active chat history
    setChatHistories((prev) => ({
      ...prev,
      [astroId]: [...(prev[astroId] || []), userMsg],
    }));

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

      setChatHistories((prev) => ({
        ...prev,
        [astroId]: [...(prev[astroId] || []), aiMsg],
      }));
    } catch (err) {
      console.error("AI Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    const astroId = selectedAstrologer.id;
    const freshWelcomeMsg: ChatMessage = {
      id: `welcome-${astroId}-${Date.now()}`,
      sender: "ai",
      text: selectedAstrologer.welcomeGreeting,
      remedy: selectedAstrologer.remedy,
      mantra: selectedAstrologer.mantra,
      timestamp: "Just now",
    };
    setChatHistories((prev) => ({
      ...prev,
      [astroId]: [freshWelcomeMsg],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter astrologers based on search query and category
  const filteredAstrologers = astrologers.filter((astro) => {
    const matchesCategory = activeCategory === "all" || astro.category === activeCategory;
    const matchesSearch = 
      astro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Combine chips: selected astrologer's customized questions
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
      showBack={activeView === "chat"} 
      backTitle="Chats" 
      title={activeView === "chat" ? selectedAstrologer.name : "WhatsApp Chats"}
    >
      <div className="h-[calc(100dvh-130px)] max-w-5xl mx-auto flex flex-row -my-2 relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-300/80 shadow-xl bg-white">
        
        {/* ======================================================== */}
        {/* 1. WHATSAPP CHAT LIST PANE (Like 2nd Picture)            */}
        {/* ======================================================== */}
        <aside 
          className={`flex-col h-full bg-[#FAF9F5] border-r border-amber-200/80 transition-all duration-300 ${
            activeView === "list" ? "flex w-full md:w-88 lg:w-96" : "hidden md:flex md:w-88 lg:w-96"
          }`}
        >
          {/* WhatsApp Style Top Header Bar */}
          <div className="p-3.5 bg-gradient-to-r from-[#2A2B2A] to-[#1F201F] text-white flex items-center justify-between shadow-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg tracking-tight text-white">
                AstroAI WhatsApp
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-3 text-white/80">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold px-2 py-0.5 rounded-full">
                {astrologers.length} Online
              </span>
              <button 
                type="button"
                onClick={() => setInspectedAstro(selectedAstrologer)}
                className="hover:text-white"
                title="Astrologer Info"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* WhatsApp Style Search Input */}
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <div className="relative flex items-center bg-white rounded-xl border border-amber-200/90 shadow-2xs px-3 py-2 text-espresso">
              <Search className="w-4 h-4 text-espresso/45 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Astrologer or Search..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder-espresso/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-espresso/50 hover:text-espresso"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* WhatsApp Style Filter Pills (All, Love, Career, Wealth...) */}
          <div className="flex items-center gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-none flex-shrink-0">
            {topicCategories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                    isActive
                      ? "bg-[#1E5E4B] text-white shadow-xs"
                      : "bg-white text-espresso/70 border border-amber-200/80 hover:bg-amber-50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* WhatsApp Chat Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-amber-100/80 scrollbar-thin">
            {filteredAstrologers.map((astro) => {
              const isSelected = selectedAstrologer.id === astro.id;
              const history = chatHistories[astro.id] || [];
              const lastMsg = history[history.length - 1];

              // Display last message snippet like WhatsApp
              const isLastUser = lastMsg?.sender === "user";
              const lastSnippet = lastMsg 
                ? (isLastUser ? `You: ${lastMsg.text}` : lastMsg.text)
                : astro.defaultLastSnippet;
              const lastTime = lastMsg?.timestamp || astro.defaultTime;

              return (
                <div
                  key={astro.id}
                  onClick={() => handleSelectAstrologer(astro)}
                  className={`w-full px-3.5 py-3 flex items-center gap-3 cursor-pointer transition-colors text-left relative ${
                    isSelected
                      ? "bg-amber-100/60 md:bg-amber-100/80"
                      : "hover:bg-amber-50/70 bg-white"
                  }`}
                >
                  {/* WhatsApp Round Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-300/80 bg-neutral-200 shadow-xs">
                      <Image
                        src={astro.image}
                        alt={astro.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Live Online Dot */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  </div>

                  {/* Middle Content: Name + Last Message snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <h3 className="font-sans font-bold text-sm text-espresso truncate">
                          {astro.name}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 flex-shrink-0" />
                      </div>

                      <span className={`text-[11px] whitespace-nowrap font-medium ${
                        isLastUser ? "text-emerald-700 font-bold" : "text-espresso/50"
                      }`}>
                        {lastTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-espresso/65 truncate flex items-center gap-1">
                        {isLastUser && (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{lastSnippet}</span>
                      </p>

                      {/* WhatsApp Green Unread / Rating Badge */}
                      <span className="flex-shrink-0 px-1.5 py-0.2 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E] text-[10px] font-black flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#128C7E]" />
                        {astro.rating}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAstrologers.length === 0 && (
              <div className="p-8 text-center text-espresso/60">
                <p className="text-sm font-semibold">Koi Astrologer nahi mila</p>
                <p className="text-xs text-espresso/45 mt-1">Search term change karein</p>
              </div>
            )}
          </div>

          {/* WhatsApp Bottom Tab Status */}
          <div className="p-2.5 bg-[#FAF7F2] border-t border-amber-200/80 text-center flex items-center justify-between px-4 text-[11px] text-espresso/60 flex-shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>End-to-End Vedic Encrypted</span>
            </span>
            <span className="font-bold text-terracotta">AstroAI WhatsApp</span>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* 2. WHATSAPP CHAT CONVERSATION VIEW (Right Pane)          */}
        {/* ======================================================== */}
        <main 
          className={`flex-1 flex flex-col h-full bg-[#EFEAE2] relative overflow-hidden ${
            activeView === "chat" ? "flex w-full" : "hidden md:flex"
          }`}
        >
          {/* WhatsApp Chat Header Bar */}
          <div className="p-2 sm:p-2.5 bg-[#F0F2F5] border-b border-neutral-300 flex items-center justify-between gap-2 shadow-xs flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {/* Back button (Mobile view to return to WhatsApp chat list) */}
              <button
                type="button"
                onClick={() => setActiveView("list")}
                className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-neutral-200 active:scale-95 text-espresso transition-colors flex items-center gap-0.5"
                title="Back to WhatsApp list"
              >
                <ArrowLeft className="w-5 h-5 text-terracotta" />
              </button>

              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-amber-300/80 shadow-2xs flex-shrink-0">
                <Image
                  src={selectedAstrologer.image}
                  alt={selectedAstrologer.name}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-sans font-bold text-sm text-espresso truncate">
                    {selectedAstrologer.name}
                  </h2>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold truncate leading-tight">
                  online • {selectedAstrologer.specialty}
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setInspectedAstro(selectedAstrologer)}
                className="text-xs font-bold text-espresso/75 hover:text-terracotta bg-white border border-neutral-300 px-2.5 py-1.5 rounded-xl shadow-2xs active:scale-95 flex items-center gap-1"
                title="View Astrologer Bio & Upay"
              >
                <Info className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden sm:inline">Bio</span>
              </button>

              <button
                onClick={handleClearChat}
                className="text-xs font-bold text-espresso/60 hover:text-rose-600 bg-white border border-neutral-300 px-2.5 py-1.5 rounded-xl shadow-2xs active:scale-95 flex items-center gap-1"
                title="Clear Chat History"
              >
                <RefreshCw className="w-3.5 h-3.5 text-espresso/60" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Stream (WhatsApp Wallpaper Background) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-thin bg-[#EFEAE2]">
            {activeMessages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 text-xs sm:text-sm animate-in fade-in duration-200 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Astrologer mini avatar */}
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-300 flex-shrink-0 mt-0.5 shadow-2xs">
                      <Image
                        src={selectedAstrologer.image}
                        alt={selectedAstrologer.name}
                        width={28}
                        height={28}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* WhatsApp Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 shadow-xs relative ${
                      isUser
                        ? "bg-[#E7FFDB] text-[#111B21] rounded-tr-2xs border border-[#C8E6C9]"
                        : "bg-white text-[#111B21] rounded-tl-2xs border border-neutral-200"
                    }`}
                  >
                    {/* Astrologer Name Header */}
                    {!isUser && (
                      <div className="flex items-center gap-1 mb-1 text-[11px] font-sans font-bold text-[#128C7E]">
                        <span>{selectedAstrologer.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-50 text-emerald-800 font-extrabold uppercase">
                          AI Pandit
                        </span>
                      </div>
                    )}

                    {/* Text content with line breaks */}
                    <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                      {msg.text}
                    </div>

                    {/* Pandit Ji Upay & Mantra Box */}
                    {msg.remedy && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#FFF8E7] border border-amber-300/80 text-espresso text-xs shadow-2xs">
                        <div className="flex items-center gap-1 text-terracotta font-extrabold uppercase text-[10px] mb-1">
                          <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
                          <span>Pandit Ji Ka Upay:</span>
                        </div>
                        <p className="leading-relaxed">{msg.remedy}</p>

                        {msg.mantra && (
                          <div className="mt-2 pt-1.5 border-t border-amber-200/80 font-serif font-bold text-terracotta text-[11px]">
                            {msg.mantra}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bubble Footer: Timestamp & Double Tick */}
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-espresso/45">
                      <span>{msg.timestamp}</span>
                      {isUser ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                      ) : (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-terracotta flex items-center gap-0.5 active:scale-90 ml-1"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <span className="text-emerald-600 font-bold">Copied</span>
                          ) : (
                            <span>Copy</span>
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
                <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-300 flex-shrink-0">
                  <Image
                    src={selectedAstrologer.image}
                    alt={selectedAstrologer.name}
                    width={28}
                    height={28}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-2.5 shadow-2xs flex items-center gap-2 text-espresso">
                  <span className="text-xs font-semibold text-emerald-800">
                    {selectedAstrologer.shortName} is typing...
                  </span>
                  <span className="inline-flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-200" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto px-3 py-1.5 bg-[#F0F2F5]/80 scrollbar-none flex-shrink-0">
            {activeChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => handleSend(chip)}
                disabled={isTyping}
                className="flex-shrink-0 text-[11px] font-semibold bg-white hover:bg-neutral-100 border border-neutral-300 text-espresso px-3 py-1 rounded-full shadow-2xs transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* WhatsApp Bottom Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2 sm:p-2.5 bg-[#F0F2F5] border-t border-neutral-300 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              placeholder={`Message ${selectedAstrologer.shortName}...`}
              className="flex-1 bg-white border border-neutral-300 rounded-full px-4 py-2.5 text-xs sm:text-sm text-espresso placeholder-espresso/45 focus:outline-none focus:border-emerald-600 shadow-2xs disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-md shadow-emerald-900/20 flex-shrink-0 transition-transform"
              title="Send Message"
            >
              <Send className="w-4 h-4 translate-x-0.5" />
            </button>
          </form>

        </main>

        {/* ======================================================== */}
        {/* 3. ASTROLOGER BIO POPUP MODAL                            */}
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#128C7E] to-emerald-700 text-white font-bold text-xs shadow-md active:scale-95"
                >
                  Chat with {inspectedAstro.shortName}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </MobileAppLayout>
  );
}
