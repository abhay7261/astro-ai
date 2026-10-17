"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, MessageCircle, Share2, ArrowLeft, Volume2, VolumeX, 
  Play, Pause, Sparkles, Send, X, ChevronUp, ChevronDown, 
  Flame, Music2, CheckCircle2, Bookmark
} from "lucide-react";
import AstroChatModal from "../AstroChatModal";

export interface ReelItem {
  id: string;
  title: string;
  description: string;
  astrologerName: string;
  astrologerTitle: string;
  astrologerAvatar: string;
  astrologerSpecialty: string;
  astrologerExp: string;
  themeColor: string;
  bgGradient: string;
  symbol: string;
  mantra: string;
  audioName: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  tags: string[];
  comments: {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timeAgo: string;
    likes: number;
  }[];
}

const reelsList: ReelItem[] = [
  {
    id: "reel-1",
    title: "✨ Shanivaar ko Shani Dev ko prasann karne ka 1 achook upay!",
    description: "Agar Shani ki Sade Sati ya Dhaiya chal rahi hai, toh har Shanivaar suryast ke baad peepal ke ped ke neeche sarson ke tel ka deepak jalayein aur 'Om Sham Shanaishcharaya Namah' ka 11 baar jaap karein.",
    astrologerName: "Acharya Vidyadhar",
    astrologerTitle: "Vedic Jyotish Acharya",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    astrologerSpecialty: "Lagna & Shani Shanti",
    astrologerExp: "18+ Yrs",
    themeColor: "#4B5563",
    bgGradient: "from-[#0F172A] via-[#1E1B4B] to-[#31102A]",
    symbol: "🪐",
    mantra: "ॐ शं शनैश्चराय नमः",
    audioName: "Original Audio • Shani Shanti Vedic Chants",
    likes: 1840,
    commentsCount: 142,
    sharesCount: 380,
    tags: ["#ShaniUpay", "#VedicAstrology", "#SadeSati", "#AstroAI"],
    comments: [
      { id: "1", userName: "Rahul Sharma", userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", text: "Acharya ji, tel kitne baje chadhana sabse shubh hota hai?", timeAgo: "1h ago", likes: 24 },
      { id: "2", userName: "Pooja Mishra", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", text: "Bahut sundar upay pandit ji. Mujhe Sade Sati me bahut shanti mili 🙏", timeAgo: "3h ago", likes: 18 },
      { id: "3", userName: "Aman Gupta", userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80", text: "Kala til bhi daal sakte hain kya deepak me?", timeAgo: "5h ago", likes: 9 },
    ],
  },
  {
    id: "reel-2",
    title: "🌙 Agar Kundli me Chandrama kamzor ho toh turant karein ye upay!",
    description: "Man me bechaini, anxiety ya overthinking rehti hai? Somvaar ko shivling par kacha doodh aur jal arpit karein. Chandi ka chhalla ya kada pehanne se Chandrama bali hota hai.",
    astrologerName: "Dr. Ananya Mukherjee",
    astrologerTitle: "Vedic & Psychological Astrologer",
    astrologerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    astrologerSpecialty: "Chandra Dosha & Mental Peace",
    astrologerExp: "12+ Yrs",
    themeColor: "#38BDF8",
    bgGradient: "from-[#082F49] via-[#0C4A6E] to-[#1E1B4B]",
    symbol: "🌕",
    mantra: "ॐ सों सोमाय नमः",
    audioName: "Divine Flute • Chandra Dhyan Soundscape",
    likes: 3290,
    commentsCount: 268,
    sharesCount: 740,
    tags: ["#MoonSign", "#MentalPeace", "#ShivlingUpay", "#AstroReels"],
    comments: [
      { id: "1", userName: "Sneha Kapur", userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80", text: "Mam meri rashi Kark hai, kya ye daily kar sakti hoon?", timeAgo: "2h ago", likes: 41 },
      { id: "2", userName: "Vikram Chauhan", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80", text: "Very helpful tips! Overthinking sach me kam hui.", timeAgo: "4h ago", likes: 15 },
    ],
  },
  {
    id: "reel-3",
    title: "💰 Ghar ki tijori is disha me rakhein, dhan aana shuru ho jayega!",
    description: "Kuber Dev aur Maa Lakshmi ka vaas Uttar (North) disha me hota hai. Almirah ka mukh hamesha Uttar ki taraf khulna chahiye. Tijori me lal kapde me thoda chandan aur 1 supari zaroor rakhein.",
    astrologerName: "Pandit Radheshyam",
    astrologerTitle: "Vastu & Dhan Yog Specialist",
    astrologerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    astrologerSpecialty: "Dhan Yog & Vastu Shastra",
    astrologerExp: "15+ Yrs",
    themeColor: "#F59E0B",
    bgGradient: "from-[#451A03] via-[#78350F] to-[#1C1917]",
    symbol: "🪙",
    mantra: "ॐ श्रीं ह्रीं क्लीं श्रीं सिद्ध लक्ष्म्यै नमः",
    audioName: "Maha Lakshmi Stotram • Sacred Temple Chimes",
    likes: 4910,
    commentsCount: 410,
    sharesCount: 1120,
    tags: ["#DhanYog", "#VastuTips", "#KuberDishan", "#MoneyAstrology"],
    comments: [
      { id: "1", userName: "Arun Verma", userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80", text: "Pandit ji North East me safe rakh sakte hain kya?", timeAgo: "30m ago", likes: 33 },
      { id: "2", userName: "Divya Shah", userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", text: "Supari kaunsi honi chahiye, puja wali?", timeAgo: "2h ago", likes: 12 },
    ],
  },
  {
    id: "reel-4",
    title: "❤️ Kundli Milan me Nadi Dosha se darna band karein! Sach jaaniye",
    description: "Nadi Dosha sunkar rishta cancel mat kijiye! Agar dono ka Nakshatra Charan alag hai ya Rashi Swami mitra hain, toh Nadi Dosha ka prabhav samapt ho jata hai. Free kundli milan me check karein.",
    astrologerName: "Acharya Vidyadhar",
    astrologerTitle: "Vedic Vivah Consultant",
    astrologerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    astrologerSpecialty: "Vivah Yog & 36 Gunas",
    astrologerExp: "18+ Yrs",
    themeColor: "#E11D48",
    bgGradient: "from-[#4C0519] via-[#831843] to-[#1E1B4B]",
    symbol: "💑",
    mantra: "ॐ क्लीं कृष्णाय नमः",
    audioName: "Vivah Sanskar • Melodious Shenhai & Flute",
    likes: 5620,
    commentsCount: 520,
    sharesCount: 1430,
    tags: ["#KundliMilan", "#NadiDosha", "#LoveMarriage", "#VedicMatching"],
    comments: [
      { id: "1", userName: "Rohan & Riya", userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", text: "Acharya ji hamara rishta isi wajah se atka tha. Thank you clarity ke liye!", timeAgo: "1h ago", likes: 62 },
    ],
  },
  {
    id: "reel-5",
    title: "☀️ Surya Dev ki kripa se banegi Sarkari Naukri aur samman!",
    description: "Kundli me Surya Majboot karne ke liye subah taambe ke lote se arghya dein. Jal me thoda lal chandan, roli aur lal phool milayein. Pita ka aadar karein aur surya kiran me 10 minute baithein.",
    astrologerName: "Dr. Ananya Mukherjee",
    astrologerTitle: "Career & Government Job Astrologer",
    astrologerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    astrologerSpecialty: "Surya Yog & Rajyog",
    astrologerExp: "12+ Yrs",
    themeColor: "#EA580C",
    bgGradient: "from-[#7C2D12] via-[#9A3412] to-[#18181B]",
    symbol: "☀️",
    mantra: "ॐ घृणिः सूर्याय नमः",
    audioName: "Aditya Hridaya Stotra • Golden Dawn Mantra",
    likes: 6780,
    commentsCount: 610,
    sharesCount: 1890,
    tags: ["#SuryaUpay", "#SarkariNaukri", "#Rajyog", "#AstroReels"],
    comments: [
      { id: "1", userName: "Deepak Saini", userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80", text: "Arghya kis samay dena sabse best hota hai?", timeAgo: "45m ago", likes: 29 },
    ],
  },
];

export default function InstagramReelsPlayer() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesState, setLikesState] = useState<Record<string, { liked: boolean; count: number }>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentInput, setNewCommentInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedAstroForChat, setSelectedAstroForChat] = useState<{
    id: string;
    name: string;
    title: string;
    image: string;
    experience: string;
    specialty: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentReel = reelsList[currentIndex];

  // Initialize likes state
  useEffect(() => {
    const initLikes: Record<string, { liked: boolean; count: number }> = {};
    reelsList.forEach((r) => {
      initLikes[r.id] = { liked: false, count: r.likes };
    });
    setLikesState(initLikes);
  }, []);

  // Keyboard navigation (Up/Down arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCommentsDrawer) return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "m") {
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, showCommentsDrawer]);

  const handleNextReel = () => {
    if (currentIndex < reelsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  // Toggle Like with burst animation
  const handleLikeToggle = () => {
    const reelId = currentReel.id;
    const current = likesState[reelId] || { liked: false, count: currentReel.likes };
    const nextLiked = !current.liked;

    setLikesState((prev) => ({
      ...prev,
      [reelId]: {
        liked: nextLiked,
        count: nextLiked ? current.count + 1 : current.count - 1,
      },
    }));

    if (nextLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
  };

  // Double tap to like (Instagram gesture)
  const lastTapRef = useRef<number>(0);
  const handleScreenDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected!
      if (!likesState[currentReel.id]?.liked) {
        handleLikeToggle();
      } else {
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 900);
      }
    } else {
      // Single tap toggle pause/play
      setIsPlaying((prev) => !prev);
    }
    lastTapRef.current = now;
  };

  // Share reel
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentReel.title,
        text: currentReel.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast("✨ Reel link copied to clipboard!");
    }
  };

  const handleSaveToggle = () => {
    setSavedReels((prev) => {
      const isSaved = !prev[currentReel.id];
      showToast(isSaved ? "Saved to your Astro bookmarks ✨" : "Removed from bookmarks");
      return { ...prev, [currentReel.id]: isSaved };
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      userName: "You (Seeker)",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80",
      text: newCommentInput.trim(),
      timeAgo: "Just now",
      likes: 0,
    };
    currentReel.comments.unshift(newComment);
    currentReel.commentsCount += 1;
    setNewCommentInput("");
    showToast("Comment posted successfully ✨");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[80] bg-espresso/90 border border-amber-400/40 text-amber-200 text-xs font-semibold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Reels Viewport: Instagram Phone Ratio Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[100dvh] max-w-md mx-auto sm:max-h-[92dvh] sm:rounded-3xl sm:border sm:border-white/15 overflow-hidden shadow-2xl bg-black flex flex-col justify-between"
      >
        
        {/* Background Visual Layer: Celestial Cosmic Canvas / Animated Aura */}
        <div 
          onClick={handleScreenDoubleTap}
          className={`absolute inset-0 bg-gradient-to-b ${currentReel.bgGradient} cursor-pointer transition-all duration-700`}
        >
          {/* Cosmic Star Dust Particles */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#FFE5D4_1px,transparent_1px)] [background-size:18px_18px] animate-pulse pointer-events-none" />

          {/* Central Animated Astrological Aura Wheel */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-white/10 flex items-center justify-center ${isPlaying ? "animate-spin-slow" : ""}`}>
              {/* Sacred Ring & Concentric Circles */}
              <div className="absolute inset-2 rounded-full border border-amber-300/15" />
              <div className="absolute inset-8 rounded-full border border-dashed border-peach/25" />
              <div className="absolute inset-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-xs flex items-center justify-center">
                <span className="text-6xl sm:text-7xl filter drop-shadow-[0_0_20px_rgba(255,200,100,0.4)]">
                  {currentReel.symbol}
                </span>
              </div>
            </div>
            
            {/* Ambient Cosmic Radial Glow */}
            <div 
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-35"
              style={{ background: currentReel.themeColor }}
            />
          </div>

          {/* Sanskrit Mantra Ribbon */}
          <div className="absolute top-24 left-0 right-0 text-center pointer-events-none">
            <span className="inline-block px-3.5 py-1 rounded-full bg-black/40 border border-white/15 text-amber-200/90 font-serif text-xs tracking-widest backdrop-blur-md shadow-lg">
              {currentReel.mantra}
            </span>
          </div>

          {/* Large Heart Explosion on Double-Tap */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 fade-out duration-700">
              <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.9)] animate-bounce" />
            </div>
          )}

          {/* Big Pause/Play Indicator overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/30 backdrop-blur-[2px]">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Dark bottom gradient overlay for clear caption readability */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        </div>

        {/* 1. TOP HEADER OVERLAY (Instagram style) */}
        <div className="relative z-20 flex items-center justify-between p-4 pt-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          {/* Back Button */}
          <button
            onClick={() => router.push("/home")}
            className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white active:scale-90 hover:bg-black/60 transition-all backdrop-blur-md"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Brand & Live Badge */}
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-base sm:text-lg tracking-wide text-white drop-shadow-md">
              Astro<span className="text-amber-400">Reels</span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[9px] font-black uppercase tracking-wider shadow-sm animate-pulse">
              <Flame className="w-2.5 h-2.5 fill-white" />
              LIVE
            </span>
          </div>

          {/* Sound / Mute Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((prev) => !prev);
              showToast(isMuted ? "Sound Unmuted 🔊" : "Sound Muted 🔇");
            }}
            className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white active:scale-90 hover:bg-black/60 transition-all backdrop-blur-md"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white/70" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>

        {/* 2. PROGRESS BAR AT TOP */}
        <div className="relative z-20 px-3 w-full">
          <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r from-terracotta via-amber-400 to-rose-500 rounded-full ${
                isPlaying ? "animate-progress" : ""
              }`}
              style={{
                width: `${((currentIndex + 1) / reelsList.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Spacer to push controls to bottom */}
        <div className="flex-1" />

        {/* 3. RIGHT-SIDE INSTAGRAM ACTION BAR */}
        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4">
          
          {/* Astrologer Avatar + Connect Plus */}
          <div className="relative group">
            <button
              onClick={() => setSelectedAstroForChat({
                id: currentReel.id,
                name: currentReel.astrologerName,
                title: currentReel.astrologerTitle,
                image: currentReel.astrologerAvatar,
                specialty: currentReel.astrologerSpecialty,
                experience: currentReel.astrologerExp,
              })}
              className="w-12 h-12 rounded-full p-0.5 border-2 border-amber-400 overflow-hidden shadow-lg hover:scale-105 active:scale-95 transition-all bg-espresso"
            >
              <Image
                src={currentReel.astrologerAvatar}
                alt={currentReel.astrologerName}
                width={48}
                height={48}
                unoptimized
                className="object-cover w-full h-full rounded-full"
              />
            </button>
            <button
              onClick={() => setSelectedAstroForChat({
                id: currentReel.id,
                name: currentReel.astrologerName,
                title: currentReel.astrologerTitle,
                image: currentReel.astrologerAvatar,
                specialty: currentReel.astrologerSpecialty,
                experience: currentReel.astrologerExp,
              })}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-terracotta text-white font-bold flex items-center justify-center text-[10px] shadow-md border border-white"
              title="Chat with Astrologer"
            >
              +
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="flex flex-col items-center gap-1 active:scale-80 transition-transform group"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
              likesState[currentReel.id]?.liked 
                ? "bg-rose-500/20 border-rose-500 text-rose-500" 
                : "bg-black/40 border-white/20 text-white group-hover:bg-black/60"
            }`}>
              <Heart 
                className={`w-6 h-6 transition-all ${
                  likesState[currentReel.id]?.liked ? "fill-rose-500 text-rose-500 scale-110" : ""
                }`} 
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {(likesState[currentReel.id]?.count || currentReel.likes).toLocaleString()}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowCommentsDrawer(true)}
            className="flex flex-col items-center gap-1 active:scale-80 transition-transform group"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md text-white group-hover:bg-black/60">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 active:scale-80 transition-transform group"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-md text-white group-hover:bg-black/60">
              <Share2 className="w-5 h-5 -rotate-12" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-md">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={handleSaveToggle}
            className="flex flex-col items-center gap-1 active:scale-80 transition-transform"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border ${
              savedReels[currentReel.id]
                ? "bg-amber-400/20 border-amber-400 text-amber-400"
                : "bg-black/40 border-white/20 text-white"
            }`}>
              <Bookmark className={`w-5 h-5 ${savedReels[currentReel.id] ? "fill-amber-400" : ""}`} />
            </div>
          </button>

          {/* Rotating Music Disc */}
          <div className={`relative w-10 h-10 rounded-full border-2 border-amber-300/70 p-1 bg-black/70 overflow-hidden shadow-lg ${
            isPlaying ? "animate-spin" : ""
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-terracotta to-amber-500 flex items-center justify-center text-white">
              <Music2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* 4. BOTTOM CAPTION & ASTROLOGER DETAILS */}
        <div className="relative z-20 p-4 pb-6 pr-16 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
          
          {/* Astrologer Badge & Quick Chat CTA */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm text-white flex items-center gap-1 drop-shadow-md">
              {currentReel.astrologerName}
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400 inline" />
            </span>

            <button
              onClick={() => setSelectedAstroForChat({
                id: currentReel.id,
                name: currentReel.astrologerName,
                title: currentReel.astrologerTitle,
                image: currentReel.astrologerAvatar,
                specialty: currentReel.astrologerSpecialty,
                experience: currentReel.astrologerExp,
              })}
              className="px-2.5 py-0.5 rounded-full bg-terracotta/90 hover:bg-terracotta border border-amber-300/40 text-[10px] font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 text-white"
            >
              Ask Upay
            </button>
          </div>

          {/* Reel Title & Description */}
          <h2 className="text-sm font-semibold text-white/95 leading-snug drop-shadow-md mb-1.5">
            {currentReel.title}
          </h2>

          <p className="text-xs text-white/80 leading-relaxed line-clamp-2 drop-shadow-sm mb-2">
            {currentReel.description}
          </p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {currentReel.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-bold text-amber-300/90 hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          {/* Audio Ticker Marquee */}
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <Music2 className="w-3.5 h-3.5 text-amber-400 animate-pulse flex-shrink-0" />
            <div className="overflow-hidden whitespace-nowrap max-w-[220px]">
              <span className="inline-block text-[11px] font-medium tracking-wide">
                {currentReel.audioName}
              </span>
            </div>
          </div>
        </div>

        {/* 5. DESKTOP NAVIGATION HELPER PILLS (Next / Prev) */}
        <div className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
          <button
            onClick={handlePrevReel}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed bg-black/40" : "bg-black/70 hover:bg-terracotta text-white active:scale-95 shadow-xl"
            }`}
            title="Previous Reel (Up Arrow)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNextReel}
            disabled={currentIndex === reelsList.length - 1}
            className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
              currentIndex === reelsList.length - 1 ? "opacity-30 cursor-not-allowed bg-black/40" : "bg-black/70 hover:bg-terracotta text-white active:scale-95 shadow-xl"
            }`}
            title="Next Reel (Down Arrow)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* 6. INSTAGRAM SLIDE-UP COMMENTS DRAWER */}
      {showCommentsDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-[65vh] bg-[#161616] border-t border-white/15 rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="w-6" /> {/* Spacer */}
              <h3 className="font-bold text-sm text-white">
                Comments ({currentReel.commentsCount})
              </h3>
              <button 
                onClick={() => setShowCommentsDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentReel.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-espresso">
                    <Image
                      src={comment.userAvatar}
                      alt={comment.userName}
                      width={32}
                      height={32}
                      unoptimized
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{comment.userName}</span>
                      <span className="text-[10px] text-white/50">{comment.timeAgo}</span>
                    </div>
                    <p className="text-white/85 text-xs mt-0.5 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                  <button className="text-white/40 hover:text-rose-500 pt-1">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Emoji Bar */}
            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-lg">
              {["🙏", "✨", "🕉️", "❤️", "🔥", "🪐"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setNewCommentInput((prev) => prev + emoji)}
                  className="hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#1C1C1C]">
              <input
                type="text"
                value={newCommentInput}
                onChange={(e) => setNewCommentInput(e.target.value)}
                placeholder="Add a comment for Acharya Ji..."
                className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={!newCommentInput.trim()}
                className="w-8 h-8 rounded-full bg-terracotta text-white flex items-center justify-center disabled:opacity-40 active:scale-95 shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Astro Consultation Chat Modal if triggered */}
      {selectedAstroForChat && (
        <AstroChatModal
          astrologer={selectedAstroForChat}
          onClose={() => setSelectedAstroForChat(null)}
        />
      )}

    </div>
  );
}
